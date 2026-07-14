import { formatearFechaLarga, generarEnlaceCalendario } from '../../utils/dates';
import { IconCalendar, IconMap, IconDress, IconGift } from '../icons';

export default function DetallesEvento({ evento, onSiguiente, siguienteLabel }) {
  const enlaceCalendario = generarEnlaceCalendario(evento);
  const mapaImg = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80';

  return (
    <section className="seccion">
      <div className="seccion-head">
        <p className="eyebrow">Información esencial</p>
        <h2 className="seccion-titulo">Detalles del Evento</h2>
      </div>

      <div className="detalle-card">
        <span className="ico"><IconCalendar /></span>
        <h3 style={{ textTransform: 'capitalize' }}>{formatearFechaLarga(evento.fecha_evento)}</h3>
        <p>{evento.hora_inicio} horas{evento.hora_fin ? ` — ${evento.hora_fin} horas` : ''}</p>
        <a className="detalle-link" href={enlaceCalendario} target="_blank" rel="noopener noreferrer">
          + Agregar al calendario
        </a>
      </div>

      <div className="detalle-card">
        <span className="ico"><IconMap /></span>
        <h3>{evento.lugar}</h3>
        <p>{evento.direccion}</p>
        <img className="mapa-mini" src={mapaImg} alt="Ubicación" />
        {evento.url_mapa && (
          <div>
            <a className="detalle-link" href={evento.url_mapa} target="_blank" rel="noopener noreferrer">
              Ver ubicación
            </a>
          </div>
        )}
      </div>

      <div className="detalle-grid">
        <div className="detalle-card">
          <span className="ico"><IconDress /></span>
          <p className="eyebrow" style={{ color: 'var(--ink-soft)' }}>Vestimenta</p>
          <h3 style={{ fontSize: '1.05rem', marginTop: 4 }}>{evento.codigo_vestimenta}</h3>
        </div>
        <div className="detalle-card">
          <span className="ico"><IconGift /></span>
          <p className="eyebrow" style={{ color: 'var(--ink-soft)' }}>Regalos</p>
          <h3 style={{ fontSize: '1.05rem', marginTop: 4 }}>Lluvia de sobres</h3>
        </div>
      </div>

      {evento.mensaje_regalos && (
        <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: '0.82rem', marginTop: 16, fontStyle: 'italic' }}>
          {evento.mensaje_regalos}
        </p>
      )}

      {onSiguiente && (
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <button className="btn btn-primary" onClick={onSiguiente}>{siguienteLabel}</button>
        </div>
      )}
    </section>
  );
}
