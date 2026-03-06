require('dotenv').config();
const mongoose = require('mongoose');

// Use MongoDB Atlas URI in production, fallback to localhost in dev
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  if (!mongoURI) {
    console.error("❌ MONGO_URI not set in environment variables!");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI); 
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); 
  }
};

module.exports = connectToMongo;