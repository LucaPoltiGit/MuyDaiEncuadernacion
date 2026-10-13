import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckoutStep } from './CheckoutStep';

describe('CheckoutStep', () => {
  it('agrupa los campos bajo su título', () => {
    render(
      <CheckoutStep number={1} title="Tus datos">
        <input aria-label="Nombre" />
      </CheckoutStep>,
    );
    const group = screen.getByRole('group', { name: 'Tus datos' });
    expect(group).toContainElement(screen.getByLabelText('Nombre'));
  });
});
