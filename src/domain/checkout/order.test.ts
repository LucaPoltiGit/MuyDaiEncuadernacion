import { describe, expect, it } from 'vitest';
import { buildNewOrder, checkoutTotals, quoteFromForm } from './order';
import { buildCheckoutForm, buildShippingConfig } from './testFixture';
import { summarizeCart } from '../cart/pricing';
import { buildCustomItem, buildProduct, buildProductItem } from '../cart/testFixture';
import { buildConfiguration, buildTestData } from '../notebook/testFixture';
import { quotePickup, quoteShipping } from '../shipping';

const configurator = buildTestData();
const shipping = buildShippingConfig();
const [caba, interior] = shipping.zones;
const cart = summarizeCart(
  [
    buildProductItem(),
    buildCustomItem({ configuration: buildConfiguration({ coverText: 'Ana' }) }),
  ],
  { configurator, products: [buildProduct()] },
);

describe('checkoutTotals', () => {
  it('resta el descuento y suma el envío', () => {
    expect(checkoutTotals(40000, 4000, quoteShipping(caba, 36000))).toEqual({
      subtotal: 40000,
      discount: 4000,
      shipping: 3500,
      total: 39500,
    });
  });

  it('sin entrega elegida todavía, no suma envío', () => {
    expect(checkoutTotals(40000, 0, null).total).toBe(40000);
  });
});

describe('quoteFromForm', () => {
  it('cotiza el envío por código postal, con el subtotal ya descontado', () => {
    const quote = quoteFromForm(buildCheckoutForm({ postalCode: 'C1414ABC' }), shipping, 60000);
    expect(quote).toMatchObject({ method: 'shipping', zone: { id: 'caba' }, price: 0, free: true });
  });

  it('sin código válido o sin cobertura, todavía no hay cotización', () => {
    expect(quoteFromForm(buildCheckoutForm({ postalCode: '12' }), shipping, 0)).toBeNull();
    expect(quoteFromForm(buildCheckoutForm({ postalCode: '9410' }), shipping, 0)).toBeNull();
  });

  it('retirar en el taller no tiene costo', () => {
    const quote = quoteFromForm(
      buildCheckoutForm({ method: 'pickup', pickupPointId: 'taller' }),
      shipping,
      0,
    );
    expect(quote).toMatchObject({ method: 'pickup', price: 0 });
  });
});

describe('buildNewOrder', () => {
  // Tienda $20.000 + a medida con texto $18.700 = $38.700
  it('guarda una foto del pedido con totales, entrega y plazo', () => {
    const order = buildNewOrder({
      form: buildCheckoutForm({ postalCode: '5000', city: 'Córdoba', province: 'Córdoba' }),
      cart,
      discount: { id: 'd-hola', code: 'HOLA10', amount: 3870 },
      quote: quoteShipping(interior, 34830),
      shipping,
      configurator,
    });

    expect(order.lines).toHaveLength(2);
    expect(order.lines[0]).toMatchObject({ kind: 'product', productName: 'Cuaderno Flores' });
    expect(order.lines[1]).toMatchObject({ kind: 'custom', productName: null, price: 18700 });
    expect(order).toMatchObject({
      subtotal: 38700,
      discount: { id: 'd-hola', code: 'HOLA10', amount: 3870 },
      total: 38700 - 3870 + 7900,
      delivery: { method: 'shipping', zoneId: 'interior', price: 7900 },
    });
    // El a medida con texto tarda 9 días hábiles + 4 a 8 de correo.
    expect(order.estimatedDays).toEqual({ min: 13, max: 17 });
  });

  it('para retirar, guarda el punto y no cobra envío', () => {
    const order = buildNewOrder({
      form: buildCheckoutForm({ method: 'pickup', pickupPointId: 'taller' }),
      cart,
      discount: null,
      quote: quotePickup(shipping.pickupPoints[0]),
      shipping,
      configurator,
    });
    expect(order.delivery).toEqual({
      method: 'pickup',
      pointId: 'taller',
      pointName: 'Taller MuyDai',
      price: 0,
    });
    expect(order.total).toBe(38700);
    expect(order.estimatedDays).toEqual({ min: 9, max: 9 });
  });

  it('no arma un pedido con un carrito que tiene problemas', () => {
    const broken = summarizeCart([buildProductItem({ productId: 'borrado' })], {
      configurator,
      products: [],
    });
    expect(() =>
      buildNewOrder({
        form: buildCheckoutForm(),
        cart: broken,
        discount: null,
        quote: quoteShipping(caba, 0),
        shipping,
        configurator,
      }),
    ).toThrow();
  });
});
