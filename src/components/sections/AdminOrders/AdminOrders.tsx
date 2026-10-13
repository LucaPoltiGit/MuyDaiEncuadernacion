import { useState } from 'react';
import { Badge } from '../../ui/Badge/Badge';
import type { BadgeTone } from '../../ui/Badge/Badge';
import { Button } from '../../ui/Button/Button';
import { OptionGroup } from '../../ui/OptionGroup/OptionGroup';
import { Select } from '../../ui/Select/Select';
import { NotebookFigure } from '../NotebookFigure/NotebookFigure';
import { notebookSummary } from '../NotebookSpecs/notebookSummary';
import { PageIntro } from '../PageIntro/PageIntro';
import { whatsappLinkTo } from '../../../constants/contact';
import { ALL_CATEGORIES } from '../../../constants/shop';
import { content } from '../../../content';
import { nextStatusesFor } from '../../../domain/checkout/orderRules';
import { formatPrice } from '../../../domain/money';
import { toWhatsappNumber } from '../../../domain/validation';
import type { ConfiguratorData } from '../../../types/notebook';
import type { Order, OrderStatus } from '../../../types/order';
import styles from './AdminOrders.module.css';

const text = content.admin.orders;

const STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  pendingPayment: 'accent',
  paid: 'success',
  inProduction: 'brand',
  shipped: 'brand',
  readyForPickup: 'success',
  delivered: 'neutral',
  cancelled: 'neutral',
};

/** Orden del filtro: lo que hay que atender primero. */
const STATUS_ORDER: OrderStatus[] = [
  'paid',
  'inProduction',
  'readyForPickup',
  'shipped',
  'pendingPayment',
  'delivered',
  'cancelled',
];

export interface AdminOrdersProps {
  orders: Order[];
  /** Para dibujar y describir cada cuaderno. */
  data: ConfiguratorData;
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

/** Pedidos para atender: quién, qué cuadernos coser, cómo se entregan y su estado. */
export function AdminOrders({ orders, data, onStatusChange }: AdminOrdersProps) {
  const [filter, setFilter] = useState<string>(ALL_CATEGORIES);
  const visible =
    filter === ALL_CATEGORIES ? orders : orders.filter((order) => order.status === filter);

  return (
    <div className={styles.orders}>
      <PageIntro title={text.title} lead={text.lead} />
      <OptionGroup
        legend={text.filterLegend}
        layout="pills"
        value={filter}
        onChange={setFilter}
        options={[
          { value: ALL_CATEGORIES, label: text.all },
          ...STATUS_ORDER.filter((status) => orders.some((order) => order.status === status)).map(
            (status) => ({ value: status, label: text.status[status] }),
          ),
        ]}
      />
      <p className={styles.count} role="status">
        {text.count(visible.length)}
      </p>
      {visible.length === 0 ? (
        <p>{text.empty}</p>
      ) : (
        <ul className={styles.list}>
          {visible.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} data={data} onStatusChange={onStatusChange} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OrderCard({
  order,
  data,
  onStatusChange,
}: {
  order: Order;
  data: ConfiguratorData;
  onStatusChange: AdminOrdersProps['onStatusChange'];
}) {
  const [next, setNext] = useState('');
  const [saving, setSaving] = useState(false);
  const options = nextStatusesFor(order);
  const titleId = `admin-order-${order.id}`;
  const paid = order.payment.status === 'approved';

  async function update() {
    if (!next) return;
    setSaving(true);
    const ok = await onStatusChange(order.id, next as OrderStatus);
    setSaving(false);
    if (ok) setNext('');
  }

  const delivery =
    order.delivery.method === 'pickup'
      ? text.pickupAt(order.delivery.pointName)
      : text.shippingTo(
          [
            order.delivery.address.street,
            order.delivery.address.apartment,
            order.delivery.address.city,
            order.delivery.address.province,
            order.delivery.address.postalCode,
          ]
            .filter(Boolean)
            .join(', '),
          order.delivery.zoneName,
        );

  return (
    <article className={styles.card} aria-labelledby={titleId}>
      <header className={styles.header}>
        <div>
          <h2 id={titleId} className={styles.number}>
            {text.number(order.number)}
          </h2>
          <p className={styles.muted}>{text.date(order.createdAt)}</p>
        </div>
        <Badge tone={STATUS_TONE[order.status]} withDot>
          {text.status[order.status]}
        </Badge>
      </header>

      {order.payment.refundRequired && <p className={styles.alert}>{text.refund}</p>}

      <div className={styles.grid}>
        <section aria-label={text.customer}>
          <h3 className={styles.label}>{text.customer}</h3>
          <p>{order.customer.name}</p>
          <p className={styles.muted}>{order.customer.email}</p>
          <a
            href={whatsappLinkTo(
              toWhatsappNumber(order.customer.phone),
              text.whatsappMessage(order.customer.name.split(' ')[0], order.number),
            )}
            className={styles.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            {order.customer.phone}
            <span className="visually-hidden"> ({text.whatsapp})</span>
          </a>
        </section>
        <section aria-label={text.delivery}>
          <h3 className={styles.label}>{text.delivery}</h3>
          <p>{delivery}</p>
          <p className={styles.muted}>
            {text.estimate(order.estimatedDays.min, order.estimatedDays.max)}
          </p>
        </section>
      </div>

      <section aria-label={text.items}>
        <h3 className={styles.label}>{text.items}</h3>
        <ul className={styles.items}>
          {order.lines.map((line, index) => (
            <li key={index} className={styles.item}>
              <div className={styles.thumb}>
                <NotebookFigure configuration={line.configuration} data={data} />
              </div>
              <div>
                <p className={styles.itemName}>
                  {line.productName ?? text.custom}
                  <span className={styles.muted}> · {formatPrice(line.price)}</span>
                </p>
                <p className={styles.muted}>{notebookSummary(line.configuration, data)}</p>
                {line.configuration.coverText.trim() && (
                  <p className={styles.cover}>
                    {text.coverText(line.configuration.coverText.trim())}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className={styles.total}>
          {text.total}: <strong>{formatPrice(order.total)}</strong>
          {order.discount && (
            <span className={styles.muted}>
              {' '}
              · {text.discount(order.discount.code, order.discount.amount)}
            </span>
          )}
        </p>
      </section>

      {options.length > 0 ? (
        <div className={styles.statusForm}>
          <Select
            label={text.statusLabel}
            placeholder={text.statusPlaceholder}
            options={options.map((status) => ({ value: status, label: text.status[status] }))}
            value={next}
            onChange={(event) => setNext(event.target.value)}
            hint={paid && next === 'cancelled' ? text.cancelWarning : undefined}
          />
          <Button onClick={update} disabled={!next || saving}>
            {text.update}
          </Button>
        </div>
      ) : (
        <p className={styles.muted}>{text.noNextStatus}</p>
      )}
    </article>
  );
}
