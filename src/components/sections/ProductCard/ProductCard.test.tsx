import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductCard } from './ProductCard';
import { content } from '../../../content';
import { buildProduct } from '../../../domain/cart/testFixture';
import { buildTestData } from '../../../domain/notebook/testFixture';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.catalog;
const data = buildTestData();

describe('ProductCard', () => {
  it('muestra nombre, precio y lleva a la ficha', () => {
    renderWithRouter(<ProductCard product={buildProduct()} data={data} />);
    expect(screen.getByRole('link', { name: 'Cuaderno Flores' })).toHaveAttribute(
      'href',
      '/tienda/cuaderno-flores',
    );
    expect(screen.getByText(/20\.000/)).toBeInTheDocument();
    expect(screen.queryByText(text.sold)).not.toBeInTheDocument();
  });

  it('si ya se vendió, lo dice', () => {
    renderWithRouter(<ProductCard product={buildProduct({ available: false })} data={data} />);
    expect(screen.getByText(text.sold)).toBeInTheDocument();
  });
});
