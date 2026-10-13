import { Input } from '../../ui/Input/Input';
import { content } from '../../../content';
import type { CheckoutErrors, CheckoutForm } from '../../../domain/checkout/form';
import { CheckoutStep } from './CheckoutStep';

const text = content.checkout;

export interface ContactFieldsProps {
  form: CheckoutForm;
  errors: CheckoutErrors;
  onChange: (changes: Partial<CheckoutForm>) => void;
}

/** Nombre, email y teléfono de quien compra. */
export function ContactFields({ form, errors, onChange }: ContactFieldsProps) {
  const error = (field: keyof CheckoutErrors) => {
    const type = errors[field];
    return type ? text.errors[type] : undefined;
  };

  return (
    <CheckoutStep number={1} title={text.contact.title}>
      <Input
        label={text.contact.name}
        name="name"
        autoComplete="name"
        value={form.name}
        onChange={(event) => onChange({ name: event.target.value })}
        error={error('name')}
      />
      <Input
        label={text.contact.email}
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        hint={text.contact.emailHint}
        value={form.email}
        onChange={(event) => onChange({ email: event.target.value })}
        error={error('email')}
      />
      <Input
        label={text.contact.phone}
        name="phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        hint={text.contact.phoneHint}
        value={form.phone}
        onChange={(event) => onChange({ phone: event.target.value })}
        error={error('phone')}
      />
    </CheckoutStep>
  );
}
