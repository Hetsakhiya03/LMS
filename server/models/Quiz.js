const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide quiz title'],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    totalMarks: {
      type: Number,
      default: 10,
    },
    passingScore: {
      type: Number,
      default: 70, // percentage required to pass
    },
    timeLimitMinutes: {
      type: Number,
      default: 15,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
