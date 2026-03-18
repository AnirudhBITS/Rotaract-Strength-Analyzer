const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DISTRICT_POSITIONS } = require('../config/constants');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const admin = await db('admins').where({ username }).first();
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      admin: { id: admin.id, name: admin.name, username: admin.username, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
}

async function getApplicants(req, res, next) {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = req.query;

    const offset = (page - 1) * limit;

    let baseQuery = db('applicants');

    if (status) {
      baseQuery = baseQuery.where('status', status);
    }

    if (search) {
      baseQuery = baseQuery.where(function () {
        this.where('name', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('club_name', 'like', `%${search}%`);
      });
    }

    const [{ total }] = await baseQuery.clone().count('* as total');

    const applicants = await baseQuery.clone()
      .select('*')
      .orderBy(sortBy, sortOrder)
      .limit(limit)
      .offset(offset);

    res.json({
      applicants,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getApplicantDetail(req, res, next) {
  try {
    const { id } = req.params;

    const applicant = await db('applicants').where({ id }).first();
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    const strengthScores = await db('strength_scores')
      .where({ applicant_id: id })
      .orderBy('rank', 'asc');

    const responses = await db('assessment_responses')
      .where({ applicant_id: id });

    const rolePreferences = await db('role_preferences')
      .where({ applicant_id: id })
      .orderBy('preference_order', 'asc');

    const enrichedPreferences = rolePreferences.map((r) => {
      const position = DISTRICT_POSITIONS.find((p) => p.id === r.position_id);
      return {
        ...r,
        position_title: position?.title || `Unknown Position #${r.position_id}`,
        position_category: position?.category || '',
        position_tier: position?.tier || '',
      };
    });

    res.json({
      applicant,
      strengthScores,
      responses,
      rolePreferences: enrichedPreferences,
    });
  } catch (err) {
    next(err);
  }
}

async function updateApplicantStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updated = await db('applicants')
      .where({ id })
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: db.fn.now(),
      });

    if (!updated) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function getDashboardStats(req, res, next) {
  try {
    const [{ total }] = await db('applicants').count('* as total');
    const statusCounts = await db('applicants')
      .select('status')
      .count('* as count')
      .groupBy('status');

    const topStrengths = await db('strength_scores')
      .select('theme')
      .where('rank', '<=', 5)
      .count('* as count')
      .groupBy('theme')
      .orderBy('count', 'desc')
      .limit(10);

    const clubDistribution = await db('applicants')
      .select('club_name')
      .count('* as count')
      .groupBy('club_name')
      .orderBy('count', 'desc')
      .limit(10);

    res.json({
      total,
      statusCounts: Object.fromEntries(statusCounts.map((s) => [s.status, s.count])),
      topStrengths,
      clubDistribution,
    });
  } catch (err) {
    next(err);
  }
}

async function exportApplicants(req, res, next) {
  try {
    const applicants = await db('applicants')
      .select('*')
      .orderBy('created_at', 'desc');

    const strengthScores = await db('strength_scores')
      .select('*')
      .orderBy('rank', 'asc');

    const scoresByApplicant = {};
    for (const score of strengthScores) {
      if (!scoresByApplicant[score.applicant_id]) {
        scoresByApplicant[score.applicant_id] = [];
      }
      scoresByApplicant[score.applicant_id].push(score);
    }

    const exportData = applicants.map((a) => ({
      ...a,
      strengthScores: scoresByApplicant[a.id] || [],
      top5: (scoresByApplicant[a.id] || [])
        .filter((s) => s.rank <= 5)
        .map((s) => s.theme),
    }));

    res.json({ data: exportData });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  getApplicants,
  getApplicantDetail,
  updateApplicantStatus,
  getDashboardStats,
  exportApplicants,
};
