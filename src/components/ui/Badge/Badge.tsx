import type { ReactNode } from 'react';
import styles from './Badge.module.css';

/**
 * Tonos visuales genéricos. Qué tono corresponde a cada estado de pedido
 * ("en producción", "enviado"...) lo decide quien usa el Badge, no el Badge.
 */
export type BadgeTone = 'neutral' | 'brand' | 'accent' | 'info' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  /** Punto de color antes del texto, útil para estados. */
  withDot?: boolean;
}

export function Badge({ children, tone = 'neutral', withDot = false }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[tone]].join(' ')}>
      {withDot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
