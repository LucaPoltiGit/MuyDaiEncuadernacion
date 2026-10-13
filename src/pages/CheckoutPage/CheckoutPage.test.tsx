import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckoutPage } from './CheckoutPage';
import { content } from '../../content';
import { buildProduct, buildProductItem } from '../../domain/cart/testFixture';
import { buildShippingConfig } from '../../domain/checkout/testFixture';
import { buildTestData } from '../../domain/notebook/testFixture';
import { saveCartItems } from '../../services/cartService';
import { getCatalog } from '../../services/catalogService';
import { getConfiguratorData } from '../../services/configuratorService';
import { getShippingConfig } from '../../services/shippingService';
import { renderWithRouter } from '../../test/renderWithRouter';

vi.mock('../../services/catalogService', () => ({ getCatalog: vi.fn() }));
vi.mock('../../services/configuratorService', () => ({ getConfiguratorData: vi.fn() }));
vi.mock('../../services/shippingService', () => ({ getShippingConfig: vi.fn() }));

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.mocked(getConfiguratorData).mockResolvedValue(buildTestData());
    vi.mocked(getCatalog).mockResolvedValue({ categories: [], products: [buildProduct()] });
    vi.mocked(getShippingConfig).mockResolvedValue(buildShippingConfig());
  });

  it('carga tienda y envíos y muestra el formulario', async () => {
    saveCartItems([buildProductItem()]);
    renderWithRouter(<CheckoutPage />);
    expect(screen.getByRole('status')).toHaveTextContent(content.checkout.loading);
    expect(
      await screen.findByRole('heading', { level: 1, name: content.checkout.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: content.checkout.contact.title })).toBeInTheDocument();
  });
});
