require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` 🚀 LearnPulse LMS Backend Server Running`);
  console.log(` 🌐 Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(` 📍 Endpoint    : http://localhost:${PORT}`);
  console.log(` 🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
