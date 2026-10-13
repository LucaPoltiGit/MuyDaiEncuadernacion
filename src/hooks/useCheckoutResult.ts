import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { loadCheckoutOrderId, saveCheckoutOrderId } from '../services/cartService';
import { getOrder } from '../services/orderService';
import { createPaymentPreference } from '../services/paymentService';
import { useAsyncData } from './useAsyncData';
import { useCart } from './useCart';

/**
 * Resultado del pago de un pedido. Si es el pedido del último checkout y
 * quedó hecho (aprobado o pendiente de acreditación), vacía el carrito: un
 * link viejo o "mis compras" no tocan el carrito actual.
 */
export function useCheckoutResult(orderId: string) {
  const navigate = useNavigate();
  const { clear } = useCart();
  const load = useCallback(() => getOrder(orderId), [orderId]);
  const state = useAsyncData(load);
  const [retrying, setRetrying] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);

  const order = state.status === 'ready' ? state.data : null;
  const paymentStatus = order?.payment.status;

  useEffect(() => {
    if (!order || order.id !== loadCheckoutOrderId()) return;
    if (paymentStatus === 'approved' || paymentStatus === 'pending') {
      clear();
      saveCheckoutOrderId(null);
    }
  }, [order, paymentStatus, clear]);

  async function retry() {
    if (!order || retrying) return;
    setRetrying(true);
    setRetryFailed(false);
    try {
      const preference = await createPaymentPreference(order);
      navigate(preference.checkoutUrl);
    } catch {
      setRetryFailed(true);
      setRetrying(false);
    }
  }

  return { state, retry, retrying, retryFailed };
}
