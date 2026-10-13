/** A qué parte del carrito se aplica un código. */
export type DiscountScope = 'all' | 'custom' | 'product';

/** Código de descuento tal como lo carga el admin. */
export interface DiscountCode {
  /** Identidad estable (el admin puede cambiar el texto del código). */
  id: string;
  /** Se compara sin importar mayúsculas ni espacios. */
  code: string;
  type: 'percentage' | 'fixed';
  /** Porcentaje (1 a 100) o monto fijo en pesos. */
  value: number;
  /** Subtotal mínimo (de lo alcanzado) para que aplique. 0 = sin mínimo. */
  minSubtotal: number;
  appliesTo: DiscountScope;
  active: boolean;
  /** Fecha ISO de vencimiento (inclusive hasta ese instante). `null` = no vence. */
  expiresAt: string | null;
  /** Usos totales permitidos. `null` = sin límite. */
  maxUses: number | null;
  /** Veces que ya se usó (lo suma el checkout al confirmar un pedido). */
  usedCount: number;
}
