import type { DiscountCode } from '../../types/discount';

/** Códigos de ejemplo, uno de cada caso que el carrito tiene que explicar. */
export const discountsMock: DiscountCode[] = [
  // 10% en todo, sin mínimo.
  {
    id: 'd-bienvenida',
    code: 'BIENVENIDA',
    type: 'percentage',
    value: 10,
    minSubtotal: 0,
    appliesTo: 'all',
    active: true,
    expiresAt: null,
    maxUses: null,
    usedCount: 0,
  },
  // $3.000 fijos con un mínimo de $25.000.
  {
    id: 'd-muydai3000',
    code: 'MUYDAI3000',
    type: 'fixed',
    value: 3000,
    minSubtotal: 25000,
    appliesTo: 'all',
    active: true,
    expiresAt: null,
    maxUses: null,
    usedCount: 0,
  },
  // 15% solo en cuadernos diseñados a medida.
  {
    id: 'd-amedida15',
    code: 'AMEDIDA15',
    type: 'percentage',
    value: 15,
    minSubtotal: 0,
    appliesTo: 'custom',
    active: true,
    expiresAt: null,
    maxUses: null,
    usedCount: 0,
  },
  // Vencido.
  {
    id: 'd-primavera',
    code: 'PRIMAVERA',
    type: 'percentage',
    value: 20,
    minSubtotal: 0,
    appliesTo: 'all',
    active: true,
    expiresAt: '2026-09-30T23:59:59.000-03:00',
    maxUses: null,
    usedCount: 0,
  },
  // Cupo agotado: era para los primeros 20 pedidos.
  {
    id: 'd-primeros20',
    code: 'PRIMEROS20',
    type: 'percentage',
    value: 20,
    minSubtotal: 0,
    appliesTo: 'all',
    active: true,
    expiresAt: null,
    maxUses: 20,
    usedCount: 20,
  },
  // Pausado por el admin.
  {
    id: 'd-pausado',
    code: 'PAUSADO',
    type: 'percentage',
    value: 5,
    minSubtotal: 0,
    appliesTo: 'all',
    active: false,
    expiresAt: null,
    maxUses: null,
    usedCount: 0,
  },
];
