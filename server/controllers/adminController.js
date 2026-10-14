const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');

// @desc Get platform statistics for admin dashboard
// @route GET /api/admin/stats
// @access Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments({});
    const totalEnrollments = await Enrollment.countDocuments({});
    const totalReviews = await Review.countDocuments({});

    const pendingCourses = await Course.countDocuments({ approvalStatus: 'pending' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalEnrollments,
        totalReviews,
        pendingCourses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get list of all users
// @route GET /api/admin/users
// @access Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle user suspension status
// @route PUT /api/admin/users/:id/toggle-suspend
// @access Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot suspend an admin account' });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} is now ${user.isSuspended ? 'Suspended' : 'Active'}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all courses for admin review
// @route GET /api/admin/courses
// @access Private (Admin)
exports.getAllCoursesAdmin = async (req, res, next) => {
  try {
    const courses = await Course.find({})
      .populate('instructor', 'name email')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Approve or Reject course (Admin)
// @route PUT /api/admin/courses/:id/status
// @access Private (Admin)
exports.updateCourseStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'published', 'rejected', 'archived'

    if (!['published', 'rejected', 'archived', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid course approval status' });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: status,
        isPublished: status === 'published',
      },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: `Course status updated to ${status}`,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};
