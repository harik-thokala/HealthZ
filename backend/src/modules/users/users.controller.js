const usersModel = require('./users.model');

exports.listUsers = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const users = await usersModel.getUsersByTenant(tenantId);
    res.json(users);
  } catch (err) {
    next(err);
  }
};
