import { configuratorMock } from '../data/mock/configurator';
import type { ConfiguratorData } from '../types/notebook';
import { simulateRequest } from './mockNetwork';

/**
 * Opciones, límites y reglas de precio del configurador.
 * Hoy lee el mock; con API real solo cambia este archivo.
 */
export function getConfiguratorData(): Promise<ConfiguratorData> {
  return simulateRequest(configuratorMock);
}
