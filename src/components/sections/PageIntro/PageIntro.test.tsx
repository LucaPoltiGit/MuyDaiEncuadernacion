import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageIntro } from './PageIntro';

describe('PageIntro', () => {
  it('muestra el título como h1, con el texto chico y la bajada', () => {
    render(<PageIntro eyebrow="Tienda" title="Cuadernos" lead="Hechos a mano." />);
    expect(screen.getByRole('heading', { level: 1, name: 'Cuadernos' })).toBeInTheDocument();
    expect(screen.getByText('Tienda')).toBeInTheDocument();
    expect(screen.getByText('Hechos a mano.')).toBeInTheDocument();
  });
});
