import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('avisa y deja reintentar', async () => {
    const onRetry = vi.fn();
    render(<ErrorState message="No cargó." retryLabel="Reintentar" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('No cargó.');
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onRetry).toHaveBeenCalled();
  });
});
