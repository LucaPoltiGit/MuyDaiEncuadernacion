import type { CSSProperties } from 'react';
import styles from './WaveEdge.module.css';

export interface WaveEdgeProps {
  /**
   * `bottom`: la onda cierra por abajo un bloque (ej. header).
   * `top`: la onda abre por arriba un bloque (ej. footer).
   */
  edge: 'bottom' | 'top';
  /** Color del bloque que la onda continúa, como token: `var(--color-bg)`. */
  fill: string;
  /** Color de la costura punteada que sigue la onda. */
  stitch?: string;
  className?: string;
}

/**
 * Borde ondulado con costura. La onda se dibuja en tramos de tamaño fijo
 * que se repiten (no se estira), así el punteado se ve igual en cualquier
 * ancho de pantalla. Es decorativo.
 */
export function WaveEdge({ edge, fill, stitch = 'var(--color-stitch)', className }: WaveEdgeProps) {
  const style = { '--wave-fill': fill, '--wave-stitch': stitch } as CSSProperties;

  return (
    <div
      className={[styles.wave, styles[edge], className ?? ''].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    >
      <span className={styles.fill} />
      <span className={styles.stitch} />
    </div>
  );
}
