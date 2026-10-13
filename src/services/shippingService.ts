import { shippingMock } from '../data/mock/shipping';
import type { ShippingConfig } from '../types/shipping';
import { simulateRequest } from './mockNetwork';

/** Zonas, precios y puntos de retiro. Hoy lee el mock; con API real solo cambia este archivo. */
export function getShippingConfig(): Promise<ShippingConfig> {
  return simulateRequest(shippingMock);
}
