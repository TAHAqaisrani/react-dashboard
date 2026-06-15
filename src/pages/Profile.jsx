import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Profile.css';

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
    <div className="profile-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account settings</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <h2 className="profile-card-title">Profile Information</h2>

        {msg && (
          <div className="profile-msg success">
            <i className="ti ti-check" />
            {msg}
          </div>
        )}

        <form onSubmit={updateProfile}>
          <div className="profile-form-grid">
            <div>
              <label className="profile-label">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="profile-input"
              />
            </div>

            <div>
              <label className="profile-label">Email Address</label>
              <input
                value={profile.email}
                disabled
                className="profile-input"
              />
            </div>
          </div>

          <div className="profile-form-group">
            <label className="profile-label">Role</label>
            <input
              value={profile.role}
              disabled
              className="profile-input"
              style={{ width: '50%' }}
            />
          </div>

          <button type="submit" className="primary-btn">
            Save Changes
          </button>
        </form>
      </div>

      {/* Password Card */}
      <div className="profile-card">
        <h2 className="profile-card-title">Change Password</h2>

        {pwMsg && (
          <div className={`profile-msg ${pwMsg.includes('success') ? 'success' : 'error'}`}>
            <i className={pwMsg.includes('success') ? 'ti ti-check' : 'ti ti-alert-circle'} />
            {pwMsg}
          </div>
        )}

        <form onSubmit={changePassword}>
          <div className="profile-form-group">
            <label className="profile-label">Current Password</label>
            <input
              type="password"
              required
              value={pwForm.current_password}
              onChange={(e) =>
                setPwForm({
                  ...pwForm,
                  current_password: e.target.value
                })
              }
              className="profile-input"
            />
          </div>

          <div className="profile-form-group">
            <label className="profile-label">New Password</label>
            <input
              type="password"
              required
              value={pwForm.new_password}
              onChange={(e) =>
                setPwForm({
                  ...pwForm,
                  new_password: e.target.value
                })
              }
              className="profile-input"
            />
          </div>

          <button type="submit" className="primary-btn">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

