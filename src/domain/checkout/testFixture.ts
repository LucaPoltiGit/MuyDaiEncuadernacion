import type { CheckoutForm } from './form';
import { buildConfiguration } from '../notebook/testFixture';
import type { Order } from '../../types/order';
import type { ShippingConfig } from '../../types/shipping';

/** Configuración de envíos de prueba, independiente de los mocks. */
export function buildShippingConfig(overrides: Partial<ShippingConfig> = {}): ShippingConfig {
  return {
    zones: [
      {
        id: 'caba',
        name: 'CABA',
        postalCodes: [{ from: 1000, to: 1499 }],
        price: 3500,
        freeFrom: 60000,
        days: { min: 1, max: 2 },
      },
      {
        id: 'interior',
        name: 'Resto del país',
        postalCodes: [{ from: 2000, to: 9399 }],
        price: 7900,
        freeFrom: null,
        days: { min: 4, max: 8 },
      },
    ],
    pickupPoints: [
      { id: 'taller', name: 'Taller MuyDai', address: 'Villa Crespo, CABA', schedule: 'Lun a vie' },
    ],
    dispatchDays: 2,
    ...overrides,
  };
}

/** Formulario completo y válido para envío a CABA. */
export function buildCheckoutForm(overrides: Partial<CheckoutForm> = {}): CheckoutForm {
  return {
    name: 'Ana Pérez',
    email: 'ana@example.com',
    phone: '11 5555-1234',
    method: 'shipping',
    postalCode: '1414',
    street: 'Av. Corrientes 1234',
    apartment: '',
    city: 'CABA',
    province: 'Buenos Aires',
    pickupPointId: '',
    ...overrides,
  };
}

/** Pedido de $38.700 (tienda + a medida), esperando el pago, para retirar. */
export function buildOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'order-1',
    number: 'MD-0001',
    createdAt: '2026-10-12T12:00:00.000Z',
    userId: null,
    customer: { name: 'Ana Pérez', email: 'ana@example.com', phone: '11 5555-1234' },
    lines: [
      {
        kind: 'product',
        productId: 'p-flores',
        productName: 'Cuaderno Flores',
        configuration: buildConfiguration(),
        price: 20000,
      },
      {
        kind: 'custom',
        productId: null,
        productName: null,
        configuration: buildConfiguration({ coverText: 'Ana' }),
        price: 18700,
      },
    ],
    subtotal: 38700,
    discount: null,
    delivery: { method: 'pickup', pointId: 'taller', pointName: 'Taller MuyDai', price: 0 },
    total: 38700,
    estimatedDays: { min: 9, max: 9 },
    status: 'pendingPayment',
    payment: { provider: 'mercadopago', status: 'pending', preferenceId: 'pref-1' },
    ...overrides,
  };
}
