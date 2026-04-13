import React, { useState } from 'react';
import api from '../api';

export default function Register({ onLogin, onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [rgpd, setRgpd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!rgpd) {
      setError('Debes aceptar la política de protección de datos.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError(data?.message || 'Error al registrarse. Inténtalo de nuevo.');
      }
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
            Regístrate para gestionar tus citas médicas de forma rápida y sencilla.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-blue-600 text-lg">📅 Reserva citas online</div>
            <div className="flex items-center gap-3 text-green-500 text-lg">🕐 Consulta tu historial</div>
            <div className="flex items-center gap-3 text-purple-500 text-lg">🔒 Tus datos protegidos</div>
          </div>
        </div>

        {/* Columna derecha: Registro */}
        <div className="flex-1 p-12 flex flex-col justify-center min-w-[370px]">
          <h2 className="font-extrabold text-2xl text-gray-800 mb-6">Crear Cuenta</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="font-semibold text-gray-800 text-sm block mb-1">Nombre</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full p-3 rounded-lg border border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="font-semibold text-gray-800 text-sm block mb-1">Email</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full p-3 rounded-lg border border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="font-semibold text-gray-800 text-sm block mb-1">Contraseña</label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full p-3 rounded-lg border border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="reg-password-confirm" className="font-semibold text-gray-800 text-sm block mb-1">Repetir Contraseña</label>
              <input
                id="reg-password-confirm"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full p-3 rounded-lg border border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <div className="flex items-start gap-2">
              <input
                id="rgpd"
                type="checkbox"
                checked={rgpd}
                onChange={(e) => setRgpd(e.target.checked)}
                className="mt-1 w-4 h-4 accent-blue-600"
              />
              <label htmlFor="rgpd" className="text-sm text-gray-600 leading-snug">
                Acepto la{' '}
                <span className="text-blue-600 font-medium underline cursor-pointer">
                  política de protección de datos
                </span>{' '}
                y el tratamiento de mis datos personales conforme al RGPD.
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="border-t border-gray-200 my-6"></div>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onGoToLogin}
              className="text-blue-600 font-semibold hover:underline"
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
