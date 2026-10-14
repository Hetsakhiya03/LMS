const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db', {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    console.log(`[MongoDB] Database Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Error] Connection Failed: ${error.message}`);
    console.log('[MongoDB Warning] Ensure MONGO_URI is set correctly in environment variables.');
    console.log('[MongoDB URI Check] MONGO_URI defined:', !!process.env.MONGO_URI);
  }
};

module.exports = connectDB;
