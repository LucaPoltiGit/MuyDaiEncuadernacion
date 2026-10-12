import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Butterfly } from './Butterfly';

describe('Butterfly', () => {
  it('es decorativa: los lectores de pantalla la ignoran', () => {
    render(
      <p>
        <Butterfly /> Hecho a mano
      </p>,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Hecho a mano')).toHaveTextContent(/^Hecho a mano$/);
  });
});
