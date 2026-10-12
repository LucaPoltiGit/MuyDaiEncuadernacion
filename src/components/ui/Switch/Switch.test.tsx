import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('se activa al tocar su etiqueta y avisa el cambio', async () => {
    const onChange = vi.fn();
    render(<Switch label="Texto en la tapa" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByText('Texto en la tapa'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('se anuncia como interruptor con su estado y detalle', () => {
    render(<Switch label="Texto en la tapa" detail="+ $ 2.500" checked onChange={() => {}} />);
    const toggle = screen.getByRole('switch', { name: 'Texto en la tapa' });
    expect(toggle).toBeChecked();
    expect(toggle).toHaveAccessibleDescription('+ $ 2.500');
  });
});
