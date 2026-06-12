import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);

      const { data } = await api.post('/auth/login', form, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      localStorage.setItem('token', data.access_token);

      const profile = await api.get('/profile/', {
        headers: {
          Authorization: `Bearer ${data.access_token}`
        }
      });

      localStorage.setItem('user', JSON.stringify(profile.data));

      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="logo-circle">⚡</div>

        <h1>Sobrus Agents</h1>
        <p className="subtitle">
          Welcome back. Sign in to continue.
        </p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@sobrus.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}