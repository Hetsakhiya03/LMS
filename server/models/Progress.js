const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
      },
    ],
    completedSections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],
    overallPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastAccessedLecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
