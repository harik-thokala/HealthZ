// src/router/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import { useAuth } from '../context/AuthContext';

// <-- IMPORTANT: ensure this path matches where you put the file
// If your admin page lives at src/pages/admin/AdminUsersPage.jsx use this import:
import AdminUsersPage from '../pages/admin/AdminUsersPage';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <div style={{ padding: 20 }}>
              <h2>Admin Dashboard (soon)</h2>
              <div>
                <a href="/admin/users">Manage users</a>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
