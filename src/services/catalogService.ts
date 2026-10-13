import { RESERVATION_MINUTES } from '../constants/shop';
import { catalogMock } from '../data/mock/catalog';
import { blockedProductIds } from '../domain/checkout/orderRules';
import type { CatalogData } from '../types/catalog';
import { readDb } from './mockDb';
import { simulateRequest } from './mockNetwork';

/**
 * Cuadernos de la tienda (piezas únicas) y sus categorías. Los vendidos, o
 * reservados mientras alguien los paga, quedan como no disponibles. Hoy lee
 * el mock; con API real solo cambia este archivo.
 */
export function getCatalog(): Promise<CatalogData> {
  const db = readDb();
  const blocked = blockedProductIds(db.orders, db.soldProductIds, new Date(), RESERVATION_MINUTES);
  return simulateRequest({
    ...catalogMock,
    products: catalogMock.products.map((product) =>
      blocked.has(product.id) ? { ...product, available: false } : product,
    ),
  });
}
