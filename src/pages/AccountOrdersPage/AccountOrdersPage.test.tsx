import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccountOrdersPage } from './AccountOrdersPage';
import { content } from '../../content';
import { buildOrder } from '../../domain/checkout/testFixture';
import { buildTestData } from '../../domain/notebook/testFixture';
import { login } from '../../services/authService';
import { getConfiguratorData } from '../../services/configuratorService';
import { getMyOrders } from '../../services/orderService';
import { renderWithRouter } from '../../test/renderWithRouter';

vi.mock('../../services/configuratorService', () => ({ getConfiguratorData: vi.fn() }));
vi.mock('../../services/orderService', () => ({ getMyOrders: vi.fn() }));

const text = content.account.orders;

describe('AccountOrdersPage', () => {
  beforeEach(() => {
    vi.mocked(getConfiguratorData).mockResolvedValue(buildTestData());
    vi.mocked(getMyOrders).mockReset();
  });

  it('muestra las compras de la persona logueada', async () => {
    await login('ana@example.com', 'cuadernos');
    vi.mocked(getMyOrders).mockResolvedValue([buildOrder()]);
    renderWithRouter(<AccountOrdersPage />);
    expect(
      await screen.findByRole('article', { name: text.number('MD-0001') }),
    ).toBeInTheDocument();
  });

  it('si falla, permite reintentar', async () => {
    await login('ana@example.com', 'cuadernos');
    vi.mocked(getMyOrders).mockRejectedValue(new Error('sin red'));
    renderWithRouter(<AccountOrdersPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent(text.error);
    expect(screen.getByRole('button', { name: text.retry })).toBeInTheDocument();
  });
});
