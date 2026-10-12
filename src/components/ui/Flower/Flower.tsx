import styles from './Flower.module.css';

/**
 * Flor de MuyDai: 5 pétalos redondos, apenas irregulares (como dibujados a
 * mano), con una costura punteada adentro de cada uno y el centro naranja
 * que repite el punto de la "i" del logo. Siempre decorativa.
 */
const PETALS = [
  { rotate: 0, scale: 1 },
  { rotate: 74, scale: 0.96 },
  { rotate: 143, scale: 1.03 },
  { rotate: 217, scale: 0.97 },
  { rotate: 288, scale: 1.01 },
];

const PETAL_PATH = 'M50 52C29 44 31 11 50 11C69 11 71 44 50 52Z';
const PETAL_STITCH_PATH = 'M50 43C38 38 38 19 50 18C62 19 62 38 50 43';

export type FlowerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface FlowerProps {
  size?: FlowerSize;
  /** `soft` para fondos: más suave, no compite con botones ni fotos. */
  tone?: 'brand' | 'soft';
  /** Sin costura en los pétalos (para tamaños muy chicos). */
  plain?: boolean;
  className?: string;
}

export function Flower({ size = 'md', tone = 'brand', plain, className }: FlowerProps) {
  const showStitch = plain === undefined ? size !== 'xs' : !plain;

  return (
    <svg
      className={[styles.flower, styles[size], styles[tone], className ?? '']
        .filter(Boolean)
        .join(' ')}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      {PETALS.map(({ rotate, scale }) => (
        <g
          key={rotate}
          transform={`rotate(${rotate} 50 50) translate(50 50) scale(${scale}) translate(-50 -50)`}
        >
          <path className={styles.petal} d={PETAL_PATH} />
          {showStitch && <path className={styles.stitch} d={PETAL_STITCH_PATH} pathLength={100} />}
        </g>
      ))}
      <circle className={styles.center} cx="50" cy="50" r="14" />
      <circle className={styles.shine} cx="45.5" cy="45.5" r="3.5" />
    </svg>
  );
}
