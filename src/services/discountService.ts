import { discountsMock } from '../data/mock/discounts';
import { normalizeDiscountCode } from '../domain/cart/discounts';
import type { DiscountCode } from '../types/discount';
import { simulateRequest } from './mockNetwork';

/**
 * Busca un código de descuento. Nunca se expone la lista completa (con un
 * backend real, la validación vive en el servidor): se pregunta por uno.
 * Devuelve `null` si no existe. Si aplica o no al carrito lo decide
 * `evaluateDiscount`.
 */
export function findDiscountCode(code: string): Promise<DiscountCode | null> {
  const wanted = normalizeDiscountCode(code);
  const found = discountsMock.find((discount) => normalizeDiscountCode(discount.code) === wanted);
  return simulateRequest(found ?? null);
}
