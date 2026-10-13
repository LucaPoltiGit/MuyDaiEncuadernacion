import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AccountLayout } from './AccountLayout';
import { content } from '../../content';
import { getCurrentUser, login } from '../../services/authService';
import { renderRoutes } from '../../test/renderWithRouter';

const text = content.account;
const routes = [
  {
    element: <AccountLayout />,
    children: [
      { path: '/mi-cuenta', element: <p>Compras</p> },
      { path: '/mi-cuenta/disenos', element: <p>Diseños</p> },
    ],
  },
  { path: '/', element: <p>Inicio</p> },
  { path: '/admin', element: <p>Panel</p> },
];

describe('AccountLayout', () => {
  it('saluda, marca la pestaña actual y cambia de sección', async () => {
    await login('ana@example.com', 'cuadernos');
    renderRoutes(routes, '/mi-cuenta');
    expect(await screen.findByRole('heading', { name: text.greeting('Ana') })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.tabs.orders })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.queryByRole('link', { name: text.adminLink })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: text.tabs.designs }));
    expect(screen.getByText('Diseños')).toBeInTheDocument();
  });

  it('salir cierra la sesión y vuelve al inicio', async () => {
    await login('ana@example.com', 'cuadernos');
    renderRoutes(routes, '/mi-cuenta');
    await userEvent.click(await screen.findByRole('button', { name: text.logout }));
    expect(await screen.findByText('Inicio')).toBeInTheDocument();
    expect(await getCurrentUser()).toBeNull();
  });

  it('la admin ve el acceso al panel', async () => {
    await login('admin@muydai.com', 'muydai123');
    renderRoutes(routes, '/mi-cuenta');
    expect(await screen.findByRole('link', { name: text.adminLink })).toHaveAttribute(
      'href',
      '/admin',
    );
  });
});
