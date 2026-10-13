import { Outlet } from 'react-router';
import styles from './StandaloneLayout.module.css';

/**
 * Pantallas fuera de la tienda (pago de prueba, avisos del panel): sin
 * header ni footer, con fondo de mesa de trabajo y el contenido centrado,
 * para que no parezcan una página rota.
 */
export function StandaloneLayout() {
  return (
    <main className={styles.page}>
      <Outlet />
    </main>
  );
}
