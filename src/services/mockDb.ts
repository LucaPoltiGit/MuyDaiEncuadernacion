import { usersMock } from '../data/mock/users';
import type { StoredUser } from '../data/mock/users';
import type { SavedDesign } from '../types/design';
import type { Order } from '../types/order';

/**
 * "Base de datos" simulada en el navegador: lo que en producción guardaría
 * el backend (usuarios, pedidos, diseños, piezas vendidas, usos de
 * códigos). Solo la usan los services; cuando haya API, este archivo
 * desaparece.
 */
export interface MockDb {
  /** Versión de la forma de la base: si cambia, se migra al leer. */
  schemaVersion: number;
  users: StoredUser[];
  orders: Order[];
  designs: SavedDesign[];
  /** Productos de la tienda vendidos (son piezas únicas). */
  soldProductIds: string[];
  /** Veces que se usó cada código de descuento, por id. */
  discountUses: Record<string, number>;
  lastOrderNumber: number;
}

const DB_KEY = 'muydai:mockdb:v1';

/**
 * Subirla cuando cambie la forma de los datos o las semillas del mock (ej.
 * nuevos usuarios de prueba): al leer una base vieja se re-siembra lo que
 * viene del mock y se conserva lo creado en el navegador.
 */
const SCHEMA_VERSION = 2;

/** Base inicial: los usuarios de prueba del mock y nada más. */
function emptyDb(): MockDb {
  return {
    schemaVersion: SCHEMA_VERSION,
    users: structuredClone(usersMock),
    orders: [],
    designs: [],
    soldProductIds: [],
    discountUses: {},
    lastOrderNumber: 0,
  };
}

/**
 * Completa las colecciones que falten y, si la versión es vieja, actualiza
 * las semillas: los usuarios del mock se reemplazan (mismo id) y los
 * registrados en el navegador se conservan.
 */
function migrate(stored: Partial<MockDb>): MockDb {
  const base = emptyDb();
  const merged: MockDb = { ...base, ...stored, schemaVersion: SCHEMA_VERSION };
  if (stored.schemaVersion === SCHEMA_VERSION) return merged;
  const seededIds = new Set(base.users.map((user) => user.id));
  const created = (stored.users ?? []).filter((user) => !seededIds.has(user.id));
  return { ...merged, users: [...base.users, ...created] };
}

export function readDb(): MockDb {
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (typeof parsed === 'object' && parsed !== null && Array.isArray((parsed as MockDb).orders)) {
      return migrate(parsed as Partial<MockDb>);
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
