import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CartView } from './CartView';
import { content } from '../../../content';
import {
  buildCustomItem,
  buildDiscount,
  buildProduct,
  buildProductItem,
} from '../../../domain/cart/testFixture';
import { buildTestData } from '../../../domain/notebook/testFixture';
import { saveCartItems, saveDiscountCode } from '../../../services/cartService';
import { findDiscountCode } from '../../../services/discountService';
import { renderWithRouter } from '../../../test/renderWithRouter';
import type { CartItem } from '../../../types/cart';

vi.mock('../../../services/discountService', () => ({ findDiscountCode: vi.fn() }));

const text = content.cart;
const mockedFind = vi.mocked(findDiscountCode);
const shop = {
  configurator: buildTestData(),
  catalog: { categories: [], products: [buildProduct()] },
};

function renderCart(items: CartItem[]) {
  saveCartItems(items);
  return renderWithRouter(<CartView shop={shop} />);
}

function summary() {
  return within(screen.getByRole('region', { name: text.summary.title }));
}

function totalRow() {
  return summary().getByText(text.summary.total).closest('div');
}

describe('CartView', () => {
  beforeEach(() => {
    mockedFind.mockReset();
  });

  it('vacío, ofrece la tienda y el configurador', () => {
    renderCart([]);
    expect(screen.getByRole('heading', { name: text.empty.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.empty.catalog })).toHaveAttribute(
      'href',
      '/tienda',
    );
    expect(screen.getByRole('link', { name: text.empty.configurator })).toBeInTheDocument();
  });

  it('muestra cada cuaderno y el total con precios vigentes', () => {
    // Tienda $20.000 + a medida $16.200
    renderCart([buildProductItem(), buildCustomItem()]);
    expect(screen.getByRole('heading', { name: 'Cuaderno Flores' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: content.notebook.customName })).toBeInTheDocument();
    expect(totalRow()).toHaveTextContent(/36\.200/);
    expect(screen.getByRole('link', { name: text.summary.checkout })).toHaveAttribute(
      'href',
      '/checkout',
    );
  });

  it('quitar el último cuaderno deja el carrito vacío', async () => {
    renderCart([buildProductItem()]);
    await userEvent.click(
      screen.getByRole('button', { name: text.line.removeLabel('Cuaderno Flores') }),
    );
    expect(screen.getByRole('heading', { name: text.empty.title })).toBeInTheDocument();
  });

  it('un cuaderno que ya no está bloquea el checkout y lleva a revisarlo', async () => {
    renderCart([buildProductItem({ productId: 'borrado' })]);
    const problem = screen.getByText(text.problems.productRemoved);
    expect(screen.getByText(text.line.excluded)).toBeInTheDocument();

    const checkout = screen.getByRole('button', { name: text.summary.checkout });
    expect(checkout).toHaveAttribute('aria-disabled', 'true');
    expect(checkout).toHaveAccessibleDescription(text.summary.blocked);
    await userEvent.click(checkout);
    expect(problem).toHaveFocus();
  });

  it('si no se puede revisar el código guardado, permite reintentar', async () => {
    mockedFind
      .mockRejectedValueOnce(new Error('sin red'))
      .mockResolvedValue(buildDiscount({ code: 'HOLA10' }));
    saveDiscountCode('HOLA10');
    renderCart([buildProductItem()]);

    await userEvent.click(await screen.findByRole('button', { name: text.discount.retry }));
    expect(await summary().findByText(text.summary.discount('HOLA10'))).toBeInTheDocument();
  });

  it('aplica un código válido y lo descuenta del total', async () => {
    mockedFind.mockResolvedValue(buildDiscount({ code: 'HOLA10', value: 10 }));
    renderCart([buildProductItem()]);

    await userEvent.type(screen.getByLabelText(text.discount.label), 'hola10');
    await userEvent.click(screen.getByRole('button', { name: text.discount.apply }));

    expect(await summary().findByText(text.summary.discount('HOLA10'))).toBeInTheDocument();
    expect(totalRow()).toHaveTextContent(/18\.000/);

    await userEvent.click(
      screen.getByRole('button', { name: text.summary.removeDiscountLabel('HOLA10') }),
    );
    expect(totalRow()).toHaveTextContent(/20\.000/);
    expect(screen.getByLabelText(text.discount.label)).toBeInTheDocument();
  });

  it('si el código no existe, lo dice y no lo aplica', async () => {
    mockedFind.mockResolvedValue(null);
    renderCart([buildProductItem()]);

    await userEvent.type(screen.getByLabelText(text.discount.label), 'NOEXISTE');
    await userEvent.click(screen.getByRole('button', { name: text.discount.apply }));

    expect(await screen.findByText(text.discount.rejected.notFound)).toBeInTheDocument();
    expect(screen.getByLabelText(text.discount.label)).toBeInvalid();
    expect(totalRow()).toHaveTextContent(/20\.000/);
  });

  it('si al cambiar el carrito el código deja de cumplir el mínimo, avisa cuánto falta', async () => {
    mockedFind.mockResolvedValue(buildDiscount({ code: 'MIN30', minSubtotal: 30000 }));
    renderCart([buildProductItem(), buildCustomItem()]);

    await userEvent.type(screen.getByLabelText(text.discount.label), 'MIN30');
    await userEvent.click(screen.getByRole('button', { name: text.discount.apply }));
    expect(await summary().findByText(text.summary.discount('MIN30'))).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: text.line.removeLabel(content.notebook.customName) }),
    );
    expect(
      // formatPrice usa espacio duro; Testing Library normaliza los espacios del DOM.
      screen.getByText(text.discount.rejected.belowMinimum(30000, 10000).replace(/\s+/g, ' ')),
    ).toBeInTheDocument();
    expect(totalRow()).toHaveTextContent(/20\.000/);
  });
});
