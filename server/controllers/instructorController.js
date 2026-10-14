const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc Get instructor dashboard statistics and analytics
// @route GET /api/instructor/stats
// @access Private (Instructor/Admin)
exports.getInstructorStats = async (req, res, next) => {
  try {
    const instructorId = req.user._id;

    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map((c) => c._id);

    const totalCourses = courses.length;
    const totalStudents = courses.reduce((acc, c) => acc + (c.totalStudents || 0), 0);
    const avgRating = totalCourses > 0
      ? (courses.reduce((acc, c) => acc + (c.averageRating || 5), 0) / totalCourses).toFixed(1)
      : 5.0;

    // Calculate total revenue from non-free courses
    const totalRevenue = courses.reduce((acc, c) => acc + ((c.price || 0) * (c.totalStudents || 0)), 0);

    res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalStudents,
        averageRating: parseFloat(avgRating),
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        courses: courses.map((c) => ({
          _id: c._id,
          title: c.title,
          category: c.category,
          price: c.price,
          totalStudents: c.totalStudents,
          averageRating: c.averageRating,
          approvalStatus: c.approvalStatus,
          createdAt: c.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get instructor created courses
// @route GET /api/instructor/courses
// @access Private (Instructor/Admin)
exports.getMyCreatedCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
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
