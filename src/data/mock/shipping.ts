import type { ShippingConfig } from '../../types/shipping';

/**
 * Zonas de envío por código postal y puntos de retiro. Precios en pesos,
 * enteros. Rangos aproximados para desarrollar: los reales los carga el admin.
 */
export const shippingMock: ShippingConfig = {
  zones: [
    {
      id: 'caba',
      name: 'Ciudad de Buenos Aires',
      postalCodes: [{ from: 1000, to: 1499 }],
      price: 3500,
      freeFrom: 60000,
      days: { min: 1, max: 2 },
    },
    {
      id: 'gba',
      name: 'Gran Buenos Aires',
      postalCodes: [{ from: 1500, to: 1999 }],
      price: 4900,
      freeFrom: 80000,
      days: { min: 2, max: 4 },
    },
    {
      id: 'interior',
      name: 'Resto del país',
      // Sin Tierra del Fuego (9410-9431) por ahora: se coordina por WhatsApp.
      postalCodes: [
        { from: 2000, to: 9409 },
        { from: 9432, to: 9499 },
      ],
      price: 7900,
      freeFrom: null,
      days: { min: 4, max: 8 },
    },
  ],
  pickupPoints: [
    {
      id: 'taller',
      name: 'Taller MuyDai',
      address: 'Villa Crespo, CABA (te pasamos la dirección exacta al confirmar)',
      schedule: 'Lunes a viernes de 10 a 18 h',
    },
  ],
  dispatchDays: 2,
};
