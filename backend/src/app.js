// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/users.routes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Healthcare backend up' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);

// Better error logger (show stack in dev)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  // Only reveal message in development:
  const show = process.env.NODE_ENV !== 'production';
  res.status(500).json({ error: show ? (err && err.message ? err.message : String(err)) : 'Internal server error' });
});

module.exports = app;
