const Wishlist = require('../models/Wishlist');

// @desc Get student wishlist
// @route GET /api/wishlist
// @access Private
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ student: req.user._id }).populate({
      path: 'courses',
      populate: [
        { path: 'instructor', select: 'name avatar' },
        { path: 'category', select: 'name' },
      ],
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ student: req.user._id, courses: [] });
    }

    res.status(200).json({
      success: true,
      data: wishlist.courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle course in wishlist
// @route POST /api/wishlist/toggle/:courseId
// @access Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    let wishlist = await Wishlist.findOne({ student: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ student: req.user._id, courses: [courseId] });
      return res.status(200).json({ success: true, message: 'Added to wishlist', isWishlisted: true });
    }

    const index = wishlist.courses.indexOf(courseId);
    let isWishlisted = false;

    if (index > -1) {
      wishlist.courses.splice(index, 1);
    } else {
      wishlist.courses.push(courseId);
      isWishlisted = true;
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: isWishlisted ? 'Course bookmarked to wishlist' : 'Course removed from wishlist',
      isWishlisted,
    });
  } catch (error) {
    next(error);
  }
};
