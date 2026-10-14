const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    questionText: {
      type: String,
      required: [true, 'Please provide question text'],
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswerIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    explanation: {
      type: String,
      default: '',
    },
    marks: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', questionSchema);
