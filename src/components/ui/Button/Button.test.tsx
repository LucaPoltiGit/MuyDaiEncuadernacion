import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('muestra su texto como nombre accesible', () => {
    render(<Button>Agregar al carrito</Button>);
    expect(screen.getByRole('button', { name: 'Agregar al carrito' })).toBeInTheDocument();
  });

  it('llama a onClick al hacer clic', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Comprar</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Comprar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('no llama a onClick cuando está deshabilitado', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Comprar
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Comprar' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('por defecto no envía formularios', () => {
    render(<Button>Ver más</Button>);
    expect(screen.getByRole('button', { name: 'Ver más' })).toHaveAttribute('type', 'button');
  });
});
