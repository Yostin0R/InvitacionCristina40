import { generarEnlaceCalendario } from '../../utils/dates';

export default function ConfirmacionExitosa({ asistira, evento, onModificar, puedeModificar }) {
  const enlaceCalendario = generarEnlaceCalendario(evento);

  if (asistira) {
    return (
      <section className="form-success">
        <div className="form-success-icono">🎉</div>
        <h2>¡Gracias por confirmar!</h2>
        <p>Nos alegra mucho saber que formarás parte de este momento tan especial.</p>
        <div className="success-actions">
          {evento.url_mapa && (
            <a href={evento.url_mapa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Ver ubicación
            </a>
          )}
          <a href={enlaceCalendario} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Agregar al calendario
          </a>
          {puedeModificar && (
            <button className="btn btn-ghost btn-small" onClick={onModificar}>
              Modificar mi respuesta
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="form-success">
      <div className="form-success-icono">💐</div>
      <h2>Gracias por responder</h2>
      <p>Lamentamos que no puedas acompañarnos, pero agradecemos mucho tus buenos deseos.</p>
      {puedeModificar && (
        <div className="success-actions">
          <button className="btn btn-ghost btn-small" onClick={onModificar}>
            Modificar mi respuesta
          </button>
        </div>
      )}
    </section>
  );
}
