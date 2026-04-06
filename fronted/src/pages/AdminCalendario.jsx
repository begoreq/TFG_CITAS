import React, { useEffect, useState } from 'react';
import api from '../api';

const SEMANA = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

export default function AdminCalendario() {
  const [especialidades, setEspecialidades] = useState([]);
  const [citas, setCitas] = useState([]);
  const [filtroEsp, setFiltroEsp] = useState(null);
  const [fechaSel, setFechaSel] = useState(null);

  const hoy = new Date();
  const [mesVista, setMesVista] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() });

  const diasMes = new Date(mesVista.year, mesVista.month + 1, 0).getDate();
  const primerDia = new Date(mesVista.year, mesVista.month, 1).getDay();

  useEffect(() => {
    api.get('/especialidades').then((res) => setEspecialidades(res.data));
    api.get('/citas').then((res) => setCitas(res.data)).catch(() => {});
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
    const citasDia = citas.filter((c) => c.fecha === fecha && c.estado !== 'cancelada');
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
              const esHoy = esHoyMes && dia === hoy.getDate();
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
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                      : esHoy
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
                          style={{ backgroundColor: sel ? 'rgba(255,255,255,0.7)' : (espMap[id]?.color || '#9ca3af') }}
                          title={espMap[id]?.nombre}
                        />
                      ))}
                    </div>
                  )}
                  {numCitas > 0 && (
                    <span className={`text-[10px] font-bold leading-none mt-0.5 ${sel ? 'text-blue-200' : 'text-gray-400'}`}>
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
              {citasDelDia.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-gray-400 text-sm">No hay citas para este día</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto">
                  {citasDelDia.map((c) => {
                    const espColor = c.profesional?.especialidad?.color || '#6b7280';
                    return (
                      <div key={c.id} className="rounded-lg border overflow-hidden" style={{ borderLeftWidth: '4px', borderLeftColor: espColor }}>
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm" style={{ color: espColor }}>
                              {c.hora?.slice(0, 5)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                              c.estado === 'confirmada' ? 'bg-green-100 text-green-700' :
                              c.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                              c.estado === 'completada' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {c.estado}
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
    </div>
  );
}
