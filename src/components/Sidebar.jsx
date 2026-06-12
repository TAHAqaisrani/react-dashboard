import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const links = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/users', label: 'Users Management', icon: '👥' },
  { path: '/feedbacks', label: 'Feedbacks', icon: '💬' },
  { path: '/profile', label: 'Profile', icon: '👤' },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        ⚡ Sobrus Agents
      </div>

      <div className="sidebar-user">
        <div className="user-name">
          {user.name || 'Admin'}
        </div>

        <div className="user-email">
          {user.email}
        </div>

        <span className="user-role">
          {user.role || 'Admin'}
        </span>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ path, label, icon }) => (
          <div
            key={path}
            onClick={() => navigate(path)}
            className={`nav-item ${
              location.pathname === path ? 'active' : ''
            }`}
          >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </nav>

      <div className="logout-btn" onClick={logout}>
        <span>🚪</span>
        <span>Logout</span>
      </div>

    </aside>
  );
}