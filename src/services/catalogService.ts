import { RESERVATION_MINUTES } from '../constants/shop';
import { blockedProductIds } from '../domain/checkout/orderRules';
import type { CatalogData } from '../types/catalog';
import { readDb } from './mockDb';
import { simulateRequest } from './mockNetwork';

/**
 * Cuadernos de la tienda (piezas únicas) y sus categorías, como los dejó el
 * admin. Los vendidos, o reservados mientras alguien los paga, quedan como
 * no disponibles. Con API real solo cambia este archivo.
 */
export function getCatalog(): Promise<CatalogData> {
  const db = readDb();
  const blocked = blockedProductIds(db.orders, db.soldProductIds, new Date(), RESERVATION_MINUTES);
  return simulateRequest({
    ...db.catalog,
    products: db.catalog.products.map((product) =>
      blocked.has(product.id) ? { ...product, available: false } : product,
    ),
  });
}
