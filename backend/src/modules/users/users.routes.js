// src/modules/users/users.routes.js
const express = require('express');
const router = express.Router();

const ctrl = require('./users.controller'); // should export functions
const authMiddleware = require('../../middleware/authMiddleware'); // returns function

// List users (protected)
router.get('/', authMiddleware, ctrl.listUsers);

// Create user (protected)
router.post('/', authMiddleware, ctrl.createUser);

// Update user (protected)
router.put('/:id', authMiddleware, ctrl.updateUser);

// Delete user (protected)
router.delete('/:id', authMiddleware, ctrl.deleteUser);

module.exports = router;
