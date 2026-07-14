import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import AperturaSobre from '../components/invitacion/AperturaSobre';
import Portada from '../components/invitacion/Portada';
import Countdown from '../components/invitacion/Countdown';
import DetallesEvento from '../components/invitacion/DetallesEvento';
import Galeria from '../components/invitacion/Galeria';
import FormularioRSVP from '../components/invitacion/FormularioRSVP';
import ConfirmacionExitosa from '../components/invitacion/ConfirmacionExitosa';
import { IconCard, IconInfo, IconClock, IconGallery, IconHeart, IconMusic, IconShare, IconSparkle } from '../components/icons';

const TABS = [
  { id: 'portada', label: 'Invitación', Icon: IconCard },
  { id: 'detalles', label: 'Detalles', Icon: IconInfo },
  { id: 'countdown', label: 'Cuenta', Icon: IconClock },
  { id: 'galeria', label: 'Recuerdos', Icon: IconGallery },
  { id: 'rsvp', label: 'Asistir', Icon: IconHeart },
];

const LABEL_DESTINO = {
  detalles: 'Ver detalles',
  countdown: 'Ver cuenta regresiva',
  galeria: 'Ver recuerdos',
  rsvp: 'Confirmar asistencia',
};

export default function InvitacionPage() {
  const { token } = useParams();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [tab, setTab] = useState('portada');
  const [confirmado, setConfirmado] = useState(false);
  const [respuestaAsistira, setRespuestaAsistira] = useState(null);
  const [musicaSonando, setMusicaSonando] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    api
      .getInvitacion(token)
      .then((data) => {
        setDatos(data);
        if (data.confirmacion) {
          setConfirmado(true);
          setRespuestaAsistira(data.confirmacion.asistira);
        }
        if (data.configuracion) {
          document.documentElement.style.setProperty('--burgundy', data.configuracion.color_principal || '#6B2233');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [token]);

  useEffect(() => {
    if (sobreAbierto) window.scrollTo(0, 0);
  }, [tab, sobreAbierto]);

  const toggleMusica = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setMusicaSonando(true)).catch(() => {});
    } else {
      audio.pause();
      setMusicaSonando(false);
    }
  };

  const abrirInvitacion = () => {
    setSobreAbierto(true);
    const audio = audioRef.current;
    if (audio && datos?.configuracion?.musica_activa) {
      audio.play().then(() => setMusicaSonando(true)).catch(() => {});
    }
  };

  const compartir = async () => {
    const url = window.location.href;
    const evt = datos?.evento;
    const texto = `Te invito a ${evt?.titulo} de ${evt?.homenajeada}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: evt?.titulo, text: texto, url });
      } catch { /* cancelado */ }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`, '_blank');
    }
  };

  const primerNombre = (datos?.evento?.homenajeada || '').split(' ')[0];

  if (cargando) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p style={{ color: 'var(--ink-soft)' }}>Cargando invitación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <p className="eyebrow">Cuarenta años</p>
        <h1>Invitación no encontrada</h1>
        <p>{error}</p>
      </div>
    );
  }

  const { invitado, evento, configuracion, fotografias, confirmacion, puede_confirmar } = datos;

  const hayFotos = Array.isArray(fotografias) && fotografias.length > 0;
  const tabsDisponibles = TABS.filter((t) => t.id !== 'galeria' || hayFotos);
  const orden = tabsDisponibles.map((t) => t.id);

  const audioEl = configuracion?.url_musica ? (
    <audio ref={audioRef} loop>
      <source src={configuracion.url_musica} type="audio/mpeg" />
    </audio>
  ) : null;

  if (!sobreAbierto) {
    return (
      <div className="inv-shell">
        {audioEl}
        <AperturaSobre onAbrir={abrirInvitacion} nombre={primerNombre} />
      </div>
    );
  }

  const idxActual = orden.indexOf(tab);
  const tabActual = idxActual === -1 ? 'portada' : tab;

  const avanzar = () => {
    const idx = orden.indexOf(tabActual);
    if (idx >= 0 && idx < orden.length - 1) setTab(orden[idx + 1]);
  };

  const labelSiguiente = (id) => {
    const idx = orden.indexOf(id);
    const next = idx >= 0 && idx < orden.length - 1 ? orden[idx + 1] : null;
    return next ? LABEL_DESTINO[next] : null;
  };

  const renderTab = () => {
    switch (tabActual) {
      case 'detalles':
        return <DetallesEvento evento={evento} onSiguiente={avanzar} siguienteLabel={labelSiguiente('detalles')} />;
      case 'countdown':
        return <Countdown fechaEvento={evento.fecha_evento} horaInicio={evento.hora_inicio} onSiguiente={avanzar} siguienteLabel={labelSiguiente('countdown')} />;
      case 'galeria':
        return <Galeria fotografias={fotografias} onSiguiente={avanzar} siguienteLabel={labelSiguiente('galeria')} />;
      case 'rsvp':
        return confirmado ? (
          <ConfirmacionExitosa
            asistira={respuestaAsistira}
            evento={evento}
            puedeModificar={puede_confirmar}
            onModificar={() => setConfirmado(false)}
          />
        ) : (
          <FormularioRSVP
            token={token}
            invitado={invitado}
            confirmacionExistente={confirmacion}
            puedeConfirmar={puede_confirmar}
            onConfirmado={(resultado) => {
              setConfirmado(true);
              setRespuestaAsistira(resultado.asistira);
            }}
          />
        );
      default:
        return (
          <Portada
            evento={evento}
            imagenPortada={configuracion?.imagen_portada}
            musicaSonando={musicaSonando}
            onSiguiente={avanzar}
          />
        );
    }
  };

  return (
    <div className="inv-shell">
      {audioEl}

      <header className="inv-header">
        <div className="inv-brand">
          <span className="sparkle"><IconSparkle /></span>
          <span className="inv-brand-text">
            <span className="inv-brand-name">{primerNombre}</span>
            <span className="inv-brand-sub">40 años</span>
          </span>
        </div>
        <div className="inv-header-actions">
          {configuracion?.url_musica && (
            <button
              className={`icon-btn ${musicaSonando ? 'activo' : ''}`}
              onClick={toggleMusica}
              title="Música"
            >
              <IconMusic width="18" height="18" />
            </button>
          )}
          <button className="icon-btn" title="Compartir invitación" onClick={compartir}>
            <IconShare width="18" height="18" />
          </button>
        </div>
      </header>

      <main className="inv-body">{renderTab()}</main>

      <nav className="inv-tabbar">
        {tabsDisponibles.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`tab-item ${tabActual === id ? 'activo' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon />
            {label}
            <span className="tab-dot" />
          </button>
        ))}
      </nav>
    </div>
  );
}
