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
  it('muestra el cuaderno con su precio, que es único y cómo es', () => {
    renderWithRouter(
      <ProductDetail product={buildProduct()} categoryName="Para escribir" data={data} />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Cuaderno Flores' })).toBeInTheDocument();
    expect(screen.getByText(/20\.000/)).toBeInTheDocument();
    expect(screen.getByText(text.unique)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: text.specsTitle })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: content.catalog.eyebrow })).toHaveAttribute(
      'href',
      '/tienda',
    );
  });

  it('se agrega una sola vez: es una pieza única', async () => {
    renderWithRouter(<ProductDetail product={buildProduct()} data={data} />);
    expect(screen.queryByRole('group', { name: /cantidad/i })).not.toBeInTheDocument();

    const add = screen.getByRole('button', { name: text.addToCart });
    await userEvent.click(add);
    expect(screen.getByText(text.added)).toBeInTheDocument();
    expect(add).toBeDisabled();
  });

  it('si ya se vendió, ofrece pedir uno parecido a medida', () => {
    renderWithRouter(<ProductDetail product={buildProduct({ available: false })} data={data} />);
    expect(screen.getByText(text.sold)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: text.addToCart })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.orderCustom })).toHaveAttribute(
      'href',
      '/disena-tu-cuaderno',
    );
  });
});
