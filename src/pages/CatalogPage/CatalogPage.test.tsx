import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CatalogPage } from './CatalogPage';
import { content } from '../../content';
import { buildProduct } from '../../domain/cart/testFixture';
import { buildTestData } from '../../domain/notebook/testFixture';
import { getCatalog } from '../../services/catalogService';
import { getConfiguratorData } from '../../services/configuratorService';
import { renderWithRouter } from '../../test/renderWithRouter';

vi.mock('../../services/catalogService', () => ({ getCatalog: vi.fn() }));
vi.mock('../../services/configuratorService', () => ({ getConfiguratorData: vi.fn() }));

const text = content.catalog;
const mockedCatalog = vi.mocked(getCatalog);

describe('CatalogPage', () => {
  beforeEach(() => {
    mockedCatalog.mockReset();
    vi.mocked(getConfiguratorData).mockResolvedValue(buildTestData());
  });

  it('muestra la carga y después los cuadernos', async () => {
    mockedCatalog.mockResolvedValue({ categories: [], products: [buildProduct()] });
    renderWithRouter(<CatalogPage />);
    expect(screen.getByRole('status')).toHaveTextContent(text.loading);
    expect(await screen.findByRole('link', { name: 'Cuaderno Flores' })).toBeInTheDocument();
  });

  it('si falla, permite reintentar', async () => {
    mockedCatalog
      .mockRejectedValueOnce(new Error('sin red'))
      .mockResolvedValue({ categories: [], products: [buildProduct()] });
    renderWithRouter(<CatalogPage />);
    await userEvent.click(await screen.findByRole('button', { name: text.error.retry }));
    expect(await screen.findByRole('link', { name: 'Cuaderno Flores' })).toBeInTheDocument();
  });
});
