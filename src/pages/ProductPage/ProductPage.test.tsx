import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductPage } from './ProductPage';
import { content } from '../../content';
import { buildProduct } from '../../domain/cart/testFixture';
import { buildTestData } from '../../domain/notebook/testFixture';
import { getCatalog } from '../../services/catalogService';
import { getConfiguratorData } from '../../services/configuratorService';
import { renderWithRouter } from '../../test/renderWithRouter';

vi.mock('../../services/catalogService', () => ({ getCatalog: vi.fn() }));
vi.mock('../../services/configuratorService', () => ({ getConfiguratorData: vi.fn() }));

const routes = [{ path: '/tienda/:slug', element: <ProductPage /> }];

describe('ProductPage', () => {
  beforeEach(() => {
    vi.mocked(getConfiguratorData).mockResolvedValue(buildTestData());
    vi.mocked(getCatalog).mockResolvedValue({
      categories: [{ id: 'escribir', name: 'Para escribir' }],
      products: [buildProduct()],
    });
  });

  it('muestra el producto de la URL con su categoría', async () => {
    renderWithRouter(<p />, { path: '/tienda/cuaderno-flores', routes });
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Cuaderno Flores' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Para escribir')).toBeInTheDocument();
  });

  it('si el producto no existe, lo dice y ofrece volver a la tienda', async () => {
    renderWithRouter(<p />, { path: '/tienda/no-existe', routes });
    expect(
      await screen.findByRole('heading', { name: content.product.notFound.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: content.product.notFound.action })).toHaveAttribute(
      'href',
      '/tienda',
    );
  });
});
