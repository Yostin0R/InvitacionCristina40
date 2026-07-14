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

function ConfigField({
  name,
  label,
  type = 'text',
  area = false,
  value = '',
  onChange,
  onBlur,
  className = '',
  placeholder = '',
}) {
  return (
    <div className={`form-group ${className}`}>
      <label>{label}</label>
      {area ? (
        <textarea
          className="form-textarea"
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={onBlur ? (e) => onBlur(name, e.target.value) : undefined}
        />
      ) : (
        <input
          className="form-input"
          type={type}
          value={type === 'checkbox' ? undefined : value || ''}
          checked={type === 'checkbox' ? !!value : undefined}
          placeholder={placeholder}
          onChange={(e) => onChange(name, type === 'checkbox' ? e.target.checked : e.target.value)}
          onBlur={onBlur && type !== 'checkbox' ? (e) => onBlur(name, e.target.value) : undefined}
        />
      )}
    </div>
  );
}

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
        const fotos = data.fotografias?.length ? [...data.fotografias] : [];
        while (fotos.length < 4) fotos.push(nuevaFoto(fotos.length));
        setFotografias(fotos);
      })
      .catch((err) => setError(err.message));
  }, []);

  const updateEvento = (name, value) => {
    setEvento((prev) => ({ ...prev, [name]: value }));
    setGuardado(false);
  };

  const updateConfig = (name, value) => {
    setConfiguracion((prev) => ({ ...prev, [name]: value }));
    setGuardado(false);
  };

  const normalizeConfigImage = (name, value) => {
    if (name !== 'imagen_portada') return;
    const converted = toImageUrl(value) || value;
    if (converted !== value) {
      setConfiguracion((prev) => ({ ...prev, imagen_portada: converted }));
    }
  };

  const updateFoto = (index, name, value) => {
    setFotografias((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [name]: value };
      return next;
    });
    setGuardado(false);
  };

  const normalizeFotoImage = (index, value) => {
    const converted = toImageUrl(value) || value;
    if (converted !== value) {
      setFotografias((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], url_imagen: converted };
        return next;
      });
    }
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

  const renderStep = () => {
    if (active.id === 'portada') {
      return (
        <>
          <ConfigField name="titulo" label="Título de la invitación" className="span-2" value={evento.titulo} onChange={updateEvento} />
          <ConfigField name="homenajeada" label="Nombre de la homenajeada" className="span-2" value={evento.homenajeada} onChange={updateEvento} />
          <ConfigField name="descripcion" label="Frase principal" area className="span-2" value={evento.descripcion} onChange={updateEvento} />
          <ConfigField
            name="imagen_portada"
            label="URL de foto principal"
            value={configuracion.imagen_portada}
            onChange={updateConfig}
            onBlur={normalizeConfigImage}
            className="span-2"
          />
          <p className="span-2" style={{ color: 'var(--ink-soft)', fontSize: '0.78rem', marginTop: -8 }}>
            Puedes pegar un enlace de Google Drive. Debe ser público (“Cualquier persona con el enlace”).
            Si pegas un link /view, se convertirá automáticamente al salir del campo.
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
          <ConfigField name="fecha_evento" label="Fecha del evento" type="date" value={evento.fecha_evento} onChange={updateEvento} />
          <ConfigField name="hora_inicio" label="Hora de inicio" type="time" value={evento.hora_inicio} onChange={updateEvento} />
          <ConfigField name="hora_fin" label="Hora de finalización" type="time" value={evento.hora_fin} onChange={updateEvento} />
          <ConfigField name="codigo_vestimenta" label="Código de vestimenta" value={evento.codigo_vestimenta} onChange={updateEvento} />
          <ConfigField name="lugar" label="Lugar" className="span-2" value={evento.lugar} onChange={updateEvento} />
          <ConfigField name="direccion" label="Dirección" className="span-2" value={evento.direccion} onChange={updateEvento} />
          <ConfigField name="url_mapa" label="Enlace de Google Maps" className="span-2" value={evento.url_mapa} onChange={updateEvento} />
        </>
      );
    }

    if (active.id === 'cuenta') {
      return (
        <>
          <ConfigField name="fecha_evento" label="Fecha para la cuenta regresiva" type="date" value={evento.fecha_evento} onChange={updateEvento} />
          <ConfigField name="hora_inicio" label="Hora objetivo" type="time" value={evento.hora_inicio} onChange={updateEvento} />
          <ConfigField name="fecha_limite_confirmacion" label="Fecha límite para confirmar" type="date" value={evento.fecha_limite_confirmacion} onChange={updateEvento} className="span-2" />
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
                      onBlur={(e) => normalizeFotoImage(index, e.target.value)}
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
          <ConfigField
            name="fecha_limite_confirmacion"
            label="Fecha límite de confirmación"
            type="date"
            value={evento.fecha_limite_confirmacion}
            onChange={updateEvento}
          />
          <ConfigField
            name="mensaje_regalos"
            label="Mensaje sobre regalos"
            area
            className="span-2"
            value={evento.mensaje_regalos}
            onChange={updateEvento}
          />
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
        <ConfigField
          name="color_principal"
          label="Color principal"
          type="color"
          value={configuracion.color_principal}
          onChange={updateConfig}
        />
        <ConfigField
          name="color_secundario"
          label="Color secundario"
          type="color"
          value={configuracion.color_secundario}
          onChange={updateConfig}
        />
        <ConfigField
          name="tipografia"
          label="Tipografía"
          value={configuracion.tipografia}
          onChange={updateConfig}
          className="span-2"
        />
        <ConfigField
          name="url_musica"
          label="URL de música"
          value={configuracion.url_musica}
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
