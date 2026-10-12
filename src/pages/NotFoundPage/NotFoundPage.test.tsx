import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NotFoundPage } from './NotFoundPage';
import { content } from '../../content';
import { renderWithRouter } from '../../test/renderWithRouter';

const text = content.pages.notFound;

describe('NotFoundPage', () => {
  it('avisa que la página no existe y ofrece salidas', () => {
    renderWithRouter(<NotFoundPage />, { path: '/no-existe' });
    expect(screen.getByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.backHome })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: text.goToCatalog })).toHaveAttribute('href', '/tienda');
  });
});
