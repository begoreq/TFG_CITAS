import React, { useEffect, useState } from 'react';
import api from '../api';

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
    ))}
  </tr>
);

export default function AdminUsuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const cambiarRol = async (userId, nuevoRol) => {
    if (!window.confirm(`¿Cambiar rol a "${nuevoRol}"?`)) return;
    try {
      await api.patch(`/users/${userId}/role`, { role: nuevoRol });
      cargar();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cambiar rol');
    }
  };

  const rolBadge = {
    admin: 'bg-red-100 text-red-700 border-red-200',
    profesional: 'bg-green-100 text-green-700 border-green-200',
    paciente: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const filtrados = users.filter((u) => {
    const texto = `${u.name} ${u.apellidos || ''} ${u.email}`.toLowerCase();
    const matchTexto = !filtro || texto.includes(filtro.toLowerCase());
    const matchRol = !rolFiltro || u.role === rolFiltro;
    return matchTexto && matchRol;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-gray-500">Gestión de usuarios y roles del sistema</p>
        </div>
        <div className="text-sm text-gray-500">{users.length} usuarios totales</div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={rolFiltro}
          onChange={(e) => setRolFiltro(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="profesional">Profesional</option>
          <option value="paciente">Paciente</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Usuario</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Teléfono</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Rol</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Cambiar Rol</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : filtrados.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No se encontraron usuarios</td></tr>
            ) : (
              filtrados.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{u.name} {u.apellidos || ''}</div>
                        {u.profesional && (
                          <div className="text-xs text-gray-400">{u.profesional.especialidad?.nombre}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600">{u.telefono || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${rolBadge[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => cambiarRol(u.id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="profesional">Profesional</option>
                      <option value="paciente">Paciente</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
