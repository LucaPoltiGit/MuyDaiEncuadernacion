import { useContext } from 'react';
import { CartContext } from './cartContext';

/** Carrito global. Requiere `<CartProvider>` (está en `App`). */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart tiene que usarse dentro de <CartProvider>');
  return context;
}
