import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  /** Muestra "usados/máximo" cuando hay `maxLength`. */
  showCounter?: boolean;
}

/** Campo de texto largo (descripciones, testimonios), con la misma forma que `Input`. */
export function Textarea({
  label,
  hint,
  error,
  showCounter = false,
  maxLength,
  value,
  className,
  ...rest
}: TextareaProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;
  const hasCounter = showCounter && maxLength !== undefined;
  const showHint = Boolean(hint) && !error;
  const describedBy =
    [showHint ? hintId : '', error ? errorId : '', hasCounter ? counterId : '']
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div className={[styles.field, className ?? ''].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        className={styles.textarea}
        maxLength={maxLength}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      <div className={styles.footer}>
        <div>
          {showHint && (
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
          <p id={counterId} className={styles.counter}>
            {String(value ?? '').length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
