import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CheckoutResult } from './CheckoutResult';
import { content } from '../../../content';
import { buildOrder } from '../../../domain/checkout/testFixture';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.checkout.result;

describe('CheckoutResult', () => {
  it('pago aprobado: agradece y explica qué sigue', () => {
    renderWithRouter(
      <CheckoutResult
        order={buildOrder({
          payment: { provider: 'mercadopago', status: 'approved', preferenceId: 'p' },
        })}
        onRetry={() => {}}
        retrying={false}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: text.approved.title('Ana') }),
    ).toBeInTheDocument();
    expect(screen.getByText(text.approved.text('MD-0001'))).toBeInTheDocument();
    expect(screen.getByText(text.nextSteps.custom[0])).toBeInTheDocument();
    expect(screen.getByText(text.estimatePickup(9))).toBeInTheDocument();
  });

  it('pago pendiente: avisa que el pedido queda reservado', () => {
    renderWithRouter(<CheckoutResult order={buildOrder()} onRetry={() => {}} retrying={false} />);
    expect(screen.getByRole('heading', { name: text.pending.title })).toBeInTheDocument();
  });

  it('pago rechazado: deja reintentar y avisa si no se pudo', async () => {
    const onRetry = vi.fn();
    renderWithRouter(
      <CheckoutResult
        order={buildOrder({
          payment: { provider: 'mercadopago', status: 'rejected', preferenceId: 'p' },
        })}
        onRetry={onRetry}
        retrying={false}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: text.rejected.retry }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('si el reintento no se pudo iniciar, lo explica', () => {
    renderWithRouter(
      <CheckoutResult
        order={buildOrder({
          payment: { provider: 'mercadopago', status: 'rejected', preferenceId: 'p' },
        })}
        onRetry={() => {}}
        retrying={false}
        retryFailed
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(text.rejected.retryFailed);
  });
});
