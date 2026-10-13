import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RegisterPage } from './RegisterPage';
import { content } from '../../content';
import { renderRoutes } from '../../test/renderWithRouter';

const text = content.auth.register;
const routes = [
  { path: '/crear-cuenta', element: <RegisterPage /> },
  { path: '/mi-cuenta', element: <p>Mi cuenta</p> },
];

describe('RegisterPage', () => {
  it('al crear la cuenta, entra a Mi cuenta', async () => {
    renderRoutes(routes, '/crear-cuenta');
    await userEvent.type(await screen.findByLabelText(text.name), 'Luz Gómez');
    await userEvent.type(screen.getByLabelText(text.email), 'luz@example.com');
    await userEvent.type(screen.getByLabelText(text.password), 'cuadernos');
    await userEvent.type(screen.getByLabelText(text.passwordConfirmation), 'cuadernos');
    await userEvent.click(screen.getByRole('button', { name: text.submit }));
    expect(await screen.findByText('Mi cuenta')).toBeInTheDocument();
  });

  it('ofrece ingresar si ya tiene cuenta', async () => {
    renderRoutes(routes, '/crear-cuenta');
    expect(await screen.findByRole('link', { name: text.toLogin })).toHaveAttribute(
      'href',
      '/ingresar',
    );
  });
});
