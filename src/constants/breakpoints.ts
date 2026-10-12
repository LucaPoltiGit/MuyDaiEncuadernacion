/**
 * Mismos valores que los breakpoints documentados en `src/styles/tokens.css`.
 * Las custom properties de CSS no se pueden leer dentro de un @media, así
 * que este número queda duplicado a mano en los dos lugares. Usar esta
 * constante desde TS (ej. un hook con matchMedia) en vez de repetir el
 * número suelto en el código.
 */
export const BREAKPOINTS = {
  tablet: 640,
  desktop: 1024,
} as const;
