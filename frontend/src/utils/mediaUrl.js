/**
 * Convierte enlaces de Drive/compartidos a una URL usable en <img>.
 * Google Drive "view" no funciona como src de imagen.
 */
export function toImageUrl(url) {
  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim();
  if (!trimmed) return '';

  // https://drive.google.com/file/d/FILE_ID/view?...
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  }

  // https://drive.google.com/open?id=FILE_ID
  const openMatch = trimmed.match(/drive\.google\.com\/open\?[^#]*id=([^&]+)/i);
  if (openMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${decodeURIComponent(openMatch[1])}`;
  }

  // https://drive.google.com/uc?id=FILE_ID or already uc?export=view
  const ucMatch = trimmed.match(/drive\.google\.com\/uc\?[^#]*id=([^&]+)/i);
  if (ucMatch?.[1] && !/export=view/i.test(trimmed)) {
    return `https://drive.google.com/uc?export=view&id=${decodeURIComponent(ucMatch[1])}`;
  }

  return trimmed;
}
