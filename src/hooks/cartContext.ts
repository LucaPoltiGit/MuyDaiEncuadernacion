import { createContext } from 'react';
import type { CartItem, NewCartItem } from '../types/cart';

export interface CartContextValue {
  items: CartItem[];
  /** Cantidad total de cuadernos (sumando cantidades). */
  count: number;
  addItem: (item: NewCartItem) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);
