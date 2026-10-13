import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StandaloneLayout } from './StandaloneLayout';
import { renderRoutes } from '../../test/renderWithRouter';

describe('StandaloneLayout', () => {
  it('muestra la página dentro del contenido principal', () => {
    renderRoutes([
      { element: <StandaloneLayout />, children: [{ path: '/', element: <p>Aviso</p> }] },
    ]);
    expect(screen.getByRole('main')).toContainElement(screen.getByText('Aviso'));
  });
});
