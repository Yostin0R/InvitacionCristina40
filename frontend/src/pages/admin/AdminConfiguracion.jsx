import { useState, useEffect } from 'react';
import { api } from '../../api';
import { IconTrash, IconPlus } from '../../components/icons';
import { toImageUrl } from '../../utils/mediaUrl';

const STEPS = [
  { id: 'portada', title: 'Portada', desc: 'Nombre, frase y foto principal' },
  { id: 'detalles', title: 'Detalles', desc: 'Fecha, hora, lugar y mapa' },
  { id: 'cuenta', title: 'Cuenta regresiva', desc: 'Fecha límite y horarios' },
  { id: 'recuerdos', title: 'Recuerdos', desc: 'Fotos de la galería' },
  { id: 'confirmacion', title: 'Confirmación', desc: 'Regalos y RSVP' },
  { id: 'visual', title: 'Visual y música', desc: 'Colores, tipografía y audio' },
];

const nuevaFoto = (orden) => ({
  id_fotografia: null,
  url_imagen: '',
  descripcion: '',
  etapa: ['Infancia', 'Juventud', 'Familia', 'Actualidad'][orden] || 'Recuerdo',
  orden: orden + 1,
  activa: true,
});

export default function AdminConfiguracion() {
  const [stepIndex, setStepIndex] = useState(0);
  const [evento, setEvento] = useState(null);
  const [configuracion, setConfiguracion] = useState(null);
  const [fotografias, setFotografias] = useState([]);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    api
      .getEvento()
      .then((data) => {
        setEvento(data.evento);
        setConfiguracion(data.configuracion || {});
        const fotos = data.fotografias?.length ? data.fotografias : [];
        while (fotos.length < 4) fotos.push(nuevaFoto(fotos.length));
        setFotografias(fotos);
      })
      .catch((err) => setError(err.message));
  }, []);

  const updateEvento = (name, value) => {
    setEvento({ ...evento, [name]: value });
    setGuardado(false);
  };

  const updateConfig = (name, value) => {
    const nextValue = name === 'imagen_portada' ? toImageUrl(value) || value : value;
    setConfiguracion({ ...configuracion, [name]: nextValue });
    setGuardado(false);
  };

  const updateFoto = (index, name, value) => {
    setFotografias((prev) => {
      const next = [...prev];
      const normalized = name === 'url_imagen' ? (toImageUrl(value) || value) : value;
      next[index] = { ...next[index], [name]: normalized };
      return next;
    });
    setGuardado(false);
  };

  const agregarFoto = () => {
    setFotografias((prev) => [...prev, nuevaFoto(prev.length)]);
    setGuardado(false);
  };

  const eliminarFoto = async (index) => {
    const foto = fotografias[index];
    if (!confirm('¿Eliminar esta etapa de recuerdos?')) return;

    try {
      if (foto.id_fotografia) {
        await api.eliminarFotografia(foto.id_fotografia);
      }
      setFotografias((prev) => prev.filter((_, i) => i !== index));
      setGuardado(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      const configToSave = {
        ...configuracion,
        imagen_portada: toImageUrl(configuracion.imagen_portada) || configuracion.imagen_portada,
      };
      const fotosToSave = fotografias.map((foto) => ({
        ...foto,
        url_imagen: toImageUrl(foto.url_imagen) || foto.url_imagen,
      }));

      await api.actualizarEvento({
        evento,
        configuracion: configToSave,
        fotografias: fotosToSave,
      });
      setConfiguracion(configToSave);
      setFotografias(fotosToSave);
      setGuardado(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (!evento || !configuracion) {
    return <p>{error || 'Cargando configuración...'}</p>;
  }

  const active = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const Input = ({ name, label, type = 'text', area = false, source = evento, onChange = updateEvento, className = '' }) => (
    <div className={`form-group ${className}`}>
      <label>{label}</label>
      {area ? (
        <textarea
          className="form-textarea"
          value={source[name] || ''}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <input
          className="form-input"
          type={type}
          value={source[name] || ''}
          onChange={(e) => onChange(name, type === 'checkbox' ? e.target.checked : e.target.value)}
          checked={type === 'checkbox' ? !!source[name] : undefined}
        />
      )}
    </div>
  );

  const renderStep = () => {
    if (active.id === 'portada') {
      return (
        <>
          <Input name="titulo" label="Título de la invitación" className="span-2" />
          <Input name="homenajeada" label="Nombre de la homenajeada" className="span-2" />
          <Input name="descripcion" label="Frase principal" area className="span-2" />
          <Input
            name="imagen_portada"
            label="URL de foto principal"
            source={configuracion}
            onChange={updateConfig}
            className="span-2"
          />
          <p className="span-2" style={{ color: 'var(--ink-soft)', fontSize: '0.78rem', marginTop: -8 }}>
            Puedes pegar un enlace de Google Drive. Debe ser público (“Cualquier persona con el enlace”).
            Si pegas un link /view, se convertirá automáticamente.
          </p>
          <div className="preview-mini span-2">
            {configuracion.imagen_portada && (
              <img src={toImageUrl(configuracion.imagen_portada)} alt="Vista previa portada" />
            )}
            <p className="eyebrow">Invitación exclusiva</p>
            <h2>{evento.homenajeada}</h2>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{evento.descripcion}</p>
          </div>
        </>
      );
    }

    if (active.id === 'detalles') {
      return (
        <>
          <Input name="fecha_evento" label="Fecha del evento" type="date" />
          <Input name="hora_inicio" label="Hora de inicio" type="time" />
          <Input name="hora_fin" label="Hora de finalización" type="time" />
          <Input name="codigo_vestimenta" label="Código de vestimenta" />
          <Input name="lugar" label="Lugar" className="span-2" />
          <Input name="direccion" label="Dirección" className="span-2" />
          <Input name="url_mapa" label="Enlace de Google Maps" className="span-2" />
        </>
      );
    }

    if (active.id === 'cuenta') {
      return (
        <>
          <Input name="fecha_evento" label="Fecha para la cuenta regresiva" type="date" />
          <Input name="hora_inicio" label="Hora objetivo" type="time" />
          <Input name="fecha_limite_confirmacion" label="Fecha límite para confirmar" type="date" className="span-2" />
          <div className="preview-mini span-2">
            <p className="eyebrow">Vista previa</p>
            <h2>Cada vez falta menos</h2>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
              La cuenta se calcula automáticamente con la fecha y hora del evento.
            </p>
          </div>
        </>
      );
    }

    if (active.id === 'recuerdos') {
      return (
        <>
          {fotografias.map((foto, index) => (
            <div className="photo-editor span-2" key={foto.id_fotografia || index}>
              <img
                src={toImageUrl(foto.url_imagen) || 'https://placehold.co/160x160?text=Foto'}
                alt={`Foto ${index + 1}`}
              />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="eyebrow" style={{ color: 'var(--ink-soft)' }}>
                    Recuerdo {index + 1}
                  </span>
                  <button
                    type="button"
                    className="icon-action"
                    title="Eliminar recuerdo"
                    onClick={() => eliminarFoto(index)}
                    style={{ color: '#B03A4A' }}
                  >
                    <IconTrash />
                  </button>
                </div>
                <div className="config-grid" style={{ gap: 10 }}>
                  <div className="form-group">
                    <label>Etapa</label>
                    <input
                      className="form-input"
                      value={foto.etapa || ''}
                      onChange={(e) => updateFoto(index, 'etapa', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Orden</label>
                    <input
                      className="form-input"
                      type="number"
                      value={foto.orden || index + 1}
                      onChange={(e) => updateFoto(index, 'orden', parseInt(e.target.value, 10) || index + 1)}
                    />
                  </div>
                  <div className="form-group span-2">
                    <label>URL de imagen</label>
                    <input
                      className="form-input"
                      value={foto.url_imagen || ''}
                      onChange={(e) => updateFoto(index, 'url_imagen', e.target.value)}
                      placeholder="Pega un enlace de Drive o una URL directa de imagen"
                    />
                    <p style={{ color: 'var(--ink-soft)', fontSize: '0.72rem', marginTop: 6 }}>
                      En Drive: Compartir → Cualquier persona con el enlace.
                    </p>
                  </div>
                  <div className="form-group span-2">
                    <label>Descripción / frase</label>
                    <textarea
                      className="form-textarea"
                      value={foto.descripcion || ''}
                      onChange={(e) => updateFoto(index, 'descripcion', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {fotografias.length === 0 && (
            <p className="span-2" style={{ color: 'var(--ink-soft)', textAlign: 'center' }}>
              No hay recuerdos. Agrega el primero.
            </p>
          )}

          <div className="span-2">
            <button type="button" className="btn btn-secondary btn-small" onClick={agregarFoto}>
              <IconPlus width="15" height="15" /> Agregar recuerdo
            </button>
          </div>
        </>
      );
    }

    if (active.id === 'confirmacion') {
      return (
        <>
          <Input name="fecha_limite_confirmacion" label="Fecha límite de confirmación" type="date" />
          <Input name="mensaje_regalos" label="Mensaje sobre regalos" area className="span-2" />
          <div className="preview-mini span-2">
            <p className="eyebrow">Formulario RSVP</p>
            <h2>Confirma tu asistencia</h2>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
              El invitado podrá elegir si asiste, registrar acompañantes y dejar un mensaje.
            </p>
          </div>
        </>
      );
    }

    return (
      <>
        <Input
          name="color_principal"
          label="Color principal"
          type="color"
          source={configuracion}
          onChange={updateConfig}
        />
        <Input
          name="color_secundario"
          label="Color secundario"
          type="color"
          source={configuracion}
          onChange={updateConfig}
        />
        <Input
          name="tipografia"
          label="Tipografía"
          source={configuracion}
          onChange={updateConfig}
          className="span-2"
        />
        <Input
          name="url_musica"
          label="URL de música"
          source={configuracion}
          onChange={updateConfig}
          className="span-2"
        />
        <div className="form-group span-2">
          <label className="radio-option" style={{ border: 'none', padding: 0 }}>
            <input
              type="checkbox"
              checked={!!configuracion.musica_activa}
              onChange={(e) => updateConfig('musica_activa', e.target.checked)}
            />
            Activar música en la invitación
          </label>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Configuración del evento</h1>
          <p className="sub">Edita la invitación por pantallas, paso a paso</p>
        </div>
      </div>

      <form className="config-layout" onSubmit={handleSubmit}>
        <aside className="config-steps">
          {STEPS.map((step, index) => (
            <button
              type="button"
              className={`config-step ${index === stepIndex ? 'active' : ''}`}
              key={step.id}
              onClick={() => setStepIndex(index)}
            >
              <span className="config-step-num">{index + 1}</span>
              <span className="config-step-text">
                <span className="config-step-title">{step.title}</span>
                <span className="config-step-desc">{step.desc}</span>
              </span>
            </button>
          ))}
        </aside>

        <section className="config-card">
          <div className="config-card-head">
            <p className="eyebrow">Paso {stepIndex + 1} de {STEPS.length}</p>
            <h2>{active.title}</h2>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{active.desc}</p>
          </div>

          <div className="config-grid">
            {renderStep()}
          </div>

          {error && <p className="form-error">{error}</p>}
          {guardado && (
            <p style={{ color: '#155724', textAlign: 'center', marginTop: '14px' }}>
              Cambios guardados correctamente
            </p>
          )}

          <div className="config-actions">
            <button
              type="button"
              className="btn btn-secondary btn-small"
              disabled={isFirst}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            >
              Anterior
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-ghost btn-small" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
              {!isLast ? (
                <button
                  type="button"
                  className="btn btn-primary btn-small"
                  onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))}
                >
                  Siguiente
                </button>
              ) : (
                <button type="submit" className="btn btn-primary btn-small" disabled={guardando}>
                  Guardar todo
                </button>
              )}
            </div>
          </div>
        </section>
      </form>
    </>
  );
}
