const mongoose = require('mongoose');

const quizAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  selectedOption: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    answers: [quizAnswerSchema],
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
