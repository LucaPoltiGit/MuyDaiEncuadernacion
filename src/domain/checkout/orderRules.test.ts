import { describe, expect, it } from 'vitest';
import { blockedProductIds, canTransition, conflictingProductIds, isReserving } from './orderRules';
import { buildOrder } from './testFixture';

const now = new Date('2026-10-12T12:10:00.000Z');
// buildOrder se creó a las 12:00 con la pieza p-flores.

describe('canTransition', () => {
  it('el pago lleva un pedido pendiente a pagado', () => {
    expect(canTransition('pendingPayment', 'paid')).toBe(true);
  });

  it('un pedido cancelado no se reactiva con un pago tardío', () => {
    expect(canTransition('cancelled', 'paid')).toBe(false);
  });

  it('no se puede saltar del pago pendiente a enviado ni volver atrás', () => {
    expect(canTransition('pendingPayment', 'shipped')).toBe(false);
    expect(canTransition('delivered', 'shipped')).toBe(false);
  });
});

describe('isReserving', () => {
  it('un pedido esperando el pago reserva sus piezas por un rato', () => {
    expect(isReserving(buildOrder(), now, 30)).toBe(true);
    expect(isReserving(buildOrder(), new Date('2026-10-12T12:31:00.000Z'), 30)).toBe(false);
  });

  it('un pago rechazado o un pedido ya pagado no reservan', () => {
    const rejected = buildOrder({
      payment: { provider: 'mercadopago', status: 'rejected', preferenceId: 'p' },
    });
    expect(isReserving(rejected, now, 30)).toBe(false);
    expect(isReserving(buildOrder({ status: 'paid' }), now, 30)).toBe(false);
  });
});

describe('blockedProductIds', () => {
  it('junta las vendidas y las reservadas por otros pedidos', () => {
    const blocked = blockedProductIds([buildOrder()], ['p-otro'], now, 30);
    expect([...blocked].sort()).toEqual(['p-flores', 'p-otro']);
  });

  it('el propio pedido no se bloquea a sí mismo', () => {
    const blocked = blockedProductIds([buildOrder()], [], now, 30, 'order-1');
    expect(blocked.size).toBe(0);
  });
});

describe('conflictingProductIds', () => {
  it('dice qué piezas del pedido ya no están libres', () => {
    expect(conflictingProductIds(buildOrder(), new Set(['p-flores']))).toEqual(['p-flores']);
    expect(conflictingProductIds(buildOrder(), new Set())).toEqual([]);
  });
});
