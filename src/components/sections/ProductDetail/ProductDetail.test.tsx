import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ProductDetail } from './ProductDetail';
import { content } from '../../../content';
import { buildProduct } from '../../../domain/cart/testFixture';
import { buildTestData } from '../../../domain/notebook/testFixture';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.product;
const data = buildTestData();

describe('ProductDetail', () => {
  it('muestra el cuaderno con su precio, stock y características', () => {
    renderWithRouter(
      <ProductDetail product={buildProduct()} categoryName="Para escribir" data={data} />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Cuaderno Flores' })).toBeInTheDocument();
    expect(screen.getByText(/20\.000/)).toBeInTheDocument();
    expect(screen.getByText(text.stock(3))).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: text.specsTitle })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: content.catalog.eyebrow })).toHaveAttribute(
      'href',
      '/tienda',
    );
  });

  it('agrega la cantidad elegida, sin pasarse del stock', async () => {
    renderWithRouter(<ProductDetail product={buildProduct({ stock: 2 })} data={data} />);
    const increase = screen.getByRole('button', { name: text.quantity.increase });
    await userEvent.click(increase);
    expect(increase).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: text.addToCart }));
    expect(screen.getByText(text.added)).toBeInTheDocument();
    // Ya están los 2 en el carrito: no deja agregar más.
    expect(screen.getByText(text.quantity.allInCart)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: text.addToCart })).toBeDisabled();
  });

  it('sin stock, ofrece pedirlo a medida', () => {
    renderWithRouter(<ProductDetail product={buildProduct({ stock: 0 })} data={data} />);
    expect(screen.queryByRole('button', { name: text.addToCart })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.orderCustom })).toHaveAttribute(
      'href',
      '/disena-tu-cuaderno',
    );
  });
});
