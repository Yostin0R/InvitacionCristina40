import { formatearFechaLarga, nombreDia } from '../../utils/dates';

export default function Portada({ evento, imagenPortada, musicaSonando, onSiguiente }) {
  return (
    <section className="portada">
      <div className="portada-foto-wrap">
        <img className="portada-foto" src={imagenPortada} alt={evento.homenajeada} />
        {musicaSonando && (
          <div className="portada-nowplaying">
            <span className="eq"><i></i><i></i><i></i></span>
            Reproduciendo música
          </div>
        )}
      </div>

      <p className="eyebrow">Invitación exclusiva</p>
      <p className="portada-frase">Celebramos sus 40 años</p>
      <h1 className="portada-nombre">{evento.homenajeada}</h1>
      <p className="portada-desc">{evento.descripcion}</p>

      <div className="divider-orn">✦</div>

      <div className="portada-fecha">
        <div className="eyebrow" style={{ marginBottom: 4 }}>{nombreDia(evento.fecha_evento)}</div>
        <div className="dia">{formatearFechaLarga(evento.fecha_evento)}</div>
        <div className="hora">{evento.hora_inicio} horas</div>
      </div>

      <button className="btn btn-primary" onClick={onSiguiente}>
        Ver detalles
      </button>
    </section>
  );
}
