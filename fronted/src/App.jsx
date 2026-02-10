import React, { useState } from 'react';
import AgendaMedico from './AgendaMedico';

export default function App() {
  const [pantalla, setPantalla] = useState('login');
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('10:00');

  const horasDisponibles = ['09:00', '09:30', '10:00', '11:30', '12:00', '13:30'];

  // Ficha Clínica del Paciente
  if (pantalla === 'ficha') {
    return (
      <>
        <div className="container-login">
          <div className="card-login" style={{ maxWidth: '800px' }}>
            
            {/* Cabecera con nombre y edad */}
            <div style={{ borderBottom: '2px solid #17a2b8', paddingBottom: '20px', marginBottom: '24px' }}>
              <h1 className="title" style={{ marginBottom: '8px' }}>Ana Martínez</h1>
              <p style={{ color: '#666', fontSize: '16px', textAlign: 'center' }}>34 años</p>
            </div>

            {/* Datos Médicos */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>Datos Médicos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '16px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>Peso</p>
                  <p style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>65 kg</p>
                </div>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '16px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>Altura</p>
                  <p style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>1.70 m</p>
                </div>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '16px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>Sangre</p>
                  <p style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>O+</p>
                </div>
              </div>
            </div>

            {/* Alergias */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>Alergias</h2>
              <div style={{
                backgroundColor: '#ffe5e5',
                padding: '16px',
                borderRadius: '4px',
                borderLeft: '4px solid #dc3545'
              }}>
                <p style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '14px' }}>Penicilina</p>
              </div>
            </div>

            {/* Antecedentes */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>Antecedentes</h2>
              <div>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Control rutinario</span>
                  <span style={{ color: '#999', fontSize: '12px' }}>15/01/2026</span>
                </div>
                <div style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Esguince de tobillo</span>
                  <span style={{ color: '#999', fontSize: '12px' }}>10/11/2025</span>
                </div>
              </div>
            </div>

            {/* Botón Volver */}
            <button 
              type="button"
              onClick={() => setPantalla('agenda')}
              className="btn-login"
            >
              Volver a Agenda
            </button>

          </div>
        </div>
      </>
    );
  }

  if (pantalla === 'agenda') {
    return (
      <>
        <AgendaMedico onVerDetalle={() => setPantalla('ficha')} />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={() => setPantalla('login')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Volver al Login
          </button>
          <button 
            onClick={() => setPantalla('reserva')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ir a Nueva Reserva
          </button>
        </div>
      </>
    );
  }

  if (pantalla === 'reserva') {
    const medicosDisponibles = {
      'Pediatría': ['Dra. Laura Martínez', 'Dr. Pedro García'],
      'Dermatología': ['Dra. Sofia López', 'Dr. Juan Rodríguez'],
      'Cardiología': ['Dr. Carlos Fernández', 'Dra. Ana Ruiz'],
      'Oftalmología': ['Dr. Miguel Sánchez', 'Dra. Beatriz Jiménez']
    };

    return (
      <>
        <div className="container-login">
          <div className="card-login" style={{ maxWidth: '500px' }}>
            
            {/* Título */}
            <h1 className="title">Nueva Cita Médica</h1>

            {/* Formulario */}
            <form style={{ marginTop: '32px' }}>
              {/* Especialidad */}
              <div className="form-group">
                <label className="form-label">Especialidad</label>
                <select 
                  className="form-input" 
                  style={{ cursor: 'pointer' }}
                  value={especialidadSeleccionada}
                  onChange={(e) => setEspecialidadSeleccionada(e.target.value)}
                >
                  <option value="">Selecciona especialidad</option>
                  <option value="Pediatría">Pediatría</option>
                  <option value="Dermatología">Dermatología</option>
                  <option value="Cardiología">Cardiología</option>
                  <option value="Oftalmología">Oftalmología</option>
                </select>
              </div>

              {/* Médico Disponible */}
              <div className="form-group">
                <label className="form-label">Médico disponible</label>
                <select 
                  className="form-input"
                  style={{ cursor: 'pointer' }}
                  disabled={!especialidadSeleccionada}
                >
                  <option value="">
                    {especialidadSeleccionada ? 'Selecciona médico' : 'Selecciona primero especialidad'}
                  </option>
                  {especialidadSeleccionada && medicosDisponibles[especialidadSeleccionada]?.map((medico) => (
                    <option key={medico} value={medico}>{medico}</option>
                  ))}
                </select>
              </div>

              {/* Fecha de la Cita */}
              <div className="form-group">
                <label className="form-label">Fecha de la cita</label>
                <input 
                  type="date"
                  className="form-input"
                />
              </div>

              {/* Horas Disponibles */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '12px' }}>
                  Horas Disponibles
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '8px'
                }}>
                  {horasDisponibles.map((hora) => (
                    <button
                      key={hora}
                      type="button"
                      onClick={() => setHoraSeleccionada(hora)}
                      style={{
                        padding: '10px',
                        border: horaSeleccionada === hora ? 'none' : '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: horaSeleccionada === hora ? '#17a2b8' : '#fff',
                        color: horaSeleccionada === hora ? '#fff' : '#333',
                        fontWeight: horaSeleccionada === hora ? 'bold' : '500',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (horaSeleccionada !== hora) {
                          e.target.style.borderColor = '#17a2b8';
                          e.target.style.color = '#17a2b8';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (horaSeleccionada !== hora) {
                          e.target.style.borderColor = '#ccc';
                          e.target.style.color = '#333';
                        }
                      }}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón Confirmar */}
              <button type="button" className="btn-login">
                Confirmar Reserva
              </button>
            </form>

          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={() => setPantalla('login')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Volver al Login
          </button>
          <button 
            onClick={() => setPantalla('agenda')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ir a Agenda
          </button>
        </div>
      </>
    );
  }

  // Login (pantalla por defecto)
  return (
    <>
      <div className="container-login">
        <div className="card-login">
          
          {/* Logo */}
          <div className="logo-circle">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Título */}
          <h1 className="title">SaludCitas</h1>

          {/* Subtítulo */}
          <p className="subtitle">Gestión de citas médicas</p>

          {/* Formulario */}
          <form>
            {/* Correo */}
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input 
                type="email" 
                placeholder="nombre@ejemplo.com"
                className="form-input"
              />
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            {/* Botón */}
            <button 
              type="button"
              onClick={() => setPantalla('agenda')}
              className="btn-login"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Footer */}
          <div className="footer-login">
            ¿No tienes cuenta? <span className="link-register" onClick={() => setPantalla('reserva')}>Regístrate aquí</span>
          </div>
        </div>
      </div>
    </>
  );
}