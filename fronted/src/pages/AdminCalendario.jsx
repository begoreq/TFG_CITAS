import React, { useEffect, useState } from 'react';
import api from '../api';
import ModalNuevaCita from '../ModalNuevaCita';

const SEMANA = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

export default function AdminCalendario() {
  const [especialidades, setEspecialidades] = useState([]);
  const [citas, setCitas] = useState([]);
  const [filtroEsp, setFiltroEsp] = useState(null);
  const [fechaSel, setFechaSel] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citaEditando, setCitaEditando] = useState(null);
  const [profesionales, setProfesionales] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [saveError, setSaveError] = useState('');

  const hoy = new Date();
  const [mesVista, setMesVista] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() });

  const getBadgeEstado = (cita) => {
    if (cita.no_asistio) {
      return {
        className: 'bg-rose-100 text-rose-700',
        label: '🚫 No asistido',
      };
    }

    if (cita.estado === 'confirmada') {
      return {
        className: 'bg-green-100 text-green-700',
        label: '✅ Confirmada',
      };
    }

    if (cita.estado === 'pendiente') {
      return {
        className: 'bg-yellow-100 text-yellow-700',
        label: '⏳ Pendiente',
      };
    }

    if (cita.estado === 'completada') {
      return {
        className: 'bg-blue-100 text-blue-700',
        label: '🩺 Completada',
      };
    }

    return {
      className: 'bg-red-100 text-red-700',
      label: '❌ Cancelada',
    };
  };

  const diasMes = new Date(mesVista.year, mesVista.month + 1, 0).getDate();
  const primerDia = new Date(mesVista.year, mesVista.month, 1).getDay();

  useEffect(() => {
    api.get('/especialidades').then((res) => setEspecialidades(res.data));
    api.get('/citas').then((res) => setCitas(res.data)).catch(() => {});
    api.get('/profesionales').then((res) => setProfesionales(res.data)).catch(() => {});
    api.get('/servicios').then((res) => setServicios(res.data)).catch(() => {});
  }, []);

  const mesAnterior = () => {
    setMesVista((prev) => {
      const m = prev.month - 1;
      return m < 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: m };
    });
  };

  const mesSiguiente = () => {
    setMesVista((prev) => {
      const m = prev.month + 1;
      return m > 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: m };
    });
  };

  const irAHoy = () => {
    setMesVista({ year: hoy.getFullYear(), month: hoy.getMonth() });
    const d = String(hoy.getDate()).padStart(2, '0');
    const m = String(hoy.getMonth() + 1).padStart(2, '0');
    setFechaSel(`${hoy.getFullYear()}-${m}-${d}`);
  };

  const abrirModalCrear = () => {
    setCitaEditando(null);
    setSaveError('');
    setMostrarModal(true);
  };

  const abrirModalEditar = (cita) => {
    setCitaEditando(cita);
    setSaveError('');
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCitaEditando(null);
    setSaveError('');
  };

  const guardarCita = async (formData) => {
    setSaveError('');
    try {
      if (citaEditando?.id) {
        // Editar cita existente
        const payload = {
          paciente_id: citaEditando.paciente_id,
          paciente_nombre: formData.paciente_nombre,
          paciente_email: formData.paciente_email,
          paciente_telefono: formData.paciente_telefono,
          profesional_id: formData.profesional_id || citaEditando.profesional_id,
          fecha: formData.fecha,
          hora: formData.hora,
          estado: formData.estado,
          notas_medicas: formData.notas_medicas,
          servicios: formData.servicios || [],
        };
        await api.put(`/citas/${citaEditando.id}`, payload);
      } else {
        // Crear nueva cita
        const payload = formData;
        await api.post('/citas', payload);
      }
      // Recargar citas
      const res = await api.get('/citas');
      setCitas(res.data);
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar cita:', error);
      const data = error.response?.data;
      const toShortEs = (msg = '') => {
        const text = String(msg).toLowerCase();
        if (text.includes('telefono') || text.includes('phone')) return 'Telefono no valido.';
        if (text.includes('email') || text.includes('correo')) return 'Email no valido.';
        if (text.includes('fecha') || text.includes('date')) return 'Fecha no valida.';
        if (text.includes('hora') || text.includes('time')) return 'Hora no valida.';
        return 'No se pudo guardar.';
      };

      if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        const rawMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        setSaveError(toShortEs(rawMessage));
      } else {
        setSaveError(toShortEs(data?.message));
      }
    }
  };

  const eliminarCita = async (citaId) => {
    if (window.confirm('¿Está seguro que desea eliminar esta cita?')) {
      try {
        await api.delete(`/citas/${citaId}`);
        // Recargar citas
        const res = await api.get('/citas');
        setCitas(res.data);
      } catch (error) {
        console.error('Error al eliminar cita:', error);
        alert('Error al eliminar la cita');
      }
    }
  };

  const formatFecha = (dia) => {
    const m = String(mesVista.month + 1).padStart(2, '0');
    const d = String(dia).padStart(2, '0');
    return `${mesVista.year}-${m}-${d}`;
  };

  const citasDelDia = fechaSel
    ? citas.filter((c) => {
        const match = c.fecha === fechaSel && c.estado !== 'cancelada';
        if (filtroEsp) return match && c.profesional?.especialidad?.id === filtroEsp;
        return match;
      })
    : [];

  // Devuelve los IDs de especialidades con citas activas en un día
  const especialidadesDelDia = (dia) => {
    const fecha = formatFecha(dia);
    const citasDia = citas.filter((c) => {
      const match = c.fecha === fecha && c.estado !== 'cancelada';
      if (filtroEsp) return match && c.profesional?.especialidad?.id === filtroEsp;
      return match;
    });
    const ids = [...new Set(citasDia.map((c) => c.profesional?.especialidad?.id).filter(Boolean))];
    return ids;
  };

  const citasPorDia = (dia) => {
    const fecha = formatFecha(dia);
    return citas.filter((c) => {
      const match = c.fecha === fecha && c.estado !== 'cancelada';
      if (filtroEsp) return match && c.profesional?.especialidad?.id === filtroEsp;
      return match;
    }).length;
  };

  const espMap = {};
  especialidades.forEach((e) => { espMap[e.id] = e; });

  const nombreMes = new Date(mesVista.year, mesVista.month).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const esHoyMes = mesVista.year === hoy.getFullYear() && mesVista.month === hoy.getMonth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Calendario</h1>
      <p className="text-gray-500 mb-6">Agenda de la clínica</p>

      {/* Filtros de especialidad */}
      <div className="flex gap-3 mb-6 flex-wrap items-center">
        <button
          onClick={() => setFiltroEsp(null)}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
            !filtroEsp ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        {especialidades.map((esp) => (
          <button
            key={esp.id}
            onClick={() => setFiltroEsp(filtroEsp === esp.id ? null : esp.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition border-2"
            style={{
              backgroundColor: filtroEsp === esp.id ? esp.color : '#fff',
              color: filtroEsp === esp.id ? '#fff' : esp.color,
              borderColor: esp.color,
            }}
          >
            <span>{esp.icono}</span> {esp.nombre}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Calendario */}
        <div className="flex-1 bg-white rounded-xl shadow p-6 border border-gray-100">
          {/* Navegación de mes */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={mesAnterior} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-xl font-bold">‹</button>
            <div className="flex items-center gap-3">
              <span className="font-bold text-2xl capitalize">{nombreMes}</span>
              {!esHoyMes && (
                <button onClick={irAHoy} className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold hover:bg-blue-200 transition">
                  Hoy
                </button>
              )}
            </div>
            <button onClick={mesSiguiente} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-xl font-bold">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {SEMANA.map((d) => (
              <div key={d} className="text-center text-gray-400 font-semibold text-xs uppercase tracking-wide py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(primerDia === 0 ? 6 : primerDia - 1)].map((_, i) => <div key={'e' + i}></div>)}
            {Array.from({ length: diasMes }, (_, i) => i + 1).map((dia) => {
              const fecha = formatFecha(dia);
              const sel = fechaSel === fecha;
              const numCitas = citasPorDia(dia);
              const espIds = especialidadesDelDia(dia);
              return (
                <button
                  key={dia}
                  onClick={() => setFechaSel(fecha)}
                  className={`relative rounded-xl w-full aspect-square flex flex-col items-center justify-center transition ${
                    sel
                      ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-400'
                      : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <span className={`font-semibold text-base ${numCitas > 0 && !sel ? 'text-gray-900' : ''}`}>
                    {dia}
                  </span>
                  {/* Dots de especialidad */}
                  {espIds.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {espIds.slice(0, 4).map((id) => (
                        <span
                          key={id}
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: espMap[id]?.color || '#9ca3af' }}
                          title={espMap[id]?.nombre}
                        />
                      ))}
                    </div>
                  )}
                  {numCitas > 0 && (
                    <span className={`text-[10px] font-bold leading-none mt-0.5 ${sel ? 'text-blue-500' : 'text-gray-400'}`}>
                      {numCitas}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-gray-100">
            {especialidades.map((esp) => (
              <div key={esp.id} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: esp.color }} />
                {esp.nombre}
              </div>
            ))}
          </div>
        </div>

        {/* Panel lateral: citas del día */}
        <div className="w-96 bg-white rounded-xl shadow border border-gray-100 p-6 self-start">
          {fechaSel ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  {new Date(fechaSel + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {citasDelDia.length} cita{citasDelDia.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={abrirModalCrear}
                className="w-full mb-4 px-4 py-2.5 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition flex items-center justify-center gap-2"
              >
                <span>➕</span> Crear cita
              </button>
              {citasDelDia.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-gray-400 text-sm">No hay citas para este día</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-420px)] overflow-y-auto">
                  {citasDelDia.map((c) => {
                    const espColor = c.profesional?.especialidad?.color || '#6b7280';
                    const badgeEstado = getBadgeEstado(c);
                    return (
                      <div key={c.id} className="rounded-lg border overflow-hidden" style={{ borderLeftWidth: '4px', borderLeftColor: espColor }}>
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm" style={{ color: espColor }}>
                              {c.hora?.slice(0, 5)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${badgeEstado.className}`}>
                              {badgeEstado.label}
                            </span>
                          </div>
                          <div className="font-semibold text-gray-800 text-sm">{c.paciente?.name} {c.paciente?.apellidos || ''}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: espColor }} />
                            <span className="text-xs text-gray-500">{c.profesional?.nombre} · {c.profesional?.especialidad?.nombre}</span>
                          </div>
                          {c.servicios?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {c.servicios.map((s) => (
                                <span key={s.id} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                                  {s.nombre}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-200">
                            <button
                              onClick={() => abrirModalEditar(c)}
                              className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded hover:bg-blue-200 transition flex items-center justify-center gap-1"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => eliminarCita(c.id)}
                              className="flex-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded hover:bg-red-200 transition flex items-center justify-center gap-1"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-gray-400 text-sm">Selecciona un día para ver las citas</p>
            </div>
          )}
        </div>
      </div>

      {mostrarModal && (
        <ModalEditarCita
          cita={citaEditando}
          fechaBuscada={fechaSel}
          profesionales={profesionales}
          servicios={servicios}
          especialidades={especialidades}
          errorMsg={saveError}
          onClose={cerrarModal}
          onGuardar={guardarCita}
        />
      )}
    </div>
  );
}

// Componente modal mejorado para crear y editar citas
function ModalEditarCita({ cita, fechaBuscada, profesionales, servicios, especialidades, errorMsg, onClose, onGuardar }) {
  const [form, setForm] = useState(cita ? {
    paciente_id: cita.paciente_id,
    paciente_nombre: `${cita.paciente?.name} ${cita.paciente?.apellidos || ''}`,
    paciente_email: cita.paciente?.email || '',
    paciente_telefono: cita.paciente?.telefono || '',
    profesional_id: cita.profesional_id,
    fecha: cita.fecha,
    hora: cita.hora,
    estado: cita.estado,
    notas_medicas: cita.notas_medicas || '',
    servicios: cita.servicios?.map(s => s.id) || [],
  } : {
    paciente_id: '',
    paciente_nombre: '',
    paciente_email: '',
    paciente_telefono: '',
    profesional_id: '',
    fecha: fechaBuscada || new Date().toISOString().split('T')[0],
    hora: '',
    estado: 'confirmada',
    notas_medicas: '',
    servicios: [],
  });

  const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00'];

  const profesionalSeleccionado = profesionales.find(p => p.id === form.profesional_id);
  const serviciosFiltrados = servicios.filter(s => s.especialidad_id === profesionalSeleccionado?.especialidad_id);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleChangeServicios(e) {
    const servicioId = parseInt(e.target.value);
    setForm(prev => ({
      ...prev,
      servicios: prev.servicios.includes(servicioId)
        ? prev.servicios.filter(id => id !== servicioId)
        : [...prev.servicios, servicioId]
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onGuardar(form);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold mb-6">{cita ? 'Editar Cita Médica' : 'Nueva Cita Médica'}</h2>

        {errorMsg && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sección del Paciente */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-3">👤 Información del Paciente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Nombre del Paciente *</label>
                <input
                  type="text"
                  name="paciente_nombre"
                  value={form.paciente_nombre}
                  onChange={handleChange}
                  placeholder="Ej: María García López"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Teléfono *</label>
                <input
                  type="tel"
                  name="paciente_telefono"
                  maxLength={15}
                  pattern="[0-9+() -]{9,15}"
                  value={form.paciente_telefono}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block font-semibold mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  name="paciente_email"
                  value={form.paciente_email}
                  onChange={handleChange}
                  placeholder="email@ejemplo.com"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Sección del Profesional y Servicios */}
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-3">👨‍⚕️ Profesional y Servicios</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block font-semibold mb-1 text-gray-700">Profesional *</label>
                <select
                  name="profesional_id"
                  value={form.profesional_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar profesional</option>
                  {profesionales.map(p => (
                    <option key={p.id} value={p.id}>
                      Dr/Dra. {p.nombre} · {p.especialidad?.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {profesionalSeleccionado && serviciosFiltrados.length > 0 && (
                <div className="col-span-2">
                  <label className="block font-semibold mb-2 text-gray-700">Servicios</label>
                  <div className="grid grid-cols-2 gap-2">
                    {serviciosFiltrados.map(s => (
                      <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={s.id}
                          checked={form.servicios.includes(s.id)}
                          onChange={handleChangeServicios}
                          className="w-4 h-4 rounded border-gray-300 text-green-600"
                        />
                        <span className="text-sm text-gray-700">{s.nombre}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección de Fecha y Hora */}
          <div className="bg-purple-50 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-3">📅 Fecha y Hora</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Fecha *</label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Hora *</label>
                <select
                  name="hora"
                  value={form.hora}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar hora</option>
                  {horas.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sección de Estado y Notas */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-3">📝 Estado y Notas</h3>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Estado *</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-yellow-500 focus:border-transparent mb-4"
              >
                <option value="confirmada">Confirmada</option>
                <option value="pendiente">Pendiente</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>

              <label className="block font-semibold mb-1 text-gray-700">Notas Médicas</label>
              <textarea
                name="notas_medicas"
                value={form.notas_medicas}
                onChange={handleChange}
                placeholder="Notas adicionales sobre la cita..."
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                rows="4"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
            >
              {cita ? 'Guardar Cambios' : 'Crear Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
