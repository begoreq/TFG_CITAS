import React, { useState } from 'react';

// Componente de calendario visual tipo Fresha
export default function CalendarReserva({ onReservaConfirmada, onVolverInicio, onCancelarCita }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [step, setStep] = useState(1);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  // Mostrar todos los días del mes de julio 2020 (1-31)
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);
  const mes = 'Julio 2020';
  const semana = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
  const horarios = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  // Calcular el día de la semana del 1 de julio 2020 (miércoles = 3)
  const primerDiaSemana = 3; // 0: lunes, 1: martes, ...

  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.08)', padding: 32, maxWidth: 600, width: '100%', margin: '0 auto', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* Calendario */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#888', fontWeight: 500, marginBottom: 8 }}>Selecciona fecha y hora</div>
          <div style={{ fontWeight: 700, fontSize: 26, marginBottom: 8 }}>{mes}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8 }}>
            {semana.map((d) => (
              <div key={d} style={{ color: '#888', fontWeight: 500, textAlign: 'center' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {/* Días vacíos para cuadrar el 1 en miércoles */}
            {[...Array(primerDiaSemana)].map((_, i) => <div key={'empty'+i}></div>)}
            {dias.map((dia) => (
              <button
                key={dia}
                onClick={() => { setFechaSeleccionada(dia); setHoraSeleccionada(null); setStep(2); }}
                style={{
                  border: fechaSeleccionada === dia ? '2px solid #3b5bfc' : 'none',
                  background: fechaSeleccionada === dia ? '#f4f7ff' : '#e8edfa',
                  color: '#3b5bfc',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  fontWeight: 600,
                  fontSize: 16,
                  margin: '0 auto',
                  marginBottom: 4,
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: fechaSeleccionada === dia ? '0 2px 8px #3b5bfc22' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                {dia}
              </button>
            ))}
          </div>
        </div>
        {/* Horarios */}
        <div style={{ flex: 1, minWidth: 180 }}>
          {fechaSeleccionada && (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12, color: '#444' }}>
                Lunes {fechaSeleccionada} de Julio
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {horarios.map((h) => (
                  <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      onClick={() => { setHoraSeleccionada(h); setStep(3); }}
                      style={{
                        border: horaSeleccionada === h ? '2.5px solid #3b5bfc' : '1.5px solid #3b5bfc',
                        background: horaSeleccionada === h ? '#3b5bfc' : '#fff',
                        color: horaSeleccionada === h ? '#fff' : '#3b5bfc',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 20,
                        padding: '12px 0',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        outline: 'none',
                        minWidth: 120
                      }}
                    >
                      {h}
                    </button>
                    {horaSeleccionada === h && step === 3 && (
                      <button
                        style={{
                          background: '#3b5bfc',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 28,
                          borderRadius: 10,
                          padding: '12px 32px',
                          boxShadow: '0 2px 12px #3b5bfc33',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          border: 'none',
                          marginLeft: 8
                        }}
                        onClick={() => {
                          setReservaConfirmada(true);
                          if (onReservaConfirmada) onReservaConfirmada({ fecha: fechaSeleccionada, hora: horaSeleccionada });
                        }}
                      >
                        Confirmar <span style={{ fontSize: 32, marginLeft: 8 }}>➤</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {reservaConfirmada && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(44,62,80,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(44,62,80,0.18)',
            padding: '40px 32px',
            minWidth: 320,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 24,
            color: '#14532d',
            border: '2.5px solid #22c55e',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24
          }}>
            ¡Cita reservada con éxito!
            <button
              style={{
                marginTop: 12,
                background: 'none',
                color: '#e11d48',
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 8,
                padding: '10px 28px',
                border: '2px solid #e11d48',
                cursor: 'pointer',
                transition: 'background 0.18s',
                boxShadow: 'none',
              }}
              onClick={() => {
                if (window.confirm('¿Estás seguro de que deseas cancelar tu cita?')) {
                  setReservaConfirmada(false);
                  setFechaSeleccionada(null);
                  setHoraSeleccionada(null);
                  setStep(1);
                  if (onVolverInicio) onVolverInicio();
                  if (onCancelarCita) onCancelarCita();
                }
              }}
            >
              ¿Te has equivocado? Cancelar Cita
            </button>
            <button
              style={{
                marginTop: 12,
                background: '#2563eb',
                color: '#fff',
                fontWeight: 700,
                fontSize: 18,
                borderRadius: 8,
                padding: '10px 28px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px #2563eb22',
                transition: 'background 0.18s',
              }}
              onClick={() => {
                setReservaConfirmada(false);
                setFechaSeleccionada(null);
                setHoraSeleccionada(null);
                setStep(1);
                if (onVolverInicio) onVolverInicio();
              }}
            >
              Volver a inicio
            </button>
          </div>
        </div>
      )}
          {/* Feedback de cancelación */}
          {typeof window !== 'undefined' && window.citaCancelada && (
            <div style={{
              position: 'fixed',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#fff',
              color: '#e11d48',
              fontWeight: 700,
              fontSize: 17,
              borderRadius: 8,
              padding: '12px 32px',
              boxShadow: '0 2px 8px #e11d4811',
              border: '2px solid #e11d48',
              zIndex: 99999
            }}>
              Cita cancelada correctamente
            </div>
          )}
    </div>
  );
}
