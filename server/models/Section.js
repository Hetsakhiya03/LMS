const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide section title'],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
      },
    ],
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Section', sectionSchema);
