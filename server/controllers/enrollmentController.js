const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

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

    // Send enrollment confirmation email (async — won't block or break response)
    try {
      const student = await User.findById(studentId).select('name email');
      if (student?.email) {
        await sendEmail({
          to: student.email,
          subject: `🎉 You're enrolled in "${course.title}" — LearnPulse`,
          html: `
            <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <div style="background:#1a8754;padding:32px 24px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:24px;">🎓 LearnPulse LMS</h1>
              </div>
              <div style="padding:32px 24px;">
                <h2 style="color:#1c1d1f;font-size:20px;margin:0 0 12px;">Hi ${student.name}! You're enrolled 🎉</h2>
                <p style="color:#4b5563;line-height:1.6;margin:0 0 24px;">
                  You have successfully enrolled in <strong style="color:#1a8754;">${course.title}</strong>.
                  ${course.isFree ? 'This course is <strong>FREE</strong> — enjoy unlimited access!' : 'Your access is now active.'}
                </p>
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/learning/${course._id}"
                   style="display:inline-block;padding:12px 28px;background:#1a8754;color:#ffffff;text-decoration:none;border-radius:4px;font-weight:700;font-size:14px;">
                  Start Learning →
                </a>
                <hr style="margin:32px 0;border:none;border-top:1px solid #f3f4f6;" />
                <p style="color:#9ca3af;font-size:12px;margin:0;">
                  LearnPulse LMS · You received this because you enrolled in a course.
                </p>
              </div>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error('[Enrollment Email] Non-critical error:', emailErr.message);
    }

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
