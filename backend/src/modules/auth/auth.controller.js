const authService = require('./auth.service');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(401).json({ error: err.message });
  }
};
