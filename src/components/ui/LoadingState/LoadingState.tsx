import { Flower } from '../Flower/Flower';
import styles from './LoadingState.module.css';

export interface LoadingStateProps {
  /** Qué se está cargando (ej. "Acomodando los cuadernos…"). */
  label: string;
}

/** Aviso de carga de una pantalla: la flor gira y el texto se anuncia. */
export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div className={styles.loading} role="status">
      <Flower size="lg" className={styles.spinner} />
      <p>{label}</p>
    </div>
  );
}
