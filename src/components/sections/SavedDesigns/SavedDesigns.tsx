import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { NotebookFigure } from '../NotebookFigure/NotebookFigure';
import { notebookSummary } from '../NotebookSpecs/notebookSummary';
import { PageMessage } from '../PageMessage/PageMessage';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import { calculatePrice } from '../../../domain/notebook/pricing';
import { isValidConfiguration } from '../../../domain/notebook/restrictions';
import type { SavedDesign } from '../../../types/design';
import type { ConfiguratorData } from '../../../types/notebook';
import type { ConfiguratorLocationState } from '../../../types/route';
import styles from './SavedDesigns.module.css';

const text = content.account.designs;

export interface SavedDesignsProps {
  designs: SavedDesign[];
  /** Reglas vigentes: para dibujarlos y decir cuánto cuestan hoy. */
  data: ConfiguratorData;
  onRemove: (designId: string) => Promise<void>;
}

/** Mis diseños: cada uno con su precio de hoy, para retomarlo o borrarlo. */
export function SavedDesigns({ designs, data, onRemove }: SavedDesignsProps) {
  const [removedMessage, setRemovedMessage] = useState(false);
  const countRef = useRef<HTMLParagraphElement>(null);

  if (designs.length === 0) {
    return (
      <>
        <p role="status" className="visually-hidden">
          {removedMessage && text.removed}
        </p>
        <PageMessage
          title={text.empty.title}
          text={text.empty.text}
          actions={
            <Link to={ROUTES.configurator} className={buttonClassName()}>
              {text.empty.action}
            </Link>
          }
        />
      </>
    );
  }

  async function remove(designId: string) {
    // La tarjeta desaparece: el foco va al contador, no se pierde en la página.
    countRef.current?.focus();
    await onRemove(designId);
    setRemovedMessage(true);
  }

  return (
    <>
      <p ref={countRef} tabIndex={-1} className={styles.count}>
        {text.count(designs.length)}
      </p>
      <p role="status" className="visually-hidden">
        {removedMessage && text.removed}
      </p>
      <ul className={styles.grid}>
        {designs.map((design) => (
          <li key={design.id}>
            <DesignCard design={design} data={data} onRemove={() => remove(design.id)} />
          </li>
        ))}
      </ul>
    </>
  );
}

function DesignCard({
  design,
  data,
  onRemove,
}: {
  design: SavedDesign;
  data: ConfiguratorData;
  onRemove: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const { configuration } = design;
  const valid = isValidConfiguration(data, configuration);
  const savedOn = text.savedOn(design.createdAt);
  const editState: ConfiguratorLocationState = { baseConfiguration: configuration };
  const coverText = configuration.coverText.trim();

  return (
    <article className={styles.card}>
      <div className={styles.figure}>
        <NotebookFigure configuration={configuration} data={data} />
      </div>
      <div className={styles.body}>
        <p className={styles.summary}>{notebookSummary(configuration, data)}</p>
        {coverText && (
          <p className={styles.meta}>
            {content.notebook.specs.coverText}: {content.notebook.coverTextValue(coverText)}
          </p>
        )}
        <p className={styles.meta}>{savedOn}</p>
        {valid ? (
          <p className={styles.price}>{text.priceNow(calculatePrice(configuration, data).total)}</p>
        ) : (
          <p className={styles.notice}>{text.unavailable}</p>
        )}
        <div className={styles.actions}>
          <Link
            to={ROUTES.configurator}
            state={editState}
            className={buttonClassName({ variant: 'secondary' })}
          >
            {text.edit}
          </Link>
          {!confirming && (
            <Button
              variant="ghost"
              onClick={() => setConfirming(true)}
              aria-label={text.removeLabel(savedOn)}
            >
              {text.remove}
            </Button>
          )}
        </div>
        {confirming && (
          // Confirmación en el lugar, con salida: sin ventanas emergentes.
          <div role="group" aria-label={text.removeQuestion} className={styles.confirm}>
            <p className={styles.confirmQuestion}>{text.removeQuestion}</p>
            <Button variant="secondary" onClick={onRemove}>
              {text.removeConfirm}
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              {text.cancel}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
