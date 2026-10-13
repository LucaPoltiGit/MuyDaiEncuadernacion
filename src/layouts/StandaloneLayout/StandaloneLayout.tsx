import type { ReactNode } from 'react';
import { Outlet } from 'react-router';
import styles from './StandaloneLayout.module.css';

export interface StandaloneLayoutProps {
  /** Contenido directo; si no hay, muestra la ruta hija. */
  children?: ReactNode;
}

/**
 * Pantallas fuera de la tienda (pago de prueba, avisos del panel): sin
 * header ni footer, con fondo de mesa de trabajo y el contenido centrado,
 * para que no parezcan una página rota.
 */
export function StandaloneLayout({ children }: StandaloneLayoutProps) {
  return <main className={styles.page}>{children ?? <Outlet />}</main>;
}
