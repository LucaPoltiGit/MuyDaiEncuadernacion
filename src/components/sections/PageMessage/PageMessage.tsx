import { useEffect, useRef } from 'react';
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
  /** Contenido extra entre el texto y las acciones (ej. detalle de un pedido). */
  children?: ReactNode;
  /** Momento de festejo (compra hecha): título más juguetón y la mariposa en vuelo. */
  celebrate?: boolean;
  /**
   * Lleva el foco al título al aparecer: para pantallas a las que se llega
   * desde otra página (ej. al volver del pago), así el lector de pantalla la lee.
   */
  focusTitle?: boolean;
}

/** Bloque centrado para páginas de aviso: próximamente, 404, error. */
export function PageMessage({
  title,
  text,
  eyebrow,
  actions,
  children,
  celebrate = false,
  focusTitle = false,
}: PageMessageProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusTitle) titleRef.current?.focus();
  }, [focusTitle]);

  return (
    <div className={[styles.wrapper, celebrate ? styles.celebrate : ''].filter(Boolean).join(' ')}>
      <Card variant="stitched" padding="lg" className={styles.card}>
        <Flower size="lg" className={styles.cornerFlower} />
        <Butterfly size={celebrate ? 'lg' : 'md'} className={styles.butterfly} />
        {eyebrow && (
          <p className={styles.eyebrow}>
            <Flower size="xs" />
            {eyebrow}
            <Flower size="xs" />
          </p>
        )}
        <h1 ref={titleRef} tabIndex={focusTitle ? -1 : undefined} className={styles.title}>
          {title}
        </h1>
        <p className={styles.text}>{text}</p>
        {children && <div className={styles.extra}>{children}</div>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </Card>
    </div>
  );
}
