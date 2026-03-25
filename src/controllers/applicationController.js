const db = require('../config/database');
const { analyzeApplicant } = require('../utils/scoringEngine');
const { sendAcknowledgement, sendAdminNotification, sendOTPEmail } = require('../utils/mailer');
const { setOTP, verifyOTP } = require('../utils/otpStore');
const { DISTRICT_POSITIONS } = require('../config/constants');
const { ROTARACT_CLUBS } = require('../config/clubs');

async function generateApplicationNumber(year) {
  const prefix = `RSA-${year}-`;

  // Dedicated short transaction: lock ONE counter row, increment, release
  // Lock held for ~1-2ms, so 20 concurrent submissions queue up in ~40ms total
  const seq = await db.transaction(async (counterTrx) => {
    const rows = await counterTrx('application_counters')
      .where('year', year)
      .forUpdate()
      .select('next_seq');

    if (rows.length > 0) {
      const currentSeq = rows[0].next_seq;
      await counterTrx('application_counters')
        .where('year', year)
        .update({ next_seq: currentSeq + 1 });
      return currentSeq;
    }

    // First application this year — initialize from existing data
    const [[{ maxNum }]] = await counterTrx.raw(
      "SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(application_number, '-', -1) AS UNSIGNED)), 0) as maxNum FROM applicants WHERE application_number LIKE ?",
      [`${prefix}%`]
    );
    const startSeq = maxNum + 1;
    await counterTrx('application_counters').insert({ year, next_seq: startSeq + 1 });
    return startSeq;
  });

  const candidate = `${prefix}${String(seq).padStart(4, '0')}`;
  console.log(`[APP-NUM] year=${year} seq=${seq} generated=${candidate}`);
  return candidate;
}

async function submitApplication(req, res, next) {
  const { biodata, responses, preferredPositions, applicationNumber } = req.body;

  if (!applicationNumber) {
    return res.status(400).json({ error: 'Application number is required. Please verify your email first.' });
  }

  // Verify reservation exists and matches
  const reservation = await db('application_reservations')
    .where({ email: biodata.email, application_number: applicationNumber })
    .first();

  if (!reservation) {
    return res.status(403).json({
      error: 'Invalid or expired application number. Please verify your email again.',
    });
  }

  const trx = await db.transaction();

  try {

      // Step 2: Insert applicant biodata
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

      // Step 3: Insert assessment responses
      const responseRows = responses.map((r) => ({
        applicant_id: applicantId,
        question_id: r.questionId,
        selected_option: r.selectedOption,
      }));
      await trx('assessment_responses').insert(responseRows);

      // Step 4: Calculate strength scores
      const analysis = analyzeApplicant(responses);

      const scoreRows = analysis.ranked.map((entry) => ({
        applicant_id: applicantId,
        theme: entry.theme,
        score: entry.score,
        rank: entry.rank,
      }));
      await trx('strength_scores').insert(scoreRows);

      // Step 5: Insert user-chosen role preferences
      const userPrefs = preferredPositions.map((posId, index) => ({
        applicant_id: applicantId,
        position_id: posId,
        preference_order: index + 1,
        type: 'user_choice',
      }));
      await trx('role_preferences').insert(userPrefs);

      // Step 6: Insert system-suggested role preferences
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

      // Clean up the reservation (outside transaction — if this fails, 24h cleanup handles it)
      await db('application_reservations').where('email', biodata.email).del()
        .catch((cleanupErr) => console.warn(`[${applicationNumber}] Reservation cleanup failed:`, cleanupErr.message));

      // Resolve position titles for emails
      const selectedPositionTitles = preferredPositions.map(
        (id) => DISTRICT_POSITIONS.find((p) => p.id === id)?.title || `Position #${id}`
      );
      const recommendationTitles = analysis.recommendations.slice(0, 3).map((rec) => {
        const tp = { lead: 0, deputy: 1, associate: 2 };
        const best = rec.positions
          .slice()
          .sort((a, b) => (tp[a.tier] ?? 3) - (tp[b.tier] ?? 3))[0];
        return best ? `${best.title} (${rec.category})` : rec.category;
      });

      // Send emails in background
      sendAcknowledgement({
        applicantEmail: biodata.email,
        name: biodata.name,
        applicationNumber,
        top5: analysis.top5,
        recommendations: recommendationTitles,
        selectedPositions: selectedPositionTitles,
      }).catch((err) => console.error(`[${applicationNumber}] Acknowledgement email failed:`, err.message));

      sendAdminNotification({
        name: biodata.name,
        email: biodata.email,
        phone: biodata.phone,
        clubName: biodata.clubName,
        applicationNumber,
        top5: analysis.top5,
        recommendations: recommendationTitles,
        selectedPositions: selectedPositionTitles,
      }).catch((err) => console.error(`[${applicationNumber}] Admin notification failed:`, err.message));

      return res.status(201).json({
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
        return res.status(409).json({ error: 'This application number has already been used. Please verify your email again.' });
      }
    }

    return next(err);
  }
}

async function getQuestions(req, res) {
  const ASSESSMENT_QUESTIONS = require('../data/questions');
  res.json({ questions: ASSESSMENT_QUESTIONS });
}

async function getPositions(req, res) {
  const { DISTRICT_POSITIONS, ROLE_CATEGORIES } = require('../config/constants');
  const activePositions = DISTRICT_POSITIONS.filter((p) => !p.retired);
  res.json({ positions: activePositions, categories: ROLE_CATEGORIES });
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

async function sendOTP(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const otp = setOTP(email);
    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('OTP send error:', err.message);
    res.status(503).json({ error: 'Unable to send verification code right now. Please try again in a few minutes.' });
  }
}

async function verifyOTPHandler(req, res, next) {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const result = verifyOTP(email, otp);
  if (!result.valid) {
    return res.status(400).json({ error: result.message });
  }

  try {
    // Check if email already has a submitted application
    const existing = await db('applicants').where('email', email).first('application_number');
    if (existing) {
      return res.status(409).json({
        error: 'An application with this email has already been submitted',
        applicationNumber: existing.application_number,
      });
    }

    // Check if a reservation already exists (user resuming)
    const existingReservation = await db('application_reservations').where('email', email).first();
    if (existingReservation) {
      return res.json({ verified: true, applicationNumber: existingReservation.application_number });
    }

    // Lazy cleanup: delete expired reservations (older than 24 hours)
    await db('application_reservations')
      .where('created_at', '<', db.raw("NOW() - INTERVAL 24 HOUR"))
      .del();

    // Generate application number and create reservation
    const year = new Date().getFullYear();
    const applicationNumber = await generateApplicationNumber(year);

    try {
      await db('application_reservations').insert({
        email,
        application_number: applicationNumber,
      });
    } catch (err) {
      // Race condition: another request reserved for this email simultaneously
      if (err.code === 'ER_DUP_ENTRY') {
        const race = await db('application_reservations').where('email', email).first();
        if (race) {
          return res.json({ verified: true, applicationNumber: race.application_number });
        }
      }
      throw err;
    }

    res.json({ verified: true, applicationNumber });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitApplication, getQuestions, getPositions, getClubs, checkDuplicate, sendOTP, verifyOTPHandler };
