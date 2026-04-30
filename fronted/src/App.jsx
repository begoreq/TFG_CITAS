import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/AdminLayout';
import PacienteLayout from './pages/PacienteLayout';
import ProfesionalLayout from './pages/ProfesionalLayout';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [forzarLogin, setForzarLogin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setPage('login');
    }
  }, [user]);

  const handleLogin = (userData) => {
    setForzarLogin(false);
    setUser(userData);
    setPage('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setForzarLogin(true);
    setPage('login');
    setUser(null);

    // Extra guard to ensure auth view always returns to login after logout.
    setTimeout(() => setPage('login'), 0);
  };

  if (!user) {
    if (!forzarLogin && page === 'register') {
      return <Register onLogin={handleLogin} onGoToLogin={() => setPage('login')} />;
    }
    return <Login onLogin={handleLogin} onGoToRegister={() => { setForzarLogin(false); setPage('register'); }} />;
  }

  if (user.role === 'admin') {
    return <AdminLayout user={user} onLogout={handleLogout} />;
  }

  if (user.role === 'profesional') {
    return <ProfesionalLayout user={user} onLogout={handleLogout} />;
  }

  return <PacienteLayout user={user} onLogout={handleLogout} />;
}
