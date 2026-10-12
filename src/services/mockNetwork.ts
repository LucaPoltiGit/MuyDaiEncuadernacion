/**
 * Simula una llamada al backend: demora y devuelve una copia (para que nadie
 * modifique los mocks por referencia). Así los estados de carga y error se
 * diseñan desde el día 1 y no se rompen cuando llegue la API real.
 */
const DEFAULT_DELAY_MS = 350;

export function simulateRequest<T>(data: T, delayMs = DEFAULT_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), delayMs);
  });
}
