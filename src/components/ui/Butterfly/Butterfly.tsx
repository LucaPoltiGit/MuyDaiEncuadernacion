import { useId } from 'react';
import styles from './Butterfly.module.css';

/**
 * Mariposa del logo de MuyDai: trazo continuo, suelto y con rulos, en
 * degradé rosa → naranja. Siempre decorativa. Las coordenadas siguen el
 * dibujo original del logo.
 */
const LINES = [
  // Antenas
  'M150 190C200 208 236 262 246 322',
  'M256 174C232 208 236 270 256 316',
  // Ala de arriba a la derecha, con el rulito al volver al cuerpo
  'M256 304C288 222 348 124 404 94C424 84 434 102 430 126C426 152 456 166 472 188C488 212 482 246 456 274C440 292 418 298 396 298C362 298 330 314 308 308C288 302 296 278 326 280C366 284 410 296 434 296',
  // Ala de abajo a la derecha, cerrando en el cuerpo
  'M434 296C500 312 534 398 544 468C478 494 380 490 322 446C296 426 272 404 264 378C254 346 266 324 256 304',
  // Ala de arriba a la izquierda, con el rulito de abajo
  'M244 334C202 284 132 226 92 218C66 214 64 240 78 264C96 302 112 360 162 380C192 392 216 386 220 370C224 354 204 358 198 372C190 392 188 432 196 470',
  // Ala de abajo a la izquierda y el pétalo del medio
  'M196 470C206 510 234 538 244 540C266 524 290 500 290 470C290 440 272 410 264 380',
  'M266 384C294 414 320 446 324 514C300 498 284 470 276 440',
];

export type ButterflySize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButterflyProps {
  size?: ButterflySize;
  /** `onDark` para fondos oscuros (trazo crema); `soft` para fondos claros sin protagonismo. */
  tone?: 'brand' | 'soft' | 'onDark';
  /** Espejada, para que mire hacia el otro lado. */
  flip?: boolean;
  className?: string;
}

export function Butterfly({ size = 'md', tone = 'brand', flip, className }: ButterflyProps) {
  const gradientId = useId();

  return (
    <svg
      className={[styles.butterfly, styles[size], styles[tone], flip ? styles.flip : '', className]
        .filter(Boolean)
        .join(' ')}
      viewBox="60 80 500 470"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="60"
          y1="0"
          x2="560"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" className={styles.stopStart} />
          <stop offset="1" className={styles.stopEnd} />
        </linearGradient>
      </defs>
      <g className={styles.lines} stroke={tone === 'brand' ? `url(#${gradientId})` : undefined}>
        {LINES.map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
