const db = require('../config/database');
const { analyzeApplicant } = require('../utils/scoringEngine');
const { sendAcknowledgement, sendAdminNotification, sendOTPEmail } = require('../utils/mailer');
const { setOTP, verifyOTP } = require('../utils/otpStore');
const { DISTRICT_POSITIONS } = require('../config/constants');
const { ROTARACT_CLUBS } = require('../config/clubs');

async function submitApplication(req, res, next) {
  const trx = await db.transaction();

  try {
    const {
      biodata,
      responses,
      preferredPositions,
    } = req.body;

    // Generate application number: RSA-YYYY-NNNN (based on max existing number)
    const year = new Date().getFullYear();
    const [[{ maxNum }]] = await trx.raw(
      "SELECT COALESCE(MAX(CAST(SUBSTRING(application_number, -4) AS UNSIGNED)), 0) as maxNum FROM applicants WHERE application_number LIKE ?",
      [`RSA-${year}-%`]
    );
    const seq = String(maxNum + 1).padStart(4, '0');
    const applicationNumber = `RSA-${year}-${seq}`;

    // Insert applicant biodata
    const [applicantId] = await trx('applicants').insert({
      application_number: applicationNumber,
      name: biodata.name,
      email: biodata.email,
      phone: biodata.phone,
      secondary_phone: biodata.secondaryPhone || null,
      club_name: biodata.clubName,
      rotary_id: biodata.rotaryId,
      age: biodata.age,
      date_of_birth: biodata.dateOfBirth,
      profession: biodata.profession,
      blood_group: biodata.bloodGroup,
      willing_to_donate: biodata.willingToDonate,
      address: biodata.address,
      past_positions: biodata.pastPositions || null,
      hobbies: biodata.hobbies || null,
      professional_photo: biodata.professionalPhoto || null,
      casual_photo: biodata.casualPhoto || null,
    });

    // Insert assessment responses
    const responseRows = responses.map((r) => ({
      applicant_id: applicantId,
      question_id: r.questionId,
      selected_option: r.selectedOption,
    }));
    await trx('assessment_responses').insert(responseRows);

    // Calculate strength scores
    const analysis = analyzeApplicant(responses);

    // Insert strength scores
    const scoreRows = analysis.ranked.map((entry) => ({
      applicant_id: applicantId,
      theme: entry.theme,
      score: entry.score,
      rank: entry.rank,
    }));
    await trx('strength_scores').insert(scoreRows);

    // Insert user-chosen role preferences
    const userPrefs = preferredPositions.map((posId, index) => ({
      applicant_id: applicantId,
      position_id: posId,
      preference_order: index + 1,
      type: 'user_choice',
    }));
    await trx('role_preferences').insert(userPrefs);

    // Insert system-suggested role preferences (top position from top 3 categories)
    const tierPriority = { lead: 0, deputy: 1, associate: 2 };
    let suggestionOrder = 1;
    for (const rec of analysis.recommendations.slice(0, 3)) {
      const bestPosition = rec.positions
        .slice()
        .sort((a, b) => (tierPriority[a.tier] ?? 3) - (tierPriority[b.tier] ?? 3))[0];
      if (bestPosition) {
        await trx('role_preferences').insert({
          applicant_id: applicantId,
          position_id: bestPosition.id,
          preference_order: suggestionOrder++,
          type: 'system_suggestion',
        });
      }
    }

    await trx.commit();

    // Resolve position titles for emails (non-blocking)
    const selectedPositionTitles = preferredPositions.map(
      (id) => DISTRICT_POSITIONS.find((p) => p.id === id)?.title || `Position #${id}`
    );
    const recommendationTitles = analysis.recommendations.slice(0, 3).map((rec) => {
      const tierPriority = { lead: 0, deputy: 1, associate: 2 };
      const best = rec.positions
        .slice()
        .sort((a, b) => (tierPriority[a.tier] ?? 3) - (tierPriority[b.tier] ?? 3))[0];
      return best ? `${best.title} (${rec.category})` : rec.category;
    });

    // Send emails in background — don't block the response
    sendAcknowledgement({
      applicantEmail: biodata.email,
      name: biodata.name,
      applicationNumber,
      top5: analysis.top5,
      recommendations: recommendationTitles,
      selectedPositions: selectedPositionTitles,
    }).catch(() => {});

    sendAdminNotification({
      name: biodata.name,
      email: biodata.email,
      phone: biodata.phone,
      clubName: biodata.clubName,
      applicationNumber,
      top5: analysis.top5,
      recommendations: recommendationTitles,
      selectedPositions: selectedPositionTitles,
    }).catch(() => {});

    res.status(201).json({
      message: 'Application submitted successfully',
      applicantId,
      applicationNumber,
      analysis: {
        top5: analysis.top5,
        ranked: analysis.ranked,
        recommendations: analysis.recommendations.map((r) => ({
          category: r.category,
          matchScore: r.matchScore,
          matchedStrengths: r.matchedStrengths,
        })),
      },
    });
  } catch (err) {
    await trx.rollback();

    if (err.code === 'ER_DUP_ENTRY') {
      const msg = err.sqlMessage || '';
      if (msg.includes('email')) {
        return res.status(409).json({ error: 'An application with this email already exists' });
      }
      if (msg.includes('application_number')) {
        return res.status(409).json({ error: 'Application number conflict. Please try again.' });
      }
      return res.status(409).json({ error: 'A duplicate entry was detected. Please try again.' });
    }

    next(err);
  }
}

async function getQuestions(req, res) {
  const ASSESSMENT_QUESTIONS = require('../data/questions');
  res.json({ questions: ASSESSMENT_QUESTIONS });
}

async function getPositions(req, res) {
  const { DISTRICT_POSITIONS, ROLE_CATEGORIES } = require('../config/constants');
  res.json({ positions: DISTRICT_POSITIONS, categories: ROLE_CATEGORIES });
}

async function getClubs(req, res) {
  res.json({ clubs: ROTARACT_CLUBS });
}

async function checkDuplicate(req, res, next) {
  try {
    const { email, phone } = req.body;

    const existing = await db('applicants')
      .where('email', email)
      .orWhere('phone', phone)
      .first();

    if (existing) {
      const field = existing.email === email ? 'email' : 'phone number';
      return res.status(409).json({
        duplicate: true,
        field,
        message: `An application with this ${field} already exists (${existing.application_number || 'ID: ' + existing.id}).`,
      });
    }

    res.json({ duplicate: false });
  } catch (err) {
    next(err);
  }
}

async function sendOTP(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const otp = setOTP(email);
    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    next(err);
  }
}

async function verifyOTPHandler(req, res) {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const result = verifyOTP(email, otp);
  if (!result.valid) {
    return res.status(400).json({ error: result.message });
  }

  res.json({ verified: true });
}

module.exports = { submitApplication, getQuestions, getPositions, getClubs, checkDuplicate, sendOTP, verifyOTPHandler };
