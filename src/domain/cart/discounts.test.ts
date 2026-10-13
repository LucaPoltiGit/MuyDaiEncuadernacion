import { describe, expect, it } from 'vitest';
import { evaluateDiscount, normalizeDiscountCode } from './discounts';
import { summarizeCart } from './pricing';
import { buildCustomItem, buildDiscount, buildProduct, buildProductItem } from './testFixture';
import { buildTestData } from '../notebook/testFixture';

const context = { configurator: buildTestData(), products: [buildProduct()] };
const now = new Date('2026-10-12T12:00:00.000Z');

/** Carrito con $40.000 de catálogo y $16.200 a medida. */
const mixedCart = summarizeCart([buildProductItem({ quantity: 2 }), buildCustomItem()], context);
const productOnlyCart = summarizeCart([buildProductItem()], context);

describe('normalizeDiscountCode', () => {
  it('ignora mayúsculas y espacios', () => {
    expect(normalizeDiscountCode('  hola 10 ')).toBe('HOLA10');
  });
});

describe('evaluateDiscount', () => {
  it('aplica un porcentaje sobre el subtotal, redondeado a pesos', () => {
    const result = evaluateDiscount(buildDiscount({ value: 15 }), mixedCart, now);
    // 15% de $56.200 = $8.430
    expect(result).toMatchObject({ status: 'applied', amount: 8430 });
  });

  it('redondea los porcentajes que dan centavos', () => {
    const cart = summarizeCart([buildProductItem()], {
      ...context,
      products: [buildProduct({ price: 9999 })],
    });
    // 10% de $9.999 = $999,90 → $1.000
    expect(evaluateDiscount(buildDiscount(), cart, now)).toMatchObject({ amount: 1000 });
  });

  it('aplica un monto fijo', () => {
    const result = evaluateDiscount(buildDiscount({ type: 'fixed', value: 3000 }), mixedCart, now);
    expect(result).toMatchObject({ status: 'applied', amount: 3000 });
  });

  it('un monto fijo nunca deja el total en negativo', () => {
    const result = evaluateDiscount(
      buildDiscount({ type: 'fixed', value: 99999 }),
      productOnlyCart,
      now,
    );
    expect(result).toMatchObject({ status: 'applied', amount: 20000 });
  });

  it('un porcentaje mayor a 100 se limita al 100%', () => {
    const result = evaluateDiscount(buildDiscount({ value: 150 }), productOnlyCart, now);
    expect(result).toMatchObject({ amount: 20000 });
  });

  it('si aplica solo a cuadernos a medida, descuenta solo sobre esa parte', () => {
    const result = evaluateDiscount(buildDiscount({ appliesTo: 'custom' }), mixedCart, now);
    // 10% de $16.200 (no de $56.200)
    expect(result).toMatchObject({ status: 'applied', amount: 1620 });
  });

  it('si no hay productos de ese tipo en el carrito, explica que no aplica', () => {
    const result = evaluateDiscount(buildDiscount({ appliesTo: 'custom' }), productOnlyCart, now);
    expect(result).toEqual({
      status: 'rejected',
      reason: { type: 'notApplicable', appliesTo: 'custom' },
    });
  });

  it('con mínimo de compra, dice cuánto falta', () => {
    const result = evaluateDiscount(buildDiscount({ minSubtotal: 25000 }), productOnlyCart, now);
    expect(result).toEqual({
      status: 'rejected',
      reason: { type: 'belowMinimum', minSubtotal: 25000, missing: 5000 },
    });
  });

  it('el mínimo se cumple justo en el valor exacto', () => {
    const result = evaluateDiscount(buildDiscount({ minSubtotal: 20000 }), productOnlyCart, now);
    expect(result.status).toBe('applied');
  });

  it('el mínimo se mide sobre la parte alcanzada por el código', () => {
    // Total $56.200, pero lo hecho a medida suma $16.200: no llega a $20.000.
    const result = evaluateDiscount(
      buildDiscount({ appliesTo: 'custom', minSubtotal: 20000 }),
      mixedCart,
      now,
    );
    expect(result).toMatchObject({ reason: { type: 'belowMinimum', missing: 3800 } });
  });

  it('rechaza códigos inexistentes, pausados o vencidos', () => {
    expect(evaluateDiscount(null, mixedCart, now)).toMatchObject({
      reason: { type: 'notFound' },
    });
    expect(evaluateDiscount(buildDiscount({ active: false }), mixedCart, now)).toMatchObject({
      reason: { type: 'inactive' },
    });
    expect(
      evaluateDiscount(buildDiscount({ expiresAt: '2026-10-11T23:59:59.000Z' }), mixedCart, now),
    ).toMatchObject({ reason: { type: 'expired' } });
  });

  it('rechaza un código que llegó a su máximo de usos', () => {
    expect(
      evaluateDiscount(buildDiscount({ maxUses: 50, usedCount: 50 }), mixedCart, now),
    ).toMatchObject({ reason: { type: 'exhausted' } });
    expect(
      evaluateDiscount(buildDiscount({ maxUses: 50, usedCount: 49 }), mixedCart, now).status,
    ).toBe('applied');
  });

  it('sigue valiendo hasta el instante en que vence', () => {
    const result = evaluateDiscount(
      buildDiscount({ expiresAt: '2026-10-12T12:00:00.000Z' }),
      mixedCart,
      now,
    );
    expect(result.status).toBe('applied');
  });

  it('los renglones con problemas no cuentan para el descuento', () => {
    const cart = summarizeCart(
      [buildProductItem(), buildProductItem({ id: 'otro', productId: 'borrado' })],
      context,
    );
    expect(evaluateDiscount(buildDiscount(), cart, now)).toMatchObject({ amount: 2000 });
  });
});
