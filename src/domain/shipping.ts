import type { PickupPoint, ShippingConfig, ShippingZone } from '../types/shipping';

/**
 * Código postal argentino normalizado a sus 4 dígitos. Acepta el formato
 * viejo ("1414") y el CPA ("C1414ABC", con o sin espacios). `null` si no es
 * un código válido.
 */
export function normalizePostalCode(input: string): number | null {
  const compact = input.replace(/\s+/g, '').toUpperCase();
  const match = /^(?:[A-Z])?(\d{4})(?:[A-Z]{3})?$/.exec(compact);
  if (!match) return null;
  const code = Number(match[1]);
  return code >= 1000 ? code : null;
}

/** Zona que cubre ese código postal, o `null` si no llegamos. */
export function findShippingZone(postalCode: number, zones: ShippingZone[]) {
  return (
    zones.find((zone) =>
      zone.postalCodes.some((range) => postalCode >= range.from && postalCode <= range.to),
    ) ?? null
  );
}

export type ShippingQuote =
  | {
      method: 'shipping';
      zone: ShippingZone;
      price: number;
      /** Era pago pero el subtotal llegó al mínimo de envío gratis. */
      free: boolean;
      /** Cuánto falta para el envío gratis (si la zona lo tiene y no se llegó). */
      missingForFree: number | null;
    }
  | { method: 'pickup'; point: PickupPoint; price: 0 };

/**
 * Cotiza un envío a domicilio. `subtotal` es lo que se paga por los
 * cuadernos, ya con descuento: el envío gratis se mide sobre eso.
 */
export function quoteShipping(zone: ShippingZone, subtotal: number): ShippingQuote {
  const free = zone.freeFrom !== null && subtotal >= zone.freeFrom;
  return {
    method: 'shipping',
    zone,
    price: free ? 0 : zone.price,
    free,
    missingForFree: zone.freeFrom !== null && !free ? zone.freeFrom - subtotal : null,
  };
}

export function quotePickup(point: PickupPoint): ShippingQuote {
  return { method: 'pickup', point, price: 0 };
}

/**
 * Cuándo puede estar listo un pedido, en días hábiles. Lo más lento manda:
 * cada cuaderno a medida tiene su plazo de producción; los ya hechos solo
 * necesitan despacharse. Con envío se suma lo que tarda el correo.
 */
export function estimateDelivery(
  productionDaysPerItem: number[],
  config: Pick<ShippingConfig, 'dispatchDays'>,
  quote: ShippingQuote | null,
) {
  const ready = Math.max(config.dispatchDays, ...productionDaysPerItem);
  if (!quote || quote.method === 'pickup') return { min: ready, max: ready };
  return { min: ready + quote.zone.days.min, max: ready + quote.zone.days.max };
}
