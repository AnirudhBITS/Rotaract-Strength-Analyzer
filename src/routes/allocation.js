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
} = require('../controllers/allocationController');

const router = express.Router();

router.use(authenticate);

router.get('/positions', getPositions);
router.get('/summary', getAllocationSummary);
router.get('/positions/:positionId/candidates', getPositionCandidates);

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

module.exports = router;
