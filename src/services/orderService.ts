import { RESERVATION_MINUTES } from '../constants/shop';
import {
  blockedProductIds,
  canTransition,
  conflictingProductIds,
} from '../domain/checkout/orderRules';
import { createId } from '../domain/id';
import type { NewOrder, Order, PaymentStatus } from '../types/order';
import { currentUserId, requireUserId } from './authService';
import { readDb, updateDb } from './mockDb';
import type { MockDb } from './mockDb';
import { simulateRequest } from './mockNetwork';

/**
 * Pedidos. Hoy se guardan en la base simulada del navegador; con API real
 * solo cambia este archivo (el backend asigna id, número y estados, y hace
 * estas mismas validaciones del lado del servidor).
 */

/** Alguna pieza única ya se vendió o la está pagando otra persona. */
export class OrderConflictError extends Error {
  readonly productIds: string[];

  constructor(productIds: string[]) {
    super('Hay piezas que ya no están disponibles.');
    this.productIds = productIds;
  }
}

/** El código de descuento se quedó sin usos mientras se compraba. */
export class DiscountUnavailableError extends Error {
  constructor() {
    super('El código de descuento ya no está disponible.');
  }
}

function blockedFor(db: MockDb, exceptOrderId?: string) {
  return blockedProductIds(
    db.orders,
    db.soldProductIds,
    new Date(),
    RESERVATION_MINUTES,
    exceptOrderId,
  );
}

function discountHasUses(db: MockDb, discountId: string) {
  const discount = db.discounts.find((candidate) => candidate.id === discountId);
  if (!discount || discount.maxUses === null) return true;
  return discount.usedCount < discount.maxUses;
}

function cancelIfPending(order: Order): Order {
  return order.status === 'pendingPayment' ? { ...order, status: 'cancelled' } : order;
}

/**
 * Crea el pedido esperando el pago y reserva sus piezas. Revalida contra lo
 * vendido, lo reservado y los usos del código (otra pestaña o persona pudo
 * comprar mientras tanto). `replacesOrderId`: el pedido pendiente anterior
 * de este mismo checkout, que se cancela (así no quedan pedidos huérfanos).
 */
export function createOrder(newOrder: NewOrder, replacesOrderId?: string): Promise<Order> {
  try {
    let created: Order | undefined;
    updateDb((db) => {
      const conflicts = conflictingProductIds(newOrder, blockedFor(db, replacesOrderId));
      if (conflicts.length > 0) throw new OrderConflictError(conflicts);
      if (newOrder.discount && !discountHasUses(db, newOrder.discount.id)) {
        throw new DiscountUnavailableError();
      }
      const number = db.lastOrderNumber + 1;
      created = {
        ...newOrder,
        // Quién compra sale de la sesión, no de lo que mande la pantalla.
        userId: currentUserId(),
        id: createId(),
        number: `MD-${String(number).padStart(4, '0')}`,
        createdAt: new Date().toISOString(),
        status: 'pendingPayment',
        payment: { provider: 'mercadopago', status: 'pending', preferenceId: null },
      };
      const orders = db.orders.map((order) =>
        order.id === replacesOrderId ? cancelIfPending(order) : order,
      );
      return { ...db, lastOrderNumber: number, orders: [...orders, created] };
    });
    return simulateRequest(created as Order);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getOrder(id: string): Promise<Order | null> {
  return simulateRequest(readDb().orders.find((order) => order.id === id) ?? null);
}

/**
 * Mis compras (de la sesión actual), de la más nueva a la más vieja. No
 * incluye los intentos que quedaron cancelados sin cobrarse (ej. al volver
 * a pagar).
 */
export async function getMyOrders(): Promise<Order[]> {
  const userId = requireUserId();
  return simulateRequest(
    readDb()
      .orders.filter(
        (order) =>
          order.userId === userId &&
          !(order.status === 'cancelled' && order.payment.status !== 'approved'),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
}

export function findOrderByPreference(preferenceId: string): Promise<Order | null> {
  return simulateRequest(
    readDb().orders.find((order) => order.payment.preferenceId === preferenceId) ?? null,
  );
}

/**
 * Asocia una preferencia de pago nueva al pedido y lo vuelve a poner
 * esperando el pago (también al reintentar tras un rechazo, renovando la
 * reserva). Revalida las piezas: si alguien las compró, no deja pagar.
 */
export function attachPaymentPreference(orderId: string, preferenceId: string) {
  updateDb((db) => {
    const order = db.orders.find((candidate) => candidate.id === orderId);
    if (!order || order.status !== 'pendingPayment') throw new OrderConflictError([]);
    const conflicts = conflictingProductIds(order, blockedFor(db, orderId));
    if (conflicts.length > 0) throw new OrderConflictError(conflicts);
    return {
      ...db,
      orders: db.orders.map((candidate) =>
        candidate.id === orderId
          ? {
              ...candidate,
              createdAt: new Date().toISOString(),
              payment: { ...candidate.payment, status: 'pending', preferenceId },
            }
          : candidate,
      ),
    };
  });
}

/**
 * Registra el resultado de un pago (lo que haría el aviso —webhook— de
 * Mercado Pago en el backend). Aprobado: pedido pagado, piezas vendidas y un
 * uso más del código. Es idempotente y respeta las transiciones: un pedido
 * cancelado no se reactiva. Si al aprobar alguna pieza ya se vendió por otro
 * lado, el pedido se cancela y queda marcado para devolver el dinero.
 */
export function registerPaymentResult(orderId: string, status: PaymentStatus) {
  updateDb((db) => {
    const order = db.orders.find((candidate) => candidate.id === orderId);
    if (!order || order.payment.status === 'approved') return db;

    if (status !== 'approved') {
      return {
        ...db,
        orders: db.orders.map((candidate) =>
          candidate.id === orderId
            ? { ...candidate, payment: { ...candidate.payment, status } }
            : candidate,
        ),
      };
    }

    const soldElsewhere = conflictingProductIds(order, new Set(db.soldProductIds)).length > 0;
    const canBePaid = canTransition(order.status, 'paid') && !soldElsewhere;
    const updated: Order = {
      ...order,
      status: canBePaid ? 'paid' : 'cancelled',
      payment: canBePaid
        ? { ...order.payment, status }
        : { ...order.payment, status, refundRequired: true },
    };
    const productIds = order.lines.flatMap((line) => (line.productId ? [line.productId] : []));
    return {
      ...db,
      orders: db.orders.map((candidate) => (candidate.id === orderId ? updated : candidate)),
      soldProductIds: canBePaid
        ? [...new Set([...db.soldProductIds, ...productIds])]
        : db.soldProductIds,
      discounts:
        canBePaid && order.discount
          ? db.discounts.map((discount) =>
              discount.id === order.discount?.id
                ? { ...discount, usedCount: discount.usedCount + 1 }
                : discount,
            )
          : db.discounts,
    };
  });
}
