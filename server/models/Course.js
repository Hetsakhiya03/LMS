const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price must be greater than or equal to 0'],
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    approvalStatus: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected', 'archived'],
      default: 'published',
    },
    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],
    requirements: [
      {
        type: String,
      },
    ],
    learningObjectives: [
      {
        type: String,
      },
    ],
    averageRating: {
      type: Number,
      default: 5.0,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: '12 Hours',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ instructor: 1 });

// Generate slug before saving
courseSchema.pre('save', function (next) {
  if (this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  if (this.price === 0) {
    this.isFree = true;
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
