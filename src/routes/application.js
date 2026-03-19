const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  submitApplication,
  getQuestions,
  getPositions,
} = require('../controllers/applicationController');

const router = express.Router();

router.get('/questions', getQuestions);
router.get('/positions', getPositions);

router.post(
  '/submit',
  [
    body('biodata.name').trim().notEmpty().withMessage('Name is required'),
    body('biodata.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('biodata.phone').trim().notEmpty().withMessage('Phone number is required'),
    body('biodata.clubName').trim().notEmpty().withMessage('Club name is required'),
    body('biodata.rotaryId').trim().notEmpty().withMessage('Rotary ID is required'),
    body('biodata.age').isInt({ min: 18, max: 35 }).withMessage('Age must be between 18 and 35'),
    body('biodata.dateOfBirth').isDate().withMessage('Valid date of birth is required'),
    body('biodata.profession').trim().notEmpty().withMessage('Profession is required'),
    body('biodata.bloodGroup')
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .withMessage('Valid blood group is required'),
    body('biodata.willingToDonate').isBoolean().withMessage('Willing to donate must be true or false'),
    body('biodata.address').trim().notEmpty().withMessage('Address is required'),
    body('responses')
      .isArray({ min: 32, max: 32 })
      .withMessage('All 32 questions must be answered'),
    body('responses.*.questionId').isInt({ min: 1, max: 32 }).withMessage('Invalid question ID'),
    body('responses.*.selectedOption')
      .isIn(['a', 'b', 'c', 'd'])
      .withMessage('Invalid option selected'),
    body('preferredPositions')
      .isArray({ min: 3, max: 3 })
      .withMessage('Exactly 3 preferred positions are required'),
    body('preferredPositions.*').isInt({ min: 1 }).withMessage('Invalid position ID'),
  ],
  validate,
  submitApplication
);

module.exports = router;
