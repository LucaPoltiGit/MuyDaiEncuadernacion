import type { CartItem } from '../../types/cart';
import type { Product } from '../../types/catalog';
import type { ConfiguratorData, NotebookConfiguration } from '../../types/notebook';
import { calculatePrice } from '../notebook/pricing';
import { isValidConfiguration } from '../notebook/restrictions';

/** Algo que impide comprar un renglón tal cual está (el texto lo arma la UI). */
export type CartLineProblem =
  /** El producto ya no está en el catálogo. */
  | { type: 'productRemoved' }
  | { type: 'outOfStock' }
  /** Se pidieron más unidades de las que hay (o de las que el taller hace por pedido). */
  | { type: 'tooMany'; max: number }
  /** Un cuaderno a medida usa opciones que se agotaron o cambiaron. */
  | { type: 'invalidConfiguration' };

export interface CartLine {
  item: CartItem;
  /**
   * Lo que se va a hacer o enviar: en productos de catálogo, la configuración
   * vigente del producto (el admin puede haberla cambiado); en los a medida,
   * la del ítem.
   */
  configuration: NotebookConfiguration;
  /** Precio unitario vigente. */
  unitPrice: number;
  subtotal: number;
  /** Máximo de unidades que se pueden pedir de este renglón. */
  maxQuantity: number;
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

function priceLine(
  item: CartItem,
  { configurator, products }: CartPricingContext,
  /** Unidades de este mismo producto en otros renglones (el stock es por producto). */
  otherUnits: number,
): CartLine {
  if (item.kind === 'product') {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) {
      return {
        item,
        configuration: item.configuration,
        unitPrice: item.priceAtAdd,
        subtotal: 0,
        maxQuantity: 0,
        problem: { type: 'productRemoved' },
        priceChanged: false,
      };
    }
    const max = Math.max(0, product.stock - otherUnits);
    const problem: CartLineProblem | null =
      product.stock <= 0
        ? { type: 'outOfStock' }
        : item.quantity > max
          ? { type: 'tooMany', max }
          : null;
    return {
      item,
      product,
      configuration: product.configuration,
      unitPrice: product.price,
      subtotal: product.price * item.quantity,
      maxQuantity: max,
      problem,
      priceChanged: hasPriceChanged(product.price, item.priceAtAdd),
    };
  }

  const unitPrice = calculatePrice(item.configuration, configurator).total;
  const max = configurator.production.maxUnitsPerDesign;
  const problem: CartLineProblem | null = !isValidConfiguration(configurator, item.configuration)
    ? { type: 'invalidConfiguration' }
    : item.quantity > max
      ? { type: 'tooMany', max }
      : null;
  return {
    item,
    configuration: item.configuration,
    unitPrice,
    subtotal: unitPrice * item.quantity,
    maxQuantity: max,
    problem,
    priceChanged: hasPriceChanged(unitPrice, item.priceAtAdd),
  };
}

/**
 * Precio del carrito con las reglas y el stock vigentes (nunca con el
 * precio guardado al agregar). Los renglones con problemas no suman al
 * subtotal y bloquean el checkout hasta que se corrijan o se quiten.
 */
export function summarizeCart(items: CartItem[], context: CartPricingContext): CartSummary {
  // Unidades pedidas antes de cada renglón, por producto: si un mismo
  // producto quedó en dos renglones, el stock se reparte entre ambos.
  const unitsBefore = new Map<string, number>();
  const lines = items.map((item) => {
    if (item.kind !== 'product') return priceLine(item, context, 0);
    const before = unitsBefore.get(item.productId) ?? 0;
    unitsBefore.set(item.productId, before + item.quantity);
    return priceLine(item, context, before);
  });
  const subtotalByKind = { custom: 0, product: 0 };
  for (const line of lines) {
    if (!line.problem) subtotalByKind[line.item.kind] += line.subtotal;
  }
  return {
    lines,
    subtotal: subtotalByKind.custom + subtotalByKind.product,
    subtotalByKind,
    hasProblems: lines.some((line) => line.problem !== null),
  };
}
