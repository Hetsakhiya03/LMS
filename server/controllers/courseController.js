const Course = require('../models/Course');
const Section = require('../models/Section');
const Lecture = require('../models/Lecture');

// @desc Get all published courses with search, filters, sorting, and pagination
// @route GET /api/courses
// @access Public
exports.getCourses = async (req, res, next) => {
  try {
    const { search, category, level, priceType, sort, page = 1, limit = 8 } = req.query;

    const query = { approvalStatus: 'published', isPublished: true };

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'All') {
      query.level = level;
    }

    // Price type filter
    if (priceType === 'free') {
      query.isFree = true;
    } else if (priceType === 'paid') {
      query.isFree = false;
    }

    // Sort options
    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') sortOptions = { totalStudents: -1 };
    if (sort === 'rating') sortOptions = { averageRating: -1 };
    if (sort === 'price-low') sortOptions = { price: 1 };
    if (sort === 'price-high') sortOptions = { price: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar headline')
      .populate('category', 'name icon')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      pages: Math.ceil(total / limit),
      page: parseInt(page),
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single course details by ID or Slug
// @route GET /api/courses/:id
// @access Public
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar headline bio')
      .populate('category', 'name icon')
      .populate({
        path: 'sections',
        populate: [
          { path: 'lectures' },
          { path: 'quiz' },
          { path: 'assignment' },
        ],
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create new course (Instructor/Admin)
// @route POST /api/courses
// @access Private (Instructor/Admin)
exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, category, level, price, thumbnail, requirements, learningObjectives } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      level,
      price: parseFloat(price) || 0,
      isFree: parseFloat(price) === 0,
      thumbnail: thumbnail || undefined,
      instructor: req.user._id,
      requirements: requirements || [],
      learningObjectives: learningObjectives || [],
      approvalStatus: req.user.role === 'admin' ? 'published' : 'pending',
      isPublished: req.user.role === 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update course
// @route PUT /api/courses/:id
// @access Private (Instructor/Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Verify ownership or admin role
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete course
// @route DELETE /api/courses/:id
// @access Private (Instructor/Admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
