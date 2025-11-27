const db = require('../../config/db');

exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
};

exports.createTenantAdmin = async ({ tenant_id, email, password_hash, full_name }) => {
  const [result] = await db.execute(
    `INSERT INTO users (tenant_id, email, password_hash, full_name, role, status)
     VALUES (?, ?, ?, ?, 'TENANT_ADMIN', 'ACTIVE')`,
    [tenant_id, email, password_hash, full_name]
  );

  return {
    id: result.insertId,
    tenant_id,
    email,
    full_name,
    role: 'TENANT_ADMIN'
  };
};

exports.getUsersByTenant = async (tenant_id) => {
  const [rows] = await db.query(
    'SELECT id, email, full_name, role, status, created_at FROM users WHERE tenant_id = ?',
    [tenant_id]
  );
  return rows;
};
