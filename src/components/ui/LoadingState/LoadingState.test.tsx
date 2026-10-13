import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('anuncia qué se está cargando', () => {
    render(<LoadingState label="Cargando cuadernos…" />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando cuadernos…');
  });
});
