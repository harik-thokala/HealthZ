// src/middleware/requireRole.js
module.exports = function requireRole(allowedRoles = []) {
  // allow a single string or array
  if (!Array.isArray(allowedRoles)) allowedRoles = [allowedRoles];

  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    // if allowedRoles is empty, allow any authenticated user
    if (allowedRoles.length === 0) return next();

    // req.user.role should exist from your authMiddleware
    const userRole = (req.user && req.user.role) || null;
    if (!userRole) return res.status(403).json({ error: 'Forbidden' });

    // allow if user's role is in allowedRoles OR if user is tenant_admin (optional)
    if (allowedRoles.includes(userRole) || userRole === 'tenant_admin') {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden' });
  };
};
