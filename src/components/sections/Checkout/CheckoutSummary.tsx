import { Link } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { NotebookFigure } from '../NotebookFigure/NotebookFigure';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import type { CartSummary } from '../../../domain/cart/pricing';
import type { CheckoutTotals } from '../../../domain/checkout/order';
import { formatPrice } from '../../../domain/money';
import type { ShippingQuote } from '../../../domain/shipping';
import type { ConfiguratorData } from '../../../types/notebook';
import styles from './CheckoutSummary.module.css';

const text = content.checkout.summary;

export interface CheckoutSummaryProps {
  cart: CartSummary;
  configurator: ConfiguratorData;
  totals: CheckoutTotals;
  discountCode: string | null;
  quote: ShippingQuote | null;
  /** Días hábiles estimados, si ya se sabe cómo se entrega. */
  estimate: { min: number; max: number } | null;
  submitting: boolean;
  /** Mensaje de error del envío del formulario (validación o pago). */
  error: string | null;
}

/** Resumen del pedido con el total y el botón de pago (es el submit del formulario). */
export function CheckoutSummary({
  cart,
  configurator,
  totals,
  discountCode,
  quote,
  estimate,
  submitting,
  error,
}: CheckoutSummaryProps) {
  const hasCustom = cart.lines.some((line) => line.item.kind === 'custom');

  function shippingValue() {
    if (!quote) return text.shippingPending;
    if (quote.method === 'pickup') return text.shippingFree;
    return quote.price === 0 ? text.shippingFree : formatPrice(quote.price);
  }

  return (
    <section className={styles.summary} aria-labelledby="checkout-summary-title">
      <div className={styles.header}>
        <h2 id="checkout-summary-title" className={styles.title}>
          {text.title}
        </h2>
        <Link to={ROUTES.cart} className={styles.editCart}>
          {text.editCart}
        </Link>
      </div>

      <ul className={styles.items}>
        {cart.lines.map((line) => (
          <li key={line.item.id} className={styles.item}>
            <div className={styles.thumb}>
              <NotebookFigure configuration={line.configuration} data={configurator} />
            </div>
            <span className={styles.itemName}>
              {line.product?.name ?? content.notebook.customName}
            </span>
            <span className={styles.itemPrice}>{formatPrice(line.price)}</span>
          </li>
        ))}
      </ul>

      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>{text.subtotal}</dt>
          <dd>{formatPrice(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && discountCode && (
          <div className={[styles.line, styles.discount].join(' ')}>
            <dt>{text.discount(discountCode)}</dt>
            <dd>− {formatPrice(totals.discount)}</dd>
          </div>
        )}
        <div className={styles.line}>
          <dt>{quote?.method === 'pickup' ? text.pickup : text.shipping}</dt>
          <dd className={quote ? undefined : styles.pending}>{shippingValue()}</dd>
        </div>
        <div className={[styles.line, styles.total].join(' ')}>
          <dt>{text.total}</dt>
          <dd>{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      {estimate && (
        <p className={styles.estimate}>
          {quote?.method === 'pickup'
            ? text.estimatePickup(estimate.min)
            : text.estimateShipping(estimate.min, estimate.max)}
          {hasCustom && ` ${text.madeToOrderNote}`}
        </p>
      )}

      <p role="alert" className={styles.error}>
        {error}
      </p>

      <Button type="submit" size="lg" fullWidth disabled={submitting}>
        {submitting ? text.paying : text.pay}
      </Button>
      <p className={styles.note}>{text.payNote}</p>
    </section>
  );
}
