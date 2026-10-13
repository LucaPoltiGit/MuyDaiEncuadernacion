import type { NotebookConfiguration } from './notebook';

/**
 * Estado del pedido a lo largo de su vida. El admin lo avanza (Parte 7);
 * el pago lo pasa de `pendingPayment` a `paid`.
 */
export type OrderStatus =
  | 'pendingPayment'
  | 'paid'
  | 'inProduction'
  | 'shipped'
  | 'readyForPickup'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

/** Foto de un cuaderno al momento de comprar: no cambia si después cambia la tienda. */
export interface OrderLine {
  kind: 'custom' | 'product';
  productId: string | null;
  /** Nombre del producto de la tienda; `null` en los cuadernos a medida. */
  productName: string | null;
  configuration: NotebookConfiguration;
  price: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  /** Para coordinar por WhatsApp. */
  phone: string;
}

export interface ShippingAddress {
  street: string;
  /** Piso, depto, etc. Opcional. */
  apartment: string;
  city: string;
  province: string;
  postalCode: string;
}

export type OrderDelivery =
  | {
      method: 'shipping';
      zoneId: string;
      zoneName: string;
      address: ShippingAddress;
      price: number;
    }
  | { method: 'pickup'; pointId: string; pointName: string; price: 0 };

export interface OrderPayment {
  provider: 'mercadopago';
  status: PaymentStatus;
  /** Id de la "preferencia" de pago (lo que se le pide a Mercado Pago). */
  preferenceId: string | null;
  /**
   * Se cobró pero el pedido no puede seguir (ej. la pieza se vendió por otro
   * lado tras vencer la reserva): hay que devolver el dinero.
   */
  refundRequired?: boolean;
}

export interface Order {
  id: string;
  /** Número legible para hablar del pedido: "MD-0001". */
  number: string;
  createdAt: string;
  /** Si compró con sesión iniciada (Parte 6). */
  userId: string | null;
  customer: CustomerInfo;
  lines: OrderLine[];
  subtotal: number;
  /** Código aplicado (el id sirve para contar sus usos). */
  discount: { id: string; code: string; amount: number } | null;
  delivery: OrderDelivery;
  total: number;
  /** Días hábiles estimados hasta la entrega (o hasta poder retirar). */
  estimatedDays: { min: number; max: number };
  status: OrderStatus;
  payment: OrderPayment;
}

/**
 * Lo que arma el checkout. El id, número, fecha, estados y a quién pertenece
 * (sale de la sesión) los pone el service.
 */
export type NewOrder = Omit<Order, 'id' | 'number' | 'createdAt' | 'status' | 'payment' | 'userId'>;
