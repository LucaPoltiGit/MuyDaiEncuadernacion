import type { CustomCartItem, ProductCartItem } from '../../types/cart';
import type { Product } from '../../types/catalog';
import type { DiscountCode } from '../../types/discount';
import { buildConfiguration } from '../notebook/testFixture';

/** Datos de prueba del carrito y el catálogo, independientes de los mocks. */
export function buildProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p-flores',
    slug: 'cuaderno-flores',
    name: 'Cuaderno Flores',
    tagline: 'A5 cosido a la vista',
    description: '',
    categoryId: 'escribir',
    configuration: buildConfiguration(),
    price: 20000,
    available: true,
    ...overrides,
  };
}

export function buildProductItem(overrides: Partial<ProductCartItem> = {}): ProductCartItem {
  return {
    id: 'item-product',
    kind: 'product',
    productId: 'p-flores',
    configuration: buildConfiguration(),
    priceAtAdd: 20000,
    addedAt: '2026-10-01T12:00:00.000Z',
    ...overrides,
  };
}

/** Con la config por defecto y `buildTestData()`, vale $16.200. */
export function buildCustomItem(overrides: Partial<CustomCartItem> = {}): CustomCartItem {
  return {
    id: 'item-custom',
    kind: 'custom',
    configuration: buildConfiguration(),
    priceAtAdd: 16200,
    addedAt: '2026-10-01T12:00:00.000Z',
    ...overrides,
  };
}

export function buildDiscount(overrides: Partial<DiscountCode> = {}): DiscountCode {
  return {
    id: 'd-hola',
    code: 'HOLA10',
    type: 'percentage',
    value: 10,
    minSubtotal: 0,
    appliesTo: 'all',
    active: true,
    expiresAt: null,
    maxUses: null,
    usedCount: 0,
    ...overrides,
  };
}
