// config/db.js
const mongoose = require('mongoose');
const { DATABASE_URL } = require('./dotenvConfig');

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
