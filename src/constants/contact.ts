/**
 * Datos de contacto y redes de MuyDai. Placeholders hasta tener los reales:
 * cambiarlos acá alcanza, ningún componente los repite.
 */

/** Número en formato internacional sin "+", espacios ni guiones (lo pide wa.me). */
export const WHATSAPP_NUMBER = '5491100000000';

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/muydai',
  facebook: 'https://www.facebook.com/muydai',
} as const;

/** Sitio oficial de Defensa de las y los Consumidores (Argentina). */
export const CONSUMER_DEFENSE_URL = 'https://www.argentina.gob.ar/produccion/defensadelconsumidor';

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
