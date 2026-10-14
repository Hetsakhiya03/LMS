const express = require('express');
const { enrollCourse, getMyEnrollments, checkEnrollment } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyEnrollments);
router.post('/:courseId', protect, enrollCourse);
router.get('/check/:courseId', protect, checkEnrollment);

module.exports = router;
