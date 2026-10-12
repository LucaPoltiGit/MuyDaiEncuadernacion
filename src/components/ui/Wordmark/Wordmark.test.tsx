import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Wordmark } from './Wordmark';

describe('Wordmark', () => {
  it('se lee como el nombre completo de la marca', () => {
    render(
      <a href="/">
        <Wordmark name="MuyDai" />
      </a>,
    );
    expect(screen.getByRole('link', { name: 'MuyDai' })).toBeInTheDocument();
  });

  it('funciona con nombres que no terminan en "i"', () => {
    render(
      <a href="/">
        <Wordmark name="Taller" />
      </a>,
    );
    expect(screen.getByRole('link', { name: 'Taller' })).toBeInTheDocument();
  });
});
