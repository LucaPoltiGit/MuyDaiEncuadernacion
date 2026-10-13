import { Link } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { NotebookFigure } from '../NotebookFigure/NotebookFigure';
import { notebookSummary } from '../NotebookSpecs/notebookSummary';
import { productPath } from '../../../constants/routes';
import { content } from '../../../content';
import type { CartLine, CartLineProblem } from '../../../domain/cart/pricing';
import { formatPrice } from '../../../domain/money';
import { getProductionDays } from '../../../domain/notebook/production';
import type { ConfiguratorData } from '../../../types/notebook';
import { problemId } from './cartIds';
import styles from './CartLineItem.module.css';

const text = content.cart;

export interface CartLineItemProps {
  line: CartLine;
  data: ConfiguratorData;
  onRemove: () => void;
}

function problemText(problem: CartLineProblem) {
  return text.problems[problem.type];
}

/** Un renglón del carrito (un cuaderno único): dibujo, descripción, precio y quitar. */
export function CartLineItem({ line, data, onRemove }: CartLineItemProps) {
  const { item, product, problem, configuration } = line;
  const name = product?.name ?? content.notebook.customName;

  return (
    <li className={[styles.line, problem ? styles.withProblem : ''].filter(Boolean).join(' ')}>
      <div className={styles.thumb}>
        <NotebookFigure configuration={configuration} data={data} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>
          {product ? <Link to={productPath(product.slug)}>{name}</Link> : name}
        </h3>
        <p className={styles.summary}>{notebookSummary(configuration, data)}</p>
        {configuration.coverText.trim() && (
          <p className={styles.summary}>
            {content.notebook.specs.coverText}:{' '}
            {content.notebook.coverTextValue(configuration.coverText.trim())}
          </p>
        )}
        {!problem && (
          <p className={styles.note}>
            {item.kind === 'custom'
              ? text.line.madeToOrder(getProductionDays(configuration, data))
              : text.line.readyToShip}
          </p>
        )}
        {line.priceChanged && !problem && (
          <p className={styles.note}>{text.line.priceChanged(item.priceAtAdd)}</p>
        )}
        {problem && (
          <p id={problemId(item.id)} tabIndex={-1} className={styles.problem}>
            {problemText(problem)}
          </p>
        )}

        <div className={styles.controls}>
          <Button variant="ghost" onClick={onRemove} aria-label={text.line.removeLabel(name)}>
            {text.line.remove}
          </Button>
        </div>
      </div>

      <div className={styles.price}>
        <p className={styles.subtotal}>
          {problem ? (
            // No suma al total hasta resolverlo: se tacha y se aclara.
            <>
              <s>{formatPrice(line.price)}</s>
              <span className={styles.excluded}>{text.line.excluded}</span>
            </>
          ) : (
            formatPrice(line.price)
          )}
        </p>
      </div>
    </li>
  );
}
