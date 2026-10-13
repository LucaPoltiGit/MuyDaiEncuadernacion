import { Link } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { DiscountCodeForm } from './DiscountCodeForm';
import { discountRejectionText } from './discountText';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import type { CartSummary } from '../../../domain/cart/pricing';
import { formatPrice } from '../../../domain/money';
import { useCartDiscount } from '../../../hooks/useCartDiscount';
import styles from './CartSummaryPanel.module.css';

const text = content.cart;

export interface CartSummaryPanelProps {
  cart: CartSummary;
  /** Lleva el foco al primer renglón con problema (al tocar el checkout bloqueado). */
  onReviewProblems: () => void;
}

/** Subtotal, código de descuento, total y paso al checkout. */
export function CartSummaryPanel({ cart, onReviewProblems }: CartSummaryPanelProps) {
  const discount = useCartDiscount(cart);
  const { state } = discount;
  const discountAmount = state.status === 'applied' ? state.amount : 0;
  const total = cart.subtotal - discountAmount;

  return (
    <section className={styles.panel} aria-labelledby="cart-summary-title">
      <h2 id="cart-summary-title" className={styles.title}>
        {text.summary.title}
      </h2>

      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>{text.summary.subtotal}</dt>
          <dd>{formatPrice(cart.subtotal)}</dd>
        </div>
        {state.status === 'applied' && (
          <div className={[styles.line, styles.discountLine].join(' ')}>
            <dt>
              {text.summary.discount(state.code)}{' '}
              <button
                type="button"
                className={styles.removeCode}
                onClick={discount.remove}
                aria-label={text.summary.removeDiscountLabel(state.code)}
              >
                {text.summary.removeDiscount}
              </button>
            </dt>
            <dd>− {formatPrice(state.amount)}</dd>
          </div>
        )}
        <div className={[styles.line, styles.total].join(' ')}>
          <dt>{text.summary.total}</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      {/* Anuncios para lectores de pantalla: revisando y aplicado. */}
      <p role="status" className="visually-hidden">
        {state.status === 'loading' && text.discount.checking}
        {state.status === 'applied' && text.discount.applied(state.code)}
      </p>

      <div role="status" className={styles.discountStatus}>
        {state.status === 'error' && (
          <p className={styles.codeNotice}>
            <strong>{state.code}:</strong> <span>{text.discount.error}</span>{' '}
            <button type="button" className={styles.removeCode} onClick={discount.retry}>
              {text.discount.retry}
            </button>
          </p>
        )}
        {state.status === 'rejected' && (
          // Un código guardado que dejó de aplicar (ej. bajó del mínimo): se
          // explica y se puede quitar; si vuelve a cumplirse, aplica solo.
          <p className={styles.codeNotice}>
            <strong>{state.code}:</strong> <span>{discountRejectionText(state.reason)}</span>{' '}
            <button
              type="button"
              className={styles.removeCode}
              onClick={discount.remove}
              aria-label={text.summary.removeDiscountLabel(state.code)}
            >
              {text.summary.removeDiscount}
            </button>
          </p>
        )}
      </div>

      {state.status === 'none' && <DiscountCodeForm onApply={discount.apply} />}

      <p className={styles.note}>{text.summary.shippingNote}</p>

      {cart.hasProblems ? (
        <>
          {/* aria-disabled (no `disabled`): sigue siendo alcanzable con teclado
              y al tocarlo lleva al cuaderno que hay que revisar. */}
          <Button
            size="lg"
            fullWidth
            aria-disabled="true"
            aria-describedby="cart-blocked"
            onClick={onReviewProblems}
          >
            {text.summary.checkout}
          </Button>
          <p id="cart-blocked" className={styles.blocked}>
            {text.summary.blocked}
          </p>
        </>
      ) : (
        <Link to={ROUTES.checkout} className={buttonClassName({ size: 'lg', fullWidth: true })}>
          {text.summary.checkout}
        </Link>
      )}

      <Link to={ROUTES.catalog} className={styles.keepShopping}>
        {text.summary.keepShopping}
      </Link>
    </section>
  );
}
