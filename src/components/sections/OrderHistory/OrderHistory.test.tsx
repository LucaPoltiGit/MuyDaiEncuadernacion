import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { OrderHistory } from './OrderHistory';
import { content } from '../../../content';
import { buildOrder } from '../../../domain/checkout/testFixture';
import { buildTestData } from '../../../domain/notebook/testFixture';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.account.orders;
const data = buildTestData();

describe('OrderHistory', () => {
  it('sin compras, invita a la tienda', () => {
    renderWithRouter(<OrderHistory orders={[]} data={data} />);
    expect(screen.getByRole('heading', { name: text.empty.title })).toBeInTheDocument();
  });

  it('muestra cada pedido con su estado, total y detalle', async () => {
    renderWithRouter(
      <OrderHistory
        orders={[
          buildOrder({
            status: 'inProduction',
            payment: { provider: 'mercadopago', status: 'approved', preferenceId: 'p' },
          }),
        ]}
        data={data}
      />,
    );
    const order = screen.getByRole('article', { name: text.number('MD-0001') });
    expect(order).toHaveTextContent(text.status.inProduction);
    expect(order).toHaveTextContent(/38\.700/);

    await userEvent.click(screen.getByText(text.details));
    expect(screen.getByText('Cuaderno Flores')).toBeVisible();
    expect(screen.getByText(content.notebook.customName)).toBeVisible();
    expect(screen.getByText(text.pickupAt('Taller MuyDai'))).toBeVisible();
    expect(screen.queryByRole('link', { name: text.payPending })).not.toBeInTheDocument();
  });

  it('un pedido sin pagar ofrece completar el pago', () => {
    renderWithRouter(<OrderHistory orders={[buildOrder()]} data={data} />);
    expect(screen.getByRole('link', { name: text.payPending })).toHaveAttribute(
      'href',
      '/checkout/pago-de-prueba?preferencia=pref-1',
    );
  });
});
