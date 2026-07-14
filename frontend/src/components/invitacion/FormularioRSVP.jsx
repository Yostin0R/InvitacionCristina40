import { useState } from 'react';
import { api } from '../../api';

export default function FormularioRSVP({
  token,
  invitado,
  confirmacionExistente,
  puedeConfirmar,
  onConfirmado,
}) {
  const [asistira, setAsistira] = useState(
    confirmacionExistente?.asistira ?? null
  );
  const [acompanantes, setAcompanantes] = useState(
    confirmacionExistente?.numero_acompanantes ?? 0
  );
  const [mensaje, setMensaje] = useState(confirmacionExistente?.mensaje ?? '');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (asistira === null) {
      setError('Por favor selecciona si asistirás o no');
      return;
    }

    setEnviando(true);
    try {
      const resultado = await api.confirmar(token, {
        asistira,
        numero_acompanantes: asistira ? acompanantes : 0,
        mensaje,
      });
      onConfirmado(resultado);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (!puedeConfirmar && !confirmacionExistente) {
    return (
      <section className="seccion">
        <div className="seccion-head">
          <p className="eyebrow">Confirmación</p>
          <h2 className="seccion-titulo">Confirmación cerrada</h2>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>
          La fecha límite para confirmar asistencia ha pasado.
        </p>
      </section>
    );
  }

  return (
    <section className="seccion">
      <div className="seccion-head">
        <p className="eyebrow">Confirmación de asistencia</p>
        <h2 className="seccion-titulo">
          {confirmacionExistente ? 'Modifica tu respuesta' : 'Confirma tu asistencia'}
        </h2>
      </div>

      <form className="rsvp-form" onSubmit={handleSubmit}>
        <p className="rsvp-nombre">{invitado.nombre}</p>

        <div className="form-group">
          <label>¿Podrás acompañarnos?</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="asistira"
                checked={asistira === true}
                onChange={() => setAsistira(true)}
              />
              Sí, asistiré
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="asistira"
                checked={asistira === false}
                onChange={() => {
                  setAsistira(false);
                  setAcompanantes(0);
                }}
              />
              No podré asistir
            </label>
          </div>
        </div>

        {asistira && (
          <div className="form-group">
            <label>
              Número de acompañantes (máx. {invitado.acompanantes_permitidos})
            </label>
            <input
              type="number"
              className="form-input"
              min={0}
              max={invitado.acompanantes_permitidos}
              value={acompanantes}
              onChange={(e) => setAcompanantes(parseInt(e.target.value, 10) || 0)}
            />
          </div>
        )}

        <div className="form-group">
          <label>Mensaje para la homenajeada</label>
          <textarea
            className="form-textarea"
            placeholder="Escribe un mensaje especial..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={enviando}
        >
          {enviando ? 'Enviando...' : 'Enviar respuesta'}
        </button>
      </form>
    </section>
  );
}
