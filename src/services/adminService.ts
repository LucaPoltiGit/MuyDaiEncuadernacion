import {
  validateConfiguratorData,
  validateDiscount,
  validateProduct,
  validateShippingConfig,
  validateTestimonial,
} from '../domain/admin/validation';
import { canTransition } from '../domain/checkout/orderRules';
import { createId } from '../domain/id';
import type { CatalogData, Product } from '../types/catalog';
import type { DiscountCode } from '../types/discount';
import type { ConfiguratorData } from '../types/notebook';
import type { Order, OrderStatus } from '../types/order';
import type { ShippingConfig } from '../types/shipping';
import type { Testimonial } from '../types/testimonial';
import { requireAdmin } from './authService';
import { readDb, updateDb } from './mockDb';
import { simulateRequest } from './mockNetwork';

/**
 * Todo lo que hace el panel. Cada función exige el rol admin y revalida los
 * datos (como haría el backend: la pantalla valida para ayudar, el servidor
 * para proteger). Con API real, solo cambia este archivo.
 */

/** Los datos no pasan la validación; `issues` trae los códigos. */
export class AdminValidationError extends Error {
  readonly issues: unknown;

  constructor(issues: unknown) {
    super('Los datos no son válidos.');
    this.issues = issues;
  }
}

/** Ese cambio de estado no está permitido (ej. reabrir un pedido cancelado). */
export class InvalidTransitionError extends Error {
  constructor() {
    super('Ese cambio de estado no está permitido.');
  }
}

/** Ejecuta un cambio como admin; si algo falla, el error llega como promesa rechazada. */
async function asAdmin<T>(run: () => T, delayMs?: number): Promise<T> {
  requireAdmin();
  return simulateRequest(run(), delayMs);
}

// ---- Pedidos ----

/** Todos los pedidos, del más nuevo al más viejo (sin los intentos abandonados). */
export function getAllOrders(): Promise<Order[]> {
  return asAdmin(() =>
    readDb()
      .orders.filter(
        (order) => !(order.status === 'cancelled' && order.payment.status !== 'approved'),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
}

/**
 * Cambia el estado de un pedido respetando las transiciones permitidas.
 * Cancelar un pedido pagado lo marca para devolver el dinero y vuelve a
 * poner a la venta sus piezas de la tienda.
 */
export function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  return asAdmin(() => {
    let updated: Order | undefined;
    updateDb((db) => {
      const order = db.orders.find((candidate) => candidate.id === orderId);
      if (!order || !canTransition(order.status, status)) throw new InvalidTransitionError();
      const paid = order.payment.status === 'approved';
      const cancellingPaid = status === 'cancelled' && paid;
      updated = {
        ...order,
        status,
        payment: cancellingPaid ? { ...order.payment, refundRequired: true } : order.payment,
      };
      const released = new Set(
        cancellingPaid
          ? order.lines.flatMap((line) => (line.productId ? [line.productId] : []))
          : [],
      );
      return {
        ...db,
        orders: db.orders.map((candidate) =>
          candidate.id === orderId ? (updated as Order) : candidate,
        ),
        soldProductIds: db.soldProductIds.filter((id) => !released.has(id)),
      };
    });
    return updated as Order;
  });
}

// ---- Tienda ----

export interface AdminCatalog {
  catalog: CatalogData;
  /** Piezas vendidas en pedidos pagados (no se ofrecen aunque estén "disponibles"). */
  soldProductIds: string[];
}

export function getAdminCatalog(): Promise<AdminCatalog> {
  return asAdmin(() => {
    const db = readDb();
    return { catalog: db.catalog, soldProductIds: db.soldProductIds };
  });
}

/**
 * Crea o actualiza un producto (si el id no existe, lo crea). El precio es
 * libre. Marcarlo disponible lo vuelve a poner a la venta aunque se haya
 * vendido (ej. hizo otro igual).
 */
export function saveProduct(product: Product): Promise<Product> {
  return asAdmin(() => {
    const db = readDb();
    const errors = validateProduct(product, db.catalog, db.configurator);
    if (Object.keys(errors).length > 0) throw new AdminValidationError(errors);
    const saved = { ...product, id: product.id || createId() };
    updateDb((current) => {
      const exists = current.catalog.products.some((candidate) => candidate.id === saved.id);
      return {
        ...current,
        catalog: {
          ...current.catalog,
          products: exists
            ? current.catalog.products.map((candidate) =>
                candidate.id === saved.id ? saved : candidate,
              )
            : [...current.catalog.products, saved],
        },
        soldProductIds: saved.available
          ? current.soldProductIds.filter((id) => id !== saved.id)
          : current.soldProductIds,
      };
    });
    return saved;
  });
}

export function deleteProduct(productId: string): Promise<void> {
  return asAdmin(() => {
    updateDb((db) => ({
      ...db,
      catalog: {
        ...db.catalog,
        products: db.catalog.products.filter((product) => product.id !== productId),
      },
    }));
  });
}

// ---- Configurador ----

/** Guarda opciones, precios, stock, máximos, personalización y plazos. */
export function saveConfigurator(data: ConfiguratorData): Promise<ConfiguratorData> {
  return asAdmin(() => {
    const issues = validateConfiguratorData(data);
    if (issues.length > 0) throw new AdminValidationError(issues);
    updateDb((db) => ({ ...db, configurator: data }));
    return data;
  });
}

// ---- Códigos de descuento ----

export function getAllDiscounts(): Promise<DiscountCode[]> {
  return asAdmin(() => readDb().discounts);
}

export function saveDiscount(discount: DiscountCode): Promise<DiscountCode> {
  return asAdmin(() => {
    const saved: DiscountCode = {
      ...discount,
      id: discount.id || createId(),
      code: discount.code.replace(/\s+/g, '').toUpperCase(),
    };
    const errors = validateDiscount(saved, readDb().discounts);
    if (Object.keys(errors).length > 0) throw new AdminValidationError(errors);
    updateDb((db) => {
      const exists = db.discounts.some((candidate) => candidate.id === saved.id);
      return {
        ...db,
        discounts: exists
          ? db.discounts.map((candidate) => (candidate.id === saved.id ? saved : candidate))
          : [...db.discounts, saved],
      };
    });
    return saved;
  });
}

export function deleteDiscount(discountId: string): Promise<void> {
  return asAdmin(() => {
    updateDb((db) => ({
      ...db,
      discounts: db.discounts.filter((discount) => discount.id !== discountId),
    }));
  });
}

// ---- Envíos ----

export function saveShippingConfig(config: ShippingConfig): Promise<ShippingConfig> {
  return asAdmin(() => {
    const issues = validateShippingConfig(config);
    if (issues.length > 0) throw new AdminValidationError(issues);
    updateDb((db) => ({ ...db, shipping: config }));
    return config;
  });
}

// ---- Testimonios ----

/** Todos los testimonios (también los ocultos), del más nuevo al más viejo. */
export function getAllTestimonials(): Promise<Testimonial[]> {
  return asAdmin(() =>
    [...readDb().testimonials].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
}

export function saveTestimonial(testimonial: Testimonial): Promise<Testimonial> {
  return asAdmin(() => {
    const errors = validateTestimonial(testimonial);
    if (Object.keys(errors).length > 0) throw new AdminValidationError(errors);
    const saved: Testimonial = {
      ...testimonial,
      id: testimonial.id || createId(),
      createdAt: testimonial.createdAt || new Date().toISOString(),
    };
    updateDb((db) => {
      const exists = db.testimonials.some((candidate) => candidate.id === saved.id);
      return {
        ...db,
        testimonials: exists
          ? db.testimonials.map((candidate) => (candidate.id === saved.id ? saved : candidate))
          : [...db.testimonials, saved],
      };
    });
    return saved;
  });
}

export function deleteTestimonial(testimonialId: string): Promise<void> {
  return asAdmin(() => {
    updateDb((db) => ({
      ...db,
      testimonials: db.testimonials.filter((testimonial) => testimonial.id !== testimonialId),
    }));
  });
}
