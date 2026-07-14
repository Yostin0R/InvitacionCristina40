/**
 * Extrae el ID de un enlace de Google Drive.
 */
export function extractDriveId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  const patterns = [
    /drive\.google\.com\/file\/d\/([^/]+)/i,
    /drive\.google\.com\/open\?[^#]*[?&]id=([^&]+)/i,
    /drive\.google\.com\/uc\?[^#]*[?&]id=([^&]+)/i,
    /drive\.google\.com\/thumbnail\?[^#]*[?&]id=([^&]+)/i,
    /drive\.usercontent\.google\.com\/download\?[^#]*[?&]id=([^&]+)/i,
    /lh3\.googleusercontent\.com\/d\/([^=/?#]+)/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return decodeURIComponent(match[1]);
  }

  return null;
}

/**
 * Convierte enlaces de Drive/compartidos a una URL usable en <img>.
 * El formato /view de Drive no funciona como src.
 * lh3.googleusercontent.com es el que responde image/* correctamente.
 */
export function toImageUrl(url) {
  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim();
  if (!trimmed) return '';

  const driveId = extractDriveId(trimmed);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}=w2000`;
  }

  return trimmed;
}
