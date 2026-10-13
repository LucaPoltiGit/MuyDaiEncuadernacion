import type { ReactNode } from 'react';
import styles from './PurchaseBar.module.css';

export interface PurchaseBarProps {
  /** Rótulo del precio (en mobile queda solo para lectores de pantalla). */
  priceLabel: string;
  /** Precio ya formateado. */
  price: string;
  /** Línea chica debajo del precio (plazo, stock...). */
  detail?: string;
  /** El botón principal. */
  action: ReactNode;
  /** Avisos arriba del precio (ej. ajustes automáticos). */
  top?: ReactNode;
  /** Mensajes debajo (ej. "agregado", por qué no se puede agregar). */
  bottom?: ReactNode;
}

/**
 * Precio + acción de compra. En mobile queda fija abajo de la pantalla
 * (siempre a mano); desde desktop se integra al contenido donde se ubique.
 * La ruta tiene que pedir `bottomBar` en su layout para reservar el espacio.
 */
export function PurchaseBar({ priceLabel, price, detail, action, top, bottom }: PurchaseBarProps) {
  return (
    <div className={styles.bar}>
      {top}
      <div className={styles.inner}>
        <div className={styles.priceBlock}>
          <span className={styles.priceLabel}>{priceLabel}</span>
          <span className={styles.price}>{price}</span>
          {detail && <span className={styles.detail}>{detail}</span>}
        </div>
        <div className={styles.action}>{action}</div>
      </div>
      {bottom}
    </div>
  );
}
