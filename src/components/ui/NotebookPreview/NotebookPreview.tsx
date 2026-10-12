import { useId } from 'react';
import type { BindingPreviewStyle } from '../../../types/notebook';
import styles from './NotebookPreview.module.css';

/**
 * Vista previa del cuaderno armada por capas (no fotos por combinación):
 * textura de la tela repetida + silueta según tamaño + encuadernación +
 * grosor según hojas + etiqueta con el texto. Sumar una tela nueva es
 * solo sumar su textura.
 *
 * El cuaderno siempre se ve grande (el producto es el protagonista); el
 * tamaño más chico se dibuja un poco más chico, pero la comparación real
 * entre tamaños la muestra `SizeComparison`.
 *
 * Todas las medidas de abajo son coordenadas internas del dibujo SVG.
 */
const CANVAS = { width: 320, height: 380 };
const MAX_COVER_HEIGHT = 330;
const FLOOR_Y = 352;
const FABRIC_TILE = 34;
const MAX_THICKNESS = 12;
/** El tamaño más chico se dibuja a este porcentaje del más grande. */
const MIN_VISUAL_SCALE = 0.72;
/** Leve inclinación: un objeto apoyado, no un rectángulo. */
const TILT_DEGREES = -3;

export interface NotebookPreviewProps {
  /** Textura de la tela. */
  fabricImage: string;
  widthCm: number;
  heightCm: number;
  /** Tamaño más grande disponible: define la escala. */
  referenceHeightCm: number;
  binding: BindingPreviewStyle;
  /** 0 a 1: qué tan grueso se ve el bloque de hojas. */
  thickness: number;
  coverText: string;
  /** Descripción completa para lectores de pantalla. */
  alt: string;
}

export function NotebookPreview({
  fabricImage,
  widthCm,
  heightCm,
  referenceHeightCm,
  binding,
  thickness,
  coverText,
  alt,
}: NotebookPreviewProps) {
  const patternId = useId();
  const ratio = heightCm / referenceHeightCm;
  const height = MAX_COVER_HEIGHT * (MIN_VISUAL_SCALE + (1 - MIN_VISUAL_SCALE) * ratio);
  const width = height * (widthCm / heightCm);
  const x = (CANVAS.width - width) / 2;
  const y = FLOOR_Y - height;
  const pages = Math.max(2, thickness * MAX_THICKNESS);

  const text = coverText.trim();
  const labelWidth = width * 0.68;
  const fontSize = Math.min(width * 0.12, (labelWidth * 0.92) / Math.max(text.length * 0.56, 1));
  const labelHeight = fontSize * 2;
  const labelX = x + (width - labelWidth) / 2 + (binding === 'spiral' ? 6 : 4);
  const labelY = y + height * 0.22;

  return (
    <svg
      className={styles.preview}
      viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
      role="img"
      aria-label={alt}
    >
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={FABRIC_TILE}
          height={FABRIC_TILE}
        >
          <image href={fabricImage} width={FABRIC_TILE} height={FABRIC_TILE} />
        </pattern>
      </defs>

      <ellipse
        className={styles.shadow}
        cx={CANVAS.width / 2}
        cy={FLOOR_Y + 5}
        rx={width * 0.6}
        ry="9"
      />
      <ellipse
        className={styles.contactShadow}
        cx={CANVAS.width / 2 + 2}
        cy={FLOOR_Y + 2}
        rx={width * 0.5}
        ry="3.5"
      />

      <g transform={`rotate(${TILT_DEGREES} ${CANVAS.width / 2} ${FLOOR_Y})`}>
        {/* Bloque de hojas: asoma a la derecha y abajo, más grueso con más hojas. */}
        <rect
          className={styles.pages}
          x={x + pages * 0.5}
          y={y + pages * 0.5}
          width={width}
          height={height}
          rx="8"
        />

        <g className={styles.cover}>
          <rect x={x} y={y} width={width} height={height} rx="8" fill={`url(#${patternId})`} />
          <rect className={styles.coverEdge} x={x} y={y} width={width} height={height} rx="8" />
        </g>

        <Binding style={binding} x={x} y={y} height={height} />

        {text && (
          <g className={styles.label}>
            <rect
              x={labelX}
              y={labelY}
              width={labelWidth}
              height={labelHeight}
              rx={labelHeight / 2}
            />
            <rect
              className={styles.labelStitch}
              x={labelX + 4}
              y={labelY + 4}
              width={labelWidth - 8}
              height={labelHeight - 8}
              rx={(labelHeight - 8) / 2}
            />
            <text
              x={labelX + labelWidth / 2}
              y={labelY + labelHeight / 2}
              fontSize={fontSize}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {text}
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}

interface BindingProps {
  style: BindingPreviewStyle;
  x: number;
  y: number;
  height: number;
}

/** Detalle del lomo según la encuadernación. */
function Binding({ style, x, y, height }: BindingProps) {
  const count = Math.max(4, Math.round(height / 22));
  const gap = height / (count + 1);
  const marks = Array.from({ length: count }, (_, i) => y + gap * (i + 1));

  switch (style) {
    case 'hardcover':
      return (
        <g className={styles.binding}>
          <rect className={styles.spine} x={x} y={y} width="14" height={height} rx="6" />
          <line
            className={styles.spineLine}
            x1={x + 17}
            y1={y + 6}
            x2={x + 17}
            y2={y + height - 6}
          />
        </g>
      );
    case 'spiral':
      return (
        <g className={styles.binding}>
          {marks.map((markY) => (
            <ellipse key={markY} className={styles.ring} cx={x + 2} cy={markY} rx="8" ry="4.5" />
          ))}
        </g>
      );
    case 'japanese':
      return (
        <g className={styles.binding}>
          <line className={styles.thread} x1={x + 12} y1={marks[0]} x2={x + 12} y2={marks.at(-1)} />
          {marks.map((markY) => (
            <g key={markY}>
              <line className={styles.thread} x1={x} y1={markY} x2={x + 12} y2={markY} />
              <circle className={styles.hole} cx={x + 12} cy={markY} r="2.2" />
            </g>
          ))}
        </g>
      );
    case 'exposed':
      return (
        <g className={styles.binding}>
          <rect className={styles.exposedSpine} x={x} y={y} width="9" height={height} rx="4" />
          {marks.map((markY) => (
            <line
              key={markY}
              className={styles.thread}
              x1={x - 2}
              y1={markY}
              x2={x + 9}
              y2={markY}
            />
          ))}
        </g>
      );
  }
}
