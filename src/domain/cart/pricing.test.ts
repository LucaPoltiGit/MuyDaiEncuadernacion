import { describe, expect, it } from 'vitest';
import { summarizeCart } from './pricing';
import { buildCustomItem, buildProduct, buildProductItem } from './testFixture';
import { buildConfiguration, buildTestData } from '../notebook/testFixture';

const configurator = buildTestData();
const context = { configurator, products: [buildProduct()] };

describe('summarizeCart', () => {
  it('suma productos de catálogo y cuadernos a medida con los precios vigentes', () => {
    const cart = summarizeCart(
      [buildProductItem({ quantity: 2 }), buildCustomItem({ quantity: 1 })],
      context,
    );
    // Catálogo: 2 × $20.000. A medida: A5 $10.000 + 80 hojas × $40 + cosido $3.000.
    expect(cart.subtotalByKind).toEqual({ product: 40000, custom: 16200 });
    expect(cart.subtotal).toBe(56200);
    expect(cart.hasProblems).toBe(false);
  });

  it('usa el precio actual aunque haya cambiado desde que se agregó, y lo marca', () => {
    const cart = summarizeCart([buildProductItem({ priceAtAdd: 18000 })], context);
    expect(cart.lines[0].unitPrice).toBe(20000);
    expect(cart.lines[0].priceChanged).toBe(true);
  });

  it('un producto que ya no existe no suma y bloquea el checkout', () => {
    const cart = summarizeCart([buildProductItem({ productId: 'borrado' })], context);
    expect(cart.lines[0].problem).toEqual({ type: 'productRemoved' });
    expect(cart.subtotal).toBe(0);
    expect(cart.hasProblems).toBe(true);
  });

  it('un producto sin stock no se puede comprar', () => {
    const cart = summarizeCart([buildProductItem()], {
      configurator,
      products: [buildProduct({ stock: 0 })],
    });
    expect(cart.lines[0].problem).toEqual({ type: 'outOfStock' });
  });

  it('no deja pedir más unidades que el stock', () => {
    const cart = summarizeCart([buildProductItem({ quantity: 5 })], context);
    expect(cart.lines[0].problem).toEqual({ type: 'tooMany', max: 3 });
    expect(cart.lines[0].maxQuantity).toBe(3);
  });

  it('los cuadernos a medida respetan el máximo por diseño del taller', () => {
    const cart = summarizeCart([buildCustomItem({ quantity: 6 })], context);
    expect(cart.lines[0].problem).toEqual({ type: 'tooMany', max: 5 });
  });

  it('un cuaderno a medida con una tela que se agotó queda marcado', () => {
    const item = buildCustomItem({ configuration: buildConfiguration({ fabricId: 'lunares' }) });
    const cart = summarizeCart([item], context);
    expect(cart.lines[0].problem).toEqual({ type: 'invalidConfiguration' });
    expect(cart.hasProblems).toBe(true);
  });

  it('el stock es por producto aunque esté en dos renglones', () => {
    const cart = summarizeCart(
      [buildProductItem({ id: 'a', quantity: 2 }), buildProductItem({ id: 'b', quantity: 2 })],
      context,
    );
    expect(cart.lines[0].problem).toBeNull();
    expect(cart.lines[1].problem).toEqual({ type: 'tooMany', max: 1 });
  });

  it('un producto de catálogo usa su configuración vigente, no la guardada', () => {
    const current = buildConfiguration({ fabricId: 'lino' });
    const cart = summarizeCart([buildProductItem()], {
      configurator,
      products: [buildProduct({ configuration: current })],
    });
    expect(cart.lines[0].configuration).toEqual(current);
  });

  it('sin precio de referencia, no avisa que el precio cambió', () => {
    const cart = summarizeCart([buildCustomItem({ priceAtAdd: 0 })], context);
    expect(cart.lines[0].priceChanged).toBe(false);
  });

  it('un carrito vacío vale $0 y no tiene problemas', () => {
    expect(summarizeCart([], context)).toMatchObject({ subtotal: 0, hasProblems: false });
  });
});
