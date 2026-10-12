import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { configurationKey } from '../domain/notebook/restrictions';
import { loadCartItems, saveCartItems } from '../services/cartService';
import type { CartItem, NewCartItem } from '../types/cart';
import { CartContext } from './cartContext';

function sameItem(a: CartItem | NewCartItem, b: CartItem | NewCartItem) {
  const sameProduct =
    a.kind === b.kind &&
    (a.kind !== 'product' || (b.kind === 'product' && a.productId === b.productId));
  return sameProduct && configurationKey(a.configuration) === configurationKey(b.configuration);
}

/** Estado global del carrito. La página del carrito (Parte 4) suma editar y quitar. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartItems);

  useEffect(() => {
    saveCartItems(items);
  }, [items]);

  // Si ya hay un cuaderno idéntico, suma cantidad en vez de crear otro renglón.
  const addItem = useCallback((item: NewCartItem) => {
    setItems((current) => {
      const existing = current.find((candidate) => sameItem(candidate, item));
      if (existing) {
        return current.map((candidate) =>
          candidate === existing
            ? { ...candidate, quantity: candidate.quantity + item.quantity }
            : candidate,
        );
      }
      return [
        ...current,
        { ...item, id: crypto.randomUUID(), addedAt: new Date().toISOString() } as CartItem,
      ];
    });
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem,
    }),
    [items, addItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
