import { useState, useEffect } from 'react';
import { api } from '../../api';

function iniciales(nombre) {
  return nombre.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function AdminMensajes() {
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    api.getMensajes().then(setMensajes).catch(console.error);
  }, []);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Mensajes</h1>
          <p className="sub">{mensajes.length} mensaje(s) para la homenajeada</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
        {mensajes.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)' }}>Aún no hay mensajes.</p>
        ) : (
          mensajes.map((msg, i) => (
            <div className="panel" key={i} style={{ marginBottom: 0 }}>
              <div className="recent-item" style={{ marginBottom: 12 }}>
                <div className="avatar">{iniciales(msg.nombre)}</div>
                <div className="info">
                  <div className="n">{msg.nombre}</div>
                  <div className="s">{msg.asistira ? 'Asistirá' : 'No asistirá'}</div>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink)', fontSize: '0.95rem' }}>
                "{msg.mensaje}"
              </p>
              {msg.fecha_confirmacion && (
                <p style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginTop: 10 }}>
                  {new Date(msg.fecha_confirmacion).toLocaleString('es-ES')}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
