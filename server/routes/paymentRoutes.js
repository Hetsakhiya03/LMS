const express = require('express');
const { createCheckoutSession, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/checkout-session', protect, createCheckoutSession);
router.post('/verify', protect, verifyPayment);

module.exports = router;
