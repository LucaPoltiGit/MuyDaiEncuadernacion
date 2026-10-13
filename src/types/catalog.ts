import type { NotebookConfiguration } from './notebook';

export interface ProductCategory {
  id: string;
  name: string;
}

/**
 * Cuaderno de catálogo: una configuración ya armada, con precio y stock
 * propios (son cuadernos hechos, listos para enviar). El admin los edita.
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
  /** Precio unitario en pesos, entero. */
  price: number;
  /** Unidades hechas y disponibles. 0 = sin stock. */
  stock: number;
}

export interface CatalogData {
  categories: ProductCategory[];
  products: Product[];
}
