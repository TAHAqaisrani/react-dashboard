import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All Roles');
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin'
  });

  function load() {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role !== 'All Roles') params.append('role', role);

    api.get(`/users/?${params}`).then((r) => setUsers(r.data));
  }

  useEffect(() => {
    load();
  }, []);

  async function addUser(e) {
    e.preventDefault();
    await api.post('/users/', form);
    setShowAdd(false);
    setForm({ name: '', email: '', password: '', role: 'Admin' });
    load();
  }

  async function deleteUser(email) {
    if (!window.confirm(`Delete ${email}?`)) return;
    await api.delete(`/users/${email}`);
    load();
  }

  async function resetPassword(email) {
    const r = await api.post(`/users/${email}/reset-password`);
    alert(`Password reset. Temp: ${r.data.temp_password || 'sent to email'}`);
  }

  return (
    <div className="users-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Users Management</h1>
          <p className="page-subtitle">Manage system users and permissions</p>
        </div>
        <button className="primary-btn" onClick={() => setShowAdd(true)}>
          + Add User
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="search-bar">
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
        />
        <select
          className="filter-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>All Roles</option>
          <option>Admin</option>
          <option>Viewer</option>
        </select>
        <button className="primary-btn" onClick={load}>Search</button>
      </div>

      {/* USERS */}
      {users.map((u) => (
        <div key={u.email} className="user-card">
          <div className="user-avatar">
            {u.name?.[0]?.toUpperCase()}
          </div>
          
          <div className="user-info">
            <div className="user-name">{u.name}</div>
            <div className="user-email">{u.email}</div>
            <div className="user-badges">
              <span className="badge-role">{u.role}</span>
              <span className="badge-status">{u.status || 'Active'}</span>
            </div>
          </div>

          <div className="user-actions">
            <button className="action-btn" onClick={() => resetPassword(u.email)}>
              Reset Password
            </button>
            <button className="action-btn danger" onClick={() => deleteUser(u.email)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* MODAL */}
      {showAdd && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={addUser}>
            <h2>Add New User</h2>
            <div className="form-fields">
              <input
                className="form-input"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="form-input"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <select
                className="form-input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option>Admin</option>
                <option>Viewer</option>
              </select>
            </div>

            <div className="modal-actions">
              <button type="submit" className="primary-btn" style={{ flex: 1 }}>Create User</button>
              <button type="button" className="btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}