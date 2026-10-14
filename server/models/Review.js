const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// One review per student per course
reviewSchema.index({ course: 1, student: 1 }, { unique: true });

// Static method to recalculate Average Course Rating
reviewSchema.statics.getAverageRating = async function (courseId) {
  const obj = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: '$course',
        averageRating: { $avg: '$rating' },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      await mongoose.model('Course').findByIdAndUpdate(courseId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10,
        ratingsCount: obj[0].ratingsCount,
      });
    } else {
      await mongoose.model('Course').findByIdAndUpdate(courseId, {
        averageRating: 5.0,
        ratingsCount: 0,
      });
    }
  } catch (err) {
    console.error(`[Review Aggregation Error]: ${err.message}`);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.course);
});

// Call getAverageRating before remove
reviewSchema.post('remove', async function () {
  await this.constructor.getAverageRating(this.course);
});

module.exports = mongoose.model('Review', reviewSchema);
