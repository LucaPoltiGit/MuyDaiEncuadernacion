import { useState } from 'react';
import { Link } from 'react-router';
import { Badge } from '../../ui/Badge/Badge';
import { Button } from '../../ui/Button/Button';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { Butterfly } from '../../ui/Butterfly/Butterfly';
import { Flower } from '../../ui/Flower/Flower';
import { PurchaseBar } from '../../ui/PurchaseBar/PurchaseBar';
import { NotebookFigure } from '../NotebookFigure/NotebookFigure';
import { NotebookSpecs } from '../NotebookSpecs/NotebookSpecs';
import { ROUTES } from '../../../constants/routes';
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

/** Ficha de un cuaderno de la tienda (pieza única): dibujo, precio y detalle. */
export function ProductDetail({ product, categoryName, data }: ProductDetailProps) {
  const { addItem, contains } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const newItem = {
    kind: 'product' as const,
    productId: product.id,
    configuration: product.configuration,
    priceAtAdd: product.price,
  };
  const sold = !product.available;
  const inCart = contains(newItem);
  const customizeState: ConfiguratorLocationState = {
    baseConfiguration: product.configuration,
  };

  function handleAdd() {
    if (addItem(newItem)) setJustAdded(true);
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
            {sold ? (
              <Badge>{text.sold}</Badge>
            ) : (
              <Badge tone="brand" withDot>
                {text.unique}
              </Badge>
            )}
          </p>

          <div className={styles.purchase}>
            <PurchaseBar
              priceLabel={text.priceLabel}
              price={formatPrice(product.price)}
              detail={sold ? text.soldHint : text.readyToShip}
              action={
                sold ? (
                  <Link
                    to={ROUTES.configurator}
                    state={customizeState}
                    className={buttonClassName({ size: 'lg' })}
                  >
                    {text.orderCustom}
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleAdd}
                    disabled={inCart}
                    aria-describedby={inCart && !justAdded ? 'product-in-cart' : undefined}
                  >
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
                  {inCart && !justAdded && (
                    <span id="product-in-cart">
                      {text.alreadyInCart} <Link to={ROUTES.cart}>{text.goToCart}</Link>
                    </span>
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

          {!sold && (
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
