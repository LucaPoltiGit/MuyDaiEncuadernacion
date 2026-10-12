import type { ReactNode } from 'react';
import { Butterfly } from '../../ui/Butterfly/Butterfly';
import { Card } from '../../ui/Card/Card';
import { Flower } from '../../ui/Flower/Flower';
import styles from './PageMessage.module.css';

export interface PageMessageProps {
  title: string;
  text: string;
  /** Texto chico arriba del título (ej. "Próximamente"). */
  eyebrow?: string;
  /** Botones o links de salida. */
  actions?: ReactNode;
}

/** Bloque centrado para páginas de aviso: próximamente, 404, error. */
export function PageMessage({ title, text, eyebrow, actions }: PageMessageProps) {
  return (
    <div className={styles.wrapper}>
      <Card variant="stitched" padding="lg" className={styles.card}>
        <Flower size="lg" className={styles.cornerFlower} />
        <Butterfly size="md" className={styles.butterfly} />
        {eyebrow && (
          <p className={styles.eyebrow}>
            <Flower size="xs" />
            {eyebrow}
            <Flower size="xs" />
          </p>
        )}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>{text}</p>
        {actions && <div className={styles.actions}>{actions}</div>}
      </Card>
    </div>
  );
}
