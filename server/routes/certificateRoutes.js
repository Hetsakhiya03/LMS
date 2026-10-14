const express = require('express');
const { getCertificate, verifyCertificate } = require('../controllers/certificateController');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/verify/:certificateId', verifyCertificate);
router.get('/:id', optionalAuth, getCertificate);

module.exports = router;
