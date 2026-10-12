import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('es decorativo por defecto', () => {
    render(<Icon name="cart" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('se anuncia con su etiqueta cuando la tiene', () => {
    render(<Icon name="instagram" label="Instagram" />);
    expect(screen.getByRole('img', { name: 'Instagram' })).toBeInTheDocument();
  });
});
