// src/services/authService.js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

async function login(emailOrObj, maybePassword) {
  // support (email, password) or ({email, password})
  let payload;
  if (typeof emailOrObj === 'string') {
    payload = { email: emailOrObj, password: maybePassword };
  } else if (emailOrObj && typeof emailOrObj === 'object') {
    payload = { email: emailOrObj.email, password: emailOrObj.password };
  } else {
    throw new Error('Invalid arguments to authService.login');
  }

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

  if (!res.ok) {
    const message = (data && data.error) ? data.error : `Login failed (${res.status})`;
    throw new Error(message);
  }

  // expect { token, user }
  return data;
}

export default { login };
