import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

function Controlled() {
  const [value, setValue] = useState('');
  return (
    <Textarea
      label="Testimonio"
      maxLength={20}
      showCounter
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

describe('Textarea', () => {
  it('tiene su rótulo y cuenta los caracteres', async () => {
    render(<Controlled />);
    await userEvent.type(screen.getByLabelText('Testimonio'), 'Hermoso');
    expect(screen.getByText('7/20')).toBeInTheDocument();
  });

  it('con error, lo anuncia en vez de la ayuda', () => {
    render(<Textarea label="Texto" hint="Contá tu experiencia" error="Completá este dato." />);
    const field = screen.getByLabelText('Texto');
    expect(field).toBeInvalid();
    expect(field).toHaveAccessibleDescription('Completá este dato.');
  });
});
