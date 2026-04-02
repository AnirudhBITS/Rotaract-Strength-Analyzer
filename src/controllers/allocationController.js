const db = require('../config/database');
const XLSX = require('xlsx');
const { DISTRICT_POSITIONS } = require('../config/constants');

/**
 * Get all positions with their allocation status and interest counts
 */
async function getPositions(req, res, next) {
  try {
    // Count how many applicants chose each position (user_choice)
    const interestCounts = await db('role_preferences')
      .select('position_id')
      .where('type', 'user_choice')
      .count('* as interest_count')
      .groupBy('position_id');

    // Count system suggestions per position
    const suggestionCounts = await db('role_preferences')
      .select('position_id')
      .where('type', 'system_suggestion')
      .count('* as suggestion_count')
      .groupBy('position_id');

    // Get all current allocations
    const allocations = await db('allocations')
      .select('allocations.*', 'applicants.name as applicant_name', 'applicants.email as applicant_email', 'applicants.club_name')
      .leftJoin('applicants', 'allocations.applicant_id', 'applicants.id');

    const interestMap = Object.fromEntries(interestCounts.map((r) => [r.position_id, r.interest_count]));
    const suggestionMap = Object.fromEntries(suggestionCounts.map((r) => [r.position_id, r.suggestion_count]));
    const allocationMap = {};
    for (const a of allocations) {
      if (!allocationMap[a.position_id]) allocationMap[a.position_id] = [];
      allocationMap[a.position_id].push(a);
    }

    const positions = DISTRICT_POSITIONS.map((pos) => ({
      ...pos,
      interest_count: interestMap[pos.id] || 0,
      suggestion_count: suggestionMap[pos.id] || 0,
      allocated: allocationMap[pos.id] || [],
      allocated_count: (allocationMap[pos.id] || []).length,
      is_filled: (allocationMap[pos.id] || []).length > 0,
    }));

    res.json({ positions });
  } catch (err) {
    next(err);
  }
}

/**
 * Get candidates who expressed interest in a specific position
 */
async function getPositionCandidates(req, res, next) {
  try {
    const { positionId } = req.params;
    const position = DISTRICT_POSITIONS.find((p) => p.id === parseInt(positionId, 10));

    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }

    // Applicants who chose this position
    const userChoices = await db('role_preferences')
      .select(
        'role_preferences.preference_order',
        'applicants.id', 'applicants.name', 'applicants.email',
        'applicants.club_name', 'applicants.phone', 'applicants.status',
        'applicants.professional_photo'
      )
      .leftJoin('applicants', 'role_preferences.applicant_id', 'applicants.id')
      .where('role_preferences.position_id', positionId)
      .where('role_preferences.type', 'user_choice')
      .orderBy('role_preferences.preference_order', 'asc');

    // Applicants the system suggested for this position
    const systemSuggestions = await db('role_preferences')
      .select(
        'role_preferences.preference_order',
        'applicants.id', 'applicants.name', 'applicants.email',
        'applicants.club_name', 'applicants.phone', 'applicants.status',
        'applicants.professional_photo'
      )
      .leftJoin('applicants', 'role_preferences.applicant_id', 'applicants.id')
      .where('role_preferences.position_id', positionId)
      .where('role_preferences.type', 'system_suggestion')
      .orderBy('role_preferences.preference_order', 'asc');

    // Get top 5 strengths for each candidate
    const allCandidateIds = [...new Set([
      ...userChoices.map((c) => c.id),
      ...systemSuggestions.map((c) => c.id),
    ])];

    const strengths = await db('strength_scores')
      .whereIn('applicant_id', allCandidateIds)
      .where('rank', '<=', 5)
      .orderBy('rank', 'asc');

    const strengthMap = {};
    for (const s of strengths) {
      if (!strengthMap[s.applicant_id]) strengthMap[s.applicant_id] = [];
      strengthMap[s.applicant_id].push(s.theme);
    }

    // Check if any candidate is already allocated elsewhere
    const existingAllocations = await db('allocations')
      .whereIn('applicant_id', allCandidateIds);
    const allocatedMap = Object.fromEntries(existingAllocations.map((a) => [a.applicant_id, a.position_id]));

    const enrichCandidate = (c) => ({
      ...c,
      top5: strengthMap[c.id] || [],
      allocated_to: allocatedMap[c.id] || null,
      allocated_position_title: allocatedMap[c.id]
        ? DISTRICT_POSITIONS.find((p) => p.id === allocatedMap[c.id])?.title || null
        : null,
    });

    // Get all current allocations for this position
    const currentAllocations = await db('allocations')
      .select('allocations.*', 'applicants.name as applicant_name', 'applicants.email as applicant_email', 'applicants.club_name')
      .leftJoin('applicants', 'allocations.applicant_id', 'applicants.id')
      .where('allocations.position_id', positionId);

    res.json({
      position,
      userChoices: userChoices.map(enrichCandidate),
      systemSuggestions: systemSuggestions.map(enrichCandidate),
      currentAllocations,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Allocate a candidate to a position
 */
async function allocateCandidate(req, res, next) {
  try {
    const { positionId } = req.params;
    const { applicantId, notes } = req.body;

    const position = DISTRICT_POSITIONS.find((p) => p.id === parseInt(positionId, 10));
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }

    // Check if applicant exists
    const applicant = await db('applicants').where({ id: applicantId }).first();
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    // Check if applicant is already allocated to another position
    const existingAllocation = await db('allocations').where({ applicant_id: applicantId }).first();
    if (existingAllocation) {
      const existingPosition = DISTRICT_POSITIONS.find((p) => p.id === existingAllocation.position_id);
      return res.status(409).json({
        error: `${applicant.name} is already allocated to "${existingPosition?.title || 'another position'}"`,
      });
    }

    await db('allocations').insert({
      applicant_id: applicantId,
      position_id: parseInt(positionId, 10),
      allocated_by: req.admin.id,
      notes: notes || null,
    });

    // Update applicant status to 'selected'
    await db('applicants').where({ id: applicantId }).update({ status: 'selected', updated_at: db.fn.now() });

    res.status(201).json({
      message: `${applicant.name} allocated to "${position.title}"`,
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'This allocation already exists' });
    }
    next(err);
  }
}

/**
 * Remove allocation (deallocate)
 */
async function deallocateCandidate(req, res, next) {
  try {
    const { positionId, applicantId } = req.params;

    const deleted = await db('allocations')
      .where({ position_id: positionId, applicant_id: applicantId })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: 'Allocation not found' });
    }

    // Revert applicant status to 'shortlisted'
    await db('applicants').where({ id: applicantId }).update({ status: 'shortlisted', updated_at: db.fn.now() });

    res.json({ message: 'Allocation removed' });
  } catch (err) {
    next(err);
  }
}

/**
 * Get overall allocation summary
 */
async function getAllocationSummary(req, res, next) {
  try {
    const allocations = await db('allocations')
      .select('allocations.*', 'applicants.name as applicant_name', 'applicants.club_name')
      .leftJoin('applicants', 'allocations.applicant_id', 'applicants.id');

    const allocationMap = {};
    for (const a of allocations) {
      allocationMap[a.position_id] = a;
    }

    const totalPositions = DISTRICT_POSITIONS.length;
    const filledPositions = Object.keys(allocationMap).length;
    const vacantPositions = totalPositions - filledPositions;

    // Group by category
    const categoryStats = {};
    for (const pos of DISTRICT_POSITIONS) {
      if (!categoryStats[pos.category]) {
        categoryStats[pos.category] = { total: 0, filled: 0, vacant: 0, positions: [] };
      }
      const isFilled = !!allocationMap[pos.id];
      categoryStats[pos.category].total++;
      if (isFilled) categoryStats[pos.category].filled++;
      else categoryStats[pos.category].vacant++;

      categoryStats[pos.category].positions.push({
        ...pos,
        allocation: allocationMap[pos.id] || null,
      });
    }

    res.json({
      totalPositions,
      filledPositions,
      vacantPositions,
      fillRate: totalPositions > 0 ? Math.round((filledPositions / totalPositions) * 100) : 0,
      categoryStats,
    });
  } catch (err) {
    next(err);
  }
}

async function searchApplicants(req, res, next) {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ applicants: [] });
    }

    const applicants = await db('applicants')
      .select('id', 'name', 'email', 'club_name', 'application_number')
      .where(function () {
        this.where('name', 'like', `%${q}%`)
          .orWhere('email', 'like', `%${q}%`)
          .orWhere('club_name', 'like', `%${q}%`)
          .orWhere('application_number', 'like', `%${q}%`);
      })
      .limit(10);

    // Check existing allocations
    const ids = applicants.map((a) => a.id);
    const allocations = ids.length > 0
      ? await db('allocations').whereIn('applicant_id', ids)
      : [];
    const allocMap = Object.fromEntries(allocations.map((a) => [a.applicant_id, a.position_id]));

    const enriched = applicants.map((a) => ({
      ...a,
      allocated_to: allocMap[a.id] || null,
      allocated_position_title: allocMap[a.id]
        ? DISTRICT_POSITIONS.find((p) => p.id === allocMap[a.id])?.title || null
        : null,
    }));

    res.json({ applicants: enriched });
  } catch (err) {
    next(err);
  }
}

async function getUnallocatedApplicants(req, res, next) {
  try {
    const applicants = await db('applicants')
      .select('applicants.id', 'applicants.name', 'applicants.email', 'applicants.club_name', 'applicants.application_number')
      .leftJoin('allocations', 'applicants.id', 'allocations.applicant_id')
      .whereNull('allocations.id')
      .orderBy('applicants.name', 'asc');

    res.json({ applicants });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all allocations grouped by position with applicant details
 */
async function getAllAllocations(req, res, next) {
  try {
    const allocations = await db('allocations')
      .select(
        'allocations.id as allocation_id',
        'allocations.applicant_id',
        'allocations.position_id',
        'allocations.notes',
        'allocations.created_at as allocated_at',
        'applicants.name',
        'applicants.email',
        'applicants.phone',
        'applicants.club_name',
        'applicants.professional_photo'
      )
      .leftJoin('applicants', 'allocations.applicant_id', 'applicants.id')
      .orderBy('allocations.position_id', 'asc');

    // Check which allocations are confirmed (exist in finalised_officials)
    const finalisedRows = await db('finalised_officials').select('applicant_id');
    const finalisedSet = new Set(finalisedRows.map((r) => r.applicant_id));

    // Build position map from constants
    const positionMap = Object.fromEntries(DISTRICT_POSITIONS.map((p) => [p.id, p]));

    // Group by position
    const grouped = {};
    for (const a of allocations) {
      const posId = a.position_id;
      if (!grouped[posId]) {
        const pos = positionMap[posId];
        grouped[posId] = {
          position_id: posId,
          position_title: pos?.title || `Position #${posId}`,
          category: pos?.category || '',
          tier: pos?.tier || '',
          allocations: [],
        };
      }
      grouped[posId].allocations.push({
        allocation_id: a.allocation_id,
        applicant_id: a.applicant_id,
        name: a.name,
        email: a.email,
        phone: a.phone,
        club_name: a.club_name,
        professional_photo: a.professional_photo,
        notes: a.notes,
        allocated_at: a.allocated_at,
        is_confirmed: finalisedSet.has(a.applicant_id),
      });
    }

    res.json({ positions: Object.values(grouped) });
  } catch (err) {
    next(err);
  }
}

/**
 * Confirm an allocation - copy data to finalised_officials table
 */
async function confirmAllocation(req, res, next) {
  try {
    const { allocationId } = req.params;

    const allocation = await db('allocations').where({ id: allocationId }).first();
    if (!allocation) {
      return res.status(404).json({ error: 'Allocation not found' });
    }

    // Check if already confirmed
    const existing = await db('finalised_officials').where({ applicant_id: allocation.applicant_id }).first();
    if (existing) {
      return res.status(409).json({ error: 'This allocation is already confirmed' });
    }

    // Get applicant details
    const applicant = await db('applicants').where({ id: allocation.applicant_id }).first();
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    // Get position title
    const position = DISTRICT_POSITIONS.find((p) => p.id === allocation.position_id);
    const positionTitle = position?.title || `Position #${allocation.position_id}`;

    // Insert into finalised_officials
    await db('finalised_officials').insert({
      applicant_id: applicant.id,
      position_id: allocation.position_id,
      position_title: positionTitle,
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      club_name: applicant.club_name,
      rotary_id: applicant.rotary_id,
      age: applicant.age,
      date_of_birth: applicant.date_of_birth,
      profession: applicant.profession,
      blood_group: applicant.blood_group,
      willing_to_donate: applicant.willing_to_donate,
      address: applicant.address,
      professional_photo: applicant.professional_photo,
      casual_photo: applicant.casual_photo,
      confirmed_by: req.admin.id,
      confirmed_at: db.fn.now(),
    });

    res.status(201).json({
      message: `${applicant.name} confirmed as ${positionTitle}`,
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'This allocation is already confirmed' });
    }
    next(err);
  }
}

/**
 * Remove confirmation - delete from finalised_officials
 */
async function removeConfirmation(req, res, next) {
  try {
    const { allocationId } = req.params;

    const allocation = await db('allocations').where({ id: allocationId }).first();
    if (!allocation) {
      return res.status(404).json({ error: 'Allocation not found' });
    }

    const deleted = await db('finalised_officials')
      .where({ applicant_id: allocation.applicant_id })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: 'This allocation is not confirmed' });
    }

    res.json({ message: 'Confirmation removed' });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all finalised officials with optional filters
 */
async function getFinalisedOfficials(req, res, next) {
  try {
    const { blood_group, willing_to_donate } = req.query;

    let query = db('finalised_officials')
      .select('*')
      .orderBy('position_id', 'asc');

    if (blood_group) {
      query = query.where('blood_group', blood_group);
    }

    if (willing_to_donate !== undefined && willing_to_donate !== '') {
      query = query.where('willing_to_donate', willing_to_donate === 'true' || willing_to_donate === '1');
    }

    const officials = await query;

    res.json({ officials });
  } catch (err) {
    next(err);
  }
}

/**
 * Export finalised officials as Excel
 */
async function exportFinalisedOfficials(req, res, next) {
  try {
    const { blood_group, willing_to_donate } = req.query;

    let query = db('finalised_officials')
      .select('*')
      .orderBy('position_id', 'asc');

    if (blood_group) {
      query = query.where('blood_group', blood_group);
    }

    if (willing_to_donate !== undefined && willing_to_donate !== '') {
      query = query.where('willing_to_donate', willing_to_donate === 'true' || willing_to_donate === '1');
    }

    const officials = await query;

    const rows = officials.map((o) => ({
      'Position': o.position_title,
      'Name': o.name,
      'Email': o.email,
      'Phone': o.phone,
      'Club': o.club_name,
      'Rotary ID': o.rotary_id,
      'Age': o.age,
      'DOB': o.date_of_birth ? new Date(o.date_of_birth).toLocaleDateString('en-IN') : '',
      'Profession': o.profession,
      'Blood Group': o.blood_group,
      'Willing to Donate': o.willing_to_donate ? 'Yes' : 'No',
      'Address': o.address,
      'Confirmed At': o.confirmed_at ? new Date(o.confirmed_at).toLocaleDateString('en-IN') : '',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-width columns
    if (rows.length > 0) {
      const colWidths = Object.keys(rows[0]).map((key) => {
        const maxLen = Math.max(
          key.length,
          ...rows.map((r) => String(r[key] || '').length)
        );
        return { wch: Math.min(maxLen + 2, 40) };
      });
      ws['!cols'] = colWidths;
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Finalised Officials');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=finalised-officials-${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}

async function exportPositionCandidates(req, res, next) {
  try {
    const { positionId } = req.params;
    const position = DISTRICT_POSITIONS.find((p) => p.id === parseInt(positionId, 10));

    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }

    // Get all applicants who chose this position (user_choice)
    const candidates = await db('role_preferences')
      .select(
        'applicants.id', 'applicants.name', 'applicants.club_name',
        'applicants.phone', 'applicants.email', 'applicants.rotary_id',
        'applicants.past_positions',
        'role_preferences.preference_order'
      )
      .leftJoin('applicants', 'role_preferences.applicant_id', 'applicants.id')
      .where('role_preferences.position_id', positionId)
      .where('role_preferences.type', 'user_choice')
      .orderBy('role_preferences.preference_order', 'asc');

    // Get all 3 preferred positions for each candidate
    const candidateIds = candidates.map((c) => c.id);
    const allPrefs = await db('role_preferences')
      .select('applicant_id', 'position_id', 'preference_order')
      .whereIn('applicant_id', candidateIds)
      .where('type', 'user_choice')
      .orderBy('preference_order', 'asc');

    const prefsMap = {};
    for (const p of allPrefs) {
      if (!prefsMap[p.applicant_id]) prefsMap[p.applicant_id] = {};
      const pos = DISTRICT_POSITIONS.find((dp) => dp.id === p.position_id);
      prefsMap[p.applicant_id][p.preference_order] = pos?.title || `Position #${p.position_id}`;
    }

    const rows = candidates.map((c) => {
      const prefs = prefsMap[c.id] || {};
      return {
        'Name': c.name,
        'Club': c.club_name,
        'Phone': c.phone,
        'Email': c.email,
        'Rotary ID': c.rotary_id || '',
        'Preferred Position 1': prefs[1] || '',
        'Preferred Position 2': prefs[2] || '',
        'Preferred Position 3': prefs[3] || '',
        'Past Positions': c.past_positions || '',
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ 'No candidates found': '' }]);

    if (rows.length > 0) {
      const colWidths = Object.keys(rows[0]).map((key) => {
        const maxLen = Math.max(key.length, ...rows.map((r) => String(r[key] || '').length));
        return { wch: Math.min(maxLen + 2, 40) };
      });
      ws['!cols'] = colWidths;
    }

    const safeTitle = position.title.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, safeTitle);

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const filename = position.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}-candidates.xlsx`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPositions,
  getPositionCandidates,
  allocateCandidate,
  deallocateCandidate,
  getAllocationSummary,
  searchApplicants,
  getUnallocatedApplicants,
  getAllAllocations,
  confirmAllocation,
  removeConfirmation,
  getFinalisedOfficials,
  exportFinalisedOfficials,
  exportPositionCandidates,
};
