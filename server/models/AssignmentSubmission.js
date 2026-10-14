const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    textSubmission: {
      type: String,
      default: '',
    },
    marksObtained: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'resubmit_required'],
      default: 'submitted',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// One submission per student per assignment
assignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
