const db = require('../config/database');
const { analyzeApplicant } = require('../utils/scoringEngine');

async function submitApplication(req, res, next) {
  const trx = await db.transaction();

  try {
    const {
      biodata,
      responses,
      preferredPositions,
    } = req.body;

    // Insert applicant biodata
    const [applicantId] = await trx('applicants').insert({
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

    // Insert system-suggested role preferences
    let suggestionOrder = 1;
    for (const rec of analysis.recommendations) {
      const leadPosition = rec.positions.find((p) => p.tier === 'lead');
      if (leadPosition) {
        await trx('role_preferences').insert({
          applicant_id: applicantId,
          position_id: leadPosition.id,
          preference_order: suggestionOrder++,
          type: 'system_suggestion',
        });
      }
    }

    await trx.commit();

    res.status(201).json({
      message: 'Application submitted successfully',
      applicantId,
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
      return res.status(409).json({ error: 'An application with this email already exists' });
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

module.exports = { submitApplication, getQuestions, getPositions };
