import React, { useState } from 'react';
import Dashboard from './Dashboard';
import AdminServicios from './AdminServicios';
import AdminPersonal from './AdminPersonal';
import AdminCalendario from './AdminCalendario';
import AdminUsuarios from './AdminUsuarios';

export default function AdminLayout({ user, onLogout }) {
  const [tab, setTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'calendario', label: 'Calendario', icon: '📅' },
    { id: 'servicios', label: 'Servicios', icon: '💼' },
    { id: 'personal', label: 'Personal', icon: '🧑‍⚕️' },
    { id: 'usuarios', label: 'Usuarios', icon: '👥' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
          <div className="bg-blue-600 rounded-xl w-12 h-12 flex items-center justify-center">
            <span className="text-white text-2xl">🩺</span>
          </div>
          <div>
            <div className="font-extrabold text-lg text-gray-800">MediCitas</div>
            <div className="text-xs text-gray-500 font-medium">Gestión de Citas</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 mx-4 mt-4 rounded-lg bg-blue-50">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm">{user?.name || 'Admin'}</div>
            <div className="text-xs text-gray-500">Administrador</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 mt-6 px-4 flex-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 p-3 rounded-lg font-medium text-base transition ${
                tab === t.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        <div className="px-4 pb-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg font-medium text-base text-red-600 hover:bg-red-50 transition"
          >
            <span>🚪</span> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8 overflow-auto">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'calendario' && <AdminCalendario />}
        {tab === 'servicios' && <AdminServicios />}
        {tab === 'personal' && <AdminPersonal />}
        {tab === 'usuarios' && <AdminUsuarios />}
      </main>
    </div>
  );
}
