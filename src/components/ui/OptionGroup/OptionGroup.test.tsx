import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { OptionGroup } from './OptionGroup';
import type { OptionGroupOption } from './OptionGroup';

const options: OptionGroupOption[] = [
  { value: 'a6', label: 'A6', detail: '10,5 × 14,8 cm' },
  { value: 'a5', label: 'A5', detail: '14,8 × 21 cm' },
  { value: 'a4', label: 'A4', disabled: true, disabledReason: 'Sin stock' },
];

function Controlled({ onChange }: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState<string | null>('a6');
  return (
    <OptionGroup
      legend="Tamaño"
      options={options}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

describe('OptionGroup', () => {
  it('agrupa las opciones bajo su título', () => {
    render(<Controlled />);
    expect(screen.getByRole('group', { name: 'Tamaño' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('marca la opción elegida y avisa el cambio', async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    expect(screen.getByRole('radio', { name: /A6/ })).toBeChecked();
    await userEvent.click(screen.getByText('A5'));
    expect(screen.getByRole('radio', { name: /A5/ })).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('a5');
  });

  it('se puede recorrer con el teclado', async () => {
    render(<Controlled />);
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: /A6/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: /A5/ })).toBeChecked();
  });

  it('no deja elegir una opción deshabilitada y muestra el motivo', async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    const a4 = screen.getByRole('radio', { name: /A4.*Sin stock/ });
    expect(a4).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(screen.getByText('A4'));
    expect(onChange).not.toHaveBeenCalled();
    expect(a4).not.toBeChecked();
    expect(screen.getByText('Sin stock')).toBeInTheDocument();
  });

  it('las opciones sin stock se alcanzan con teclado para escuchar el motivo', async () => {
    render(<Controlled />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('radio', { name: /A4.*Sin stock/ })).toHaveFocus();
    expect(screen.getByRole('radio', { name: /A5/ })).toBeChecked();
  });
});
