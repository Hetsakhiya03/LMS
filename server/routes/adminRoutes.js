const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getAllCoursesAdmin,
  updateCourseStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-suspend', toggleUserStatus);
router.get('/courses', getAllCoursesAdmin);
router.put('/courses/:id/status', updateCourseStatus);

module.exports = router;
