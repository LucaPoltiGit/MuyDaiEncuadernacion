import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouteErrorPage } from './RouteErrorPage';
import { content } from '../../content';

const text = content.pages.error;

describe('RouteErrorPage', () => {
  it('explica que hubo un error y permite volver al inicio', () => {
    render(<RouteErrorPage />);
    expect(screen.getByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.backHome })).toHaveAttribute('href', '/');
  });
});
