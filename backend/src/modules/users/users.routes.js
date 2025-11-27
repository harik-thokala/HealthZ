const express = require('express');
const router = express.Router();
const controller = require('./users.controller');

// GET /api/users
router.get('/', controller.listUsers);

module.exports = router;
