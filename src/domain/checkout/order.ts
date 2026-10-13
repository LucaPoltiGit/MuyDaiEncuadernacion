import type { CheckoutForm } from './form';
import type { CartSummary } from '../cart/pricing';
import { getProductionDays } from '../notebook/production';
import {
  estimateDelivery,
  findShippingZone,
  normalizePostalCode,
  quotePickup,
  quoteShipping,
} from '../shipping';
import type { ShippingQuote } from '../shipping';
import type { ConfiguratorData } from '../../types/notebook';
import type { NewOrder, OrderDelivery } from '../../types/order';
import type { ShippingConfig } from '../../types/shipping';

export interface CheckoutTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

/** Subtotal − descuento + envío. El envío no se descuenta. */
export function checkoutTotals(
  subtotal: number,
  discount: number,
  quote: ShippingQuote | null,
): CheckoutTotals {
  const shipping = quote?.price ?? 0;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

/**
 * Cotización de la entrega según lo que eligió la persona, o `null` si
 * todavía falta un dato (CP inválido, sin cobertura, sin punto de retiro).
 */
export function quoteFromForm(
  form: Pick<CheckoutForm, 'method' | 'postalCode' | 'pickupPointId'>,
  shipping: ShippingConfig,
  subtotalAfterDiscount: number,
): ShippingQuote | null {
  if (form.method === 'pickup') {
    const point = shipping.pickupPoints.find((candidate) => candidate.id === form.pickupPointId);
    return point ? quotePickup(point) : null;
  }
  const postalCode = normalizePostalCode(form.postalCode);
  const zone = postalCode === null ? null : findShippingZone(postalCode, shipping.zones);
  return zone ? quoteShipping(zone, subtotalAfterDiscount) : null;
}

/** Días hábiles de producción de cada cuaderno (los de la tienda ya están hechos). */
export function productionDaysOf(cart: CartSummary, configurator: ConfiguratorData) {
  return cart.lines
    .filter((line) => line.item.kind === 'custom')
    .map((line) => getProductionDays(line.configuration, configurator));
}

interface BuildOrderInput {
  form: CheckoutForm;
  cart: CartSummary;
  discount: { id: string; code: string; amount: number } | null;
  quote: ShippingQuote;
  shipping: ShippingConfig;
  configurator: ConfiguratorData;
  userId: string | null;
}

/**
 * Arma el pedido a partir del carrito y el formulario ya validados. Guarda
 * una foto de cada cuaderno y de los precios: el pedido no cambia aunque
 * después cambie la tienda.
 */
export function buildNewOrder({
  form,
  cart,
  discount,
  quote,
  shipping,
  configurator,
  userId,
}: BuildOrderInput): NewOrder {
  if (cart.hasProblems || cart.lines.length === 0) {
    throw new Error('El carrito tiene que estar listo para comprar (ver summarizeCart).');
  }
  const totals = checkoutTotals(cart.subtotal, discount?.amount ?? 0, quote);
  const delivery: OrderDelivery =
    quote.method === 'pickup'
      ? { method: 'pickup', pointId: quote.point.id, pointName: quote.point.name, price: 0 }
      : {
          method: 'shipping',
          zoneId: quote.zone.id,
          zoneName: quote.zone.name,
          price: quote.price,
          address: {
            street: form.street.trim(),
            apartment: form.apartment.trim(),
            city: form.city.trim(),
            province: form.province.trim(),
            postalCode: form.postalCode.trim().toUpperCase(),
          },
        };

  return {
    userId,
    customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
    lines: cart.lines.map((line) => ({
      kind: line.item.kind,
      productId: line.product?.id ?? null,
      productName: line.product?.name ?? null,
      configuration: line.configuration,
      price: line.price,
    })),
    subtotal: totals.subtotal,
    discount: discount && discount.amount > 0 ? discount : null,
    delivery,
    total: totals.total,
    estimatedDays: estimateDelivery(productionDaysOf(cart, configurator), shipping, quote),
  };
}
