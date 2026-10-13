import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactFields } from './ContactFields';
import { content } from '../../../content';
import { emptyCheckoutForm } from '../../../domain/checkout/form';

const text = content.checkout;

describe('ContactFields', () => {
  it('avisa los cambios y muestra los errores de cada campo', async () => {
    const onChange = vi.fn();
    render(
      <ContactFields form={emptyCheckoutForm()} errors={{ email: 'email' }} onChange={onChange} />,
    );
    await userEvent.type(screen.getByLabelText(text.contact.name), 'A');
    expect(onChange).toHaveBeenCalledWith({ name: 'A' });
    expect(screen.getByLabelText(text.contact.email)).toHaveAccessibleDescription(
      expect.stringContaining(text.errors.email),
    );
  });
});
