import type { NotebookConfiguration } from './notebook';

export interface ProductCategory {
  id: string;
  name: string;
}

/**
 * Cuaderno de catálogo: una pieza única ya hecha, lista para enviar (no hay
 * dos iguales). Una configuración armada con precio propio. El admin los edita.
 */
export interface Product {
  id: string;
  /** Parte de la URL: /tienda/<slug>. Única. */
  slug: string;
  name: string;
  /** Una línea para la tarjeta del catálogo. */
  tagline: string;
  description: string;
  categoryId: string;
  configuration: NotebookConfiguration;
  /** Precio en pesos, entero. */
  price: number;
  /** `false` cuando ya se vendió (queda visible como "Vendido"). */
  available: boolean;
}

export interface CatalogData {
  categories: ProductCategory[];
  products: Product[];
}
