import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('muestra su texto', () => {
    render(<Badge tone="success">Entregado</Badge>);
    expect(screen.getByText('Entregado')).toBeInTheDocument();
  });

  it('el punto de estado es decorativo y no cambia el texto leído', () => {
    const { container } = render(
      <Badge tone="info" withDot>
        Enviado
      </Badge>,
    );
    expect(container).toHaveTextContent(/^Enviado$/);
  });
});
