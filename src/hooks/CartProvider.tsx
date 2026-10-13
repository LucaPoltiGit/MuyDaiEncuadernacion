import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createId } from '../domain/id';
import { configurationKey } from '../domain/notebook/restrictions';
import {
  loadCartItems,
  loadDiscountCode,
  saveCartItems,
  saveDiscountCode,
} from '../services/cartService';
import type { CartItem, NewCartItem } from '../types/cart';
import { CartContext } from './cartContext';

/** Un producto de catálogo va en un solo renglón; los a medida, uno por diseño. */
function sameItem(a: CartItem | NewCartItem, b: CartItem | NewCartItem) {
  if (a.kind === 'product' || b.kind === 'product') {
    return a.kind === 'product' && b.kind === 'product' && a.productId === b.productId;
  }
  return configurationKey(a.configuration) === configurationKey(b.configuration);
}

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
        { ...item, id: createId(), addedAt: new Date().toISOString() } as CartItem,
      ];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const safe = Math.max(1, Math.floor(quantity));
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: safe } : item)),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      discountCode,
      setDiscountCode,
    }),
    [items, addItem, updateQuantity, removeItem, discountCode],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
