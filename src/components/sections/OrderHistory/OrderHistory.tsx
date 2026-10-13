import { Link } from 'react-router';
import { Badge } from '../../ui/Badge/Badge';
import type { BadgeTone } from '../../ui/Badge/Badge';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { NotebookFigure } from '../NotebookFigure/NotebookFigure';
import { PageMessage } from '../PageMessage/PageMessage';
import { whatsappLink } from '../../../constants/contact';
import { checkoutResultPath, paymentSimulatorPath, ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import { formatPrice } from '../../../domain/money';
import type { ConfiguratorData } from '../../../types/notebook';
import type { Order, OrderStatus } from '../../../types/order';
import styles from './OrderHistory.module.css';

const text = content.account.orders;

/** Qué tono de etiqueta lleva cada estado (lo decide la sección, no el Badge). */
const STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  pendingPayment: 'accent',
  paid: 'success',
  inProduction: 'brand',
  shipped: 'brand',
  readyForPickup: 'success',
  delivered: 'success',
  cancelled: 'neutral',
};

export interface OrderHistoryProps {
  orders: Order[];
  /** Para dibujar los cuadernos de cada pedido. */
  data: ConfiguratorData;
}

/** Mis compras: cada pedido con estado, cuadernos, total y detalle desplegable. */
export function OrderHistory({ orders, data }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <PageMessage
        title={text.empty.title}
        text={text.empty.text}
        actions={
          <Link to={ROUTES.catalog} className={buttonClassName()}>
            {text.empty.action}
          </Link>
        }
      />
    );
  }

  return (
    <ul className={styles.list}>
      {orders.map((order) => (
        <li key={order.id}>
          <OrderCard order={order} data={data} />
        </li>
      ))}
    </ul>
  );
}

/**
 * A dónde ir para completar el pago: al pago (si quedó abierto) o al
 * resultado, que permite reintentar si fue rechazado.
 */
function payPath(order: Order) {
  const { status, preferenceId } = order.payment;
  return status === 'pending' && preferenceId
    ? paymentSimulatorPath(preferenceId)
    : checkoutResultPath(order.id);
}

function deliveryText(order: Order) {
  if (order.delivery.method === 'pickup') return text.pickupAt(order.delivery.pointName);
  const { street, apartment, city } = order.delivery.address;
  return text.deliveryTo([street, apartment, city].filter(Boolean).join(', '));
}

function OrderCard({ order, data }: { order: Order; data: ConfiguratorData }) {
  const awaitingPayment = order.status === 'pendingPayment';
  const titleId = `order-${order.id}`;

  return (
    <article className={styles.card} aria-labelledby={titleId}>
      <header className={styles.header}>
        <div>
          <h2 id={titleId} className={styles.number}>
            {text.number(order.number)}
          </h2>
          <p className={styles.date}>{text.date(order.createdAt)}</p>
        </div>
        <Badge tone={STATUS_TONE[order.status]} withDot>
          {text.status[order.status]}
        </Badge>
      </header>

      <div className={styles.summary}>
        <ul className={styles.thumbs} aria-label={text.count(order.lines.length)}>
          {order.lines.map((line, index) => (
            <li key={index} className={styles.thumb}>
              <NotebookFigure configuration={line.configuration} data={data} />
            </li>
          ))}
        </ul>
        <p className={styles.total}>
          <span className={styles.totalLabel}>{text.total}</span>
          {formatPrice(order.total)}
        </p>
      </div>

      {order.payment.refundRequired && <p className={styles.notice}>{text.refund}</p>}

      <details className={styles.details}>
        <summary>{text.details}</summary>
        <dl className={styles.lines}>
          {order.lines.map((line, index) => (
            <div key={index} className={styles.line}>
              <dt>{line.productName ?? content.notebook.customName}</dt>
              <dd>{formatPrice(line.price)}</dd>
            </div>
          ))}
          {order.discount && (
            <div className={styles.line}>
              <dt>{text.discount(order.discount.code)}</dt>
              <dd>− {formatPrice(order.discount.amount)}</dd>
            </div>
          )}
          <div className={styles.line}>
            <dt>{order.delivery.method === 'pickup' ? text.pickup : text.shipping}</dt>
            <dd>{order.delivery.price === 0 ? text.free : formatPrice(order.delivery.price)}</dd>
          </div>
          <div className={[styles.line, styles.lineTotal].join(' ')}>
            <dt>{text.total}</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <p className={styles.meta}>{deliveryText(order)}</p>
        <p className={styles.meta}>
          {text.estimate(order.estimatedDays.min, order.estimatedDays.max)}
        </p>
      </details>

      <div className={styles.actions}>
        {awaitingPayment && (
          <Link to={payPath(order)} className={buttonClassName()}>
            {text.payPending}
          </Link>
        )}
        <a
          href={whatsappLink(text.whatsappMessage(order.number))}
          target="_blank"
          rel="noreferrer"
          className={styles.whatsapp}
        >
          {text.whatsapp}
        </a>
      </div>
    </article>
  );
}
