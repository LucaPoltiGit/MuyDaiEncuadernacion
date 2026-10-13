import { catalogMock } from '../data/mock/catalog';
import { configuratorMock } from '../data/mock/configurator';
import { discountsMock } from '../data/mock/discounts';
import { shippingMock } from '../data/mock/shipping';
import { testimonialsMock } from '../data/mock/testimonials';
import { usersMock } from '../data/mock/users';
import type { StoredUser } from '../data/mock/users';
import type { CatalogData } from '../types/catalog';
import type { SavedDesign } from '../types/design';
import type { DiscountCode } from '../types/discount';
import type { ConfiguratorData } from '../types/notebook';
import type { Order } from '../types/order';
import type { ShippingConfig } from '../types/shipping';
import type { Testimonial } from '../types/testimonial';

/**
 * "Base de datos" simulada en el navegador: lo que en producción guardaría
 * el backend. Lo editable por el admin (configurador, tienda, códigos,
 * envíos, testimonios) arranca con los datos de `data/mock` y después vive
 * acá. Solo la usan los services; cuando haya API, este archivo desaparece.
 */
export interface MockDb {
  /** Versión de la forma de la base: si cambia, se migra al leer. */
  schemaVersion: number;
  users: StoredUser[];
  orders: Order[];
  designs: SavedDesign[];
  configurator: ConfiguratorData;
  catalog: CatalogData;
  discounts: DiscountCode[];
  shipping: ShippingConfig;
  testimonials: Testimonial[];
  /** Productos de la tienda vendidos (son piezas únicas). */
  soldProductIds: string[];
  lastOrderNumber: number;
}

const DB_KEY = 'muydai:mockdb:v1';

/**
 * Subirla cuando cambie la forma de los datos o las semillas de usuarios:
 * al leer una base vieja se completan las colecciones nuevas, se
 * re-siembran los usuarios de prueba y se conserva lo creado en el navegador.
 */
const SCHEMA_VERSION = 3;

/** Base inicial: todo lo del mock y nada más. */
function emptyDb(): MockDb {
  return {
    schemaVersion: SCHEMA_VERSION,
    users: structuredClone(usersMock),
    orders: [],
    designs: [],
    configurator: structuredClone(configuratorMock),
    catalog: structuredClone(catalogMock),
    discounts: structuredClone(discountsMock),
    shipping: structuredClone(shippingMock),
    testimonials: structuredClone(testimonialsMock),
    soldProductIds: [],
    lastOrderNumber: 0,
  };
}

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
