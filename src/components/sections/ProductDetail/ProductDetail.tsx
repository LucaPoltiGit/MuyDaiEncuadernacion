import { useState } from 'react';
import { Link } from 'react-router';
import { Badge } from '../../ui/Badge/Badge';
import { Button } from '../../ui/Button/Button';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { Butterfly } from '../../ui/Butterfly/Butterfly';
import { Flower } from '../../ui/Flower/Flower';
import { PurchaseBar } from '../../ui/PurchaseBar/PurchaseBar';
import { Stepper } from '../../ui/Stepper/Stepper';
import { NotebookFigure } from '../NotebookFigure/NotebookFigure';
import { NotebookSpecs } from '../NotebookSpecs/NotebookSpecs';
import { ROUTES } from '../../../constants/routes';
import { LOW_STOCK_THRESHOLD } from '../../../constants/shop';
import { content } from '../../../content';
import { formatPrice } from '../../../domain/money';
import { useCart } from '../../../hooks/useCart';
import type { Product } from '../../../types/catalog';
import type { ConfiguratorData } from '../../../types/notebook';
import type { ConfiguratorLocationState } from '../../../types/route';
import styles from './ProductDetail.module.css';

const text = content.product;

export interface ProductDetailProps {
  product: Product;
  categoryName?: string;
  /** Reglas del configurador: para dibujar y describir el cuaderno. */
  data: ConfiguratorData;
}

/** Ficha de un cuaderno de catálogo: dibujo, precio, cantidad y detalle. */
export function ProductDetail({ product, categoryName, data }: ProductDetailProps) {
  const { items, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const inCart = items
    .filter((item) => item.kind === 'product' && item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);
  const soldOut = product.stock <= 0;
  const available = Math.max(0, product.stock - inCart);
  const safeQuantity = Math.min(quantity, Math.max(1, available));
  const customizeState: ConfiguratorLocationState = {
    baseConfiguration: product.configuration,
  };

  function handleAdd() {
    if (available <= 0) return;
    addItem({
      kind: 'product',
      productId: product.id,
      configuration: product.configuration,
      priceAtAdd: product.price,
      quantity: safeQuantity,
    });
    setQuantity(1);
    setJustAdded(true);
  }

  function stockText() {
    if (soldOut) return text.outOfStock;
    if (available <= 0) return text.quantity.allInCart;
    return text.stock(product.stock);
  }

  return (
    <div className={styles.detail}>
      <nav aria-label={text.breadcrumbLabel} className={styles.breadcrumb}>
        <ol>
          <li>
            <Link to={ROUTES.catalog}>{content.catalog.eyebrow}</Link>
          </li>
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className={styles.layout}>
        <div className={styles.figureColumn}>
          <div className={styles.figure}>
            <Butterfly size="lg" className={styles.butterfly} />
            <NotebookFigure configuration={product.configuration} data={data} />
          </div>
        </div>

        <div className={styles.info}>
          <header className={styles.header}>
            {categoryName && (
              <p className={styles.eyebrow}>
                <Flower size="xs" />
                {categoryName}
              </p>
            )}
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.tagline}>{product.tagline}</p>
          </header>

          <p className={styles.stock}>
            {soldOut ? (
              <Badge>{stockText()}</Badge>
            ) : (
              <Badge tone={product.stock <= LOW_STOCK_THRESHOLD ? 'accent' : 'brand'} withDot>
                {stockText()}
              </Badge>
            )}
          </p>

          {available > 0 && (
            <Stepper
              label={text.quantity.label}
              value={safeQuantity}
              min={1}
              max={available}
              step={1}
              onChange={(value) => {
                setQuantity(value);
                setJustAdded(false);
              }}
              formatValue={text.quantity.unit}
              decrementLabel={text.quantity.decrease}
              incrementLabel={text.quantity.increase}
              hint={
                inCart > 0
                  ? `${text.quantity.alreadyInCart(inCart)} ${text.quantity.hint(available)}`
                  : text.quantity.hint(available)
              }
            />
          )}

          <div className={styles.purchase}>
            <PurchaseBar
              priceLabel={text.priceLabel}
              price={formatPrice(product.price)}
              detail={soldOut ? text.outOfStockHint : text.readyToShip}
              action={
                soldOut ? (
                  <Link
                    to={ROUTES.configurator}
                    state={customizeState}
                    className={buttonClassName({ size: 'lg' })}
                  >
                    {text.orderCustom}
                  </Link>
                ) : (
                  <Button size="lg" onClick={handleAdd} disabled={available <= 0}>
                    {text.addToCart}
                  </Button>
                )
              }
              bottom={
                <p role="status" className={styles.status}>
                  {justAdded && (
                    <>
                      {text.added} <Link to={ROUTES.cart}>{text.goToCart}</Link>
                    </>
                  )}
                </p>
              }
            />
          </div>

          <p className={styles.description}>{product.description}</p>

          <section aria-labelledby="product-specs" className={styles.specs}>
            <h2 id="product-specs" className={styles.sectionTitle}>
              {text.specsTitle}
            </h2>
            <NotebookSpecs configuration={product.configuration} data={data} />
          </section>

          {!soldOut && (
            <aside className={styles.customize} aria-labelledby="product-customize">
              <h2 id="product-customize" className={styles.sectionTitle}>
                {text.customize.title}
              </h2>
              <p>{text.customize.text}</p>
              <Link
                to={ROUTES.configurator}
                state={customizeState}
                className={buttonClassName({ variant: 'secondary' })}
              >
                {text.customize.action}
              </Link>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
