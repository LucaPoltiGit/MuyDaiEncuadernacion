import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RegisterForm } from './RegisterForm';
import { content } from '../../../content';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.auth;

async function fill(email: string, password = 'cuadernos', confirmation = password) {
  await userEvent.type(screen.getByLabelText(text.register.name), 'Luz Gómez');
  await userEvent.type(screen.getByLabelText(text.register.email), email);
  await userEvent.type(screen.getByLabelText(text.register.password), password);
  await userEvent.type(screen.getByLabelText(text.register.passwordConfirmation), confirmation);
  await userEvent.click(screen.getByRole('button', { name: text.register.submit }));
}

describe('RegisterForm', () => {
  it('crea la cuenta e ingresa', async () => {
    const onSuccess = vi.fn();
    renderWithRouter(<RegisterForm onSuccess={onSuccess} />);
    await fill('luz@example.com');
    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it('avisa si las contraseñas no coinciden', async () => {
    renderWithRouter(<RegisterForm onSuccess={() => {}} />);
    await fill('luz@example.com', 'cuadernos', 'cuadernas');
    expect(screen.getByLabelText(text.register.passwordConfirmation)).toHaveAccessibleDescription(
      text.errors.passwordMismatch,
    );
  });

  it('si el email ya tiene cuenta, lo marca en ese campo', async () => {
    renderWithRouter(<RegisterForm onSuccess={() => {}} />);
    await fill('ana@example.com');
    const email = screen.getByLabelText(text.register.email);
    await vi.waitFor(() => expect(email).toHaveAccessibleDescription(text.register.emailTaken));
    expect(email).toHaveFocus();
  });

  it('con la contraseña corta, el error repite la regla', async () => {
    renderWithRouter(<RegisterForm />);
    await fill('luz@example.com', 'corta');
    expect(screen.getByLabelText(text.register.password)).toHaveAccessibleDescription(
      text.register.passwordRule(8),
    );
  });
});
