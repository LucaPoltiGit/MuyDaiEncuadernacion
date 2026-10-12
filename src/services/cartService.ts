import type { CartItem } from '../types/cart';

/**
 * Persistencia del carrito. Hoy vive en el navegador (localStorage); si
 * después se guarda en el backend, solo cambia este archivo. La clave lleva
 * versión: si cambia la forma de los datos, se sube y el carrito viejo se ignora.
 */
const STORAGE_KEY = 'muydai:cart:v1';

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  const configuration = item.configuration as Record<string, unknown> | undefined;
  return (
    typeof item.id === 'string' &&
    (item.kind === 'custom' || (item.kind === 'product' && typeof item.productId === 'string')) &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    typeof item.priceAtAdd === 'number' &&
    typeof configuration === 'object' &&
    configuration !== null &&
    typeof configuration.sizeId === 'string' &&
    typeof configuration.sheets === 'number' &&
    typeof configuration.coverText === 'string'
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
