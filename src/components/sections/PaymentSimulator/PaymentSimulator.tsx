import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { PageMessage } from '../PageMessage/PageMessage';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import { formatPrice } from '../../../domain/money';
import type { Order, PaymentStatus } from '../../../types/order';
import styles from './PaymentSimulator.module.css';

const text = content.checkout.simulator;

export interface PaymentSimulatorProps {
  order: Order;
  /** Resuelve el pago como lo haría Mercado Pago. */
  onResolve: (outcome: PaymentStatus) => void;
}

/**
 * Reemplazo de Mercado Pago en modo prueba: muestra el pedido y deja elegir
 * cómo termina el pago. Dice claramente que es una simulación.
 */
export function PaymentSimulator({ order, onResolve }: PaymentSimulatorProps) {
  const [processing, setProcessing] = useState(false);

  function resolve(outcome: PaymentStatus) {
    setProcessing(true);
    onResolve(outcome);
  }

  return (
    <PageMessage
      eyebrow={text.eyebrow}
      title={text.title}
      text={text.text}
      focusTitle
      actions={
        <>
          <Button onClick={() => resolve('approved')} disabled={processing}>
            {processing ? text.processing : text.approve}
          </Button>
          <Button variant="secondary" onClick={() => resolve('rejected')} disabled={processing}>
            {text.reject}
          </Button>
          <Button variant="secondary" onClick={() => resolve('pending')} disabled={processing}>
            {text.pending}
          </Button>
          <Link to={ROUTES.checkout} className={styles.back}>
            {text.back}
          </Link>
        </>
      }
    >
      <dl className={styles.order}>
        <div>
          <dt>{text.order(order.number)}</dt>
        </div>
        <div className={styles.total}>
          <dt>{text.total}</dt>
          <dd>{formatPrice(order.total)}</dd>
        </div>
      </dl>
    </PageMessage>
  );
}
