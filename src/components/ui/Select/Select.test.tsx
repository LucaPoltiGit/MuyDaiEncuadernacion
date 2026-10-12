import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'caba', label: 'CABA' },
  { value: 'gba', label: 'Gran Buenos Aires' },
  { value: 'interior', label: 'Interior', disabled: true },
];

describe('Select', () => {
  it('permite elegir una opción por su etiqueta', async () => {
    const onChange = vi.fn();
    render(<Select label="Zona de envío" options={options} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByLabelText('Zona de envío'), 'gba');
    expect(screen.getByLabelText('Zona de envío')).toHaveValue('gba');
    expect(onChange).toHaveBeenCalled();
  });

  it('muestra el placeholder como primera opción', () => {
    render(<Select label="Zona" options={options} placeholder="Elegí una zona" />);
    expect(screen.getByRole('option', { name: 'Elegí una zona' })).toBeInTheDocument();
  });

  it('deshabilita las opciones marcadas', () => {
    render(<Select label="Zona" options={options} />);
    expect(screen.getByRole('option', { name: 'Interior' })).toBeDisabled();
  });

  it('anuncia el error asociado al campo', () => {
    render(<Select label="Zona" options={options} error="Elegí una zona" />);
    expect(screen.getByLabelText('Zona')).toBeInvalid();
    expect(screen.getByLabelText('Zona')).toHaveAccessibleDescription('Elegí una zona');
  });
});
