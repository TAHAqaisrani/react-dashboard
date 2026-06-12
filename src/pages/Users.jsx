import { useEffect, useState } from 'react';
import api from '../api/axios';

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

    api
      .get(`/users/?${params}`)
      .then((r) => setUsers(r.data));
  }

  useEffect(() => {
    load();
  }, []);

  async function addUser(e) {
    e.preventDefault();

    await api.post('/users/', form);

    setShowAdd(false);

    setForm({
      name: '',
      email: '',
      password: '',
      role: 'Admin'
    });

    load();
  }

  async function deleteUser(email) {
    if (!window.confirm(`Delete ${email}?`)) return;

    await api.delete(`/users/${email}`);

    load();
  }

  async function resetPassword(email) {
    const r = await api.post(
      `/users/${email}/reset-password`
    );

    alert(
      `Password reset. Temp: ${
        r.data.temp_password || 'sent to email'
      }`
    );
  }

  return (
    <div
      style={{
        background: '#111827',
        minHeight: '100vh',
        padding: '30px',
        color: '#fff'
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '30px'
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: '700'
            }}
          >
            Users Management
          </h1>

          <p
            style={{
              color: '#9ca3af',
              marginTop: '8px'
            }}
          >
            Manage system users and permissions
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          + Add User
        </button>
      </div>

      {/* SEARCH BAR */}

      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '25px'
        }}
      >
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search users by name or email..."
          style={{
            flex: 1,
            padding: '12px 14px',
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '10px',
            color: '#fff',
            outline: 'none'
          }}
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          style={{
            padding: '12px 14px',
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '10px',
            color: '#fff'
          }}
        >
          <option>All Roles</option>
          <option>Admin</option>
          <option>Viewer</option>
        </select>

        <button
          onClick={load}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Search
        </button>
      </div>

      {/* USERS */}

      {users.map((u) => (
        <div
          key={u.email}
          style={{
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '16px',
            padding: '18px 20px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            boxShadow:
              '0 10px 25px rgba(0,0,0,.25)'
          }}
        >
          {/* AVATAR */}

          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '18px',
              marginRight: '16px'
            }}
          >
            {u.name?.[0]?.toUpperCase()}
          </div>

          {/* INFO */}

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              {u.name}
            </div>

            <div
              style={{
                color: '#9ca3af',
                fontSize: '13px',
                marginTop: '4px'
              }}
            >
              {u.email}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px'
              }}
            >
              <span
                style={{
                  background: '#374151',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {u.role}
              </span>

              <span
                style={{
                  background: '#064e3b',
                  color: '#34d399',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {u.status}
              </span>
            </div>
          </div>

          {/* ACTIONS */}

          <div
            style={{
              display: 'flex',
              gap: '10px'
            }}
          >
            <button
              onClick={() =>
                resetPassword(u.email)
              }
              style={{
                background: '#111827',
                color: '#fff',
                border:
                  '1px solid #374151',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Reset Password
            </button>

            <button
              onClick={() =>
                deleteUser(u.email)
              }
              style={{
                background: 'transparent',
                color: '#ef4444',
                border:
                  '1px solid #ef4444',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* MODAL */}

      {showAdd && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'rgba(0,0,0,.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <form
            onSubmit={addUser}
            style={{
              width: '450px',
              background: '#1f2937',
              border:
                '1px solid #374151',
              borderRadius: '18px',
              padding: '30px',
              color: '#fff',
              boxShadow:
                '0 20px 40px rgba(0,0,0,.4)'
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: '24px'
              }}
            >
              Add New User
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                required
                style={inputStyle}
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                required
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password:
                      e.target.value
                  })
                }
                required
                style={inputStyle}
              />

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value
                  })
                }
                style={inputStyle}
              >
                <option>Admin</option>
                <option>Viewer</option>
              </select>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px'
              }}
            >
              <button
                type="submit"
                style={{
                  flex: 1,
                  background:
                    '#2563eb',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Create User
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowAdd(false)
                }
                style={{
                  flex: 1,
                  background:
                    '#374151',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: '#111827',
  border: '1px solid #374151',
  borderRadius: '10px',
  color: '#fff',
  outline: 'none',
  boxSizing: 'border-box'
};