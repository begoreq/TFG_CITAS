import React, { useEffect, useState } from 'react';
import api from '../api';

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const SkeletonCita = () => (
  <div className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex gap-4">
    <div className="bg-gray-200 rounded-lg w-20 h-12"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export default function ProfesionalLayout({ user, onLogout }) {
  const [tab, setTab] = useState('agenda');
  const [citas, setCitas] = useState([]);
  const [fechaSel, setFechaSel] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [pacientes, setPacientes] = useState([]);
  const [pacientesLoading, setPacientesLoading] = useState(true);
  const [modalCita, setModalCita] = useState(null);
  const [notasMedicas, setNotasMedicas] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaPacientes, setBusquedaPacientes] = useState('');
  const [modalFicha, setModalFicha] = useState(null);
  const [fichaLoading, setFichaLoading] = useState(false);
  const [modalEditarPaciente, setModalEditarPaciente] = useState(null);
  const [guardandoPaciente, setGuardandoPaciente] = useState(false);
  const [formPaciente, setFormPaciente] = useState({
    name: '',
    apellidos: '',
    email: '',
    telefono: '',
  });
  const [mesVista, setMesVista] = useState(() => {
    const hoy = new Date();
    return { year: hoy.getFullYear(), month: hoy.getMonth() };
  });
  const [citasMes, setCitasMes] = useState([]);
  const [citasMesLoading, setCitasMesLoading] = useState(false);

  const profesionalId = user.profesional?.id;

  const cargarCitas = async () => {
    if (!profesionalId) return;
    setLoading(true);
    try {
      const res = await api.get('/citas', {
        params: { profesional_id: profesionalId, fecha: fechaSel },
      });
      setCitas(res.data);
    } catch {
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarKpis = async () => {
    setKpisLoading(true);
    try {
      const res = await api.get('/mi-dashboard');
      setKpis(res.data);
    } catch {
      setKpis(null);
    } finally {
      setKpisLoading(false);
    }
  };

  const cargarPacientes = async () => {
    setPacientesLoading(true);
    try {
      const res = await api.get('/mis-pacientes');
      setPacientes(res.data);
    } catch {
      setPacientes([]);
    } finally {
      setPacientesLoading(false);
    }
  };

  const cargarCitasMes = async () => {
    if (!profesionalId) return;

    setCitasMesLoading(true);
    try {
      const inicioMes = `${mesVista.year}-${String(mesVista.month + 1).padStart(2, '0')}-01`;
      const finMes = new Date(mesVista.year, mesVista.month + 1, 0).getDate();
      const finMesIso = `${mesVista.year}-${String(mesVista.month + 1).padStart(2, '0')}-${String(finMes).padStart(2, '0')}`;

      const res = await api.get('/citas', {
        params: { profesional_id: profesionalId },
      });

      const citasFiltradas = (res.data || []).filter((cita) => cita.fecha >= inicioMes && cita.fecha <= finMesIso);
      setCitasMes(citasFiltradas);
    } catch {
      setCitasMes([]);
    } finally {
      setCitasMesLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, [fechaSel, profesionalId]);

  useEffect(() => {
    if (profesionalId) {
      cargarKpis();
      cargarPacientes();
    }
  }, [profesionalId]);

  useEffect(() => {
    if (!profesionalId) return;

    cargarCitasMes();
  }, [mesVista, profesionalId]);

  useEffect(() => {
    if (!profesionalId) return;

    const interval = setInterval(() => {
      cargarKpis();
    }, 30000);

    return () => clearInterval(interval);
  }, [profesionalId]);

  const cambiarEstado = async (cita, nuevoEstado) => {
    try {
      await api.put(`/citas/${cita.id}`, { estado: nuevoEstado });
      cargarCitas();
      cargarKpis();
    } catch {
      alert('Error al actualizar la cita');
    }
  };

  const completarRapido = async (cita) => {
    const ok = window.confirm('Marcar esta cita como completada para contabilizar ingresos?');
    if (!ok) return;

    await cambiarEstado(cita, 'completada');
  };

  const abrirModalCompletar = (cita) => {
    setModalCita(cita);
    setNotasMedicas(cita.notas_medicas || '');
  };

  const completarConNotas = async () => {
    if (!modalCita) return;
    setGuardando(true);
    try {
      await api.put(`/citas/${modalCita.id}`, {
        estado: 'completada',
        notas_medicas: notasMedicas,
      });
      setModalCita(null);
      setNotasMedicas('');
      cargarCitas();
      cargarKpis();
    } catch {
      alert('Error al completar la cita');
    } finally {
      setGuardando(false);
    }
  };

  const abrirFicha = async (pacienteId) => {
    setFichaLoading(true);
    setModalFicha(null);
    try {
      const res = await api.get(`/ficha-paciente/${pacienteId}`);
      setModalFicha(res.data);
    } catch {
      alert('Error al cargar la ficha del paciente');
    } finally {
      setFichaLoading(false);
    }
  };

  const abrirModalEditarPaciente = (paciente) => {
    setModalEditarPaciente(paciente);
    setFormPaciente({
      name: paciente.name || '',
      apellidos: paciente.apellidos || '',
      email: paciente.email || '',
      telefono: paciente.telefono || '',
    });
  };

  const guardarEdicionPaciente = async () => {
    if (!modalEditarPaciente) return;

    if (!formPaciente.name.trim() || !formPaciente.email.trim()) {
      alert('Nombre y email son obligatorios');
      return;
    }

    setGuardandoPaciente(true);
    try {
      const res = await api.put(`/pacientes/${modalEditarPaciente.id}`, {
        name: formPaciente.name.trim(),
        apellidos: formPaciente.apellidos.trim() || null,
        email: formPaciente.email.trim(),
        telefono: formPaciente.telefono.trim() || null,
      });

      setPacientes((prev) => prev.map((p) => (p.id === modalEditarPaciente.id ? { ...p, ...res.data } : p)));
      setModalEditarPaciente(null);
    } catch {
      alert('No se pudo actualizar el paciente');
    } finally {
      setGuardandoPaciente(false);
    }
  };

  const cambiarDia = (offset) => {
    const d = new Date(fechaSel);
    d.setDate(d.getDate() + offset);
    const nuevaFecha = d.toISOString().split('T')[0];
    setFechaSel(nuevaFecha);
    setMesVista({ year: d.getFullYear(), month: d.getMonth() });
  };

  const cambiarMes = (offset) => {
    setMesVista((prev) => {
      const nuevaFecha = new Date(prev.year, prev.month + offset, 1);
      return { year: nuevaFecha.getFullYear(), month: nuevaFecha.getMonth() };
    });
  };

  const seleccionarDiaCalendario = (dia) => {
    const fechaIso = `${mesVista.year}-${String(mesVista.month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    setFechaSel(fechaIso);
  };

  const esHoy = fechaSel === new Date().toISOString().split('T')[0];
  const hoyIso = new Date().toISOString().split('T')[0];

  const fechaFormateada = new Date(fechaSel + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const nombreMesVista = new Date(mesVista.year, mesVista.month).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const diasMes = new Date(mesVista.year, mesVista.month + 1, 0).getDate();
  const primerDiaMes = new Date(mesVista.year, mesVista.month, 1).getDay();
  const offsetInicio = primerDiaMes === 0 ? 6 : primerDiaMes - 1;
  const semanaCorta = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

  const citasPorDia = citasMes.reduce((acc, cita) => {
    const dia = Number((cita.fecha || '').slice(8, 10));
    if (!Number.isNaN(dia)) {
      acc[dia] = (acc[dia] || 0) + 1;
    }
    return acc;
  }, {});

  const estadoColor = {
    pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    confirmada: 'bg-green-100 text-green-700 border-green-300',
    completada: 'bg-blue-100 text-blue-700 border-blue-300',
  };

  const totalDia = citas.length;
  const citasActivasDia = citas.filter((c) => c.estado === 'confirmada' || c.estado === 'pendiente');
  const citasHistorialDia = citas.filter((c) => c.estado === 'completada' || c.estado === 'cancelada');
  const pendientesDia = citasActivasDia.filter((c) => c.estado === 'pendiente').length;
  const confirmadasDia = citasActivasDia.filter((c) => c.estado === 'confirmada').length;
  const completadasDia = citas.filter((c) => c.estado === 'completada').length;
  const canceladasDia = citas.filter((c) => c.estado === 'cancelada').length;
  const citasOrdenadasPorHora = [...citas].sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));

  const hhmmToMinutes = (hhmm) => {
    const [h, m] = (hhmm || '00:00').slice(0, 5).split(':').map(Number);
    return (h * 60) + m;
  };

  const minutesToHHMM = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const duracionCitaMinutos = (cita) => {
    const total = (cita.servicios || []).reduce((acc, s) => acc + Number(s.duracion_minutos || 0), 0);
    return total > 0 ? total : 30;
  };

  const franjaInicioMin = citasOrdenadasPorHora.length > 0
    ? Math.min(...citasOrdenadasPorHora.map((c) => hhmmToMinutes(c.hora)))
    : null;

  const franjaFinMin = citasOrdenadasPorHora.length > 0
    ? Math.max(...citasOrdenadasPorHora.map((c) => hhmmToMinutes(c.hora) + duracionCitaMinutos(c)))
    : null;

  const franjaDia = franjaInicioMin !== null && franjaFinMin !== null
    ? `${minutesToHHMM(franjaInicioMin)} - ${minutesToHHMM(franjaFinMin)}`
    : '—';

  const ahoraHHMM = new Date().toTimeString().slice(0, 5);
  const citasActivasOrdenadas = [...citasActivasDia].sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));
  const proximaCitaDia = (esHoy
    ? citasActivasOrdenadas.find((c) => (c.hora || '').slice(0, 5) >= ahoraHHMM)
    : citasActivasOrdenadas[0]) || null;

  if (!profesionalId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-4">No se encontró el perfil profesional asociado a tu cuenta.</p>
          <button onClick={onLogout} className="text-red-500 font-semibold hover:underline">Cerrar sesión</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'agenda', label: 'Mi Agenda', icon: '📅' },
    { id: 'pacientes', label: 'Mis Pacientes', icon: '👥' },
  ];

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const termino = busquedaPacientes.trim().toLowerCase();
    if (!termino) return true;

    const nombreCompleto = `${paciente.name || ''} ${paciente.apellidos || ''}`.toLowerCase();
    const email = (paciente.email || '').toLowerCase();
    const telefono = (paciente.telefono || '').toLowerCase();

    return nombreCompleto.includes(termino) || email.includes(termino) || telefono.includes(termino);
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
          <div className="bg-green-600 rounded-xl w-12 h-12 flex items-center justify-center">
            <span className="text-white text-2xl">🩺</span>
          </div>
          <div>
            <div className="font-extrabold text-lg text-gray-800">MediCitas</div>
            <div className="text-xs text-gray-500 font-medium">Panel Profesional</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 mx-4 mt-4 rounded-lg bg-green-50">
          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm">{user?.name}</div>
            <div className="text-xs text-gray-500">{user.profesional?.especialidad?.nombre || 'Profesional'}</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 mt-6 px-4 flex-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 p-3 rounded-lg font-medium text-base transition ${
                tab === t.id ? 'bg-green-100 text-green-600' : 'text-gray-700 hover:bg-gray-100'
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
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 max-w-4xl">
          {kpisLoading ? (
            [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          ) : kpis ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="text-sm text-gray-500 mb-1">Citas Hoy</div>
                <div className="text-3xl font-bold text-green-600">{kpis.citasHoy}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="text-sm text-gray-500 mb-1">Pendientes</div>
                <div className="text-3xl font-bold text-yellow-600">{kpis.citasPendientes}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="text-sm text-gray-500 mb-1">Ingresos Mes</div>
                <div className="text-3xl font-bold text-blue-600">€{Number(kpis.ingresosMes).toFixed(0)}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="text-sm text-gray-500 mb-1">Completadas Mes</div>
                <div className="text-3xl font-bold text-gray-800">{kpis.completadasMes}</div>
              </div>
            </>
          ) : null}
        </div>

        {tab === 'agenda' && (
          <div className="max-w-6xl">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => cambiarMes(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-xl transition">‹</button>
                  <h2 className="text-2xl font-bold text-gray-800 capitalize">{nombreMesVista}</h2>
                  <button onClick={() => cambiarMes(1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-xl transition">›</button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {semanaCorta.map((d) => (
                    <div key={d} className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: offsetInicio }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-12" />
                  ))}
                  {Array.from({ length: diasMes }, (_, i) => i + 1).map((dia) => {
                    const fechaDia = `${mesVista.year}-${String(mesVista.month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
                    const seleccionado = fechaDia === fechaSel;
                    const esHoyDia = fechaDia === hoyIso;
                    const totalDia = citasPorDia[dia] || 0;

                    return (
                      <button
                        key={dia}
                        onClick={() => seleccionarDiaCalendario(dia)}
                        className={`h-12 rounded-xl border text-sm font-semibold transition relative ${
                          seleccionado
                            ? 'bg-green-600 text-white border-green-600'
                            : esHoyDia
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        title={totalDia > 0 ? `${totalDia} cita(s)` : 'Sin citas'}
                      >
                        {dia}
                        {totalDia > 0 && (
                          <span className={`absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            seleccionado ? 'bg-white text-green-700' : 'bg-green-600 text-white'
                          }`}>
                            {totalDia}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  {citasMesLoading ? 'Cargando citas del mes...' : 'Haz click en un dia para ver sus pacientes.'}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <button onClick={() => cambiarDia(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-xl transition">‹</button>
                    <button onClick={() => cambiarDia(1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-xl transition">›</button>
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-800 capitalize leading-tight">{fechaFormateada}</h1>
                  {esHoy && <span className="text-sm text-green-600 font-semibold">Hoy</span>}
                  <p className="text-sm text-gray-500 mt-2">Resumen de citas para la fecha seleccionada.</p>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Totales</div>
                      <div className="text-xl font-extrabold text-gray-800">{totalDia}</div>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                      <div className="text-xs uppercase tracking-wide text-green-700 font-semibold">Activas</div>
                      <div className="text-xl font-extrabold text-green-700">{citasActivasDia.length}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-700 font-semibold">Historial</div>
                      <div className="text-xl font-extrabold text-slate-700">{citasHistorialDia.length}</div>
                    </div>
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                      <div className="text-xs uppercase tracking-wide text-blue-700 font-semibold">Franja</div>
                      <div className="text-sm font-bold text-blue-700">{franjaDia}</div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                    Confirmadas: <span className="font-semibold text-green-700">{confirmadasDia}</span>
                    {' · '}
                    Pendientes: <span className="font-semibold text-yellow-700">{pendientesDia}</span>
                    {' · '}
                    Completadas: <span className="font-semibold text-blue-700">{completadasDia}</span>
                    {' · '}
                    Canceladas: <span className="font-semibold text-slate-700">{canceladasDia}</span>
                  </div>

                  <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3 text-sm">
                    {proximaCitaDia ? (
                      <p className="text-gray-700">
                        <span className="font-semibold">Proxima cita:</span>{' '}
                        {proximaCitaDia.hora?.slice(0, 5)} con {proximaCitaDia.paciente?.name} {proximaCitaDia.paciente?.apellidos || ''}
                      </p>
                    ) : (
                      <p className="text-gray-500">No hay citas pendientes para esta fecha.</p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <input
                    type="date"
                    value={fechaSel}
                    onChange={(e) => {
                      setFechaSel(e.target.value);
                      const d = new Date(`${e.target.value}T12:00:00`);
                      setMesVista({ year: d.getFullYear(), month: d.getMonth() });
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Buscador de pacientes */}
            <div className="mb-4">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="🔍 Buscar paciente por nombre..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Lista de citas */}
            {(() => {
              const filtrar = (lista) => lista.filter((c) => {
                if (!busqueda.trim()) return true;
                const nombre = `${c.paciente?.name || ''} ${c.paciente?.apellidos || ''}`.toLowerCase();
                return nombre.includes(busqueda.toLowerCase());
              });
              const siguientes = filtrar(citas.filter((c) => c.estado === 'confirmada' || c.estado === 'pendiente'));
              const historial  = filtrar(citas.filter((c) => c.estado === 'completada' || c.estado === 'cancelada'));
              const hayResultados = siguientes.length + historial.length > 0;

              const renderCard = (cita, opaco = false) => (
                <div key={cita.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start justify-between hover:shadow-md transition ${opaco ? 'opacity-50' : ''}`}>
                  <div className="flex gap-4">
                    <div className={`rounded-lg px-4 py-2 text-center min-w-[80px] ${opaco ? 'bg-gray-100' : 'bg-green-50'}`}>
                      <div className={`font-bold text-lg ${opaco ? 'text-gray-500' : 'text-green-700'}`}>{cita.hora?.slice(0, 5)}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-lg">
                        {cita.paciente?.name} {cita.paciente?.apellidos || ''}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        {cita.paciente?.telefono && (
                          <a
                            href={`tel:${cita.paciente.telefono}`}
                            className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800 font-medium transition"
                            title="Llamar al paciente"
                          >
                            📞 {cita.paciente.telefono}
                          </a>
                        )}
                        <button
                          onClick={() => abrirFicha(cita.paciente_id)}
                          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
                          title="Ver ficha del paciente"
                        >
                          📋 Ficha
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {cita.servicios?.map((s) => s.nombre).join(', ')}
                      </div>
                      {cita.notas && <div className="text-sm text-gray-400 mt-1 italic">📝 {cita.notas}</div>}
                      {cita.notas_medicas && (
                        <div className="text-sm text-blue-500 mt-1 italic">🏥 {cita.notas_medicas}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {cita.estado === 'confirmada' ? (
                      <button
                        onClick={() => abrirModalCompletar(cita)}
                        title="Abrir atención para añadir notas médicas y completar la cita"
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition hover:brightness-95 ${estadoColor[cita.estado] || 'bg-gray-100 text-gray-600'}`}
                      >
                        Atender
                      </button>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${estadoColor[cita.estado] || 'bg-gray-100 text-gray-600'}`}>
                        {cita.estado}
                      </span>
                    )}
                    {cita.estado === 'confirmada' && (
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => cambiarEstado(cita, 'cancelada')}
                          className="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-lg font-semibold hover:bg-red-100 transition"
                        >
                          ✕ Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );

              return loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <SkeletonCita key={i} />)}
                </div>
              ) : !hayResultados && busqueda.trim() ? (
                <div className="text-center py-16">
                  <span className="text-5xl">🔍</span>
                  <p className="text-gray-400 mt-4 text-lg">No se encontraron pacientes con ese nombre</p>
                </div>
              ) : citas.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-6xl">☀️</span>
                  <p className="text-xl font-semibold text-green-600 mt-4">¡Día libre!</p>
                  <p className="text-gray-400 mt-2">No tienes citas programadas para este día. Disfruta tu descanso.</p>
                </div>
              ) : (
                <>
                  {/* Sección: Siguientes Pacientes */}
                  {siguientes.length > 0 && (
                    <>
                      <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">🟢 Siguientes Pacientes</h3>
                      <div className="space-y-4 mb-8">
                        {siguientes.map((cita) => renderCard(cita, false))}
                      </div>
                    </>
                  )}

                  {/* Sección: Historial */}
                  {historial.length > 0 && (
                    <>
                      <h3 className="text-lg font-bold text-gray-400 mb-3 flex items-center gap-2">📁 Historial</h3>
                      <div className="space-y-4">
                        {historial.map((cita) => renderCard(cita, true))}
                      </div>
                    </>
                  )}
                </>
              );
            })()}

            {/* Resumen */}
            {!loading && citas.length > 0 && (
              <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex justify-around text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{citas.length}</div>
                  <div className="text-xs text-gray-500">Citas del día</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{citas.filter((c) => c.estado === 'confirmada').length}</div>
                  <div className="text-xs text-gray-500">Confirmadas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{citas.filter((c) => c.estado === 'completada').length}</div>
                  <div className="text-xs text-gray-500">Completadas</div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'pacientes' && (
          <div className="max-w-4xl">
            <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Mis Pacientes</h2>
                <p className="text-sm text-gray-500 mt-1">Busca un paciente y accede a su historia clínica.</p>
              </div>
              <div className="w-full md:max-w-sm">
                <input
                  type="text"
                  value={busquedaPacientes}
                  onChange={(e) => setBusquedaPacientes(e.target.value)}
                  placeholder="🔎 Buscar por nombre, email o teléfono..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            {pacientesLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : pacientes.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl">👥</span>
                <p className="text-gray-400 mt-4 text-lg">Aún no tienes pacientes</p>
              </div>
            ) : pacientesFiltrados.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <span className="text-5xl">🔍</span>
                <p className="text-gray-400 mt-4 text-lg">No se encontraron pacientes con esa búsqueda</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Paciente</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Teléfono</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Citas</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Última Cita</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Historia Clínica</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientesFiltrados.map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                              {p.name?.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-800">{p.name} {p.apellidos || ''}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{p.email}</td>
                        <td className="px-4 py-3 text-gray-600">{p.telefono || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{p.totalCitas}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{p.ultimaCita || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => abrirFicha(p.id)}
                              className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                            >
                              📋 Ver ficha
                            </button>
                            <button
                              onClick={() => abrirModalEditarPaciente(p)}
                              className="inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
                            >
                              ✏️ Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Completar Cita */}
      {modalCita && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-1">🩺 Atender Paciente</h2>
            <p className="text-sm text-gray-500 mb-4">
              {modalCita.paciente?.name} {modalCita.paciente?.apellidos || ''} — {modalCita.hora?.slice(0, 5)}
            </p>
            <div className="text-sm text-gray-500 mb-4">
              {modalCita.servicios?.map((s) => s.nombre).join(', ')}
            </div>
            <label htmlFor="notas-medicas" className="block font-semibold text-sm text-gray-700 mb-2">
              Notas Médicas
            </label>
            <textarea
              id="notas-medicas"
              value={notasMedicas}
              onChange={(e) => setNotasMedicas(e.target.value)}
              rows={5}
              placeholder="Diagnóstico, tratamiento, observaciones..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setModalCita(null); setNotasMedicas(''); }}
                className="px-5 py-2 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={completarConNotas}
                disabled={guardando}
                className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : '🩺 Completar Atención'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalEditarPaciente && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">✏️ Editar Paciente</h2>
              <button
                onClick={() => setModalEditarPaciente(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >×</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formPaciente.name}
                  onChange={(e) => setFormPaciente((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Apellidos</label>
                <input
                  type="text"
                  value={formPaciente.apellidos}
                  onChange={(e) => setFormPaciente((prev) => ({ ...prev, apellidos: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formPaciente.email}
                  onChange={(e) => setFormPaciente((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Telefono</label>
                <input
                  type="tel"
                  maxLength={15}
                  pattern="[0-9+() -]{9,15}"
                  value={formPaciente.telefono}
                  onChange={(e) => setFormPaciente((prev) => ({ ...prev, telefono: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalEditarPaciente(null)}
                className="px-5 py-2 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicionPaciente}
                disabled={guardandoPaciente}
                className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {guardandoPaciente ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ficha Paciente */}
      {(modalFicha || fichaLoading) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-4 max-h-[85vh] overflow-auto">
            {fichaLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-400 mt-4">Cargando ficha...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">📋 Ficha del Paciente</h2>
                  <button
                    onClick={() => setModalFicha(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >×</button>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-wrap gap-6">
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Nombre</div>
                    <div className="font-medium text-gray-800">{modalFicha.paciente.name} {modalFicha.paciente.apellidos || ''}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Email</div>
                    <div className="font-medium text-gray-800">{modalFicha.paciente.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Teléfono</div>
                    <div className="font-medium text-gray-800">{modalFicha.paciente.telefono || '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Total Visitas</div>
                    <div className="font-medium text-gray-800">{modalFicha.citas.length}</div>
                  </div>
                </div>

                <h3 className="font-bold text-gray-700 mb-3">Historial de Citas</h3>
                {modalFicha.citas.length === 0 ? (
                  <p className="text-gray-400 text-sm">Sin historial de citas.</p>
                ) : (
                  <div className="space-y-3">
                    {modalFicha.citas.map((c) => (
                      <div key={c.id} className="border border-gray-100 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-800 text-sm">{c.fecha} — {c.hora?.slice(0, 5)}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                            c.estado === 'completada' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                            c.estado === 'confirmada' ? 'bg-green-100 text-green-700 border-green-300' :
                            'bg-yellow-100 text-yellow-700 border-yellow-300'
                          }`}>{c.estado}</span>
                        </div>
                        <div className="text-xs text-gray-500">{c.servicios?.join(', ')}</div>
                        {c.notas && <div className="text-xs text-gray-400 mt-1 italic">📝 {c.notas}</div>}
                        {c.notas_medicas && <div className="text-xs text-blue-500 mt-1 italic">🏥 {c.notas_medicas}</div>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setModalFicha(null)}
                    className="px-5 py-2 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
