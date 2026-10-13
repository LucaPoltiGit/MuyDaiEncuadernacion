import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AdminOrders } from './AdminOrders';
import { content } from '../../../content';
import { buildOrder } from '../../../domain/checkout/testFixture';
import { buildTestData } from '../../../domain/notebook/testFixture';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.admin.orders;
const data = buildTestData();
const paid = buildOrder({
  status: 'paid',
  payment: { provider: 'mercadopago', status: 'approved', preferenceId: 'p' },
});
const pending = buildOrder({ id: 'order-2', number: 'MD-0002' });

describe('AdminOrders', () => {
  it('muestra lo necesario para atender el pedido, incluido el texto a bordar', () => {
    renderWithRouter(<AdminOrders orders={[paid]} data={data} onStatusChange={async () => true} />);
    const card = screen.getByRole('article', { name: text.number('MD-0001') });
    expect(card).toHaveTextContent('Ana Pérez');
    expect(card).toHaveTextContent(text.pickupAt('Taller MuyDai'));
    expect(card).toHaveTextContent(text.coverText('Ana'));
    expect(screen.getByRole('link', { name: /11 5555-1234/ })).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5491155551234'),
    );
  });

  it('filtra por estado', async () => {
    renderWithRouter(
      <AdminOrders orders={[paid, pending]} data={data} onStatusChange={async () => true} />,
    );
    expect(screen.getByText(text.count(2))).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: text.status.pendingPayment }));
    expect(screen.getByText(text.count(1))).toBeInTheDocument();
    expect(screen.getByRole('article', { name: text.number('MD-0002') })).toBeInTheDocument();
  });

  it('cambia el estado solo a los permitidos', async () => {
    const onStatusChange = vi.fn(async () => true);
    renderWithRouter(<AdminOrders orders={[paid]} data={data} onStatusChange={onStatusChange} />);
    const select = screen.getByLabelText(text.statusLabel);
    // Retira en el taller: no ofrece "Enviado".
    expect(screen.queryByRole('option', { name: text.status.shipped })).not.toBeInTheDocument();
    await userEvent.selectOptions(select, 'inProduction');
    await userEvent.click(screen.getByRole('button', { name: text.update }));
    expect(onStatusChange).toHaveBeenCalledWith('order-1', 'inProduction');
  });
});
