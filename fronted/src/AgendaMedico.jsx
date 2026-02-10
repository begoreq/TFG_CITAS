import React from 'react';

export default function AgendaMedico({ onVerDetalle }) {
  const citas = [
    { id: 1, hora: '09:00', paciente: 'Juan Pérez' },
    { id: 2, hora: '10:30', paciente: 'María García' },
    { id: 3, hora: '14:00', paciente: 'Carlos López' }
  ];

  return (
    <div className="container-login">
      <div className="card-login" style={{ maxWidth: '600px' }}>
        
        {/* Título */}
        <h1 className="title">Agenda del Médico</h1>

        {/* Lista de citas */}
        <div style={{ marginTop: '32px' }}>
          {citas.map((cita) => (
            <div key={cita.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #eee',
              marginBottom: '12px'
            }}>
              <div>
                <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                  {cita.hora}
                </p>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  {cita.paciente}
                </p>
              </div>
              <button 
                onClick={() => onVerDetalle && onVerDetalle(cita)}
                className="btn-login" 
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  marginTop: '0',
                  width: 'auto'
                }}
              >
                Ver detalle
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
