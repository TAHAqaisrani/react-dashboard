import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Feedbacks from './pages/Feedbacks';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Sidebar from './components/Sidebar';

function PrivateLayout({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
        <Route path="/users" element={<PrivateLayout><Users /></PrivateLayout>} />
        <Route path="/feedbacks" element={<PrivateLayout><Feedbacks /></PrivateLayout>} />
        <Route path="/profile" element={<PrivateLayout><Profile /></PrivateLayout>} />
        <Route path="/analytics" element={<PrivateLayout><Analytics /></PrivateLayout>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
