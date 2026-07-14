import { useState } from 'react';
import { IconSparkle } from '../icons';

export default function AperturaSobre({ onAbrir, nombre }) {
  const [abierto, setAbierto] = useState(false);

  const handleAbrir = () => {
    setAbierto(true);
    setTimeout(() => onAbrir(), 750);
  };

  return (
    <div className="apertura">
      <p className="eyebrow apertura-eyebrow">
        <IconSparkle width="12" height="12" style={{ verticalAlign: 'middle', marginRight: 6 }} />
        Cuarenta años {nombre ? `· ${nombre}` : ''}
      </p>
      <p className="apertura-texto">Tienes una<br />invitación especial</p>
      <div className={`sobre ${abierto ? 'abierto' : ''}`}>
        <div className="sobre-cuerpo"><span>✦</span></div>
        <div className="sobre-tapa" />
      </div>
      <button className="btn btn-primary" onClick={handleAbrir}>
        Abrir invitación
      </button>
    </div>
  );
}
