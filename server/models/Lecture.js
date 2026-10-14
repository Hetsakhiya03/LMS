const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, default: 'pdf' },
});

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide lecture title'],
      trim: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    videoUrl: {
      type: String,
      default: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    duration: {
      type: String,
      default: '10:00',
    },
    description: {
      type: String,
      default: '',
    },
    resources: [resourceSchema],
    order: {
      type: Number,
      default: 1,
    },
    isFreePreview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lecture', lectureSchema);
