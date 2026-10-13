import { Icon } from '../../ui/Icon/Icon';
import { whatsappLink } from '../../../constants/contact';
import { content } from '../../../content';
import styles from './WhatsAppButton.module.css';

const text = content.layout.whatsapp;

/** Festón: 10 ondas alrededor de un círculo (lienzo de 100×100). */
const SCALLOPS = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * 2 * Math.PI;
  return { cx: 50 + 37 * Math.cos(angle), cy: 50 + 37 * Math.sin(angle) };
});

export interface WhatsAppButtonProps {
  /** La página tiene una barra fija abajo: el botón se ubica por encima. */
  aboveBottomBar?: boolean;
}

/** Botón flotante para consultas, con mensaje pre-armado. */
export function WhatsAppButton({ aboveBottomBar = false }: WhatsAppButtonProps) {
  return (
    <a
      href={whatsappLink(text.message)}
      target="_blank"
      rel="noreferrer"
      aria-label={text.label}
      className={[styles.button, aboveBottomBar ? styles.raised : ''].filter(Boolean).join(' ')}
    >
      {/* Fondo festoneado (borde ondulado) con costura: decorativo. El área
          de toque es el cuadrado completo del link, no solo la silueta. */}
      <svg className={styles.shape} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        {/* Contorno crema (un poco más grande) y relleno tinta encima. */}
        <g className={styles.outline}>
          <circle cx="50" cy="50" r="40" />
          {SCALLOPS.map(({ cx, cy }) => (
            <circle key={`o${cx},${cy}`} cx={cx} cy={cy} r="11.5" />
          ))}
        </g>
        <g className={styles.scallop}>
          <circle cx="50" cy="50" r="38" />
          {SCALLOPS.map(({ cx, cy }) => (
            <circle key={`s${cx},${cy}`} cx={cx} cy={cy} r="9.5" />
          ))}
        </g>
        <circle className={styles.stitch} cx="50" cy="50" r="31" pathLength={100} />
      </svg>
      <Icon name="whatsapp" size="lg" />
    </a>
  );
}
