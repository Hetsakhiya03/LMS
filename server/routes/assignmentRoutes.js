const express = require('express');
const { submitAssignment, gradeSubmission } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:id/submit', protect, submitAssignment);
router.put('/submissions/:submissionId/grade', protect, authorize('instructor', 'admin'), gradeSubmission);

module.exports = router;
