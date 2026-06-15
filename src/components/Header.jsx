import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const links = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/users', label: 'Users', icon: '👥' },
  { path: '/feedbacks', label: 'Feedbacks', icon: '💬' },
  { path: '/profile', label: 'Profile', icon: '👤' },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
];

export default function Header({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <header className="main-header">
      <div className="header-brand" onClick={() => navigate('/dashboard')}>
        <span className="brand-logo">⚡</span>
        <span className="brand-text">Sobrus Agents</span>
      </div>

      <nav className="header-nav">
        {links.map(({ path, label, icon }) => (
          <div
            key={path}
            onClick={() => navigate(path)}
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </div>
        ))}
      </nav>

      <div className="header-actions">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className="header-profile" onClick={() => navigate('/profile')}>
          <div className="profile-avatar">
            {user.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="profile-info">
            <span className="profile-name">{user.name || 'Admin'}</span>
            <span className="profile-role">{user.role || 'Admin'}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={logout} title="Logout">
          🚪
        </button>
      </div>
    </header>
  );
}
