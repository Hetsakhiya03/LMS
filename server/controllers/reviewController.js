const Review = require('../models/Review');

// @desc Get reviews for a course
// @route GET /api/reviews/course/:courseId
// @access Public
exports.getCourseReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('student', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add or update review for a course
// @route POST /api/reviews
// @access Private (Enrolled Student)
exports.addReview = async (req, res, next) => {
  try {
    const { courseId, rating, comment } = req.body;

    const review = await Review.findOneAndUpdate(
      { course: courseId, student: req.user._id },
      { course: courseId, student: req.user._id, rating, comment },
      { new: true, upsert: true, runValidators: true }
    );

    // Trigger statics recalculation on Course
    await Review.getAverageRating(courseId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
