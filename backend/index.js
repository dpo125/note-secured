// backend/index.js

require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();

// Connect MongoDB
connectToMongo(process.env.MONGO_URI);

// Middleware
app.use(express.json());

// CORS setup
app.use(cors({
  origin: true, // Production me kisi bhi frontend ko allow karega
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Test route (local development ke liye)
app.get('/', (req, res) => {
  res.send('Backend running successfully');
});

// ✅ Export app for Vercel serverless
module.exports = app;

// 🔹 Optional: Local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
}