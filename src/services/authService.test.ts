import { describe, expect, it } from 'vitest';
import {
  EmailTakenError,
  getCurrentUser,
  InvalidCredentialsError,
  login,
  logout,
  register,
} from './authService';

describe('authService', () => {
  it('sin sesión, no hay usuario', async () => {
    expect(await getCurrentUser()).toBeNull();
  });

  it('ingresa con una cuenta de prueba y recuerda la sesión', async () => {
    const user = await login(' ANA@example.com ', 'cuadernos');
    expect(user).toMatchObject({ name: 'Ana Pérez', role: 'customer' });
    expect(user).not.toHaveProperty('passwordHash');
    expect(await getCurrentUser()).toMatchObject({ id: user.id });

    await logout();
    expect(await getCurrentUser()).toBeNull();
  });

  it('con contraseña incorrecta o email inexistente, el mismo error', async () => {
    await expect(login('ana@example.com', 'otra')).rejects.toBeInstanceOf(InvalidCredentialsError);
    await expect(login('nadie@example.com', 'cuadernos')).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('registra una clienta nueva y deja la sesión iniciada', async () => {
    const user = await register({
      name: ' Luz ',
      email: 'Luz@Example.com',
      phone: '',
      password: 'cuadernos',
    });
    expect(user).toMatchObject({ name: 'Luz', email: 'luz@example.com', role: 'customer' });
    expect(await getCurrentUser()).toMatchObject({ id: user.id });
    expect(await login('luz@example.com', 'cuadernos')).toMatchObject({ id: user.id });
  });

  it('no deja registrar un email que ya tiene cuenta', async () => {
    await expect(
      register({ name: 'Otra', email: 'ana@example.com', phone: '', password: 'cuadernos' }),
    ).rejects.toBeInstanceOf(EmailTakenError);
  });
});
