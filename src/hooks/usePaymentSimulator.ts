import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { checkoutResultPath } from '../constants/routes';
import { getPaymentPreference, simulatePayment } from '../services/paymentService';
import type { PaymentStatus } from '../types/order';
import { useAsyncData } from './useAsyncData';

/** Pantalla de pago de prueba: el pedido a pagar y cómo resolver el pago. */
export function usePaymentSimulator(preferenceId: string) {
  const navigate = useNavigate();
  const load = useCallback(() => getPaymentPreference(preferenceId), [preferenceId]);
  const state = useAsyncData(load);

  async function resolve(outcome: PaymentStatus) {
    const orderId = await simulatePayment(preferenceId, outcome);
    // Como Mercado Pago: vuelve a la tienda sin dejar el pago en el historial.
    if (orderId) navigate(checkoutResultPath(orderId), { replace: true });
  }

  return { state, resolve };
}
