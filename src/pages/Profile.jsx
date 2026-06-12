import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const [pwForm, setPwForm] = useState({
    current_password: '',
    new_password: ''
  });

  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    api.get('/profile/').then((r) => {
      setProfile(r.data);
      setName(r.data.name);
    });
  }, []);

  async function updateProfile(e) {
    e.preventDefault();

    await api.put('/profile/', { name });

    setMsg('Profile updated successfully');

    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    localStorage.setItem(
      'user',
      JSON.stringify({
        ...user,
        name
      })
    );

    setTimeout(() => setMsg(''), 3000);
  }

  async function changePassword(e) {
    e.preventDefault();

    try {
      await api.put(
        '/profile/password',
        pwForm
      );

      setPwMsg(
        'Password changed successfully'
      );

      setPwForm({
        current_password: '',
        new_password: ''
      });
    } catch (err) {
      setPwMsg(
        err.response?.data?.detail ||
          'Error changing password'
      );
    }

    setTimeout(() => setPwMsg(''), 3000);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111827',
        color: '#fff',
        padding: '30px'
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 30
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '34px',
            fontWeight: 700
          }}
        >
          Profile
        </h1>

        <p
          style={{
            color: '#9ca3af',
            marginTop: 8
          }}
        >
          Manage your account settings
        </p>
      </div>

      {/* Profile Card */}
      <div
        style={{
          background: '#1f2937',
          border: '1px solid #374151',
          borderRadius: 18,
          padding: 30,
          maxWidth: 700,
          marginBottom: 25,
          boxShadow:
            '0 10px 25px rgba(0,0,0,.25)'
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 25
          }}
        >
          Profile Information
        </h2>

        {msg && (
          <div
            style={{
              background: '#064e3b',
              color: '#34d399',
              padding: '12px 16px',
              borderRadius: 10,
              marginBottom: 20,
              border:
                '1px solid #065f46'
            }}
          >
            {msg}
          </div>
        )}

        <form
          onSubmit={updateProfile}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 20,
              marginBottom: 20
            }}
          >
            <div>
              <label
                style={
                  labelStyle
                }
              >
                Full Name
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={
                  labelStyle
                }
              >
                Email Address
              </label>

              <input
                value={
                  profile.email
                }
                disabled
                style={{
                  ...inputStyle,
                  background:
                    '#111827',
                  color:
                    '#9ca3af'
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginBottom: 25
            }}
          >
            <label
              style={
                labelStyle
              }
            >
              Role
            </label>

            <input
              value={
                profile.role
              }
              disabled
              style={{
                ...inputStyle,
                background:
                  '#111827',
                color:
                  '#9ca3af',
                width: '50%'
              }}
            />
          </div>

          <button
            type="submit"
            style={
              primaryBtn
            }
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Password Card */}
      <div
        style={{
          background: '#1f2937',
          border: '1px solid #374151',
          borderRadius: 18,
          padding: 30,
          maxWidth: 700,
          boxShadow:
            '0 10px 25px rgba(0,0,0,.25)'
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 25
          }}
        >
          Change Password
        </h2>

        {pwMsg && (
          <div
            style={{
              background:
                pwMsg.includes(
                  'success'
                )
                  ? '#064e3b'
                  : '#7f1d1d',

              color:
                pwMsg.includes(
                  'success'
                )
                  ? '#34d399'
                  : '#f87171',

              padding:
                '12px 16px',

              borderRadius: 10,

              marginBottom: 20,

              border:
                pwMsg.includes(
                  'success'
                )
                  ? '1px solid #065f46'
                  : '1px solid #991b1b'
            }}
          >
            {pwMsg}
          </div>
        )}

        <form
          onSubmit={
            changePassword
          }
        >
          <div
            style={{
              marginBottom: 18
            }}
          >
            <label
              style={
                labelStyle
              }
            >
              Current Password
            </label>

            <input
              type="password"
              required
              value={
                pwForm.current_password
              }
              onChange={(e) =>
                setPwForm({
                  ...pwForm,
                  current_password:
                    e.target.value
                })
              }
              style={
                inputStyle
              }
            />
          </div>

          <div
            style={{
              marginBottom: 25
            }}
          >
            <label
              style={
                labelStyle
              }
            >
              New Password
            </label>

            <input
              type="password"
              required
              value={
                pwForm.new_password
              }
              onChange={(e) =>
                setPwForm({
                  ...pwForm,
                  new_password:
                    e.target.value
                })
              }
              style={
                inputStyle
              }
            />
          </div>

          <button
            type="submit"
            style={
              primaryBtn
            }
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 600,
  color: '#60a5fa'
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #374151',
  background: '#111827',
  color: '#fff',
  fontSize: 14,
  boxSizing: 'border-box',
  outline: 'none'
};

const primaryBtn = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '12px 24px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 14
};
