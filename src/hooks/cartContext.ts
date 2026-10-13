import { createContext } from 'react';
import type { CartItem, NewCartItem } from '../types/cart';

export interface CartContextValue {
  items: CartItem[];
  /** Cantidad de cuadernos (cada uno es único: uno por renglón). */
  count: number;
  /** Si ese cuaderno (producto o diseño) ya está en el carrito. */
  contains: (item: NewCartItem) => boolean;
  /** Agrega un cuaderno; devuelve `false` si ya estaba (no se repite). */
  addItem: (item: NewCartItem) => boolean;
  removeItem: (id: string) => void;
  /** Código de descuento aplicado (se revalida contra el carrito en cada cambio). */
  discountCode: string | null;
  setDiscountCode: (code: string | null) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);
