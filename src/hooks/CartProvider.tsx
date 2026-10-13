import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createId } from '../domain/id';
import { cartItemIdentity } from '../domain/cart/pricing';
import {
  loadCartItems,
  loadDiscountCode,
  saveCartItems,
  saveDiscountCode,
} from '../services/cartService';
import type { CartItem, NewCartItem } from '../types/cart';
import { CartContext } from './cartContext';

/** Estado global del carrito, guardado en el navegador vía `cartService`. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartItems);
  const [discountCode, setDiscountCode] = useState<string | null>(loadDiscountCode);

  useEffect(() => {
    saveCartItems(items);
  }, [items]);

  useEffect(() => {
    saveDiscountCode(discountCode);
  }, [discountCode]);

  // Cada cuaderno es único: si ya está en el carrito, no se repite.
  const contains = useCallback(
    (item: NewCartItem) => {
      const identity = cartItemIdentity(item);
      return items.some((candidate) => cartItemIdentity(candidate) === identity);
    },
    [items],
  );

  const addItem = useCallback(
    (item: NewCartItem) => {
      if (contains(item)) return false;
      setItems((current) => [
        ...current,
        { ...item, id: createId(), addedAt: new Date().toISOString() } as CartItem,
      ]);
      return true;
    },
    [contains],
  );

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setDiscountCode(null);
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      contains,
      addItem,
      removeItem,
      clear,
      discountCode,
      setDiscountCode,
    }),
    [items, contains, addItem, removeItem, clear, discountCode],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
