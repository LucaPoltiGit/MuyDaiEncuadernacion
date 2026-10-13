import { useState } from 'react';
import { useNavigate } from 'react-router';
import { loadCheckoutOrderId, saveCheckoutOrderId } from '../services/cartService';
import {
  createOrder,
  DiscountUnavailableError,
  OrderConflictError,
} from '../services/orderService';
import { createPaymentPreference } from '../services/paymentService';
import type { NewOrder } from '../types/order';

export type PlaceOrderError =
  /** Alguna pieza se vendió o la está pagando otra persona. */
  | { type: 'conflict'; productIds: string[] }
  | { type: 'discountUnavailable' }
  | { type: 'generic' };

/**
 * Crea el pedido y lleva a pagar (Mercado Pago, simulado). Si se vuelve a
 * tocar "Pagar" desde el mismo checkout, reemplaza el pedido pendiente
 * anterior en vez de dejarlo huérfano.
 */
export function usePlaceOrder() {
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<PlaceOrderError | null>(null);

  async function placeOrder(newOrder: NewOrder) {
    if (placing) return;
    setPlacing(true);
    setError(null);
    try {
      const order = await createOrder(newOrder, loadCheckoutOrderId() ?? undefined);
      saveCheckoutOrderId(order.id);
      const preference = await createPaymentPreference(order);
      navigate(preference.checkoutUrl);
    } catch (caught) {
      if (caught instanceof OrderConflictError) {
        setError({ type: 'conflict', productIds: caught.productIds });
      } else if (caught instanceof DiscountUnavailableError) {
        setError({ type: 'discountUnavailable' });
      } else {
        setError({ type: 'generic' });
      }
      setPlacing(false);
    }
  }

  return { placeOrder, placing, error, clearError: () => setError(null) };
}
