const Category = require('../models/Category');

// @desc Get all categories
// @route GET /api/categories
// @access Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create category (Admin only)
// @route POST /api/categories
// @access Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    const category = await Category.create({ name, description, icon });
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete category (Admin only)
// @route DELETE /api/categories/:id
// @access Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
