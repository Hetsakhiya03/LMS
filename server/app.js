const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');

// Import Routes
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const progressRoutes = require('./routes/progressRoutes');
const quizRoutes = require('./routes/quizRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Enable CORS — supports multiple origins (comma-separated in CLIENT_URL)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Base 404 Route for API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
  });
});

// Central Error Handler Middleware
app.use(errorHandler);

module.exports = app;
