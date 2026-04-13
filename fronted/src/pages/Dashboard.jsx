import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

const SkeletonKPI = () => (
  <div className="animate-pulse rounded-xl shadow p-6 border bg-gray-50 border-gray-200">
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="h-8 bg-gray-200 rounded w-2/3"></div>
  </div>
);

const estadoColor = {
  pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  confirmada: 'bg-green-100 text-green-700 border-green-300',
  completada: 'bg-blue-100 text-blue-700 border-blue-300',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then((res) => {
      setData(res.data);
    }).catch(() => {
      setData({ citasHoy: 0, citasSemana: 0, ingresosTotales: 0, ingresosSemana: 0, totalPacientes: 0, ingresos7dias: [], ultimasCitas: [] });
    }).finally(() => setLoading(false));
  }, []);

  const cards = data ? [
    { label: 'Citas Hoy', value: data.citasHoy, icon: '📅', color: 'green' },
    { label: 'Ingresos Semana', value: `€${Number(data.ingresosSemana).toFixed(2)}`, icon: '💶', color: 'blue' },
    { label: 'Ingresos Totales', value: `€${Number(data.ingresosTotales).toFixed(2)}`, icon: '📈', color: 'orange' },
    { label: 'Total Pacientes', value: data.totalPacientes, icon: '👥', color: 'purple' },
  ] : [];

  const colorMap = {
    green: 'bg-green-100 border-green-200 text-green-800',
    blue: 'bg-blue-100 border-blue-200 text-blue-800',
    orange: 'bg-orange-100 border-orange-200 text-orange-800',
    purple: 'bg-purple-100 border-purple-200 text-purple-800',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Vista general de la clínica</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonKPI key={i} />)
        ) : (
          cards.map((card) => (
            <div key={card.label} className={`rounded-xl shadow p-6 border ${colorMap[card.color]}`}>
              <div className="text-sm mb-2 opacity-80">{card.label}</div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{card.value}</span>
                <span className="text-xl">{card.icon}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Gráfico Ingresos últimos 7 días */}
      {!loading && data?.ingresos7dias?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">📈 Ingresos últimos 7 días</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.ingresos7dias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${v}`} />
              <Tooltip formatter={(v) => [`€${Number(v).toFixed(2)}`, 'Ingresos']} />
              <Line type="monotone" dataKey="ingresos" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Últimas 5 citas de la clínica */}
      {!loading && data?.ultimasCitas?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">🕐 Actividad Reciente</h3>
          <div className="space-y-3">
            {data.ultimasCitas.map((cita) => (
              <div key={cita.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 rounded-lg px-3 py-1 text-center min-w-[80px]">
                    <div className="text-blue-700 font-bold text-sm">{cita.hora?.slice(0, 5)}</div>
                    <div className="text-xs text-gray-500">{cita.fecha}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {cita.paciente?.name} {cita.paciente?.apellidos || ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      {cita.profesional?.nombre} — {cita.servicios?.map((s) => s.nombre).join(', ')}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${estadoColor[cita.estado] || 'bg-gray-100 text-gray-600'}`}>
                  {cita.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
