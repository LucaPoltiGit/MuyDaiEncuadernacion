import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CartPage } from './CartPage';
import { content } from '../../content';
import { buildProduct, buildProductItem } from '../../domain/cart/testFixture';
import { buildTestData } from '../../domain/notebook/testFixture';
import { saveCartItems } from '../../services/cartService';
import { getCatalog } from '../../services/catalogService';
import { getConfiguratorData } from '../../services/configuratorService';
import { renderWithRouter } from '../../test/renderWithRouter';

vi.mock('../../services/catalogService', () => ({ getCatalog: vi.fn() }));
vi.mock('../../services/configuratorService', () => ({ getConfiguratorData: vi.fn() }));

describe('CartPage', () => {
  beforeEach(() => {
    vi.mocked(getConfiguratorData).mockResolvedValue(buildTestData());
    vi.mocked(getCatalog).mockResolvedValue({ categories: [], products: [buildProduct()] });
  });

  it('carga los datos y muestra el carrito guardado', async () => {
    saveCartItems([buildProductItem()]);
    renderWithRouter(<CartPage />);
    expect(screen.getByRole('status')).toHaveTextContent(content.cart.loading);
    expect(
      await screen.findByRole('heading', { level: 1, name: content.cart.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cuaderno Flores' })).toBeInTheDocument();
  });
});
