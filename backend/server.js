const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const candidateRoutes = require('./routes/candidateRoutes');
const matchRoutes = require('./routes/matchRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/candidate_shortlist';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error. Please ensure MongoDB is running:', err.message));

// Middleware to check DB connection
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database connection is unavailable. Please try again later or ensure MongoDB is running.' });
  }
  next();
});

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api', matchRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
