import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then((res) => {
      setData(res.data);
    }).catch(() => {
      setData({ citasHoy: 0, citasSemana: 0, ingresosTotales: 0, ingresosSemana: 0, totalPacientes: 0 });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Cargando dashboard...</div>;

  const cards = [
    { label: 'Citas Hoy', value: data.citasHoy, icon: '📅', color: 'green' },
    { label: 'Ingresos Semana', value: `€${Number(data.ingresosSemana).toFixed(2)}`, icon: '💶', color: 'blue' },
    { label: 'Ingresos Totales', value: `€${Number(data.ingresosTotales).toFixed(2)}`, icon: '📈', color: 'orange' },
    { label: 'Total Pacientes', value: data.totalPacientes, icon: '👥', color: 'purple' },
  ];

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
        {cards.map((card) => (
          <div key={card.label} className={`rounded-xl shadow p-6 border ${colorMap[card.color]}`}>
            <div className="text-sm mb-2 opacity-80">{card.label}</div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{card.value}</span>
              <span className="text-xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
