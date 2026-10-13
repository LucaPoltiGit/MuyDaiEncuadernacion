import type { DiscountCode } from '../../types/discount';
import type { CartSummary } from './pricing';

/** Por qué un código no aplica (el texto lo arma la UI). */
export type DiscountRejection =
  | { type: 'notFound' }
  | { type: 'inactive' }
  | { type: 'expired' }
  /** Se alcanzó el máximo de usos. */
  | { type: 'exhausted' }
  /** No hay productos del tipo al que aplica (ej. solo cuadernos a medida). */
  | { type: 'notApplicable'; appliesTo: DiscountCode['appliesTo'] }
  /** Falta llegar al mínimo: `missing` es cuánto falta. */
  | { type: 'belowMinimum'; minSubtotal: number; missing: number };

export type DiscountResult =
  | { status: 'applied'; discount: DiscountCode; amount: number }
  | { status: 'rejected'; reason: DiscountRejection };

/** Forma canónica de un código: sin espacios y en mayúsculas. */
export function normalizeDiscountCode(code: string) {
  return code.replace(/\s+/g, '').toUpperCase();
}

function eligibleSubtotal(discount: DiscountCode, cart: CartSummary) {
  if (discount.appliesTo === 'all') return cart.subtotal;
  return cart.subtotalByKind[discount.appliesTo];
}

/**
 * Evalúa un código contra el carrito actual. Se vuelve a evaluar con cada
 * cambio del carrito: si deja de cumplir (ej. baja del mínimo), deja de
 * aplicar y se explica por qué. Nunca descuenta más que lo alcanzado y
 * redondea a pesos enteros.
 */
export function evaluateDiscount(
  discount: DiscountCode | null,
  cart: CartSummary,
  now: Date,
): DiscountResult {
  if (!discount) return { status: 'rejected', reason: { type: 'notFound' } };
  if (!discount.active) return { status: 'rejected', reason: { type: 'inactive' } };
  if (discount.expiresAt !== null && now.getTime() > new Date(discount.expiresAt).getTime()) {
    return { status: 'rejected', reason: { type: 'expired' } };
  }
  if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
    return { status: 'rejected', reason: { type: 'exhausted' } };
  }

  const base = eligibleSubtotal(discount, cart);
  if (base <= 0) {
    return { status: 'rejected', reason: { type: 'notApplicable', appliesTo: discount.appliesTo } };
  }
  if (base < discount.minSubtotal) {
    return {
      status: 'rejected',
      reason: {
        type: 'belowMinimum',
        minSubtotal: discount.minSubtotal,
        missing: discount.minSubtotal - base,
      },
    };
  }

  const raw =
    discount.type === 'percentage'
      ? Math.round((base * Math.min(100, Math.max(0, discount.value))) / 100)
      : Math.max(0, discount.value);
  return { status: 'applied', discount, amount: Math.min(raw, base) };
}
