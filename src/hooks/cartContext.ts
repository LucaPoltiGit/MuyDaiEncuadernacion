import { createContext } from 'react';
import type { CartItem, NewCartItem } from '../types/cart';

export interface CartContextValue {
  items: CartItem[];
  /** Cantidad total de cuadernos (sumando cantidades). */
  count: number;
  addItem: (item: NewCartItem) => void;
  /** Cambia la cantidad de un renglón (mínimo 1; para sacarlo, `removeItem`). */
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  /** Código de descuento aplicado (se revalida contra el carrito en cada cambio). */
  discountCode: string | null;
  setDiscountCode: (code: string | null) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);
