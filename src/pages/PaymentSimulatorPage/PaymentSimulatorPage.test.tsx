import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaymentSimulatorPage } from './PaymentSimulatorPage';
import { content } from '../../content';
import { buildOrder } from '../../domain/checkout/testFixture';
import { getPaymentPreference, simulatePayment } from '../../services/paymentService';
import { renderWithRouter } from '../../test/renderWithRouter';

vi.mock('../../services/paymentService', () => ({
  getPaymentPreference: vi.fn(),
  simulatePayment: vi.fn(),
}));

const text = content.checkout.simulator;
const routes = [
  { path: '/checkout/pago-de-prueba', element: <PaymentSimulatorPage /> },
  { path: '/checkout/resultado', element: <p>Resultado</p> },
];

describe('PaymentSimulatorPage', () => {
  beforeEach(() => {
    vi.mocked(getPaymentPreference).mockReset();
    vi.mocked(simulatePayment).mockReset();
  });

  it('muestra el pedido de la preferencia y vuelve a la tienda con el resultado', async () => {
    vi.mocked(getPaymentPreference).mockResolvedValue(buildOrder());
    vi.mocked(simulatePayment).mockResolvedValue('order-1');
    const { router } = renderWithRouter(<p />, {
      path: '/checkout/pago-de-prueba?preferencia=pref-1',
      routes,
    });

    await userEvent.click(await screen.findByRole('button', { name: text.approve }));
    expect(simulatePayment).toHaveBeenCalledWith('pref-1', 'approved');
    expect(await screen.findByText('Resultado')).toBeInTheDocument();
    expect(router.state.location.search).toBe('?pedido=order-1');
  });

  it('si la preferencia no existe, lo dice', async () => {
    vi.mocked(getPaymentPreference).mockResolvedValue(null);
    renderWithRouter(<p />, { path: '/checkout/pago-de-prueba?preferencia=x', routes });
    expect(await screen.findByRole('heading', { name: text.notFound.title })).toBeInTheDocument();
  });
});
