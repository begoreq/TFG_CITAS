

import React, { useState } from 'react';

export default function App() {
    // ...existing code...
    const [showHistoria, setShowHistoria] = useState(false);
    const [historiaActual, setHistoriaActual] = useState(null);
    // Agenda de citas (solo admin)
    const [agenda, setAgenda] = useState([
      // Ejemplo inicial
      {
        hora: '09:00',
        nombre: 'Ana Martínez',
        apellidos: 'Martínez López',
        edad: 32,
        alergias: 'Penicilina',
        antecedentes: 'Asma',
        telefono: '666123456',
        especialidad: 'Medicina General',
        profesional: 'Dra. Ana López'
      },
      {
        hora: '10:00',
        nombre: 'Luis Gómez',
        apellidos: 'Gómez Pérez',
        edad: 45,
        alergias: 'Ninguna',
        antecedentes: 'Hipertensión',
        telefono: '666654321',
        especialidad: 'Fisioterapia',
        profesional: 'Dra. Marta Ruiz'
      }
    ]);
  // Estados principales
  const [pantalla, setPantalla] = useState('login');
  const [modoReserva, setModoReserva] = useState('paciente'); // 'paciente' o 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [profesional, setProfesional] = useState('');
  const [hora, setHora] = useState('');
  const [confirmar, setConfirmar] = useState(false);
  const [nombrePaciente, setNombrePaciente] = useState('');

  // Datos de ejemplo
  const ESPECIALIDADES = [
    'Medicina General',
    'Fisioterapia',
    'Psicología'
  ];
  const PROFESIONALES = {
    'Medicina General': ['Dra. Ana López', 'Dr. Juan Pérez'],
    'Fisioterapia': ['Dra. Marta Ruiz', 'Dr. Pablo Torres'],
    'Psicología': ['Dra. Laura Gómez', 'Dr. Sergio Díaz']
  };
  const HORAS = [
    '09:00', '10:00', '11:30', '12:30', '16:00', '17:00', '18:30'
  ];

  // Handlers básicos
  const handleEspecialidad = (e) => {
    setEspecialidad(e.target.value);
    setProfesional('');
    setHora('');
    setConfirmar(false);
  };
  const handleProfesional = (e) => {
    setProfesional(e.target.value);
    setHora('');
    setConfirmar(false);
  };
  const handleHora = (h) => {
    setHora(h);
    setConfirmar(false);
  };
  const handleConfirmar = () => {
    setConfirmar(true);
  };

  // Login simple (puedes personalizar)
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@clinica.com') {
      setModoReserva('admin');
      setPantalla('reserva');
    } else if (email === 'paciente@gmail.com') {
      setModoReserva('paciente');
      setPantalla('reserva');
    } else {
      alert('Usuario no reconocido. Usa admin@clinica.com o paciente@gmail.com');
    }
  };

  // Pantalla de Login
  if (pantalla === 'login') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.08)', padding: '32px 24px', maxWidth: 380, width: '100%', border: '1.5px solid #18BC9C', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ color: '#2C3E50', fontWeight: 700, fontSize: 26, marginBottom: 18, letterSpacing: 0.5 }}>Acceso Portal SaludCitas</h1>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" style={{ width: '100%', marginBottom: 16, padding: '12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15 }} required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" style={{ width: '100%', marginBottom: 24, padding: '12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15 }} required />
          <button type="submit" style={{ width: '100%', padding: '14px 0', background: '#18BC9C', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, cursor: 'pointer', boxShadow: '0 2px 8px rgba(24,188,156,0.08)' }}>Entrar</button>
          <div style={{ marginTop: 18, color: '#888', fontSize: 14, textAlign: 'center' }}>
            <div>Admin: admin@clinica.com</div>
            <div>Paciente: paciente@gmail.com</div>
          </div>
        </form>
      </div>
    );
  }

  // Pantalla de Reserva Online (unificada para paciente y admin)
  if (pantalla === 'reserva') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 40 }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(44,62,80,0.08)',
          padding: '32px 24px',
          maxWidth: 420,
          width: '100%',
          margin: '0 auto',
          border: '1.5px solid #18BC9C',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#2C3E50', fontWeight: 700, fontSize: 26, marginBottom: 18, letterSpacing: 0.5 }}>
            {modoReserva === 'admin' ? (
              <>Panel de Gestión de Citas - <span style={{ color: '#18BC9C' }}>Administración</span></>
            ) : (
              <>Reserva tu Cita Online - <span style={{ color: '#18BC9C' }}>Clínica SaludCitas</span></>
            )}
          </h1>
          {/* Formulario de reserva para paciente */}
          {modoReserva === 'paciente' && (
            <>
              <div style={{ width: '100%', marginBottom: 18 }}>
                <label style={{ color: '#2C3E50', fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Nombre y apellidos</label>
                <input
                  type="text"
                  value={nombrePaciente}
                  onChange={e => setNombrePaciente(e.target.value)}
                  placeholder="Introduce tu nombre y apellidos"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15, color: '#2C3E50', background: '#f8f9fa', outline: 'none' }}
                />
              </div>
              <div style={{ width: '100%', marginBottom: 18 }}>
                <label style={{ color: '#2C3E50', fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Edad</label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  placeholder="Edad"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15, color: '#2C3E50', background: '#f8f9fa', outline: 'none' }}
                />
              </div>
              <div style={{ width: '100%', marginBottom: 18 }}>
                <label style={{ color: '#2C3E50', fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Teléfono</label>
                <input
                  type="tel"
                  placeholder="Número de teléfono"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15, color: '#2C3E50', background: '#f8f9fa', outline: 'none' }}
                />
              </div>
              <div style={{ width: '100%', marginBottom: 18 }}>
                <label style={{ color: '#2C3E50', fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Alergias</label>
                <input
                  type="text"
                  placeholder="Alergias"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15, color: '#2C3E50', background: '#f8f9fa', outline: 'none' }}
                />
              </div>
              <div style={{ width: '100%', marginBottom: 18 }}>
                <label style={{ color: '#2C3E50', fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Antecedentes</label>
                <input
                  type="text"
                  placeholder="Antecedentes"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15, color: '#2C3E50', background: '#f8f9fa', outline: 'none' }}
                />
              </div>
              <div style={{ width: '100%', marginBottom: 18 }}>
                <label style={{ color: '#2C3E50', fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Especialidad</label>
                <select
                  value={especialidad}
                  onChange={handleEspecialidad}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15, color: '#2C3E50', background: '#f8f9fa', outline: 'none', marginBottom: 0 }}
                >
                  <option value="">Selecciona especialidad</option>
                  {ESPECIALIDADES.map((esp) => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>
              <div style={{ width: '100%', marginBottom: 18 }}>
                <label style={{ color: '#2C3E50', fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Profesional</label>
                <select
                  value={profesional}
                  onChange={handleProfesional}
                  disabled={!especialidad}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15, color: '#2C3E50', background: especialidad ? '#f8f9fa' : '#eaeaea', outline: 'none', marginBottom: 0 }}
                >
                  <option value="">{especialidad ? 'Selecciona profesional' : 'Selecciona especialidad primero'}</option>
                  {especialidad && PROFESIONALES[especialidad].map((pro) => (
                    <option key={pro} value={pro}>{pro}</option>
                  ))}
                </select>
              </div>
              <div style={{ width: '100%', marginBottom: 24 }}>
                <label style={{ color: '#2C3E50', fontWeight: 600, fontSize: 15, marginBottom: 10, display: 'block' }}>Selecciona la hora</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {HORAS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHora(h)}
                      style={{ padding: '12px 0', borderRadius: 8, border: hora === h ? '2.5px solid #18BC9C' : '1.5px solid #2C3E50', background: hora === h ? '#18BC9C' : '#fff', color: hora === h ? '#fff' : '#2C3E50', fontWeight: hora === h ? 700 : 500, fontSize: 15, cursor: 'pointer', transition: 'all 0.18s', outline: 'none', boxShadow: hora === h ? '0 2px 8px rgba(24,188,156,0.08)' : 'none' }}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              {hora && profesional && especialidad && nombrePaciente && (
                <button onClick={() => {
                  setConfirmar(true);
                  // Guardar cita en agenda admin
                  setAgenda(prev => [...prev, {
                    hora,
                    nombre: nombrePaciente,
                    apellidos: '', // Puedes separar nombre y apellidos si lo deseas
                    edad: '',
                    alergias: '',
                    antecedentes: '',
                    telefono: '',
                    especialidad,
                    profesional
                  }]);
                }} style={{ width: '100%', padding: '16px 0', background: '#2C3E50', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, marginTop: 10, cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.08)', letterSpacing: 0.5 }}>
                  Confirmar mi Cita
                </button>
              )}
              {confirmar && (
                <div style={{ marginTop: 18, background: '#18BC9C', color: '#fff', borderRadius: 8, padding: '18px 12px', width: '100%', textAlign: 'center', fontWeight: 600, fontSize: 17, boxShadow: '0 2px 8px rgba(24,188,156,0.08)' }}>
                  ¡Cita reservada con éxito!<br />
                  <span style={{ fontWeight: 400, fontSize: 15 }}>
                    {nombrePaciente} - {especialidad} con {profesional} a las {hora}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 18 }}>
                <button type="button" onClick={() => setPantalla('login')} className="btn-login">Cerrar sesión</button>
              </div>
            </>
          )}
          {/* Agenda admin: lista de citas */}
          {modoReserva === 'admin' && (
            <>
              <div style={{ width: '100%', marginBottom: 24 }}>
                <h2 style={{ color: '#2C3E50', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Crear nueva cita</h2>
                <div style={{ marginBottom: 18, display: 'flex', gap: 8 }}>
                  <input type="text" placeholder="Nombre del paciente" id="admin-nombre" style={{ flex: 2, padding: '10px 12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15 }} />
                  <select id="admin-especialidad" style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15 }}>
                    <option value="">Especialidad</option>
                    {ESPECIALIDADES.map((esp) => (
                      <option key={esp} value={esp}>{esp}</option>
                    ))}
                  </select>
                  <button style={{ padding: '10px 18px', background: '#18BC9C', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Añadir</button>
                </div>
              </div>
              <div>
                <h2 style={{ color: '#2C3E50', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Agenda de hoy</h2>
                {agenda.length === 0 ? (
                  <div style={{ color: '#888', fontSize: 16 }}>No hay citas reservadas.</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, width: '100%' }}>
                    {agenda.map((cita, idx) => (
                      <div key={idx} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(44,62,80,0.08)', padding: '18px 16px', border: '1.5px solid #18BC9C', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: '#18BC9C', fontSize: 18 }}>{cita.nombre}</div>
                          <div style={{ color: '#2C3E50', fontSize: 15 }}>{cita.especialidad} - {cita.hora}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => { setShowHistoria(true); setHistoriaActual(cita); }} style={{ padding: '8px 18px', background: '#2C3E50', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Ver historia</button>
                          <button onClick={() => {
                            setAgenda(prev => prev.filter((_, i) => i !== idx));
                          }} style={{ padding: '8px 12px', background: '#e74c3c', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Eliminar</button>
                          <button onClick={() => {
                            setAgenda(prev => prev.filter((_, i) => i !== idx));
                          }} style={{ padding: '8px 12px', background: '#27ae60', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Finalizar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 18 }}>
                <button type="button" onClick={() => setPantalla('login')} className="btn-login">Cerrar sesión</button>
              </div>
            </>
          )}
          {/* Modal historia clínica admin */}
          {showHistoria && historiaActual && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(44,62,80,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.18)', padding: '32px 24px', maxWidth: 420, width: '100%', border: '1.5px solid #18BC9C', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ color: '#2C3E50', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Historia Clínica</h2>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Nombre:</strong> <input value={historiaActual.nombre} onChange={e => setHistoriaActual({...historiaActual, nombre: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Apellidos:</strong> <input value={historiaActual.apellidos} onChange={e => setHistoriaActual({...historiaActual, apellidos: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Edad:</strong> <input value={historiaActual.edad} onChange={e => setHistoriaActual({...historiaActual, edad: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Teléfono:</strong> <input value={historiaActual.telefono} onChange={e => setHistoriaActual({...historiaActual, telefono: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Alergias:</strong> <input value={historiaActual.alergias} onChange={e => setHistoriaActual({...historiaActual, alergias: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Antecedentes:</strong> <input value={historiaActual.antecedentes} onChange={e => setHistoriaActual({...historiaActual, antecedentes: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Especialidad:</strong> {historiaActual.especialidad}</div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Hora:</strong> {historiaActual.hora}</div>
                <button onClick={() => setShowHistoria(false)} style={{ marginTop: 18, padding: '10px 24px', background: '#18BC9C', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Guardar cambios</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}