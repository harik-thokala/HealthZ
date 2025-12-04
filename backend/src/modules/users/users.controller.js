// src/modules/users/users.controller.js
const usersModel = require('./users.model');
const bcrypt = require('bcryptjs');

const listUsers = async (req, res) => {
  try {
    // Optionally scope by tenant: req.user.tenantId
    const rows = await usersModel.findAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { tenantId, fullName, email, password, role } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ error: 'Missing fields' });

    const existing = await usersModel.findByEmail(email);
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const id = await usersModel.createUser({
      tenantId: tenantId || 1,
      fullName,
      email,
      passwordHash: hash,
      role: role || 'admin'
    });
    const user = await usersModel.findById(id);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { fullName, email, role } = req.body;
    await usersModel.updateUser(id, { fullName, email, role });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await usersModel.deleteUser(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { listUsers, createUser, updateUser, deleteUser };
