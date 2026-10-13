import type { ShippingConfig } from '../types/shipping';
import { readDb } from './mockDb';
import { simulateRequest } from './mockNetwork';

/** Zonas, precios y puntos de retiro (los edita el admin). Con API real solo cambia este archivo. */
export function getShippingConfig(): Promise<ShippingConfig> {
  return simulateRequest(readDb().shipping);
}
