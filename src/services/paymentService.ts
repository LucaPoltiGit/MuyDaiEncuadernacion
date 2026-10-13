import { paymentSimulatorPath } from '../constants/routes';
import { createId } from '../domain/id';
import type { Order, PaymentStatus } from '../types/order';
import { simulateRequest } from './mockNetwork';
import {
  attachPaymentPreference,
  findOrderByPreference,
  registerPaymentResult,
} from './orderService';

/**
 * Mercado Pago, simulado. Imita el flujo de Checkout Pro:
 * 1. Se crea una "preferencia" con el pedido y se recibe una URL de pago.
 * 2. La persona paga en esa URL (acá, una pantalla de prueba de la app).
 * 3. Mercado Pago avisa el resultado al backend y vuelve a la tienda.
 *
 * Para conectar el real: `createPaymentPreference` llama al backend (que usa
 * el SDK con el access token, nunca desde el navegador) y devuelve su
 * `init_point`; `simulatePayment` desaparece y el resultado llega por webhook.
 */
export interface PaymentPreference {
  preferenceId: string;
  /** A dónde mandar a la persona para pagar. */
  checkoutUrl: string;
}

export async function createPaymentPreference(order: Order): Promise<PaymentPreference> {
  const preferenceId = `pref-${createId()}`;
  attachPaymentPreference(order.id, preferenceId);
  return simulateRequest({ preferenceId, checkoutUrl: paymentSimulatorPath(preferenceId) });
}

/** Lo que se muestra en la pantalla de pago: el pedido de esa preferencia. */
export function getPaymentPreference(preferenceId: string) {
  return findOrderByPreference(preferenceId);
}

/**
 * Solo para la pantalla de prueba: resuelve el pago como si la persona
 * hubiera pagado (o fallado) en Mercado Pago. Devuelve el id del pedido.
 */
export async function simulatePayment(
  preferenceId: string,
  outcome: PaymentStatus,
): Promise<string | null> {
  const order = await findOrderByPreference(preferenceId);
  if (!order) return null;
  registerPaymentResult(order.id, outcome);
  return simulateRequest(order.id, 600);
}
