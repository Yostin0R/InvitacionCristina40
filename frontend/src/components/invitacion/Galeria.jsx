import { useState } from 'react';

const PERIODOS = {
  Infancia: '1986 — 1994',
  Juventud: '1995 — 2005',
  Familia: '2006 — 2019',
  Actualidad: '2019 — Hoy',
};

export default function Galeria({ fotografias, onSiguiente, siguienteLabel }) {
  const [ampliada, setAmpliada] = useState(null);

  if (!fotografias?.length) {
    return (
      <section className="seccion">
        <div className="seccion-head">
          <p className="eyebrow">Álbum digital</p>
          <h2 className="seccion-titulo">Galería de Recuerdos</h2>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>Pronto habrá fotografías aquí.</p>
      </section>
    );
  }

  return (
    <section className="seccion">
      <div className="seccion-head">
        <p className="eyebrow">Cuatro décadas</p>
        <h2 className="seccion-titulo">Línea de Tiempo</h2>
      </div>

      <div className="timeline">
        {fotografias.map((foto, i) => (
          <div className={`tl-item ${i % 2 === 1 ? 'rev' : ''}`} key={foto.id_fotografia}>
            <span className="tl-dot" />
            <div className="tl-text">
              <div className="tl-period">{PERIODOS[foto.etapa] || foto.etapa}</div>
              <h3 className="tl-title">{foto.etapa}</h3>
              <p className="tl-desc">{foto.descripcion}</p>
            </div>
            <div className="tl-foto" onClick={() => setAmpliada(foto)}>
              <img src={foto.url_imagen} alt={foto.descripcion} loading="lazy" />
            </div>
          </div>
        ))}
      </div>

      <p className="tl-quote">
        "La vida no se mide por las veces que respiras, sino por los momentos que te dejan sin aliento."
      </p>

      <div className="seccion-head" style={{ marginTop: 36 }}>
        <p className="eyebrow">Álbum digital</p>
        <h2 className="seccion-titulo">Galería de Recuerdos</h2>
      </div>

      <div className="galeria-grid">
        {fotografias.map((foto) => (
          <img
            key={`g-${foto.id_fotografia}`}
            src={foto.url_imagen}
            alt={foto.descripcion}
            loading="lazy"
            onClick={() => setAmpliada(foto)}
          />
        ))}
      </div>

      {onSiguiente && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button className="btn btn-primary" onClick={onSiguiente}>{siguienteLabel}</button>
        </div>
      )}

      {ampliada && (
        <div className="galeria-modal" onClick={() => setAmpliada(null)}>
          <button className="galeria-modal-cerrar" onClick={() => setAmpliada(null)}>×</button>
          <img src={ampliada.url_imagen} alt={ampliada.descripcion} />
        </div>
      )}
    </section>
  );
}
