const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const XLSX = require('xlsx');
const archiver = require('archiver');
const { DISTRICT_POSITIONS } = require('../config/constants');
const { sendInterviewNotification } = require('../utils/mailer');

const MIME_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function decodeDataUri(dataUri) {
  if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:')) return null;
  const match = dataUri.match(/^data:([^;,]+)(?:;base64)?,([\s\S]*)$/);
  if (!match) return null;
  const mime = match[1].toLowerCase();
  const ext = MIME_EXT[mime] || 'bin';
  const buffer = Buffer.from(match[2], 'base64');
  return { ext, buffer };
}

function sanitizeFilenamePart(s) {
  return String(s || 'unknown')
    .replace(/[\\/:*?"<>|\r\n\t]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80) || 'unknown';
}

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
      .select(
        'id', 'application_number', 'name', 'email', 'phone', 'secondary_phone',
        'club_name', 'rotary_id', 'age', 'date_of_birth', 'profession',
        'blood_group', 'willing_to_donate', 'address', 'past_positions', 'hobbies',
        'status', 'admin_notes', 'created_at'
      )
      .orderBy('created_at', 'desc');

    const strengthScores = await db('strength_scores')
      .select('applicant_id', 'theme', 'rank')
      .orderBy('rank', 'asc');

    const rolePreferences = await db('role_preferences')
      .select('applicant_id', 'position_id', 'type', 'preference_order')
      .orderBy('preference_order', 'asc');

    const scoresByApplicant = {};
    for (const score of strengthScores) {
      if (!scoresByApplicant[score.applicant_id]) scoresByApplicant[score.applicant_id] = [];
      scoresByApplicant[score.applicant_id].push(score);
    }

    const prefsByApplicant = {};
    for (const pref of rolePreferences) {
      if (!prefsByApplicant[pref.applicant_id]) prefsByApplicant[pref.applicant_id] = { user: [], system: [] };
      const pos = DISTRICT_POSITIONS.find((p) => p.id === pref.position_id);
      const title = pos ? pos.title : `Position #${pref.position_id}`;
      if (pref.type === 'user_choice') prefsByApplicant[pref.applicant_id].user.push(title);
      else prefsByApplicant[pref.applicant_id].system.push(title);
    }

    const usedFilenames = new Set();
    const photoPlan = [];

    const reserveFilename = (baseName, kind, ext, appNum, id) => {
      let filename = `${baseName} - ${kind}.${ext}`;
      if (usedFilenames.has(filename)) {
        filename = `${baseName} - ${kind} (${appNum || id}).${ext}`;
      }
      usedFilenames.add(filename);
      return filename;
    };

    const rows = applicants.map((a) => {
      const scores = scoresByApplicant[a.id] || [];
      const top5 = scores.filter((s) => s.rank <= 5).map((s) => s.theme);
      const prefs = prefsByApplicant[a.id] || { user: [], system: [] };
      const baseName = `${sanitizeFilenamePart(a.name)} - ${sanitizeFilenamePart(a.club_name)}`;

      const profFile = reserveFilename(baseName, 'professional', 'jpg', a.application_number, a.id);
      const casualFile = reserveFilename(baseName, 'casual', 'jpg', a.application_number, a.id);
      photoPlan.push({ id: a.id, baseName, appNum: a.application_number, profFile, casualFile });

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
        'Professional Photo File': profFile,
        'Casual Photo File': casualFile,
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

    const colWidths = Object.keys(rows[0] || {}).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...rows.map((r) => String(r[key] || '').length)
      );
      return { wch: Math.min(maxLen + 2, 40) };
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Applicants');

    const xlsxBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const today = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=rotaract-applicants-${today}.zip`);

    const archive = archiver('zip', { zlib: { level: 0 } });
    let archiveFailed = false;
    archive.on('warning', (err) => console.warn('archiver warning:', err));
    archive.on('error', (err) => {
      archiveFailed = true;
      console.error('archiver error:', err);
      if (!res.headersSent) res.status(500);
      try { res.end(); } catch (_) {}
    });
    req.on('close', () => {
      if (!res.writableEnded) {
        archiveFailed = true;
        try { archive.abort(); } catch (_) {}
      }
    });
    archive.pipe(res);

    archive.append(xlsxBuffer, { name: `rotaract-applicants-${today}.xlsx` });

    const renameForActualExt = (placeholderName, actualExt) =>
      placeholderName.replace(/\.jpg$/, `.${actualExt}`);

    const waitForDrain = () => {
      if (res.writableNeedDrain) {
        return new Promise((resolve) => res.once('drain', resolve));
      }
      return Promise.resolve();
    };

    for (const entry of photoPlan) {
      if (archiveFailed) break;

      const row = await db('applicants')
        .select('professional_photo', 'casual_photo')
        .where({ id: entry.id })
        .first();
      if (!row) continue;

      for (const [field, placeholder] of [
        ['professional_photo', entry.profFile],
        ['casual_photo', entry.casualFile],
      ]) {
        if (archiveFailed) break;
        const decoded = decodeDataUri(row[field]);
        if (!decoded) continue;
        const finalName = renameForActualExt(placeholder, decoded.ext);
        archive.append(decoded.buffer, { name: `photos/${finalName}` });
        await waitForDrain();
      }
      row.professional_photo = null;
      row.casual_photo = null;
    }

    if (!archiveFailed) {
      await archive.finalize();
    }
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
