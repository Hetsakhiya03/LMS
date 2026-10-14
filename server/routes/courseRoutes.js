const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected Instructor/Admin routes
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
