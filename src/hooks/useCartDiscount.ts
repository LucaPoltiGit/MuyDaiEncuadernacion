import { useEffect, useState } from 'react';
import { evaluateDiscount, normalizeDiscountCode } from '../domain/cart/discounts';
import type { DiscountResult } from '../domain/cart/discounts';
import type { CartSummary } from '../domain/cart/pricing';
import { findDiscountCode } from '../services/discountService';
import type { DiscountCode } from '../types/discount';
import { useCart } from './useCart';

type Lookup = { code: string } & (
  | { failed: false; discount: DiscountCode | null }
  /** No se pudo consultar (red): no es lo mismo que "no existe". */
  | { failed: true }
);

export type CartDiscountState =
  | { status: 'none' }
  /** Buscando el código guardado (al volver al carrito). */
  | { status: 'loading'; code: string }
  /** No se pudo revisar el código guardado; se puede reintentar. */
  | { status: 'error'; code: string }
  | ({ code: string } & DiscountResult);

/**
 * Código de descuento del carrito. Al aplicar uno, se busca en el service y
 * se evalúa contra el carrito: si no aplica, no se guarda y se devuelve el
 * motivo. Uno guardado se reevalúa con cada cambio del carrito (si baja del
 * mínimo, deja de aplicar y vuelve solo al cumplirse).
 */
export function useCartDiscount(cart: CartSummary) {
  const { discountCode, setDiscountCode } = useCart();
  const [lookup, setLookup] = useState<Lookup | null>(null);

  useEffect(() => {
    if (!discountCode || lookup?.code === discountCode) return;
    let active = true;
    findDiscountCode(discountCode)
      .then((discount) => active && setLookup({ code: discountCode, failed: false, discount }))
      .catch(() => active && setLookup({ code: discountCode, failed: true }));
    return () => {
      active = false;
    };
  }, [discountCode, lookup?.code]);

  async function apply(rawCode: string): Promise<DiscountResult> {
    const code = normalizeDiscountCode(rawCode);
    const discount = await findDiscountCode(code);
    const result = evaluateDiscount(discount, cart, new Date());
    if (result.status === 'applied') {
      setLookup({ code, failed: false, discount });
      setDiscountCode(code);
    }
    return result;
  }

  function remove() {
    setDiscountCode(null);
  }

  /** Vuelve a consultar el código guardado (después de un error de red). */
  function retry() {
    setLookup(null);
  }

  let state: CartDiscountState = { status: 'none' };
  if (discountCode) {
    if (lookup?.code !== discountCode) state = { status: 'loading', code: discountCode };
    else if (lookup.failed) state = { status: 'error', code: discountCode };
    else state = { code: discountCode, ...evaluateDiscount(lookup.discount, cart, new Date()) };
  }

  return { state, apply, remove, retry };
}
