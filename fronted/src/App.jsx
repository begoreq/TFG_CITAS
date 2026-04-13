import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/AdminLayout';
import PacienteLayout from './pages/PacienteLayout';
import ProfesionalLayout from './pages/ProfesionalLayout';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    if (page === 'register') {
      return <Register onLogin={handleLogin} onGoToLogin={() => setPage('login')} />;
    }
    return <Login onLogin={handleLogin} onGoToRegister={() => setPage('register')} />;
  }

  if (user.role === 'admin') {
    return <AdminLayout user={user} onLogout={handleLogout} />;
  }

  if (user.role === 'profesional') {
    return <ProfesionalLayout user={user} onLogout={handleLogout} />;
  }

  return <PacienteLayout user={user} onLogout={handleLogout} />;
}
