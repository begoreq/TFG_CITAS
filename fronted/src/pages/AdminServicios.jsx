import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AdminServicios() {
  const [servicios, setServicios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', duracion_minutos: 30, especialidad_id: '' });

  const cargarDatos = async () => {
    try {
      const [sRes, eRes] = await Promise.all([api.get('/servicios'), api.get('/especialidades')]);
      setServicios(sRes.data);
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
    setForm({ nombre: '', descripcion: '', precio: '', duracion_minutos: 30, especialidad_id: '' });
    setEditando(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/servicios/${editando}`, form);
      } else {
        await api.post('/servicios', form);
      }
      resetForm();
      cargarDatos();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar');
    }
  };

  const handleEditar = (s) => {
    setForm({
      nombre: s.nombre,
      descripcion: s.descripcion || '',
      precio: s.precio,
      duracion_minutos: s.duracion_minutos,
      especialidad_id: s.especialidad_id,
    });
    setEditando(s.id);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    try {
      await api.delete(`/servicios/${id}`);
      cargarDatos();
    } catch {
      alert('Error al eliminar');
    }
  };

  if (loading) return <div className="text-gray-500">Cargando servicios...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Servicios</h1>
          <p className="text-gray-500">Gestión de los servicios de la clínica</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          + Nuevo Servicio
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-4">{editando ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="srv-nombre" className="block font-semibold mb-1 text-sm">Nombre *</label>
              <input id="srv-nombre" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="srv-especialidad" className="block font-semibold mb-1 text-sm">Especialidad *</label>
              <select id="srv-especialidad" name="especialidad_id" value={form.especialidad_id} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar</option>
                {especialidades.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="srv-precio" className="block font-semibold mb-1 text-sm">Precio (€) *</label>
              <input id="srv-precio" name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="srv-duracion" className="block font-semibold mb-1 text-sm">Duración (min) *</label>
              <input id="srv-duracion" name="duracion_minutos" type="number" min="1" value={form.duracion_minutos} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="srv-desc" className="block font-semibold mb-1 text-sm">Descripción</label>
              <textarea id="srv-desc" name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                {editando ? 'Guardar Cambios' : 'Crear Servicio'}
              </button>
              <button type="button" onClick={resetForm} className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Servicio</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Especialidad</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Precio</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Duración</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No hay servicios registrados</td></tr>
            ) : (
              servicios.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{s.nombre}</td>
                  <td className="px-6 py-4 text-gray-600">{s.especialidad?.nombre || '-'}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">€{Number(s.precio).toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600">{s.duracion_minutos} min</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEditar(s)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Editar</button>
                    <button onClick={() => handleEliminar(s.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm">Eliminar</button>
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
