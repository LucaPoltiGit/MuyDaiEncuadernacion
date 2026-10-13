import { isNotebookConfiguration } from '../domain/notebook/guards';
import type { CartItem } from '../types/cart';

/**
 * Persistencia del carrito. Hoy vive en el navegador (localStorage); si
 * después se guarda en el backend, solo cambia este archivo. La clave lleva
 * versión: si cambia la forma de los datos, se sube y el carrito viejo se ignora.
 */
const STORAGE_KEY = 'muydai:cart:v2';

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    (item.kind === 'custom' || (item.kind === 'product' && typeof item.productId === 'string')) &&
    typeof item.priceAtAdd === 'number' &&
    isNotebookConfiguration(item.configuration)
  );
}

export function loadCartItems(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    // Navegación privada o datos corruptos: arrancamos con el carrito vacío.
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Si no se puede guardar, el carrito sigue funcionando en memoria.
  }
}

const DISCOUNT_KEY = 'muydai:cart-discount:v1';

/** Código de descuento aplicado al carrito (solo el texto: se revalida siempre). */
export function loadDiscountCode(): string | null {
  try {
    const raw = window.localStorage.getItem(DISCOUNT_KEY);
    return raw && raw.trim() ? raw : null;
  } catch {
    return null;
  }
}

export function saveDiscountCode(code: string | null) {
  try {
    if (code) window.localStorage.setItem(DISCOUNT_KEY, code);
    else window.localStorage.removeItem(DISCOUNT_KEY);
  } catch {
    // Sin almacenamiento, el código vale solo mientras dure la visita.
  }
}
