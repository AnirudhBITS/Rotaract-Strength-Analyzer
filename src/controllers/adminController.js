const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const XLSX = require('xlsx');
const { DISTRICT_POSITIONS } = require('../config/constants');
const { sendInterviewNotification } = require('../utils/mailer');

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
      status,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = req.query;

    let baseQuery = db('applicants');

    if (status) {
      baseQuery = baseQuery.where('status', status);
    }

    if (search) {
      baseQuery = baseQuery.where(function () {
        this.where('name', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('club_name', 'like', `%${search}%`)
          .orWhere('application_number', 'like', `%${search}%`);
      });
    }

    const applicants = await baseQuery
      .select('id', 'application_number', 'name', 'email', 'phone', 'club_name', 'rotary_id', 'age', 'date_of_birth', 'profession', 'blood_group', 'willing_to_donate', 'status', 'admin_notes', 'created_at', 'updated_at')
      .orderBy(sortBy, sortOrder);

    res.json({ applicants });
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

    const rolePreferences = await db('role_preferences')
      .select('*')
      .orderBy('preference_order', 'asc');

    const scoresByApplicant = {};
    for (const score of strengthScores) {
      if (!scoresByApplicant[score.applicant_id]) {
        scoresByApplicant[score.applicant_id] = [];
      }
      scoresByApplicant[score.applicant_id].push(score);
    }

    const prefsByApplicant = {};
    for (const pref of rolePreferences) {
      if (!prefsByApplicant[pref.applicant_id]) {
        prefsByApplicant[pref.applicant_id] = { user: [], system: [] };
      }
      const pos = DISTRICT_POSITIONS.find((p) => p.id === pref.position_id);
      const title = pos ? pos.title : `Position #${pref.position_id}`;
      if (pref.type === 'user_choice') {
        prefsByApplicant[pref.applicant_id].user.push(title);
      } else {
        prefsByApplicant[pref.applicant_id].system.push(title);
      }
    }

    const rows = applicants.map((a) => {
      const scores = scoresByApplicant[a.id] || [];
      const top5 = scores.filter((s) => s.rank <= 5).map((s) => s.theme);
      const prefs = prefsByApplicant[a.id] || { user: [], system: [] };

      return {
        'Application #': a.application_number || '',
        'Name': a.name,
        'Email': a.email,
        'Phone': a.phone,
        'Secondary Phone': a.secondary_phone || '',
        'Club': a.club_name,
        'Rotary ID': a.rotary_id,
        'Age': a.age,
        'DOB': a.date_of_birth ? new Date(a.date_of_birth).toLocaleDateString('en-IN') : '',
        'Profession': a.profession,
        'Blood Group': a.blood_group,
        'Willing to Donate': a.willing_to_donate ? 'Yes' : 'No',
        'Address': a.address,
        'Past Positions': a.past_positions || '',
        'Hobbies': a.hobbies || '',
        'Strength #1': top5[0] || '',
        'Strength #2': top5[1] || '',
        'Strength #3': top5[2] || '',
        'Strength #4': top5[3] || '',
        'Strength #5': top5[4] || '',
        'System Suggestion 1': prefs.system[0] || '',
        'System Suggestion 2': prefs.system[1] || '',
        'System Suggestion 3': prefs.system[2] || '',
        'Preferred Position 1': prefs.user[0] || '',
        'Preferred Position 2': prefs.user[1] || '',
        'Preferred Position 3': prefs.user[2] || '',
        'Status': a.status,
        'Admin Notes': a.admin_notes || '',
        'Applied On': a.created_at ? new Date(a.created_at).toLocaleDateString('en-IN') : '',
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-width columns
    const colWidths = Object.keys(rows[0] || {}).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...rows.map((r) => String(r[key] || '').length)
      );
      return { wch: Math.min(maxLen + 2, 40) };
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Applicants');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=rotaract-applicants-${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}

async function deleteApplicant(req, res, next) {
  const trx = await db.transaction();
  try {
    const { id } = req.params;

    const applicant = await trx('applicants').where({ id }).first();
    if (!applicant) {
      await trx.rollback();
      return res.status(404).json({ error: 'Applicant not found' });
    }

    await trx('role_preferences').where({ applicant_id: id }).del();
    await trx('strength_scores').where({ applicant_id: id }).del();
    await trx('assessment_responses').where({ applicant_id: id }).del();
    await trx('applicants').where({ id }).del();

    await trx.commit();

    res.json({ message: `Applicant "${applicant.name}" (${applicant.application_number}) deleted successfully` });
  } catch (err) {
    await trx.rollback();
    next(err);
  }
}

async function sendBulkEmail(req, res, next) {
  try {
    const applicants = await db('applicants').select('name', 'email');

    if (applicants.length === 0) {
      return res.json({ message: 'No applicants found', sent: 0, failed: 0 });
    }

    let sent = 0;
    let failed = 0;
    const errors = [];

    for (const applicant of applicants) {
      const result = await sendInterviewNotification(applicant.email, applicant.name);
      if (result.success) {
        sent++;
      } else {
        failed++;
        errors.push({ email: applicant.email, error: result.error });
      }
    }

    console.log(`Bulk email complete: ${sent} sent, ${failed} failed out of ${applicants.length}`);
    res.json({ message: 'Bulk email complete', total: applicants.length, sent, failed, errors });
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
  deleteApplicant,
  sendBulkEmail,
};
