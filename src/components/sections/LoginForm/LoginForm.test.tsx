import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';
import { content } from '../../../content';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.auth;

async function fill(email: string, password: string) {
  await userEvent.type(screen.getByLabelText(text.login.email), email);
  await userEvent.type(screen.getByLabelText(text.login.password), password);
  await userEvent.click(screen.getByRole('button', { name: text.login.submit }));
}

describe('LoginForm', () => {
  it('sin datos, marca los errores y lleva el foco al primero', async () => {
    renderWithRouter(<LoginForm onSuccess={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: text.login.submit }));
    expect(screen.getByLabelText(text.login.email)).toHaveFocus();
    expect(screen.getByLabelText(text.login.email)).toBeInvalid();
  });

  it('con credenciales incorrectas, lo dice sin revelar cuál falló', async () => {
    const onSuccess = vi.fn();
    renderWithRouter(<LoginForm onSuccess={onSuccess} />);
    await fill('ana@example.com', 'equivocada');
    expect(await screen.findByRole('alert')).toHaveTextContent(text.login.invalidCredentials);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('con la cuenta de prueba, ingresa', async () => {
    const onSuccess = vi.fn();
    renderWithRouter(<LoginForm onSuccess={onSuccess} />);
    await fill('ana@example.com', 'cuadernos');
    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it('deja ver la contraseña', async () => {
    renderWithRouter(<LoginForm onSuccess={() => {}} />);
    const password = screen.getByLabelText(text.login.password);
    expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByLabelText(text.showPassword));
    expect(password).toHaveAttribute('type', 'text');
  });

  it('las cuentas de prueba solo se muestran si se piden', () => {
    const { unmount } = renderWithRouter(<LoginForm onSuccess={() => {}} />);
    expect(screen.queryByText(text.login.demoTitle)).not.toBeInTheDocument();
    unmount();
    renderWithRouter(<LoginForm onSuccess={() => {}} showDemoAccounts />);
    expect(screen.getByText(text.login.demoCustomer)).toBeInTheDocument();
  });
});
