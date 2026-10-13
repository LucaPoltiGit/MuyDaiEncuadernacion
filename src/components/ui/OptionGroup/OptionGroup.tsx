import { useId } from 'react';
import type { ReactNode } from 'react';
import { Flower } from '../Flower/Flower';
import styles from './OptionGroup.module.css';

export interface OptionGroupOption {
  value: string;
  label: string;
  /** Dato secundario (ej. "+ $1.500", "hasta 120 hojas"). */
  detail?: string;
  /** Imagen o muestra visual (ej. textura de la tela). */
  media?: ReactNode;
  disabled?: boolean;
  /** Motivo visible cuando está deshabilitada (ej. "Sin stock"). */
  disabledReason?: string;
}

export interface OptionGroupProps {
  legend: string;
  options: OptionGroupOption[];
  value: string | null;
  onChange: (value: string) => void;
  /**
   * `chips` para opciones cortas, `list` para opciones con descripción larga,
   * `swatches` para muestras visuales, `pills` para filtros (compactas, en fila).
   */
  layout?: 'chips' | 'list' | 'swatches' | 'pills';
  hint?: string;
}

export function OptionGroup({
  legend,
  options,
  value,
  onChange,
  layout = 'chips',
  hint,
}: OptionGroupProps) {
  const name = useId();
  const hintId = `${name}-hint`;

  return (
    <fieldset className={styles.group} aria-describedby={hint ? hintId : undefined}>
      <legend className={styles.legend}>{legend}</legend>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <div className={[styles.options, styles[layout]].join(' ')}>
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;
          return (
            <div key={option.value} className={styles.option}>
              <input
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                checked={value === option.value}
                // aria-disabled (no `disabled`): sigue siendo alcanzable con
                // teclado y lector de pantalla, que anuncian el motivo.
                aria-disabled={option.disabled || undefined}
                onChange={() => {
                  if (!option.disabled) onChange(option.value);
                }}
                className={styles.radio}
              />
              <label htmlFor={optionId} className={styles.card}>
                {value === option.value && (
                  <Flower size="sm" plain className={styles.selectedMark} />
                )}
                {option.media && (
                  <span className={styles.media} aria-hidden="true">
                    {option.media}
                  </span>
                )}
                <span className={styles.text}>
                  <span className={styles.label}>{option.label}</span>
                  {option.detail && <span className={styles.detail}>{option.detail}</span>}
                  {option.disabled && option.disabledReason && (
                    <span className={styles.reason}>{option.disabledReason}</span>
                  )}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
