const express = require('express');
const { markLectureCompleted, getCourseProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:courseId', protect, getCourseProgress);
router.post('/:courseId/complete-lecture', protect, markLectureCompleted);

module.exports = router;
