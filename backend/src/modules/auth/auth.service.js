// src/modules/auth/auth.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

exports.login = async (email, password) => {
  // 1. Find user by email
  const [rows] = await db.query(
    `SELECT id, tenant_id, full_name, email, password_hash, role, status
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  const user = rows[0];
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. Compare password
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error('Invalid email or password');
  }

  // 3. Check status (if column exists)
  if (user.status && user.status !== 'ACTIVE') {
    throw new Error('User is not active');
  }

  // 4. Create JWT payload
  const payload = {
    userId: user.id,
    tenantId: user.tenant_id,
    role: user.role,
    fullName: user.full_name,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

  return { token, user: payload };
};


// OPTIONAL: helper to create a tenant + admin user initially
exports.createTenantWithAdmin = async ({ tenantName, adminEmail, adminPassword, adminName }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [tenantResult] = await conn.execute(
      'INSERT INTO tenants (name, status) VALUES (?, "ACTIVE")',
      [tenantName]
    );
    const tenantId = tenantResult.insertId;

    const password_hash = await bcrypt.hash(adminPassword, 10);

    const [userResult] = await conn.execute(
      `INSERT INTO users (tenant_id, email, password_hash, full_name, role, status)
       VALUES (?, ?, ?, ?, 'TENANT_ADMIN', 'ACTIVE')`,
      [tenantId, adminEmail, password_hash, adminName]
    );

    await conn.commit();

    return {
      tenant_id: tenantId,
      admin_user_id: userResult.insertId
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
