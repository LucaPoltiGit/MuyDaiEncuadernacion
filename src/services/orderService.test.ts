import { describe, expect, it } from 'vitest';
import {
  attachPaymentPreference,
  createOrder,
  getMyOrders,
  getOrder,
  OrderConflictError,
  registerPaymentResult,
} from './orderService';
import { buildConfiguration } from '../domain/notebook/testFixture';
import { login } from './authService';
import { readDb } from './mockDb';
import type { NewOrder } from '../types/order';

function buildNewOrder(overrides: Partial<NewOrder> = {}): NewOrder {
  return {
    customer: { name: 'Ana', email: 'ana@example.com', phone: '1155551234' },
    lines: [
      {
        kind: 'product',
        productId: 'p-1',
        productName: 'Jardín',
        configuration: buildConfiguration(),
        price: 20000,
      },
    ],
    subtotal: 20000,
    discount: { id: 'd-bienvenida', code: 'BIENVENIDA', amount: 2000 },
    delivery: { method: 'pickup', pointId: 'taller', pointName: 'Taller', price: 0 },
    total: 18000,
    estimatedDays: { min: 2, max: 2 },
    ...overrides,
  };
}

function usesOf(discountId: string) {
  return readDb().discounts.find((discount) => discount.id === discountId)?.usedCount;
}

describe('orderService', () => {
  it('numera los pedidos y los deja esperando el pago', async () => {
    const first = await createOrder(buildNewOrder());
    const second = await createOrder(buildNewOrder({ lines: [] }));
    expect(first).toMatchObject({ number: 'MD-0001', status: 'pendingPayment' });
    expect(second.number).toBe('MD-0002');
    expect(first.payment.status).toBe('pending');
  });

  it('un pago aprobado marca el pedido, vende las piezas y cuenta el uso del código', async () => {
    const order = await createOrder(buildNewOrder());
    registerPaymentResult(order.id, 'approved');

    expect(await getOrder(order.id)).toMatchObject({
      status: 'paid',
      payment: { status: 'approved' },
    });
    expect(readDb().soldProductIds).toEqual(['p-1']);
    expect(usesOf('d-bienvenida')).toBe(1);
  });

  it('un pago rechazado no vende nada y se puede reintentar', async () => {
    const order = await createOrder(buildNewOrder());
    registerPaymentResult(order.id, 'rejected');
    expect(await getOrder(order.id)).toMatchObject({
      status: 'pendingPayment',
      payment: { status: 'rejected' },
    });
    expect(readDb().soldProductIds).toEqual([]);

    registerPaymentResult(order.id, 'approved');
    expect((await getOrder(order.id))?.status).toBe('paid');
  });

  it('un aviso repetido de pago aprobado no cuenta dos veces', async () => {
    const order = await createOrder(buildNewOrder());
    registerPaymentResult(order.id, 'approved');
    registerPaymentResult(order.id, 'approved');
    registerPaymentResult(order.id, 'rejected');
    expect(usesOf('d-bienvenida')).toBe(1);
    expect((await getOrder(order.id))?.payment.status).toBe('approved');
  });

  it('una pieza reservada por otro pedido en curso no se puede volver a pedir', async () => {
    await createOrder(buildNewOrder());
    await expect(createOrder(buildNewOrder())).rejects.toBeInstanceOf(OrderConflictError);
  });

  it('volver a pagar desde el mismo checkout reemplaza el pedido pendiente anterior', async () => {
    const first = await createOrder(buildNewOrder());
    const second = await createOrder(buildNewOrder(), first.id);
    expect((await getOrder(first.id))?.status).toBe('cancelled');
    expect(second.status).toBe('pendingPayment');
  });

  it('un pago rechazado libera la pieza; reintentar la vuelve a reservar si sigue libre', async () => {
    const order = await createOrder(buildNewOrder());
    registerPaymentResult(order.id, 'rejected');
    const other = await createOrder(buildNewOrder());
    // Mientras la otra persona paga, el reintento no se puede iniciar.
    expect(() => attachPaymentPreference(order.id, 'pref-2')).toThrow(OrderConflictError);
    registerPaymentResult(other.id, 'rejected');
    attachPaymentPreference(order.id, 'pref-2');
    expect((await getOrder(order.id))?.payment).toMatchObject({
      status: 'pending',
      preferenceId: 'pref-2',
    });
  });

  it('un pago que llega para un pedido cancelado no lo reactiva y pide devolver el dinero', async () => {
    const order = await createOrder(buildNewOrder());
    await createOrder(buildNewOrder(), order.id);
    registerPaymentResult(order.id, 'approved');
    expect(await getOrder(order.id)).toMatchObject({
      status: 'cancelled',
      payment: { status: 'approved', refundRequired: true },
    });
    expect(readDb().soldProductIds).toEqual([]);
  });

  it('el pedido queda a nombre de la sesión actual (no de lo que mande la pantalla)', async () => {
    expect((await createOrder(buildNewOrder({ lines: [] }))).userId).toBeNull();
    const user = await login('ana@example.com', 'cuadernos');
    const mine = await createOrder(buildNewOrder({ lines: [] }));
    expect(mine.userId).toBe(user.id);
    expect((await getMyOrders()).map((order) => order.id)).toEqual([mine.id]);
  });
});
