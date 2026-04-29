import React, { useEffect, useState } from 'react';
import api from '../api';

export default function PacienteLayout({ user, onLogout }) {
  const [step, setStep] = useState(0); // 0: especialidad, 1: profesional+servicios, 2: calendario
  const [especialidades, setEspecialidades] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [espSeleccionada, setEspSeleccionada] = useState(null);
  const [profSeleccionado, setProfSeleccionado] = useState(null);
  const [carritoServicios, setCarritoServicios] = useState([]);
  const [fechaSel, setFechaSel] = useState(null);
  const [horaSel, setHoraSel] = useState(null);
  const [misCitas, setMisCitas] = useState([]);
  const [citasActivasDia, setCitasActivasDia] = useState([]);
  const [cargandoHoras, setCargandoHoras] = useState(false);
  const [showCitas, setShowCitas] = useState(false);
  const [reservaExito, setReservaExito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nowTick, setNowTick] = useState(Date.now());

  const HORAS = ['09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00'];

  const hhmmToMinutes = (hhmm) => {
    const [h, m] = (hhmm || '00:00').slice(0, 5).split(':').map(Number);
    return (h * 60) + m;
  };

  const duracionReservaMinutos = Math.max(
    carritoServicios.reduce((acc, s) => acc + Number(s.duracion_minutos || 0), 0),
    30,
  );

  const duracionCitaExistente = (cita) => {
    const total = (cita.servicios || []).reduce((acc, s) => acc + Number(s.duracion_minutos || 0), 0);
    return total > 0 ? total : 30;
  };

  const esHoraOcupada = (hora) => {
    const inicioNueva = hhmmToMinutes(hora);
    const finNueva = inicioNueva + duracionReservaMinutos;

    return citasActivasDia.some((cita) => {
      const inicioExistente = hhmmToMinutes((cita.hora || '').slice(0, 5));
      const finExistente = inicioExistente + duracionCitaExistente(cita);

      return inicioNueva < finExistente && finNueva > inicioExistente;
    });
  };

  useEffect(() => {
    api.get('/especialidades').then((res) => {
      setEspecialidades(res.data);
      setLoading(false);
    });
    cargarMisCitas();
  }, []);

  const cargarMisCitas = () => {
    api.get('/citas', { params: { paciente_id: user.id } }).then((res) => {
      setMisCitas(res.data);
    }).catch(() => {});
  };

  const seleccionarEspecialidad = (esp) => {
    setEspSeleccionada(esp);
    const profs = esp.profesionales || [];
    setProfesionales(profs);
    const servs = esp.servicios || [];
    setServicios(servs);
    if (profs.length > 0) setProfSeleccionado(profs[0]);
    setStep(1);
  };

  const toggleServicio = (serv) => {
    if (carritoServicios.find((s) => s.id === serv.id)) {
      setCarritoServicios(carritoServicios.filter((s) => s.id !== serv.id));
    } else {
      setCarritoServicios([...carritoServicios, serv]);
    }
  };

  const confirmarReserva = async () => {
    if (!profSeleccionado || !fechaSel || !horaSel || carritoServicios.length === 0) {
      alert('Selecciona profesional, servicios, fecha y hora');
      return;
    }

    if (esHoraOcupada(horaSel)) {
      alert('Esa hora ya no esta disponible. Elige otra franja.');
      return;
    }

    if (esHoraPasada(horaSel)) {
      alert('Esa hora ya ha pasado. Elige otra franja disponible.');
      return;
    }

    try {
      await api.post('/citas', {
        paciente_id: user.id,
        profesional_id: profSeleccionado.id,
        fecha: fechaSel,
        hora: horaSel,
        servicios: carritoServicios.map((s) => s.id),
      });
      setReservaExito(true);
      cargarMisCitas();
      setTimeout(() => {
        setReservaExito(false);
        setStep(0);
        setCarritoServicios([]);
        setFechaSel(null);
        setHoraSel(null);
      }, 2500);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al reservar');
    }
  };

  const cancelarCita = async (id) => {
    if (!window.confirm('¿Anular esta cita?')) return;
    try {
      await api.delete(`/citas/${id}`);
      cargarMisCitas();
    } catch {
      alert('Error al cancelar');
    }
  };

  const volver = () => {
    if (step === 2) setStep(1);
    else if (step === 1) { setStep(0); setCarritoServicios([]); }
  };

  // Calendario
  const hoy = new Date();
  const [mesVista, setMesVista] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() });
  const diasMes = new Date(mesVista.year, mesVista.month + 1, 0).getDate();
  const primerDia = new Date(mesVista.year, mesVista.month, 1).getDay();
  const SEMANA = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
  const esHoyMes = mesVista.year === hoy.getFullYear() && mesVista.month === hoy.getMonth();

  // Festivos nacionales España
  const esFestivo = (fecha) => {
    const y = new Date(fecha).getFullYear();
    const festivos = [
      `${y}-01-01`, `${y}-01-06`, `${y}-05-01`, `${y}-08-15`,
      `${y}-10-12`, `${y}-11-01`, `${y}-12-06`, `${y}-12-08`, `${y}-12-25`,
    ];
    return festivos.includes(fecha);
  };

  const esDomingo = (year, month, day) => new Date(year, month, day).getDay() === 0;

  const hoyISO = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

  const esHoraPasada = (hora) => {
    if (!fechaSel || fechaSel !== hoyISO) return false;

    const [hh, mm] = hora.split(':').map(Number);
    const slot = new Date();
    slot.setHours(hh, mm, 0, 0);

    return slot <= new Date(nowTick);
  };

  const diaNoDisponible = (dia) => {
    const fecha = `${mesVista.year}-${String(mesVista.month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const esPasado = new Date(mesVista.year, mesVista.month, dia) < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return esPasado || esDomingo(mesVista.year, mesVista.month, dia) || esFestivo(fecha);
  };

  const mesAnterior = () => {
    setMesVista((prev) => {
      const m = prev.month - 1;
      if (m < 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: m };
    });
  };

  const mesSiguiente = () => {
    setMesVista((prev) => {
      const m = prev.month + 1;
      if (m > 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: m };
    });
  };

  useEffect(() => {
    const cargarHorasOcupadas = async () => {
      if (!fechaSel || !profSeleccionado?.id || step !== 2) {
        setCitasActivasDia([]);
        return;
      }

      setCargandoHoras(true);
      try {
        const res = await api.get('/citas', {
          params: {
            fecha: fechaSel,
            profesional_id: profSeleccionado.id,
          },
        });

        const activas = (res.data || []).filter((cita) => cita.estado !== 'cancelada');
        setCitasActivasDia(activas);
      } catch {
        setCitasActivasDia([]);
      } finally {
        setCargandoHoras(false);
      }
    };

    cargarHorasOcupadas();
  }, [fechaSel, profSeleccionado, step]);

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (horaSel && (esHoraOcupada(horaSel) || esHoraPasada(horaSel))) {
      setHoraSel(null);
    }
  }, [citasActivasDia, horaSel, fechaSel, nowTick, duracionReservaMinutos]);

  const iconos = { 'Medicina Deportiva': '🏃‍♂️', 'Fisioterapia': '🦴', 'Odontología': '🦷', 'Psicología': '🧠' };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 pb-16 px-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-900">
          Clínica <span className="text-emerald-500">MediCitas</span>
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCitas(!showCitas)}
            className="text-blue-600 font-bold text-sm hover:underline"
          >
            Mis Citas ({misCitas.filter((c) => c.estado !== 'cancelada').length})
          </button>
          <button onClick={onLogout} className="text-red-500 font-semibold text-sm hover:underline">
            Salir
          </button>
        </div>
      </div>

      {/* Mis Citas */}
      {showCitas && (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 mb-4 border border-gray-100">
          <h2 className="font-bold text-xl mb-4">Mis Citas</h2>
          {misCitas.filter((c) => c.estado !== 'cancelada').length === 0 ? (
            <p className="text-gray-400">No tienes citas</p>
          ) : (
            <div className="space-y-3">
              {misCitas.filter((c) => c.estado !== 'cancelada').map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold">{c.fecha} · {c.hora?.slice(0, 5)}</div>
                    <div className="text-sm text-gray-500">{c.profesional?.nombre} · {c.profesional?.especialidad?.nombre}</div>
                    <div className="text-xs text-gray-400">{c.servicios?.map((s) => s.nombre).join(', ')}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      c.estado === 'confirmada' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.estado}
                    </span>
                    <button
                      onClick={() => cancelarCita(c.id)}
                      className="border-2 border-red-500 text-red-500 px-3 py-1 rounded-lg text-sm font-bold hover:bg-red-50 transition"
                    >
                      Anular
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Panel principal */}
      <div className={`w-full max-w-2xl bg-white rounded-xl shadow p-8 border border-emerald-200 relative min-h-[400px] ${step > 0 && !showCitas ? 'pb-24' : ''}`}>
        {step > 0 && !showCitas && (
          <button onClick={volver} className="absolute left-6 bottom-6 bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-bold hover:bg-gray-300 transition">
            Volver
          </button>
        )}

        {/* Step 0: Elegir especialidad */}
        {step === 0 && (
          <>
            <h2 className="text-center text-green-900 font-bold text-2xl mb-2">Reserva tu Cita Online</h2>
            <p className="text-center text-gray-500 mb-8">Paso 1: ¿Qué tipo de cita necesitas?</p>
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              {especialidades.map((esp) => (
                <button
                  key={esp.id}
                  onClick={() => seleccionarEspecialidad(esp)}
                  className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-2 hover:shadow-lg transition border border-gray-100"
                >
                  <span className="text-4xl">{iconos[esp.nombre] || '🏥'}</span>
                  <span className="font-semibold text-green-900 text-lg">{esp.nombre}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 1: Elegir profesional + servicios */}
        {step === 1 && espSeleccionada && (
          <>
            <p className="text-center text-gray-500 mb-6">Paso 2: Elige profesional y servicios</p>
            <div className="flex gap-8">
              {/* Profesionales */}
              <div className="flex flex-col gap-4">
                {profesionales.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProfSeleccionado(p)}
                    className={`rounded-2xl p-6 flex flex-col items-center gap-2 transition font-semibold ${
                      profSeleccionado?.id === p.id
                        ? 'text-white shadow-lg'
                        : 'bg-white shadow border border-gray-100 text-green-900'
                    }`}
                    style={profSeleccionado?.id === p.id ? { backgroundColor: espSeleccionada.color } : {}}
                  >
                    <span className="text-2xl">{iconos[espSeleccionada.nombre] || '🏥'}</span>
                    {p.nombre}
                  </button>
                ))}
              </div>

              {/* Servicios */}
              <div className="flex-1 bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Servicios disponibles</h3>
                <div className="space-y-3">
                  {servicios.map((s) => {
                    const sel = carritoServicios.find((c) => c.id === s.id);
                    return (
                      <div key={s.id} className="flex items-center justify-between">
                        <span className="text-gray-800">{s.nombre}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-600 font-bold">€{Number(s.precio).toFixed(0)}</span>
                          <button
                            onClick={() => toggleServicio(s)}
                            className={`px-4 py-1 rounded-lg font-semibold text-sm border-2 transition ${
                              sel ? 'bg-green-500 text-white border-green-500' : 'border-blue-500 text-blue-500 bg-white'
                            }`}
                          >
                            {sel ? 'Quitar' : 'Añadir'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {carritoServicios.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 font-bold text-blue-600 text-lg">
                    Total: €{carritoServicios.reduce((acc, s) => acc + Number(s.precio), 0).toFixed(0)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!profSeleccionado || carritoServicios.length === 0}
                className="bg-blue-600 text-white font-bold text-lg px-10 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar ➤
              </button>
            </div>
          </>
        )}

        {/* Step 2: Calendario */}
        {step === 2 && (
          <>
            <p className="text-center text-gray-500 mb-6">Paso 3: Selecciona fecha y hora</p>
            <div className="flex gap-8">
              {/* Calendario */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={mesAnterior} className="p-1 rounded hover:bg-gray-100 text-gray-500 font-bold text-lg">‹</button>
                  <span className="font-bold text-xl capitalize">
                    {new Date(mesVista.year, mesVista.month).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={mesSiguiente} className="p-1 rounded hover:bg-gray-100 text-gray-500 font-bold text-lg">›</button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {SEMANA.map((d) => (
                    <div key={d} className="text-center text-gray-500 text-xs font-medium">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(primerDia === 0 ? 6 : primerDia - 1)].map((_, i) => <div key={'e' + i}></div>)}
                  {Array.from({ length: diasMes }, (_, i) => i + 1).map((dia) => {
                    const fecha = `${mesVista.year}-${String(mesVista.month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
                    const noDisponible = diaNoDisponible(dia);
                    return (
                      <button
                        key={dia}
                        onClick={() => { if (!noDisponible) { setFechaSel(fecha); setHoraSel(null); } }}
                        disabled={noDisponible}
                        className={`rounded-full w-9 h-9 mx-auto font-medium text-sm transition ${
                          fechaSel === fecha ? 'bg-blue-600 text-white' :
                          noDisponible ? 'text-gray-300 cursor-not-allowed' :
                          esHoyMes && dia === hoy.getDate() ? 'bg-blue-100 text-blue-700' :
                          'hover:bg-blue-50 text-gray-700'
                        }`}
                      >
                        {dia}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Horas */}
              <div className="flex-1">
                {fechaSel ? (
                  <>
                    <div className="font-semibold text-lg mb-4 text-gray-700 capitalize">
                      {new Date(fechaSel + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    {cargandoHoras && (
                      <p className="text-xs text-gray-400 mb-2">Comprobando disponibilidad...</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Disponible</span>
                      <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500"></span> Ocupada</span>
                      <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Pasada</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {HORAS.map((h) => (
                        <div key={h} className="flex items-center gap-3">
                          {(() => {
                            const estaOcupada = esHoraOcupada(h);
                            const horaPasada = esHoraPasada(h);
                            const noDisponible = estaOcupada || horaPasada;
                            return (
                          <button
                            onClick={() => {
                              if (!noDisponible) setHoraSel(h);
                            }}
                            disabled={noDisponible}
                            className={`flex-1 py-3 rounded-lg font-bold text-lg border-2 transition ${
                              estaOcupada
                                ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                                : horaPasada
                                  ? 'bg-amber-50 text-amber-600 border-amber-200 cursor-not-allowed'
                                : horaSel === h
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-blue-400 text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            <span className="inline-flex items-center gap-2">
                              <span>{h}</span>
                              {estaOcupada && <span aria-hidden="true">🔒</span>}
                              {horaPasada && <span aria-hidden="true">⏳</span>}
                            </span>
                          </button>
                            );
                          })()}
                          {horaSel === h && (
                            <button
                              onClick={confirmarReserva}
                              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                            >
                              Confirmar ➤
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-center mt-8">Selecciona un día</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de éxito */}
      {reservaExito && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center border-2 border-green-500">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-700">¡Cita reservada con éxito!</h2>
          </div>
        </div>
      )}
    </div>
  );
}
