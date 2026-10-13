import { Link } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { Stepper } from '../../ui/Stepper/Stepper';
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
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

function problemText(problem: CartLineProblem) {
  if (problem.type === 'tooMany') return text.problems.tooMany(problem.max);
  return text.problems[problem.type];
}

/** Un renglón del carrito: dibujo, descripción, cantidad, precio y quitar. */
export function CartLineItem({ line, data, onQuantityChange, onRemove }: CartLineItemProps) {
  const { item, product, problem, configuration } = line;
  const name = product?.name ?? content.notebook.customName;
  const canChangeQuantity =
    problem === null || problem.type === 'tooMany' || problem.type === 'invalidConfiguration';

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
          {canChangeQuantity && (
            <Stepper
              size="sm"
              label={text.line.quantity}
              value={item.quantity}
              min={1}
              // Si hay más de lo permitido, se puede bajar pero no subir.
              max={Math.max(line.maxQuantity, item.quantity)}
              step={1}
              onChange={onQuantityChange}
              formatValue={String}
              decrementLabel={text.line.decrease(name)}
              incrementLabel={text.line.increase(name)}
            />
          )}
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
              <s>{formatPrice(line.unitPrice * item.quantity)}</s>
              <span className={styles.excluded}>{text.line.excluded}</span>
            </>
          ) : (
            formatPrice(line.unitPrice * item.quantity)
          )}
        </p>
        {item.quantity > 1 && <p className={styles.unit}>{text.line.unitPrice(line.unitPrice)}</p>}
      </div>
    </li>
  );
}
