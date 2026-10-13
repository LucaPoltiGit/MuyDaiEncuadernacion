import type { ConfiguratorData } from '../types/notebook';
import { readDb } from './mockDb';
import { simulateRequest } from './mockNetwork';

/**
 * Opciones, límites y reglas de precio del configurador (las edita el
 * admin). Hoy salen de la base simulada; con API real solo cambia este archivo.
 */
export function getConfiguratorData(): Promise<ConfiguratorData> {
  return simulateRequest(readDb().configurator);
}
