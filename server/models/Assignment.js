const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide assignment title'],
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
    description: {
      type: String,
      required: true,
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    attachmentUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
