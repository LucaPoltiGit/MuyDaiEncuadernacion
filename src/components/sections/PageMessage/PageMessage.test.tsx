import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageMessage } from './PageMessage';

describe('PageMessage', () => {
  it('muestra título como encabezado principal, texto y acciones', () => {
    render(
      <PageMessage
        eyebrow="Próximamente"
        title="Tienda"
        text="Estamos cosiendo esta página."
        actions={<a href="/">Volver al inicio</a>}
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Tienda' })).toBeInTheDocument();
    expect(screen.getByText('Próximamente')).toBeInTheDocument();
    expect(screen.getByText('Estamos cosiendo esta página.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toBeInTheDocument();
  });
});
