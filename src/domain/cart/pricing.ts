import type { CartItem } from '../../types/cart';
import type { Product } from '../../types/catalog';
import type { ConfiguratorData, NotebookConfiguration } from '../../types/notebook';
import { calculatePrice } from '../notebook/pricing';
import { configurationKey, isValidConfiguration } from '../notebook/restrictions';

/** Algo que impide comprar un renglón tal cual está (el texto lo arma la UI). */
export type CartLineProblem =
  /** El producto ya no está en el catálogo. */
  | { type: 'productRemoved' }
  /** Era una pieza única y ya se vendió. */
  | { type: 'sold' }
  /** Un cuaderno a medida usa opciones que se agotaron o cambiaron. */
  | { type: 'invalidConfiguration' }
  /** El mismo cuaderno ya está en otro renglón (cada uno es único). */
  | { type: 'duplicate' };

export interface CartLine {
  item: CartItem;
  /**
   * Lo que se va a hacer o enviar: en productos de catálogo, la configuración
   * vigente del producto (el admin puede haberla cambiado); en los a medida,
   * la del ítem.
   */
  configuration: NotebookConfiguration;
  /** Precio vigente. */
  price: number;
  /** Producto de catálogo de origen (si es de catálogo y sigue existiendo). */
  product?: Product;
  problem: CartLineProblem | null;
  /** El precio cambió desde que se agregó (solo informativo). */
  priceChanged: boolean;
}

export interface CartSummary {
  lines: CartLine[];
  /** Suma de los renglones comprables. */
  subtotal: number;
  /** Subtotales por tipo, para los descuentos que aplican solo a una parte. */
  subtotalByKind: { custom: number; product: number };
  /** Hay renglones con problemas: no se puede pasar al checkout. */
  hasProblems: boolean;
}

export interface CartPricingContext {
  configurator: ConfiguratorData;
  products: Product[];
}

/** Si el precio de referencia falta o es 0, no hay "antes" que mostrar. */
function hasPriceChanged(current: number, atAdd: number) {
  return atAdd > 0 && current !== atAdd;
}

/**
 * Qué identifica a un cuaderno como "el mismo": el producto (pieza única)
 * o, si es a medida, su diseño. Lo usa el carrito para no repetirlos.
 */
export function cartItemIdentity(
  item: Pick<CartItem, 'kind' | 'configuration'> & { productId?: string },
) {
  return item.kind === 'product'
    ? `product:${item.productId}`
    : `custom:${configurationKey(item.configuration)}`;
}

function priceLine(item: CartItem, { configurator, products }: CartPricingContext): CartLine {
  if (item.kind === 'product') {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) {
      return {
        item,
        configuration: item.configuration,
        price: item.priceAtAdd,
        problem: { type: 'productRemoved' },
        priceChanged: false,
      };
    }
    return {
      item,
      product,
      configuration: product.configuration,
      price: product.price,
      problem: product.available ? null : { type: 'sold' },
      priceChanged: hasPriceChanged(product.price, item.priceAtAdd),
    };
  }

  const price = calculatePrice(item.configuration, configurator).total;
  return {
    item,
    configuration: item.configuration,
    price,
    problem: isValidConfiguration(configurator, item.configuration)
      ? null
      : { type: 'invalidConfiguration' },
    priceChanged: hasPriceChanged(price, item.priceAtAdd),
  };
}

/**
 * Precio del carrito con las reglas y la disponibilidad vigentes (nunca con
 * el precio guardado al agregar). Los renglones con problemas no suman al
 * subtotal y bloquean el checkout hasta que se corrijan o se quiten.
 */
export function summarizeCart(items: CartItem[], context: CartPricingContext): CartSummary {
  const seen = new Set<string>();
  const lines = items.map((item) => {
    const line = priceLine(item, context);
    // Un carrito viejo (o editado a mano) podría repetir un cuaderno único.
    const identity = cartItemIdentity(item);
    if (seen.has(identity) && !line.problem)
      return { ...line, problem: { type: 'duplicate' } as const };
    seen.add(identity);
    return line;
  });
  const subtotalByKind = { custom: 0, product: 0 };
  for (const line of lines) {
    if (!line.problem) subtotalByKind[line.item.kind] += line.price;
  }
  return {
    lines,
    subtotal: subtotalByKind.custom + subtotalByKind.product,
    subtotalByKind,
    hasProblems: lines.some((line) => line.problem !== null),
  };
}
