const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'BookOpen',
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
categorySchema.pre('save', function (next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
