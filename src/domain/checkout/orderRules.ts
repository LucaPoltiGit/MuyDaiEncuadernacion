import type { Order, OrderStatus } from '../../types/order';

/**
 * Cambios de estado permitidos. El pago mueve `pendingPayment → paid`; el
 * admin (Parte 7) avanza el resto. Un pedido cancelado o entregado no vuelve
 * atrás: si llega un pago tarde, no lo reactiva.
 */
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pendingPayment: ['paid', 'cancelled'],
  paid: ['inProduction', 'shipped', 'readyForPickup', 'cancelled'],
  inProduction: ['shipped', 'readyForPickup', 'cancelled'],
  shipped: ['delivered'],
  readyForPickup: ['delivered'],
  delivered: [],
  cancelled: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus) {
  return TRANSITIONS[from].includes(to);
}

/**
 * Estados a los que el admin puede pasar un pedido. El pago lo marca el
 * pago (no el admin), y "enviado" o "listo para retirar" dependen de cómo
 * se entrega.
 */
export function nextStatusesFor(order: Pick<Order, 'status' | 'delivery'>): OrderStatus[] {
  return TRANSITIONS[order.status].filter((status) => {
    if (status === 'paid') return false;
    if (status === 'shipped') return order.delivery.method === 'shipping';
    if (status === 'readyForPickup') return order.delivery.method === 'pickup';
    return true;
  });
}

/**
 * Un pedido esperando el pago reserva sus piezas únicas por un rato, para
 * que nadie más las compre mientras se paga. Un pago rechazado libera la
 * reserva (al reintentar, se vuelve a pedir).
 */
export function isReserving(order: Order, now: Date, reservationMinutes: number) {
  if (order.status !== 'pendingPayment' || order.payment.status === 'rejected') return false;
  const age = now.getTime() - new Date(order.createdAt).getTime();
  return age < reservationMinutes * 60_000;
}

/** Piezas que no se pueden comprar: vendidas o reservadas por otro pedido en curso. */
export function blockedProductIds(
  orders: Order[],
  soldProductIds: string[],
  now: Date,
  reservationMinutes: number,
  exceptOrderId?: string,
) {
  const blocked = new Set(soldProductIds);
  for (const order of orders) {
    if (order.id === exceptOrderId || !isReserving(order, now, reservationMinutes)) continue;
    for (const line of order.lines) if (line.productId) blocked.add(line.productId);
  }
  return blocked;
}

/** Piezas del pedido que ya no están libres (para avisar quién se las llevó). */
export function conflictingProductIds(order: Pick<Order, 'lines'>, blocked: Set<string>): string[] {
  return order.lines.flatMap((line) =>
    line.productId && blocked.has(line.productId) ? [line.productId] : [],
  );
}
