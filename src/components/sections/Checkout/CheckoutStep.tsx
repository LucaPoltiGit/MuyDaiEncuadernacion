import type { ReactNode } from 'react';
import styles from './CheckoutStep.module.css';

export interface CheckoutStepProps {
  /** Número del paso (decorativo: el orden ya lo da la página). */
  number: number;
  title: string;
  children: ReactNode;
}

/** Un bloque numerado del checkout ("1 Tus datos", "2 Entrega"). */
export function CheckoutStep({ number, title, children }: CheckoutStepProps) {
  return (
    <fieldset className={styles.step}>
      <legend className={styles.legend}>
        <span className={styles.number} aria-hidden="true">
          {number}
        </span>
        {title}
      </legend>
      <div className={styles.fields}>{children}</div>
    </fieldset>
  );
}
