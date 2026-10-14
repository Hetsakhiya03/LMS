const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

// @desc Enroll student in a course
// @route POST /api/enrollments/:courseId
// @access Private (Student/Admin)
exports.enrollCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
    }

    // Create Enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      status: 'active',
      paymentId: course.isFree ? 'FREE_ACCESS' : (req.body.paymentId || 'MOCK_PAID_ACCESS'),
    });

    // Create initial Progress record
    await Progress.create({
      student: studentId,
      course: courseId,
      completedLectures: [],
      overallPercentage: 0,
    });

    // Increment course totalStudents count
    course.totalStudents += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Enrolled in course successfully!',
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get student enrolled courses
// @route GET /api/enrollments
// @access Private
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: [
          { path: 'instructor', select: 'name avatar' },
          { path: 'category', select: 'name' },
        ],
      })
      .sort({ createdAt: -1 });

    // Fetch progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (item) => {
        if (!item.course) return null;
        const progress = await Progress.findOne({ student: req.user._id, course: item.course._id });
        return {
          _id: item._id,
          enrolledAt: item.enrolledAt,
          status: item.status,
          course: item.course,
          progressPercentage: progress ? progress.overallPercentage : 0,
          lastAccessedLecture: progress ? progress.lastAccessedLecture : null,
          isCompleted: progress ? progress.isCompleted : false,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrollmentsWithProgress.filter(Boolean).length,
      data: enrollmentsWithProgress.filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Check if student is enrolled in a specific course
// @route GET /api/enrollments/check/:courseId
// @access Private
exports.checkEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};
