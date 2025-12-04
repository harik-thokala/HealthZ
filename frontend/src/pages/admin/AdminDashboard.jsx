// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Dashboard (soon)</h2>
      <p>Welcome {user?.fullName || 'Admin'}!</p>

      <button onClick={handleLogout} style={{ marginTop: 12 }}>
        Logout
      </button>
    </div>
  );
}
