import type { NotebookConfiguration } from './notebook';

/**
 * Cada cuaderno es único: un renglón del carrito es siempre un cuaderno
 * (no hay cantidades).
 */
interface CartItemBase {
  id: string;
  /** Todo cuaderno es una configuración (los de catálogo, una ya armada). */
  configuration: NotebookConfiguration;
  /**
   * Precio cuando se agregó: solo referencia. El carrito y el
   * checkout recalculan con `calculatePrice` y las reglas vigentes.
   */
  priceAtAdd: number;
  addedAt: string;
}

/** Armado por la persona en el configurador. */
export interface CustomCartItem extends CartItemBase {
  kind: 'custom';
}

/** Producto de catálogo (Parte 4): misma forma, más el producto de origen. */
export interface ProductCartItem extends CartItemBase {
  kind: 'product';
  productId: string;
}

export type CartItem = CustomCartItem | ProductCartItem;

/** Lo que se pasa para agregar: el id y la fecha los pone el carrito. */
export type NewCartItem =
  Omit<CustomCartItem, 'id' | 'addedAt'> | Omit<ProductCartItem, 'id' | 'addedAt'>;
