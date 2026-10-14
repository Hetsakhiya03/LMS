const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Database Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Error] Connection Failed: ${error.message}`);
    console.log('[MongoDB Warning] Ensure MongoDB is running locally (mongod) or update MONGO_URI in server/.env');
  }
};

module.exports = connectDB;
