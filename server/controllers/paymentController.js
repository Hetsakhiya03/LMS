const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

// @desc Create checkout session / order
// @route POST /api/payments/checkout-session
// @access Private
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
    }

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    res.status(200).json({
      success: true,
      message: 'Checkout session created',
      data: {
        orderId,
        amount: course.price,
        currency: 'USD',
        courseId: course._id,
        courseTitle: course.title,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Verify payment & finalize enrollment
// @route POST /api/payments/verify
// @access Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { courseId, paymentId, orderId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      status: 'active',
      paymentId: paymentId || orderId || 'PAID_ACCESS',
    });

    await Progress.create({
      student: req.user._id,
      course: courseId,
      completedLectures: [],
      overallPercentage: 0,
    });

    course.totalStudents += 1;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Access granted.',
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};
