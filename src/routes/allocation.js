const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
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
} = require('../controllers/allocationController');

const router = express.Router();

router.use(authenticate);

router.get('/positions', getPositions);
router.get('/summary', getAllocationSummary);
router.get('/positions/:positionId/candidates', getPositionCandidates);
router.get('/positions/:positionId/export', exportPositionCandidates);
router.get('/search-applicants', searchApplicants);
router.get('/unallocated-applicants', getUnallocatedApplicants);
router.get('/all-allocations', getAllAllocations);
router.get('/finalised', getFinalisedOfficials);
router.get('/finalised/export', exportFinalisedOfficials);

router.post(
  '/positions/:positionId/allocate',
  authorize('super_admin', 'admin'),
  [
    body('applicantId').isInt({ min: 1 }).withMessage('Valid applicant ID is required'),
  ],
  validate,
  allocateCandidate
);

router.delete(
  '/positions/:positionId/deallocate/:applicantId',
  authorize('super_admin', 'admin'),
  deallocateCandidate
);

router.post(
  '/confirm/:allocationId',
  authorize('super_admin', 'admin'),
  confirmAllocation
);

router.delete(
  '/confirm/:allocationId',
  authorize('super_admin', 'admin'),
  removeConfirmation
);

module.exports = router;
