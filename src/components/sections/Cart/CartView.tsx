import { useMemo } from 'react';
import { Link } from 'react-router';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { CartLineItem } from './CartLineItem';
import { problemId } from './cartIds';
import { CartSummaryPanel } from './CartSummaryPanel';
import { PageIntro } from '../PageIntro/PageIntro';
import { PageMessage } from '../PageMessage/PageMessage';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import { summarizeCart } from '../../../domain/cart/pricing';
import { useCart } from '../../../hooks/useCart';
import type { ShopData } from '../../../hooks/useShopData';
import styles from './CartView.module.css';

const text = content.cart;

export interface CartViewProps {
  shop: ShopData;
}

/** Carrito: renglones editables y resumen con descuento. Precios siempre vigentes. */
export function CartView({ shop }: CartViewProps) {
  const { items, count, removeItem } = useCart();
  const cart = useMemo(
    () =>
      summarizeCart(items, { configurator: shop.configurator, products: shop.catalog.products }),
    [items, shop],
  );

  function focusFirstProblem() {
    const first = cart.lines.find((line) => line.problem);
    if (first) document.getElementById(problemId(first.item.id))?.focus();
  }

  if (items.length === 0) {
    return (
      <PageMessage
        title={text.empty.title}
        text={text.empty.text}
        actions={
          <>
            <Link to={ROUTES.catalog} className={buttonClassName()}>
              {text.empty.catalog}
            </Link>
            <Link to={ROUTES.configurator} className={buttonClassName({ variant: 'secondary' })}>
              {text.empty.configurator}
            </Link>
          </>
        }
      />
    );
  }

  return (
    <div className={styles.cart}>
      <PageIntro title={text.title} lead={text.count(count)} />
      <div className={styles.layout}>
        <section aria-labelledby="cart-items-title">
          <h2 id="cart-items-title" className="visually-hidden">
            {text.itemsLabel}
          </h2>
          <ul className={styles.items}>
            {cart.lines.map((line) => (
              <CartLineItem
                key={line.item.id}
                line={line}
                data={shop.configurator}
                onRemove={() => removeItem(line.item.id)}
              />
            ))}
          </ul>
        </section>
        <div className={styles.summary}>
          <CartSummaryPanel cart={cart} onReviewProblems={focusFirstProblem} />
        </div>
      </div>
    </div>
  );
}
