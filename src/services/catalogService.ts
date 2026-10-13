import { catalogMock } from '../data/mock/catalog';
import type { CatalogData } from '../types/catalog';
import { simulateRequest } from './mockNetwork';

/**
 * Cuadernos de catálogo (hechos, con stock) y sus categorías.
 * Hoy lee el mock; con API real solo cambia este archivo.
 */
export function getCatalog(): Promise<CatalogData> {
  return simulateRequest(catalogMock);
}
