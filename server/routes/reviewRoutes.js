const express = require('express');
const { getCourseReviews, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/course/:courseId', getCourseReviews);
router.post('/', protect, addReview);

module.exports = router;
