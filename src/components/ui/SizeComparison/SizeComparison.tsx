import styles from './SizeComparison.module.css';

export interface SizeComparisonItem {
  id: string;
  name: string;
  widthCm: number;
  heightCm: number;
}

export interface SizeComparisonProps {
  sizes: SizeComparisonItem[];
  selectedId: string;
}

/** Medidas internas del dibujo SVG. */
const BOX = 64;
const GAP = 6;

/**
 * Siluetas de todos los tamaños a escala real, una al lado de la otra, con
 * la elegida resaltada: muestra el tamaño relativo de un vistazo. Decorativo
 * (el tamaño elegido ya se dice en texto al lado).
 */
export function SizeComparison({ sizes, selectedId }: SizeComparisonProps) {
  if (sizes.length === 0) return null;
  const maxHeight = Math.max(...sizes.map((size) => size.heightCm));
  const scale = BOX / maxHeight;
  const widths = sizes.map((size) => size.widthCm * scale);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + GAP * (sizes.length - 1);

  let x = 0;
  return (
    <svg
      className={styles.comparison}
      viewBox={`-2 -2 ${totalWidth + 4} ${BOX + 18}`}
      aria-hidden="true"
      focusable="false"
    >
      {sizes.map((size, index) => {
        const width = widths[index];
        const height = size.heightCm * scale;
        const left = x;
        x += width + GAP;
        const selected = size.id === selectedId;
        return (
          <g key={size.id}>
            <rect
              className={selected ? styles.selected : styles.size}
              x={left}
              y={BOX - height}
              width={width}
              height={height}
              rx="3"
            />
            <text
              className={selected ? styles.labelSelected : styles.label}
              x={left + width / 2}
              y={BOX + 13}
              textAnchor="middle"
            >
              {size.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
