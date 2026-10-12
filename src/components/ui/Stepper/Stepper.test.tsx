import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Stepper } from './Stepper';

function Controlled({ max = 80 }: { max?: number }) {
  const [value, setValue] = useState(60);
  return (
    <Stepper
      label="Cantidad de hojas"
      value={value}
      min={40}
      max={max}
      step={20}
      onChange={setValue}
      formatValue={(v) => `${v} hojas`}
      decrementLabel="Restar 20 hojas"
      incrementLabel="Sumar 20 hojas"
      hint="Entre 40 y 80 hojas."
    />
  );
}

describe('Stepper', () => {
  it('suma y resta de a un paso', async () => {
    render(<Controlled />);
    expect(screen.getByText('60 hojas')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Sumar 20 hojas' }));
    expect(screen.getByText('80 hojas')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Restar 20 hojas' }));
    expect(screen.getByText('60 hojas')).toBeInTheDocument();
  });

  it('no deja pasar el máximo ni el mínimo', async () => {
    render(<Controlled />);
    await userEvent.click(screen.getByRole('button', { name: 'Sumar 20 hojas' }));
    expect(screen.getByRole('button', { name: 'Sumar 20 hojas' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Restar 20 hojas' }));
    await userEvent.click(screen.getByRole('button', { name: 'Restar 20 hojas' }));
    expect(screen.getByText('40 hojas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restar 20 hojas' })).toBeDisabled();
  });

  it('se agrupa bajo su etiqueta con la ayuda asociada', () => {
    render(<Controlled />);
    const group = screen.getByRole('group', { name: 'Cantidad de hojas' });
    expect(group).toHaveAccessibleDescription('Entre 40 y 80 hojas.');
  });
});
