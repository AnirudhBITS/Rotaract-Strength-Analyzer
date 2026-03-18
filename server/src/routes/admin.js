const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  login,
  getApplicants,
  getApplicantDetail,
  updateApplicantStatus,
  getDashboardStats,
  exportApplicants,
} = require('../controllers/adminController');

const router = express.Router();

router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/dashboard', authenticate, getDashboardStats);
router.get('/applicants', authenticate, getApplicants);
router.get('/applicants/:id', authenticate, getApplicantDetail);

router.patch(
  '/applicants/:id/status',
  authenticate,
  authorize('super_admin', 'admin'),
  [
    body('status')
      .isIn(['pending', 'reviewed', 'shortlisted', 'selected', 'rejected'])
      .withMessage('Invalid status'),
  ],
  validate,
  updateApplicantStatus
);

router.get('/export', authenticate, authorize('super_admin', 'admin'), exportApplicants);

module.exports = router;
