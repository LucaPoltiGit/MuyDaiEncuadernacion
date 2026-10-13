import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DeliveryFields } from './DeliveryFields';
import { content } from '../../../content';
import { buildCheckoutForm, buildShippingConfig } from '../../../domain/checkout/testFixture';

const text = content.checkout;
const shipping = buildShippingConfig();

describe('DeliveryFields', () => {
  it('al elegir retiro con un solo punto, lo deja elegido', async () => {
    const onChange = vi.fn();
    render(
      <DeliveryFields
        form={buildCheckoutForm()}
        errors={{}}
        shipping={shipping}
        quote={null}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('radio', { name: new RegExp(text.delivery.pickup) }));
    expect(onChange).toHaveBeenCalledWith({ method: 'pickup', pickupPointId: 'taller' });
  });

  it('para retirar muestra dónde y no pide dirección', () => {
    render(
      <DeliveryFields
        form={buildCheckoutForm({ method: 'pickup', pickupPointId: 'taller' })}
        errors={{}}
        shipping={shipping}
        quote={null}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('radio', { name: /Taller MuyDai/ })).toBeChecked();
    expect(screen.queryByLabelText(text.delivery.postalCode)).not.toBeInTheDocument();
  });
});
