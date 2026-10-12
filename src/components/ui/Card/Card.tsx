import type { ReactNode } from 'react';
import styles from './Card.module.css';

export type CardVariant = 'plain' | 'muted' | 'stitched';
export type CardPadding = 'none' | 'md' | 'lg';

export interface CardProps {
  children: ReactNode;
  /** Elemento HTML a usar, según el significado del contenido. */
  as?: 'div' | 'article' | 'section' | 'li';
  /** `stitched` agrega la costura punteada característica de MuyDai. */
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
}

export function Card({
  children,
  as: Element = 'div',
  variant = 'plain',
  padding = 'md',
  className,
}: CardProps) {
  const classes = [styles.card, styles[variant], styles[`padding-${padding}`], className ?? '']
    .filter(Boolean)
    .join(' ');

  return <Element className={classes}>{children}</Element>;
}
