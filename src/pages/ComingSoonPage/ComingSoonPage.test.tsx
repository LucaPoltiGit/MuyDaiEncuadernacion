import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComingSoonPage } from './ComingSoonPage';
import { content } from '../../content';
import { renderWithRouter } from '../../test/renderWithRouter';

const text = content.pages.comingSoon;

describe('ComingSoonPage', () => {
  it('muestra el nombre de la página y un link al inicio', () => {
    renderWithRouter(<ComingSoonPage pageKey="faq" />);
    expect(screen.getByRole('heading', { level: 1, name: text.titles.faq })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.backHome })).toHaveAttribute('href', '/');
  });

  it('en el inicio no ofrece volver al inicio', () => {
    renderWithRouter(<ComingSoonPage pageKey="home" />);
    expect(screen.queryByRole('link', { name: text.backHome })).not.toBeInTheDocument();
  });
});
