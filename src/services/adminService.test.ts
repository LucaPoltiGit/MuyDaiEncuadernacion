import { describe, expect, it } from 'vitest';
import {
  AdminValidationError,
  getAdminCatalog,
  getAllOrders,
  InvalidTransitionError,
  saveConfigurator,
  saveDiscount,
  saveProduct,
  updateOrderStatus,
} from './adminService';
import { ForbiddenError, login, NotAuthenticatedError } from './authService';
import { getCatalog } from './catalogService';
import { getConfiguratorData } from './configuratorService';
import { findDiscountCode } from './discountService';
import { readDb } from './mockDb';
import { createOrder, registerPaymentResult } from './orderService';
import { buildDiscount, buildProduct } from '../domain/cart/testFixture';
import { buildOrder } from '../domain/checkout/testFixture';
import type { NewOrder } from '../types/order';

function newOrderFor(productId: string): NewOrder {
  const { lines, customer, subtotal, delivery, total, estimatedDays } = buildOrder();
  return {
    customer,
    lines: [{ ...lines[0], productId }],
    subtotal,
    discount: null,
    delivery,
    total,
    estimatedDays,
  };
}

describe('adminService', () => {
  it('sin sesión o sin rol admin, no deja hacer nada', async () => {
    await expect(getAllOrders()).rejects.toBeInstanceOf(NotAuthenticatedError);
    await login('ana@example.com', 'cuadernos');
    await expect(getAllOrders()).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('el admin pone el precio que quiera a un producto y la tienda lo muestra', async () => {
    await login('admin@muydai.com', 'muydai123');
    const { catalog } = await getAdminCatalog();
    const jardin = catalog.products.find((product) => product.slug === 'cuaderno-jardin');
    if (!jardin) throw new Error('falta el producto de ejemplo');

    await saveProduct({ ...jardin, price: 45000 });
    const shop = await getCatalog();
    expect(shop.products.find((product) => product.id === jardin.id)?.price).toBe(45000);
  });

  it('crea un producto nuevo y rechaza datos inválidos', async () => {
    await login('admin@muydai.com', 'muydai123');
    const { catalog } = await getAdminCatalog();
    const configuration = catalog.products[0].configuration;
    const created = await saveProduct(
      buildProduct({ id: '', slug: 'nuevo', categoryId: 'escribir', configuration }),
    );
    expect(created.id).not.toBe('');
    await expect(
      saveProduct(buildProduct({ id: '', slug: 'nuevo', categoryId: 'escribir', configuration })),
    ).rejects.toBeInstanceOf(AdminValidationError);
  });

  it('los cambios del configurador llegan a la tienda', async () => {
    await login('admin@muydai.com', 'muydai123');
    const data = await getConfiguratorData();
    await saveConfigurator({
      ...data,
      pricing: { ...data.pricing, personalizationSurcharge: 4000 },
    });
    expect((await getConfiguratorData()).pricing.personalizationSurcharge).toBe(4000);
  });

  it('un código nuevo se puede usar en el carrito', async () => {
    await login('admin@muydai.com', 'muydai123');
    await saveDiscount(buildDiscount({ id: '', code: 'feria 25', value: 25 }));
    expect(await findDiscountCode('FERIA25')).toMatchObject({ value: 25 });
  });

  it('avanza el estado de un pedido pero no permite saltos imposibles', async () => {
    const order = await createOrder(newOrderFor('p-jardin'));
    registerPaymentResult(order.id, 'approved');
    await login('admin@muydai.com', 'muydai123');

    expect((await updateOrderStatus(order.id, 'inProduction')).status).toBe('inProduction');
    await expect(updateOrderStatus(order.id, 'pendingPayment')).rejects.toBeInstanceOf(
      InvalidTransitionError,
    );
  });

  it('cancelar un pedido pagado pide devolver el dinero y vuelve a poner la pieza a la venta', async () => {
    const order = await createOrder(newOrderFor('p-jardin'));
    registerPaymentResult(order.id, 'approved');
    expect(readDb().soldProductIds).toContain('p-jardin');
    await login('admin@muydai.com', 'muydai123');

    const cancelled = await updateOrderStatus(order.id, 'cancelled');
    expect(cancelled.payment.refundRequired).toBe(true);
    expect(readDb().soldProductIds).not.toContain('p-jardin');
  });
});
