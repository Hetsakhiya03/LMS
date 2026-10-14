const jwt = require('jsonwebtoken');

/**
 * Generate signed JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'learnpulse_super_secret_jwt_key_2026_production_grade',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

module.exports = generateToken;
