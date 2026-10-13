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
    renderWithRouter(<ProductCard product={buildProduct({ stock: 10 })} data={data} />);
    expect(screen.getByRole('link', { name: 'Cuaderno Flores' })).toHaveAttribute(
      'href',
      '/tienda/cuaderno-flores',
    );
    expect(screen.getByText(/20\.000/)).toBeInTheDocument();
    expect(screen.queryByText(text.outOfStock)).not.toBeInTheDocument();
  });

  it('avisa cuando quedan pocos', () => {
    renderWithRouter(<ProductCard product={buildProduct({ stock: 2 })} data={data} />);
    expect(screen.getByText(text.lowStock(2))).toBeInTheDocument();
  });

  it('avisa cuando no hay stock', () => {
    renderWithRouter(<ProductCard product={buildProduct({ stock: 0 })} data={data} />);
    expect(screen.getByText(text.outOfStock)).toBeInTheDocument();
  });
});
