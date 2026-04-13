import React, { useState } from 'react';
import api from '../api';

export default function Login({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const loginRapido = async (emailVal, passVal) => {
    setEmail(emailVal);
    setPassword(passVal);
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/login', { email: emailVal, password: passVal });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fbff 0%, #eaf1fb 100%)' }}>
      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden max-w-[950px] w-full">
        {/* Columna izquierda */}
        <div className="flex-1 p-12 flex flex-col justify-center" style={{ background: 'linear-gradient(135deg, #f8fbff 0%, #eaf1fb 100%)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-600 rounded-2xl w-16 h-16 flex items-center justify-center">
              <span className="text-white text-3xl">🩺</span>
            </div>
            <div>
              <div className="font-extrabold text-3xl text-gray-800">MediCitas</div>
              <div className="text-blue-600 font-medium text-lg mt-1">Sistema de Gestión de Citas Médicas</div>
            </div>
          </div>
          <p className="text-gray-700 text-lg mb-8 mt-2 leading-relaxed">
            Plataforma profesional para la gestión eficiente de citas médicas en múltiples especialidades.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-blue-600 text-lg">📅 Agenda digital completa</div>
            <div className="flex items-center gap-3 text-green-500 text-lg">🧑‍⚕️ Gestión de pacientes</div>
            <div className="flex items-center gap-3 text-purple-500 text-lg">🔒 Acceso seguro y privado</div>
          </div>
        </div>

        {/* Columna derecha: Login */}
        <div className="flex-1 p-12 flex flex-col justify-center min-w-[370px]">
          <h2 className="font-extrabold text-2xl text-gray-800 mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="font-semibold text-gray-800 text-sm block mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full p-3 rounded-lg border border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="font-semibold text-gray-800 text-sm block mb-1">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className="w-full p-3 rounded-lg border border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="border-t border-gray-200 my-6"></div>

          <p className="text-center text-sm text-gray-600 mb-4">
            ¿No tienes cuenta?{' '}
            <button
              onClick={onGoToRegister}
              className="text-blue-600 font-semibold hover:underline"
            >
              Regístrate aquí
            </button>
          </p>

          <div className="text-gray-800 font-medium text-sm mb-3">Acceso rápido de prueba:</div>
          <div className="flex gap-3">
            <button
              onClick={() => loginRapido('admin@clinica.com', 'admin123')}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-4 flex flex-col items-center gap-1 hover:bg-gray-100 transition cursor-pointer"
            >
              <span className="text-2xl text-blue-600">🔒</span>
              <span className="font-bold text-sm">Administrador</span>
              <span className="text-gray-500 text-xs">admin@clinica.com</span>
            </button>
            <button
              onClick={() => loginRapido('aparicio@clinica.com', 'password123')}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-4 flex flex-col items-center gap-1 hover:bg-gray-100 transition cursor-pointer"
            >
              <span className="text-2xl text-green-600">🩺</span>
              <span className="font-bold text-sm">Profesional</span>
              <span className="text-gray-500 text-xs">aparicio@clinica.com</span>
            </button>
            <button
              onClick={() => loginRapido('usuario@clinica.com', 'usuario123')}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-4 flex flex-col items-center gap-1 hover:bg-gray-100 transition cursor-pointer"
            >
              <span className="text-2xl text-blue-600">👤</span>
              <span className="font-bold text-sm">Paciente</span>
              <span className="text-xs text-gray-500">usuario@clinica.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
