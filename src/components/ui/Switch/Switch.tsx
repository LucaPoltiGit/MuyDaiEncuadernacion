import { useId } from 'react';
import styles from './Switch.module.css';

export interface SwitchProps {
  label: string;
  /** Dato secundario debajo del label (ej. el recargo). */
  detail?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Interruptor de encendido/apagado (checkbox con rol switch). */
export function Switch({ label, detail, checked, onChange }: SwitchProps) {
  const id = useId();
  const detailId = `${id}-detail`;

  return (
    <div className={styles.wrapper}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        aria-describedby={detail ? detailId : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id} className={styles.label}>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
        <span className={styles.text}>{label}</span>
      </label>
      {/* Fuera del label: es la descripción, no parte del nombre. */}
      {detail && (
        <p id={detailId} className={styles.detail}>
          {detail}
        </p>
      )}
    </div>
  );
}
