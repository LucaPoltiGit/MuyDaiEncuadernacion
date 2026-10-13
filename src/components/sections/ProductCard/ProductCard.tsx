import { Link } from 'react-router';
import { Badge } from '../../ui/Badge/Badge';
import { WaveEdge } from '../../ui/WaveEdge/WaveEdge';
import { NotebookFigure } from '../NotebookFigure/NotebookFigure';
import { productPath } from '../../../constants/routes';
import { content } from '../../../content';
import { formatPrice } from '../../../domain/money';
import type { Product } from '../../../types/catalog';
import type { ConfiguratorData } from '../../../types/notebook';
import styles from './ProductCard.module.css';

const text = content.catalog;

export interface ProductCardProps {
  product: Product;
  /** Reglas del configurador: para dibujar el cuaderno. */
  data: ConfiguratorData;
  /** Nivel del título según dónde se use la tarjeta. */
  headingLevel?: 'h2' | 'h3';
}

/** Tarjeta de un cuaderno de catálogo. Toda la tarjeta lleva a la ficha. */
export function ProductCard({ product, data, headingLevel: Heading = 'h2' }: ProductCardProps) {
  const soldOut = !product.available;

  return (
    <article className={[styles.card, soldOut ? styles.soldOut : ''].filter(Boolean).join(' ')}>
      <div className={styles.figure}>
        <NotebookFigure configuration={product.configuration} data={data} />
      </div>
      {/* La mesa termina en onda con costura, como el header. */}
      <WaveEdge edge="bottom" fill="var(--color-surface-muted)" className={styles.wave} />
      <div className={styles.body}>
        <Heading className={styles.name}>
          <Link to={productPath(product.slug)} className={styles.link}>
            {product.name}
          </Link>
        </Heading>
        <p className={styles.tagline}>{product.tagline}</p>
        <div className={styles.footer}>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          {/* Todos son piezas únicas (lo dice la tienda arriba): solo se marca el vendido. */}
          {soldOut && <Badge>{text.sold}</Badge>}
        </div>
      </div>
    </article>
  );
}
