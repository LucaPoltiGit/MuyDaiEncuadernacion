import { useId, useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  /** Texto de ayuda debajo del campo. */
  hint?: string;
  /** Mensaje de error; si está presente el campo se marca como inválido. */
  error?: string;
  /** Muestra "usados/máximo" cuando hay `maxLength`. */
  showCounter?: boolean;
}

export function Input({
  label,
  hint,
  error,
  showCounter = false,
  maxLength,
  value,
  defaultValue,
  onChange,
  className,
  ...rest
}: InputProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;
  const [innerLength, setInnerLength] = useState(String(defaultValue ?? '').length);
  const length = value !== undefined ? String(value).length : innerLength;
  const hasCounter = showCounter && maxLength !== undefined;

  const describedBy =
    [hint ? hintId : '', error ? errorId : '', hasCounter ? counterId : '']
      .filter(Boolean)
      .join(' ') || undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInnerLength(event.target.value.length);
    onChange?.(event);
  }

  return (
    <div className={[styles.field, className ?? ''].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      <div className={styles.footer}>
        <div className={styles.messages}>
          {hint && (
            <p id={hintId} className={styles.hint}>
              {hint}
            </p>
          )}
          {error && (
            <p id={errorId} className={styles.error}>
              {error}
            </p>
          )}
        </div>
        {hasCounter && (
          <p id={counterId} className={styles.counter} aria-live="polite">
            {length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
