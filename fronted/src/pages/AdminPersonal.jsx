import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AdminPersonal() {
  const [profesionales, setProfesionales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', telefono: '', especialidad_id: '' });

  const cargarDatos = async () => {
    try {
      const [pRes, eRes] = await Promise.all([api.get('/profesionales'), api.get('/especialidades')]);
      setProfesionales(pRes.data);
      setEspecialidades(eRes.data);
    } catch {
      // Error silencioso
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ nombre: '', apellidos: '', email: '', telefono: '', especialidad_id: '' });
    setEditando(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/profesionales/${editando}`, form);
      } else {
        await api.post('/profesionales', form);
      }
      resetForm();
      cargarDatos();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        alert(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        alert(data?.message || 'Error al guardar');
      }
    }
  };

  const handleEditar = (p) => {
    setForm({
      nombre: p.nombre,
      apellidos: p.apellidos || '',
      email: p.user?.email || '',
      telefono: p.telefono || '',
      especialidad_id: p.especialidad_id,
    });
    setEditando(p.id);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este profesional?')) return;
    try {
      await api.delete(`/profesionales/${id}`);
      cargarDatos();
    } catch {
      alert('Error al eliminar');
    }
  };

  if (loading) return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Personal</h1>
          <p className="text-gray-500">Gestión de profesionales de la clínica</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl shadow border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Personal</h1>
          <p className="text-gray-500">Gestión de profesionales de la clínica</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          + Nuevo Profesional
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-4">{editando ? 'Editar Profesional' : 'Nuevo Profesional'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prof-nombre" className="block font-semibold mb-1 text-sm">Nombre *</label>
              <input id="prof-nombre" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="prof-apellidos" className="block font-semibold mb-1 text-sm">Apellidos</label>
              <input id="prof-apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {!editando && (
              <div>
                <label htmlFor="prof-email" className="block font-semibold mb-1 text-sm">Email *</label>
                <input id="prof-email" name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-500 mt-1">Será el correo de acceso del profesional. Debe ser único en el sistema.</p>
              </div>
            )}
            <div>
              <label htmlFor="prof-telefono" className="block font-semibold mb-1 text-sm">Teléfono</label>
              <input id="prof-telefono" name="telefono" value={form.telefono} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="prof-especialidad" className="block font-semibold mb-1 text-sm">Especialidad *</label>
              <select id="prof-especialidad" name="especialidad_id" value={form.especialidad_id} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar</option>
                {especialidades.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                {editando ? 'Guardar Cambios' : 'Crear Profesional'}
              </button>
              <button type="button" onClick={resetForm} className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profesionales.length === 0 ? (
          <div className="text-gray-400 col-span-3 text-center py-8">No hay profesionales registrados</div>
        ) : (
          profesionales.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: p.especialidad?.color || '#2563eb' }}
                >
                  {p.nombre.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{p.nombre} {p.apellidos || ''}</div>
                  <div className="text-sm text-gray-500">{p.especialidad?.nombre || '-'}</div>
                </div>
              </div>
              {p.user?.email && <div className="text-sm text-gray-600 mb-1">📧 {p.user.email}</div>}
              {p.telefono && <div className="text-sm text-gray-600 mb-3">📞 {p.telefono}</div>}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => handleEditar(p)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Editar</button>
                <button onClick={() => handleEliminar(p.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm">Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
