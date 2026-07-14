import { useState, useEffect } from 'react';
import { api } from '../../api';
import { IconLink, IconExport } from '../../components/icons';

function iniciales(nombre) {
  return nombre.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [evento, setEvento] = useState(null);
  const [recientes, setRecientes] = useState([]);

  const cargar = () => {
    Promise.all([api.getEstadisticas(), api.getEvento(), api.getInvitados()])
      .then(([statsData, eventoData, invitados]) => {
        setStats(statsData);
        setEvento(eventoData.evento);
        const conf = invitados
          .filter((i) => i.fecha_confirmacion)
          .sort((a, b) => new Date(b.fecha_confirmacion) - new Date(a.fecha_confirmacion))
          .slice(0, 5);
        setRecientes(conf);
      })
      .catch(console.error);
  };

  useEffect(cargar, []);

  const copiarBase = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invitacion/`);
    alert('Base del enlace copiada. Agrega el token de cada invitado.');
  };

  const handleExportar = async (formato) => {
    try {
      const res = await api.exportar(formato);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invitados.${formato === 'xlsx' ? 'xlsx' : 'csv'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error al exportar: ' + err.message);
    }
  };

  if (!stats) return <p>Cargando estadísticas...</p>;

  const pct = (n) => (stats.total ? Math.round((n / stats.total) * 100) : 0);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Panel de Control</h1>
          <p className="sub">{evento ? `${evento.titulo} · ${evento.homenajeada}` : 'Resumen de la gestión de invitados'}</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn btn-ghost btn-small" onClick={copiarBase}><IconLink width="15" height="15" /> Copiar enlace</button>
          <button className="btn btn-primary btn-small" onClick={() => handleExportar('xlsx')}><IconExport width="15" height="15" /> Exportar</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="lbl">Total invitaciones</div>
          <div className="num">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="lbl">Confirmados</div>
          <div className="num">{stats.confirmados}<span className="pct">{pct(stats.confirmados)}%</span></div>
        </div>
        <div className="stat-card">
          <div className="lbl">No asistirán</div>
          <div className="num">{stats.noAsisten}<span className="pct">{pct(stats.noAsisten)}%</span></div>
        </div>
        <div className="stat-card">
          <div className="lbl">Pendientes</div>
          <div className="num">{stats.pendientes}<span className="pct">{pct(stats.pendientes)}%</span></div>
        </div>
        <div className="stat-card destacado">
          <div className="lbl">Asistentes totales</div>
          <div className="num">{stats.totalAsistentes}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
        <div className="panel">
          <div className="panel-title">Estado de confirmación</div>
          <div className="progress-row">
            <div className="top"><span>Confirmados</span><span>{stats.confirmados}</span></div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct(stats.confirmados)}%`, background: '#1E7E42' }} /></div>
          </div>
          <div className="progress-row">
            <div className="top"><span>Pendientes</span><span>{stats.pendientes}</span></div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct(stats.pendientes)}%`, background: 'var(--gold)' }} /></div>
          </div>
          <div className="progress-row">
            <div className="top"><span>No asistirán</span><span>{stats.noAsisten}</span></div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct(stats.noAsisten)}%`, background: '#B03A4A' }} /></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Confirmaciones recientes</div>
          {recientes.length === 0 ? (
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>Aún no hay confirmaciones.</p>
          ) : (
            <div className="recent-list">
              {recientes.map((r) => (
                <div className="recent-item" key={r.id_invitado}>
                  <div className="avatar">{iniciales(r.nombre)}</div>
                  <div className="info">
                    <div className="n">{r.nombre}</div>
                    <div className="s">
                      {r.asistira ? `Confirmado · ${1 + (r.numero_acompanantes || 0)} persona(s)` : 'No asistirá'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
