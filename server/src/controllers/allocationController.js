const db = require('../config/database');
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

    // Also get applicants from the same category who haven't chosen this specific position
    // but whose strengths match (broader pool)
    const currentAllocation = await db('allocations').where('position_id', positionId).first();

    res.json({
      position,
      userChoices: userChoices.map(enrichCandidate),
      systemSuggestions: systemSuggestions.map(enrichCandidate),
      currentAllocation: currentAllocation || null,
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

module.exports = {
  getPositions,
  getPositionCandidates,
  allocateCandidate,
  deallocateCandidate,
  getAllocationSummary,
};
