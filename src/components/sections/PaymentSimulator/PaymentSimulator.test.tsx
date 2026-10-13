import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PaymentSimulator } from './PaymentSimulator';
import { content } from '../../../content';
import { buildOrder } from '../../../domain/checkout/testFixture';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.checkout.simulator;

describe('PaymentSimulator', () => {
  it('aclara que es una prueba y muestra el pedido a pagar', () => {
    renderWithRouter(<PaymentSimulator order={buildOrder()} onResolve={() => {}} />);
    expect(screen.getByText(text.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(text.order('MD-0001'))).toBeInTheDocument();
    expect(screen.getByText(/38\.700/)).toBeInTheDocument();
  });

  it('resuelve el pago con lo que se elija, una sola vez', async () => {
    const onResolve = vi.fn();
    renderWithRouter(<PaymentSimulator order={buildOrder()} onResolve={onResolve} />);
    await userEvent.click(screen.getByRole('button', { name: text.reject }));
    expect(onResolve).toHaveBeenCalledWith('rejected');
    expect(screen.getByRole('button', { name: text.processing })).toBeDisabled();
  });
});
