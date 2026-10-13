import { Button } from '../Button/Button';
import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  message: string;
  retryLabel: string;
  onRetry: () => void;
}

/** Aviso de que algo no cargó, con reintento. */
export function ErrorState({ message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className={styles.error}>
      <p>{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}
