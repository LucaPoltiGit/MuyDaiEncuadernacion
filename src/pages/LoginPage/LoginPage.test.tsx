import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LoginPage } from './LoginPage';
import { content } from '../../content';
import { buildConfiguration } from '../../domain/notebook/testFixture';
import { login } from '../../services/authService';
import { renderRoutes } from '../../test/renderWithRouter';

const text = content.auth.login;

function ConfiguratorStub() {
  return <p>Configurador</p>;
}

const routes = [
  { path: '/ingresar', element: <LoginPage /> },
  { path: '/mi-cuenta', element: <p>Mi cuenta</p> },
  { path: '/disena-tu-cuaderno', element: <ConfiguratorStub /> },
];

async function signIn() {
  await userEvent.type(await screen.findByLabelText(text.email), 'ana@example.com');
  await userEvent.type(screen.getByLabelText(text.password), 'cuadernos');
  await userEvent.click(screen.getByRole('button', { name: text.submit }));
}

describe('LoginPage', () => {
  it('después de ingresar, va a Mi cuenta', async () => {
    renderRoutes(routes, '/ingresar');
    await signIn();
    expect(await screen.findByText('Mi cuenta')).toBeInTheDocument();
  });

  it('vuelve a donde estaba, con el diseño que estaba armando', async () => {
    const { router } = renderRoutes(routes, '/ingresar');
    const baseConfiguration = buildConfiguration({ coverText: 'Luz' });
    await router.navigate('/ingresar', {
      state: { from: '/disena-tu-cuaderno', baseConfiguration },
    });
    await signIn();
    expect(await screen.findByText('Configurador')).toBeInTheDocument();
    expect(router.state.location.state).toEqual({ baseConfiguration });
  });

  it('nunca redirige afuera de la app', async () => {
    const { router } = renderRoutes(routes, '/ingresar');
    await router.navigate('/ingresar', { state: { from: 'https://otro-sitio.com' } });
    await signIn();
    expect(await screen.findByText('Mi cuenta')).toBeInTheDocument();
  });

  it('con la sesión ya iniciada, no muestra el formulario', async () => {
    await login('ana@example.com', 'cuadernos');
    renderRoutes(routes, '/ingresar');
    expect(await screen.findByText('Mi cuenta')).toBeInTheDocument();
  });
});
