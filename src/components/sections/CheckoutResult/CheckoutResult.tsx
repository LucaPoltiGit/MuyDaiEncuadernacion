import { Link } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { PageMessage } from '../PageMessage/PageMessage';
import { whatsappLink } from '../../../constants/contact';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import type { Order } from '../../../types/order';
import styles from './CheckoutResult.module.css';

const text = content.checkout.result;

export interface CheckoutResultProps {
  order: Order;
  /** Vuelve a intentar el pago de un pedido rechazado. */
  onRetry: () => void;
  retrying: boolean;
  /** El reintento no se pudo iniciar (ej. una pieza ya no está). */
  retryFailed?: boolean;
}

/** Cómo terminó el pago: gracias + qué sigue, pendiente, o rechazado con reintento. */
export function CheckoutResult({
  order,
  onRetry,
  retrying,
  retryFailed = false,
}: CheckoutResultProps) {
  const status = order.payment.status;

  if (status === 'rejected') {
    return (
      <PageMessage
        eyebrow={text.rejected.eyebrow}
        title={text.rejected.title}
        text={text.rejected.text}
        focusTitle
        actions={
          <>
            <Button onClick={onRetry} disabled={retrying}>
              {retrying ? text.rejected.retrying : text.rejected.retry}
            </Button>
            <Link to={ROUTES.cart} className={buttonClassName({ variant: 'secondary' })}>
              {text.rejected.backToCart}
            </Link>
          </>
        }
      >
        {retryFailed && (
          <p role="alert" className={styles.retryFailed}>
            {text.rejected.retryFailed}
          </p>
        )}
      </PageMessage>
    );
  }

  const approved = status === 'approved';
  const firstName = order.customer.name.split(' ')[0];
  const hasCustom = order.lines.some((line) => line.kind === 'custom');
  const { min, max } = order.estimatedDays;

  return (
    <PageMessage
      eyebrow={approved ? text.approved.eyebrow : text.pending.eyebrow}
      title={approved ? text.approved.title(firstName) : text.pending.title}
      text={approved ? text.approved.text(order.number) : text.pending.text(order.number)}
      celebrate={approved}
      focusTitle
      actions={
        <>
          <Link to={ROUTES.catalog} className={buttonClassName()}>
            {text.keepShopping}
          </Link>
          <a
            href={whatsappLink(text.whatsappMessage(order.number))}
            target="_blank"
            rel="noreferrer"
            className={buttonClassName({ variant: 'secondary' })}
          >
            {text.whatsapp}
          </a>
        </>
      }
    >
      {approved && (
        <div className={styles.next}>
          <h2 className={styles.nextTitle}>{text.nextTitle}</h2>
          <ol className={styles.steps}>
            {(hasCustom ? text.nextSteps.custom : text.nextSteps.ready).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className={styles.estimate}>
            {order.delivery.method === 'pickup'
              ? text.estimatePickup(min)
              : text.estimateShipping(min, max)}
          </p>
        </div>
      )}
    </PageMessage>
  );
}
