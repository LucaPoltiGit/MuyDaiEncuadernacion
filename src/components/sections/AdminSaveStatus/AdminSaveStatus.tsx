import { content } from '../../../content';
import type { AdminSaveState } from '../../../hooks/useAdminSave';
import styles from './AdminSaveStatus.module.css';

const text = content.admin;

export interface AdminSaveStatusProps {
  state: AdminSaveState;
  /** Mensaje de éxito propio (por defecto, "Listo, guardado."). */
  savedMessage?: string;
}

/** Anuncia cómo terminó un guardado del panel (para todos, también lectores de pantalla). */
export function AdminSaveStatus({ state, savedMessage = text.saved }: AdminSaveStatusProps) {
  const isError = state.status === 'error';
  return (
    <p
      role="status"
      className={[styles.status, isError ? styles.error : ''].filter(Boolean).join(' ')}
    >
      {state.status === 'saved' && savedMessage}
      {isError && (state.issues ? text.saveError : text.unexpectedError)}
    </p>
  );
}
