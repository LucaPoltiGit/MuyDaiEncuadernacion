import { useState } from 'react';
import { Link } from 'react-router';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { Butterfly } from '../../ui/Butterfly/Butterfly';
import { OptionGroup } from '../../ui/OptionGroup/OptionGroup';
import { PageIntro } from '../PageIntro/PageIntro';
import { ProductCard } from '../ProductCard/ProductCard';
import { ROUTES } from '../../../constants/routes';
import { ALL_CATEGORIES } from '../../../constants/shop';
import { content } from '../../../content';
import type { CatalogData } from '../../../types/catalog';
import type { ConfiguratorData } from '../../../types/notebook';
import styles from './Catalog.module.css';

const text = content.catalog;

export interface CatalogProps {
  catalog: CatalogData;
  /** Reglas del configurador: para dibujar los cuadernos. */
  data: ConfiguratorData;
}

/** Listado de cuadernos listos, con filtro por uso. Los agotados van al final. */
export function Catalog({ catalog, data }: CatalogProps) {
  const [category, setCategory] = useState(ALL_CATEGORIES);
  // Solo categorías con productos: un filtro vacío no ayuda.
  const categories = catalog.categories.filter((option) =>
    catalog.products.some((product) => product.categoryId === option.id),
  );
  const visible = catalog.products
    .filter((product) => category === ALL_CATEGORIES || product.categoryId === category)
    .sort((a, b) => Number(a.stock <= 0) - Number(b.stock <= 0));

  return (
    <div className={styles.catalog}>
      <PageIntro eyebrow={text.eyebrow} title={text.title} lead={text.intro} />

      {categories.length > 1 && (
        <div className={styles.filters}>
          <OptionGroup
            legend={text.filterLegend}
            layout="pills"
            value={category}
            onChange={setCategory}
            options={[
              { value: ALL_CATEGORIES, label: text.allCategories },
              ...categories.map((option) => ({ value: option.id, label: option.name })),
            ]}
          />
        </div>
      )}

      <p className={styles.count} role="status">
        {text.count(visible.length)}
      </p>

      {visible.length === 0 && <p className={styles.empty}>{text.empty}</p>}

      <ul className={styles.grid}>
        {visible.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} data={data} />
          </li>
        ))}
        <li className={styles.customItem}>
          <div className={styles.customCard}>
            <Butterfly size="lg" className={styles.customButterfly} />
            <h2 className={styles.customTitle}>{text.customCard.title}</h2>
            <p>{text.customCard.text}</p>
            <Link to={ROUTES.configurator} className={buttonClassName()}>
              {text.customCard.action}
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
}
