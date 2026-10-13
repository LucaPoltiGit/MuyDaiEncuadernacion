import { discountsMock } from '../data/mock/discounts';
import { normalizeDiscountCode } from '../domain/cart/discounts';
import type { DiscountCode } from '../types/discount';
import { readDb } from './mockDb';
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
  if (!found) return simulateRequest(null);
  // Los usos de pedidos pagados se suman a los que trae el código.
  const uses = readDb().discountUses[found.id] ?? 0;
  return simulateRequest({ ...found, usedCount: found.usedCount + uses });
}
