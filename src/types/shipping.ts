/** Rango de códigos postales (4 dígitos, inclusive en ambos extremos). */
export interface PostalCodeRange {
  from: number;
  to: number;
}

/** Zona de envío: qué códigos postales cubre, cuánto cuesta y cuánto tarda. */
export interface ShippingZone {
  id: string;
  name: string;
  postalCodes: PostalCodeRange[];
  /** Precio en pesos, entero. */
  price: number;
  /** Desde este subtotal (ya con descuento) el envío es gratis. `null` = nunca. */
  freeFrom: number | null;
  /** Días hábiles que tarda el envío una vez despachado. */
  days: { min: number; max: number };
}

/** Lugar donde se puede retirar sin cargo. */
export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  schedule: string;
}

/** Todo lo que el checkout necesita para cotizar la entrega (lo edita el admin). */
export interface ShippingConfig {
  zones: ShippingZone[];
  pickupPoints: PickupPoint[];
  /** Días hábiles para despachar un cuaderno que ya está hecho. */
  dispatchDays: number;
}

export type DeliveryMethod = 'shipping' | 'pickup';
