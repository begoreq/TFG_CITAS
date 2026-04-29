import React, { useState } from 'react';
import api from '../api';

export default function Register({ onLogin, onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [rgpd, setRgpd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const telefonoValido = (value) => /^[0-9+()\- ]{9,15}$/.test(value.trim());

  const passwordValida = (value) => {
    const tieneLongitudValida = value.length >= 8 && value.length <= 12;
    const tieneMayuscula = /[A-Z]/.test(value);
    const tieneNumero = /[0-9]/.test(value);
    const tieneSimbolo = /[^A-Za-z0-9]/.test(value);
    const tieneLetra = /[A-Za-z]/.test(value);

    return tieneLongitudValida && tieneMayuscula && tieneNumero && tieneSimbolo && tieneLetra;
  };

  const passwordChecks = {
    longitud: password.length >= 8 && password.length <= 12,
    mayuscula: /[A-Z]/.test(password),
    numero: /[0-9]/.test(password),
    simbolo: /[^A-Za-z0-9]/.test(password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!passwordValida(password)) {
      setError('La contraseña debe tener entre 8 y 12 caracteres, incluir mayúscula, número y símbolo.');
      return;
    }

    if (!rgpd) {
      setError('Debes aceptar la política de protección de datos.');
      return;
    }

    if (!telefonoValido(telefono)) {
      setError('El teléfono debe tener entre 9 y 15 caracteres y no puede contener letras.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/register', {
        name,
        email,
        telefono,
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
              <label htmlFor="reg-telefono" className="font-semibold text-gray-800 text-sm block mb-1">Teléfono</label>
              <input
                id="reg-telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full p-3 rounded-lg border border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxLength={15}
                pattern="[0-9+() -]{9,15}"
              />
              <p className="text-xs text-gray-500 mt-1">
                Entre 9 y 15 caracteres. Solo números y símbolos + ( ) - espacio.
              </p>
            </div>
            <div>
              <label htmlFor="reg-password" className="font-semibold text-gray-800 text-sm block mb-1">Contraseña</label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8-12 caracteres, mayúscula, número y símbolo"
                className="w-full p-3 rounded-lg border border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={8}
                maxLength={12}
              />
              <p className="text-xs text-gray-500 mt-1">
                Usa de 8 a 12 caracteres e incluye al menos una mayúscula, un número y un símbolo.
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                <li className={passwordChecks.longitud ? 'text-green-600' : 'text-gray-500'}>
                  {passwordChecks.longitud ? '✓' : '•'} Entre 8 y 12 caracteres
                </li>
                <li className={passwordChecks.mayuscula ? 'text-green-600' : 'text-gray-500'}>
                  {passwordChecks.mayuscula ? '✓' : '•'} Al menos una letra mayúscula
                </li>
                <li className={passwordChecks.numero ? 'text-green-600' : 'text-gray-500'}>
                  {passwordChecks.numero ? '✓' : '•'} Al menos un número
                </li>
                <li className={passwordChecks.simbolo ? 'text-green-600' : 'text-gray-500'}>
                  {passwordChecks.simbolo ? '✓' : '•'} Al menos un símbolo
                </li>
              </ul>
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
                minLength={8}
                maxLength={12}
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
