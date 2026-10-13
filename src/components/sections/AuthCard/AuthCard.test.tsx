import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthCard } from './AuthCard';

describe('AuthCard', () => {
  it('muestra el título, el formulario y el pie', () => {
    render(
      <AuthCard
        eyebrow="Mi cuenta"
        title="Ingresá"
        lead="Para ver tus compras."
        footer={<p>Pie</p>}
      >
        <form aria-label="Ingreso" />
      </AuthCard>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Ingresá' })).toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Ingreso' })).toBeInTheDocument();
    expect(screen.getByText('Pie')).toBeInTheDocument();
  });
});
