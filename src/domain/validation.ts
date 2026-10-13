/** Validaciones de datos de contacto, compartidas por checkout, registro y admin. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string) {
  return EMAIL.test(email.trim());
}

/** Email comparable: sin espacios y en minúsculas (para buscar cuentas). */
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Teléfono argentino: entre 8 y 13 dígitos, se aceptan +, espacios, guiones y paréntesis. */
export function isValidPhone(phone: string) {
  if (/[^\d\s()+-]/.test(phone)) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 13;
}
