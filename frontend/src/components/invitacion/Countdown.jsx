import { useState, useEffect } from 'react';
import { formatearFechaLarga } from '../../utils/dates';

function calcularTiempoRestante(fechaEvento, horaInicio) {
  const objetivo = new Date(`${fechaEvento}T${horaInicio}:00`);
  const ahora = new Date();
  const diff = objetivo - ahora;

  if (diff <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0, terminado: true };
  }

  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
    terminado: false,
  };
}

export default function Countdown({ fechaEvento, horaInicio, onSiguiente, siguienteLabel }) {
  const [tiempo, setTiempo] = useState(() => calcularTiempoRestante(fechaEvento, horaInicio));

  useEffect(() => {
    const interval = setInterval(() => {
      setTiempo(calcularTiempoRestante(fechaEvento, horaInicio));
    }, 1000);
    return () => clearInterval(interval);
  }, [fechaEvento, horaInicio]);

  const items = [
    { valor: tiempo.dias, label: 'Días' },
    { valor: tiempo.horas, label: 'Horas' },
    { valor: tiempo.minutos, label: 'Minutos' },
    { valor: tiempo.segundos, label: 'Segundos' },
  ];

  return (
    <section className="countdown-wrap">
      <p className="eyebrow">Próximamente</p>
      <h2 className="countdown-titulo">Cada vez falta menos</h2>

      {tiempo.terminado ? (
        <h2 className="countdown-titulo">¡Hoy es el gran día! 🎉</h2>
      ) : (
        <div className="countdown-grid">
          {items.map((item) => (
            <div className="countdown-box" key={item.label}>
              <div className="countdown-num">{String(item.valor).padStart(2, '0')}</div>
              <div className="countdown-lbl">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      <p className="countdown-fecha" style={{ textTransform: 'capitalize' }}>
        {formatearFechaLarga(fechaEvento)}
      </p>

      {onSiguiente && (
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <button className="btn btn-primary" onClick={onSiguiente}>{siguienteLabel}</button>
        </div>
      )}
    </section>
  );
}
