import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('se encuentra por su etiqueta y acepta texto', async () => {
    render(<Input label="Código postal" />);
    const input = screen.getByLabelText('Código postal');
    await userEvent.type(input, '1414');
    expect(input).toHaveValue('1414');
  });

  it('asocia el texto de ayuda al campo', () => {
    render(<Input label="Email" hint="Te mandamos el comprobante acá" />);
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'Te mandamos el comprobante acá',
    );
  });

  it('marca el campo como inválido y anuncia el error', () => {
    render(<Input label="Email" error="Revisá el email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('Revisá el email');
  });

  it('muestra cuántos caracteres quedan usados y no deja pasar el máximo', async () => {
    render(<Input label="Iniciales" maxLength={4} showCounter />);
    const input = screen.getByLabelText('Iniciales');
    expect(screen.getByText('0/4')).toBeInTheDocument();
    await userEvent.type(input, 'MuyDai');
    expect(input).toHaveValue('MuyD');
    expect(screen.getByText('4/4')).toBeInTheDocument();
  });
  it('con error, el mensaje de error reemplaza a la ayuda', () => {
    render(<Input label="Email" hint="Te mandamos el comprobante acá" error="Falta el email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription('Falta el email');
    expect(screen.queryByText('Te mandamos el comprobante acá')).not.toBeInTheDocument();
  });
});
