import { useId } from 'react';
import styles from './Stepper.module.css';

export interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Cómo se muestra el valor (ej. "80 hojas"). */
  formatValue: (value: number) => string;
  decrementLabel: string;
  incrementLabel: string;
  hint?: string;
}

/** Selector numérico con botones − y +, en pasos fijos. */
export function Stepper({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  decrementLabel,
  incrementLabel,
  hint,
}: StepperProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-describedby={hint ? hintId : undefined}
      className={styles.group}
    >
      <p id={labelId} className={styles.label}>
        {label}
      </p>
      <div className={styles.control}>
        <button
          type="button"
          className={styles.button}
          aria-label={decrementLabel}
          disabled={value - step < min}
          onClick={() => onChange(Math.max(min, value - step))}
        >
          <span aria-hidden="true">−</span>
        </button>
        <output className={styles.value} aria-live="polite">
          {formatValue(value)}
        </output>
        <button
          type="button"
          className={styles.button}
          aria-label={incrementLabel}
          disabled={value + step > max}
          onClick={() => onChange(Math.min(max, value + step))}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}
