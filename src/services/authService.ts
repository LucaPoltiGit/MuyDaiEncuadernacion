import type { User } from '../types/user';
import { simulateRequest } from './mockNetwork';

/**
 * Sesión del usuario. Por ahora no hay login (llega en la Parte 6): nadie
 * está logueado. La forma de la función ya es la definitiva.
 */
export function getCurrentUser(): Promise<User | null> {
  return simulateRequest(null, 0);
}
