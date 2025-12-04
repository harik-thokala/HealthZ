// src/pages/admin/AdminUsersPage.jsx
import React, { useEffect, useState } from 'react';
// <<-- CORRECT relative path: two levels up to /src then /services
import usersServiceFactory from '../../services/usersService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function UserForm({ initial = {}, onCancel, onSubmit }) {
  const [fullName, setFullName] = useState(initial.full_name || initial.fullName || '');
  const [email, setEmail] = useState(initial.email || '');
  const [role, setRole] = useState(initial.role || 'admin');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setFullName(initial.full_name || initial.fullName || '');
    setEmail(initial.email || '');
    setRole(initial.role || 'admin');
    setPassword('');
  }, [initial]);

  const submit = (e) => {
    e.preventDefault();
    const payload = { fullName, email, role };
    if (password) payload.password = password;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} style={{ padding: 12 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Full name</label><br />
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Email</label><br />
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Role</label><br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">admin</option>
          <option value="tenant_admin">tenant_admin</option>
          <option value="doctor">doctor</option>
          <option value="patient">patient</option>
        </select>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Password (only when creating or changing)</label><br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
      </div>
    </form>
  );
}

export default function AdminUsersPage() {
  const { token, user: me } = useAuth();            // <-- read token from context
  // pass token into factory so service can add Authorization header
  const usersService = usersServiceFactory(token || null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersService.listUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (u) => {
    setEditing(u);
    setShowForm(true);
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete ${u.full_name || u.email}?`)) return;
    try {
      await usersService.deleteUser(u.userId);
      setUsers((s) => s.filter((x) => x.userId !== u.userId));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        await usersService.updateUser(editing.userId, payload);
      } else {
        await usersService.createUser({
          tenantId: me?.tenantId || 1,
          fullName: payload.fullName,
          email: payload.email,
          password: payload.password,
          role: payload.role,
        });
      }
      await load();
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin — Users</h2>
        <div>
          <Link to="/admin">Back to Admin</Link>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={handleCreate}>Create user</button>
        <button onClick={load} style={{ marginLeft: 8 }}>Refresh</button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        {loading ? <div>Loading...</div> : (
          <table border="1" cellPadding="6" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td>{u.userId}</td>
                  <td>{u.full_name || u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleString() : '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(u)}>Edit</button>
                    <button onClick={() => handleDelete(u)} style={{ marginLeft: 8 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div style={{
          position: 'fixed', left: 0, right: 0, top: 0, bottom: 0,
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: 'white', minWidth: 360, maxWidth: 520 }}>
            <UserForm
              initial={editing ? {
                full_name: editing.full_name,
                fullName: editing.full_name,
                email: editing.email,
                role: editing.role
              } : {}}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
