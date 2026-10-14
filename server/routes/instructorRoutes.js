const express = require('express');
const { getInstructorStats, getMyCreatedCourses } = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, authorize('instructor', 'admin'), getInstructorStats);
router.get('/courses', protect, authorize('instructor', 'admin'), getMyCreatedCourses);

module.exports = router;
