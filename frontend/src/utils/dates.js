export function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr + 'T12:00:00');
  return fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatearFechaCorta(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr + 'T12:00:00');
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

export function formatearFechaLarga(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr + 'T12:00:00');
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function nombreDia(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr + 'T12:00:00');
  return fecha.toLocaleDateString('es-ES', { weekday: 'long' });
}

export function generarEnlaceCalendario(evento) {
  const inicio = `${evento.fecha_evento.replace(/-/g, '')}T${evento.hora_inicio.replace(':', '')}00`;
  const fin = evento.hora_fin
    ? `${evento.fecha_evento.replace(/-/g, '')}T${evento.hora_fin.replace(':', '')}00`
    : inicio;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: evento.titulo,
    dates: `${inicio}/${fin}`,
    details: `${evento.descripcion}\n\nVestimenta: ${evento.codigo_vestimenta}`,
    location: `${evento.lugar}, ${evento.direccion}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generarEnlaceWhatsApp(telefono, mensaje) {
  const numero = telefono?.replace(/\D/g, '');
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${numero}?text=${texto}`;
}
