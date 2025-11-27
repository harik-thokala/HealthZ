const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/users.routes');

const { authMiddleware } = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Healthcare backend up' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (must be logged in)
app.use('/api/users', authMiddleware, userRoutes);

module.exports = app;
