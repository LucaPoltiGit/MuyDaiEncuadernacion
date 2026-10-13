import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Catalog } from './Catalog';
import { content } from '../../../content';
import { buildProduct } from '../../../domain/cart/testFixture';
import { buildTestData } from '../../../domain/notebook/testFixture';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.catalog;
const catalog = {
  categories: [
    { id: 'escribir', name: 'Para escribir' },
    { id: 'dibujar', name: 'Para dibujar' },
    { id: 'vacia', name: 'Sin productos' },
  ],
  products: [
    buildProduct({ id: '1', slug: 'agotado', name: 'Agotado', stock: 0 }),
    buildProduct({ id: '2', slug: 'diario', name: 'Diario' }),
    buildProduct({ id: '3', slug: 'croquera', name: 'Croquera', categoryId: 'dibujar' }),
  ],
};

function productNames() {
  return screen
    .getAllByRole('article')
    .map((card) => within(card).getByRole('heading').textContent);
}

describe('Catalog', () => {
  it('lista los cuadernos con los agotados al final', () => {
    renderWithRouter(<Catalog catalog={catalog} data={buildTestData()} />);
    expect(screen.getByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
    expect(productNames()).toEqual(['Diario', 'Croquera', 'Agotado']);
    expect(screen.getByText(text.count(3))).toBeInTheDocument();
  });

  it('filtra por categoría y no ofrece categorías vacías', async () => {
    renderWithRouter(<Catalog catalog={catalog} data={buildTestData()} />);
    expect(screen.queryByRole('radio', { name: 'Sin productos' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', { name: 'Para dibujar' }));
    expect(productNames()).toEqual(['Croquera']);
    expect(screen.getByText(text.count(1))).toBeInTheDocument();
  });

  it('invita a diseñar uno a medida', () => {
    renderWithRouter(<Catalog catalog={catalog} data={buildTestData()} />);
    expect(screen.getByRole('link', { name: text.customCard.action })).toHaveAttribute(
      'href',
      '/disena-tu-cuaderno',
    );
  });
});
