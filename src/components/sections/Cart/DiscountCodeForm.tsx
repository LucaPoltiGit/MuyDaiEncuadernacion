import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { discountRejectionText } from './discountText';
import { content } from '../../../content';
import type { DiscountResult } from '../../../domain/cart/discounts';
import styles from './DiscountCodeForm.module.css';

const text = content.cart.discount;

export interface DiscountCodeFormProps {
  /** Busca y evalúa el código; si aplica, el carrito lo guarda. */
  onApply: (code: string) => Promise<DiscountResult>;
}

/** Campo para ingresar un código de descuento, con el motivo si no aplica. */
export function DiscountCodeForm({ onApply }: DiscountCodeFormProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [applying, setApplying] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!code.trim()) {
      setError(text.empty);
      return;
    }
    setApplying(true);
    setError(undefined);
    try {
      const result = await onApply(code);
      if (result.status === 'rejected') setError(discountRejectionText(result.reason));
    } catch {
      setError(text.error);
    } finally {
      setApplying(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label={text.label}
        value={code}
        onChange={(event) => {
          setCode(event.target.value);
          setError(undefined);
        }}
        error={error}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
      />
      <Button type="submit" variant="secondary" disabled={applying} className={styles.apply}>
        {applying ? text.applying : text.apply}
      </Button>
    </form>
  );
}
