import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import { formatPrice } from '../../../domain/money';
import type { PriceBreakdown, PriceLine } from '../../../domain/notebook/pricing';
import { configurationKey } from '../../../domain/notebook/restrictions';
import { useCart } from '../../../hooks/useCart';
import { useSaveDesign } from '../../../hooks/useSaveDesign';
import type { ConfiguratorData, NotebookConfiguration } from '../../../types/notebook';
import styles from './ConfiguratorSummary.module.css';

const text = content.configurator;

interface SummaryProps {
  data: ConfiguratorData;
  configuration: NotebookConfiguration;
  price: PriceBreakdown;
  productionDays: number;
}

/** Cuánto tiempo queda visible un aviso de ajuste automático. */
const NOTICE_DURATION_MS = 6000;

interface BarProps extends SummaryProps {
  /** `false` si la combinación no se puede comprar (stock, precio, límites). */
  canAdd: boolean;
  /** Avisos de ajustes automáticos del último cambio. */
  notices: string[];
  /** Cambia con cada actualización: reinicia el tiempo de los avisos. */
  noticeVersion: number;
}

/**
 * Precio, plazo y "Agregar al carrito". En mobile queda fija abajo de la
 * pantalla (siempre visible) y muestra ahí los avisos, que se van solos;
 * en desktop va debajo de la vista previa.
 */
export function ConfiguratorBar({
  configuration,
  price,
  canAdd,
  productionDays,
  notices,
  noticeVersion,
}: BarProps) {
  const { addItem } = useCart();
  const [addedKey, setAddedKey] = useState<string | null>(null);
  const [hiddenNoticeVersion, setHiddenNoticeVersion] = useState<number | null>(null);
  // El aviso de "agregado" se va solo si la persona cambia el diseño.
  const justAdded = addedKey === configurationKey(configuration);
  const showNotices = notices.length > 0 && hiddenNoticeVersion !== noticeVersion;

  useEffect(() => {
    if (notices.length === 0) return;
    const timer = window.setTimeout(
      () => setHiddenNoticeVersion(noticeVersion),
      NOTICE_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [noticeVersion, notices.length]);

  function handleAdd() {
    if (!canAdd) return;
    addItem({ kind: 'custom', configuration, priceAtAdd: price.total, quantity: 1 });
    setAddedKey(configurationKey(configuration));
  }

  return (
    <div className={styles.bar}>
      <div role="status" className={styles.notices}>
        {showNotices && notices.map((notice) => <p key={notice}>{notice}</p>)}
      </div>
      <div className={styles.barInner}>
        <div className={styles.priceBlock}>
          <span className={styles.totalLabel}>{text.summary.totalLabel}</span>
          <span className={styles.total}>{formatPrice(price.total)}</span>
          <span className={styles.days}>{text.summary.production(productionDays)}</span>
        </div>
        <Button
          size="lg"
          onClick={handleAdd}
          disabled={!canAdd}
          aria-describedby={canAdd ? undefined : 'cannot-add'}
          className={styles.addButton}
        >
          {text.summary.addToCart}
        </Button>
      </div>
      <p role="status" className={styles.status}>
        {justAdded && (
          <>
            {text.summary.added} <Link to={ROUTES.cart}>{text.summary.goToCart}</Link>
          </>
        )}
      </p>
      {!canAdd && (
        <p id="cannot-add" className={styles.status}>
          {text.summary.cannotAdd}
        </p>
      )}
    </div>
  );
}

/** Detalle del precio y "Guardar diseño". */
export function ConfiguratorExtras({ data, configuration, price }: SummaryProps) {
  const saveDesign = useSaveDesign(configuration);

  function lineLabel(line: PriceLine) {
    const optionName = (options: { id: string; name: string }[]) =>
      options.find((option) => option.id === line.optionId)?.name ?? '';
    switch (line.kind) {
      case 'base':
        return text.summary.lines.base(optionName(data.sizes));
      case 'sheets':
        return text.summary.lines.sheets(
          line.quantity ?? 0,
          optionName(data.papers),
          line.unitPrice ?? 0,
        );
      case 'binding':
        return text.summary.lines.binding(optionName(data.bindings));
      case 'fabric':
        return text.summary.lines.fabric(optionName(data.fabrics));
      case 'personalization':
        return text.summary.lines.personalization;
    }
  }

  return (
    <div className={styles.extras}>
      <details className={styles.breakdown}>
        <summary>{text.summary.breakdownToggle}</summary>
        <dl className={styles.lines}>
          {price.lines.map((line) => (
            <div key={line.kind} className={styles.line}>
              <dt>{lineLabel(line)}</dt>
              <dd>{formatPrice(line.amount)}</dd>
            </div>
          ))}
          <div className={[styles.line, styles.lineTotal].join(' ')}>
            <dt>{text.summary.totalLabel}</dt>
            <dd>{formatPrice(price.total)}</dd>
          </div>
        </dl>
      </details>

      <div className={styles.save}>
        {saveDesign.status === 'anonymous' && (
          <Link
            to={ROUTES.login}
            className={buttonClassName({ variant: 'secondary', fullWidth: true })}
          >
            {text.saveDesign.loginPrompt}
          </Link>
        )}
        {['idle', 'saving', 'saved', 'error'].includes(saveDesign.status) && (
          <Button
            variant="secondary"
            fullWidth
            disabled={saveDesign.status === 'saving'}
            onClick={saveDesign.save}
          >
            {saveDesign.status === 'saving' ? text.saveDesign.saving : text.saveDesign.button}
          </Button>
        )}
        <p role="status" className={styles.status}>
          {saveDesign.status === 'saved' && text.saveDesign.saved}
          {saveDesign.status === 'error' && text.saveDesign.error}
        </p>
      </div>
    </div>
  );
}
