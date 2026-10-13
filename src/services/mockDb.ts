import type { Order } from '../types/order';

/**
 * "Base de datos" simulada en el navegador: lo que en producción guardaría
 * el backend (pedidos, piezas vendidas, usos de códigos). Solo la usan los
 * services; cuando haya API, este archivo desaparece.
 */
export interface MockDb {
  orders: Order[];
  /** Productos de la tienda vendidos (son piezas únicas). */
  soldProductIds: string[];
  /** Veces que se usó cada código de descuento, por id. */
  discountUses: Record<string, number>;
  lastOrderNumber: number;
}

const DB_KEY = 'muydai:mockdb:v1';

function emptyDb(): MockDb {
  return { orders: [], soldProductIds: [], discountUses: {}, lastOrderNumber: 0 };
}

export function readDb(): MockDb {
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (typeof parsed === 'object' && parsed !== null && Array.isArray((parsed as MockDb).orders)) {
      return { ...emptyDb(), ...(parsed as MockDb) };
    }
  } catch {
    // Datos corruptos o almacenamiento bloqueado: se arranca de cero.
  }
  return emptyDb();
}

export function writeDb(db: MockDb) {
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // Sin almacenamiento, los datos duran lo que dure la pestaña.
  }
}

export function updateDb(change: (db: MockDb) => MockDb) {
  const next = change(readDb());
  writeDb(next);
  return next;
}
