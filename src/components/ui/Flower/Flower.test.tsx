import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Flower } from './Flower';

describe('Flower', () => {
  it('es decorativa: los lectores de pantalla la ignoran', () => {
    render(
      <p>
        <Flower /> Próximamente
      </p>,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Próximamente')).toHaveTextContent(/^Próximamente$/);
  });
});
