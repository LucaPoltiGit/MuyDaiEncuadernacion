import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CheckoutResultPage } from './CheckoutResultPage';
import { content } from '../../content';
import { buildProductItem } from '../../domain/cart/testFixture';
import { buildOrder } from '../../domain/checkout/testFixture';
import { loadCartItems, saveCartItems, saveCheckoutOrderId } from '../../services/cartService';
import { getOrder } from '../../services/orderService';
import { createPaymentPreference } from '../../services/paymentService';
import { renderWithRouter } from '../../test/renderWithRouter';

vi.mock('../../services/orderService', () => ({ getOrder: vi.fn() }));
vi.mock('../../services/paymentService', () => ({ createPaymentPreference: vi.fn() }));

const text = content.checkout.result;
const routes = [
  { path: '/checkout/resultado', element: <CheckoutResultPage /> },
  { path: '/checkout/pago-de-prueba', element: <p>Simulador</p> },
];

describe('CheckoutResultPage', () => {
  it('al volver del pago aprobado de este checkout, vacía el carrito', async () => {
    saveCartItems([buildProductItem()]);
    saveCheckoutOrderId('order-1');
    vi.mocked(getOrder).mockResolvedValue(
      buildOrder({ payment: { provider: 'mercadopago', status: 'approved', preferenceId: 'p' } }),
    );
    renderWithRouter(<p />, { path: '/checkout/resultado?pedido=order-1', routes });
    await screen.findByRole('heading', { name: text.approved.title('Ana') });
    await waitFor(() => expect(loadCartItems()).toEqual([]));
  });

  it('abrir un pedido viejo no toca el carrito actual', async () => {
    saveCartItems([buildProductItem()]);
    saveCheckoutOrderId('otro-pedido');
    vi.mocked(getOrder).mockResolvedValue(
      buildOrder({ payment: { provider: 'mercadopago', status: 'approved', preferenceId: 'p' } }),
    );
    renderWithRouter(<p />, { path: '/checkout/resultado?pedido=order-1', routes });
    await screen.findByRole('heading', { name: text.approved.title('Ana') });
    expect(loadCartItems()).toHaveLength(1);
  });

  it('muestra el pedido aprobado', async () => {
    vi.mocked(getOrder).mockResolvedValue(
      buildOrder({ payment: { provider: 'mercadopago', status: 'approved', preferenceId: 'p' } }),
    );
    renderWithRouter(<p />, { path: '/checkout/resultado?pedido=order-1', routes });
    expect(
      await screen.findByRole('heading', { name: text.approved.title('Ana') }),
    ).toBeInTheDocument();
    expect(getOrder).toHaveBeenCalledWith('order-1');
  });

  it('si el pago fue rechazado, reintentar vuelve a pagar', async () => {
    vi.mocked(getOrder).mockResolvedValue(
      buildOrder({ payment: { provider: 'mercadopago', status: 'rejected', preferenceId: 'p' } }),
    );
    vi.mocked(createPaymentPreference).mockResolvedValue({
      preferenceId: 'p2',
      checkoutUrl: '/checkout/pago-de-prueba?preferencia=p2',
    });
    renderWithRouter(<p />, { path: '/checkout/resultado?pedido=order-1', routes });
    await userEvent.click(await screen.findByRole('button', { name: text.rejected.retry }));
    expect(await screen.findByText('Simulador')).toBeInTheDocument();
  });

  it('si el pedido no existe, lo dice', async () => {
    vi.mocked(getOrder).mockResolvedValue(null);
    renderWithRouter(<p />, { path: '/checkout/resultado?pedido=nada', routes });
    expect(await screen.findByRole('heading', { name: text.notFound.title })).toBeInTheDocument();
  });
});
