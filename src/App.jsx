import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Feedbacks from './pages/Feedbacks';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Header from './components/Header';

function PrivateLayout({ children, theme, toggleTheme }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Update the class on the html element
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/dashboard" element={<PrivateLayout theme={theme} toggleTheme={toggleTheme}><Dashboard /></PrivateLayout>} />
        <Route path="/users" element={<PrivateLayout theme={theme} toggleTheme={toggleTheme}><Users /></PrivateLayout>} />
        <Route path="/feedbacks" element={<PrivateLayout theme={theme} toggleTheme={toggleTheme}><Feedbacks /></PrivateLayout>} />
        <Route path="/profile" element={<PrivateLayout theme={theme} toggleTheme={toggleTheme}><Profile /></PrivateLayout>} />
        <Route path="/analytics" element={<PrivateLayout theme={theme} toggleTheme={toggleTheme}><Analytics /></PrivateLayout>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
