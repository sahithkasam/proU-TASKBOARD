// src/config/db.js
// MongoDB connection helper using Mongoose
import mongoose from 'mongoose';

export default async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/prou_taskboard';
  try {
    await mongoose.connect(uri, {
      autoIndex: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Mongo connection error:', err.message);
    throw err;
  }
}
