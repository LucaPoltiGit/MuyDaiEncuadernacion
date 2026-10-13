/**
 * Id único para cosas creadas en el navegador (renglones del carrito...).
 * `crypto.randomUUID` solo existe en contextos seguros (https o localhost):
 * al probar desde el celular por la IP de la red local no está.
 */
export function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
