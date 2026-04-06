import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminLayout from './pages/AdminLayout';
import PacienteLayout from './pages/PacienteLayout';

export default function App() {
  const [user, setUser] = useState(null);

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
    return <Login onLogin={handleLogin} />;
  }

  if (user.role === 'admin') {
    return <AdminLayout user={user} onLogout={handleLogout} />;
  }

  return <PacienteLayout user={user} onLogout={handleLogout} />;
}
