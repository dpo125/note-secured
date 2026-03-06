require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Connect to MongoDB using environment variable
connectToMongo(process.env.MONGO_URI);

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: true, // Production me: set your frontend URL instead of true
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Backend running successfully');
});

// ✅ Export app for Vercel serverless functions
module.exports = app;

// 🔹 Local development server
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
}