import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RequireRole } from './RequireRole';
import { content } from '../../content';
import { login } from '../../services/authService';
import { renderRoutes } from '../../test/renderWithRouter';

function routes(role: 'customer' | 'admin') {
  return [
    {
      element: <RequireRole requiredRole={role} />,
      children: [{ path: '/privado', element: <p>Contenido privado</p> }],
    },
    { path: '/ingresar', element: <p>Pantalla de ingreso</p> },
  ];
}

describe('RequireRole', () => {
  it('sin sesión, manda a ingresar recordando de dónde venía', async () => {
    const { router } = renderRoutes(routes('customer'), '/privado?x=1');
    expect(await screen.findByText('Pantalla de ingreso')).toBeInTheDocument();
    expect(router.state.location.state).toEqual({ from: '/privado?x=1' });
  });

  it('con sesión y el rol, muestra la página', async () => {
    await login('ana@example.com', 'cuadernos');
    renderRoutes(routes('customer'), '/privado');
    expect(await screen.findByText('Contenido privado')).toBeInTheDocument();
  });

  it('una clienta no entra al panel de admin', async () => {
    await login('ana@example.com', 'cuadernos');
    renderRoutes(routes('admin'), '/privado');
    expect(
      await screen.findByRole('heading', { name: content.auth.forbidden.title }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument();
  });

  it('la admin sí entra al panel', async () => {
    await login('admin@muydai.com', 'muydai123');
    renderRoutes(routes('admin'), '/privado');
    expect(await screen.findByText('Contenido privado')).toBeInTheDocument();
  });
});
