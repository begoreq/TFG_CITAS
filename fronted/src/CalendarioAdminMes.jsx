// Componente de calendario mensual visual para el admin, con iconos de especialidad
import React, { useState } from 'react';

const ESPECIALIDADES = [
  { nombre: 'Medicina Deportiva', icon: '🏃‍♂️', color: '#22c55e' },
  { nombre: 'Fisioterapia', icon: '🦴', color: '#2563eb' },
  { nombre: 'Odontología', icon: '🦷', color: '#fbbf24' },
  { nombre: 'Psicología', icon: '🧠', color: '#f472b6' }
];

export default function CalendarioAdminMes() {
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(null);
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = hoy.getMonth();
  const diasMes = new Date(year, month + 1, 0).getDate();
  const primerDiaSemana = new Date(year, month, 1).getDay(); // 0: domingo
  const semana = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.08)', padding: 32, maxWidth: 900, width: '100%', margin: '0 auto', fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* Iconos de especialidad */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
        {ESPECIALIDADES.map((esp) => (
          <button
            key={esp.nombre}
            onClick={() => setEspecialidadSeleccionada(esp.nombre)}
            style={{
              background: especialidadSeleccionada === esp.nombre ? esp.color : '#f3f4f6',
              color: especialidadSeleccionada === esp.nombre ? '#fff' : esp.color,
              border: 'none',
              borderRadius: 50,
              width: 64,
              height: 64,
              fontSize: 32,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              boxShadow: especialidadSeleccionada === esp.nombre ? '0 2px 8px ' + esp.color + '44' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
              outline: 'none',
              position: 'relative'
            }}
          >
            <span>{esp.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{esp.nombre}</span>
          </button>
        ))}
      </div>
      {/* Calendario mensual */}
      <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 26, marginBottom: 8, textAlign: 'center' }}>
          {hoy.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8 }}>
          {semana.map((d) => (
            <div key={d} style={{ color: '#888', fontWeight: 500, textAlign: 'center', textTransform: 'capitalize' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {/* Días vacíos para cuadrar el 1 en el día correcto */}
          {[...Array(primerDiaSemana === 0 ? 6 : primerDiaSemana - 1)].map((_, i) => <div key={'empty'+i}></div>)}
          {Array.from({ length: diasMes }, (_, i) => i + 1).map((dia) => (
            <div
              key={dia}
              style={{
                borderRadius: 10,
                background: dia === hoy.getDate() ? '#e0e7ff' : '#fff',
                color: dia === hoy.getDate() ? '#2563eb' : '#222',
                fontWeight: dia === hoy.getDate() ? 700 : 500,
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                margin: '0 auto',
                boxShadow: dia === hoy.getDate() ? '0 2px 8px #2563eb22' : 'none',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.15s'
              }}
            >
              {dia}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
