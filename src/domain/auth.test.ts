import { describe, expect, it } from 'vitest';
import { hasRole, safeRedirectPath, validateLogin, validateRegister } from './auth';
import type { User } from '../types/user';

const customer: User = {
  id: 'u1',
  name: 'Ana',
  email: 'ana@example.com',
  phone: '',
  role: 'customer',
};
const admin: User = { ...customer, id: 'u2', role: 'admin' };

const validRegister = {
  name: 'Ana Pérez',
  email: 'ana@example.com',
  phone: '',
  password: 'cuadernos',
  passwordConfirmation: 'cuadernos',
};

describe('validateLogin', () => {
  it('pide email válido y contraseña', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'required',
      password: 'required',
    });
    expect(validateLogin({ email: 'ana@', password: 'x' })).toEqual({ email: 'email' });
    expect(validateLogin({ email: 'ana@example.com', password: 'x' })).toEqual({});
  });
});

describe('validateRegister', () => {
  it('un registro completo no tiene errores (el teléfono es opcional)', () => {
    expect(validateRegister(validRegister)).toEqual({});
  });

  it('pide una contraseña de al menos 8 caracteres, repetida igual', () => {
    expect(
      validateRegister({ ...validRegister, password: 'corta', passwordConfirmation: 'corta' }),
    ).toEqual({ password: 'passwordShort' });
    expect(validateRegister({ ...validRegister, passwordConfirmation: 'otracosa' })).toEqual({
      passwordConfirmation: 'passwordMismatch',
    });
  });

  it('si deja teléfono, tiene que ser válido', () => {
    expect(validateRegister({ ...validRegister, phone: 'abc' })).toEqual({ phone: 'phone' });
  });

  it('pide nombre y email', () => {
    expect(validateRegister({ ...validRegister, name: ' ', email: '' })).toMatchObject({
      name: 'required',
      email: 'required',
    });
  });
});

describe('hasRole', () => {
  it('sin sesión no hay acceso a nada protegido', () => {
    expect(hasRole(null, 'customer')).toBe(false);
  });

  it('una clienta entra a su cuenta pero no al panel', () => {
    expect(hasRole(customer, 'customer')).toBe(true);
    expect(hasRole(customer, 'admin')).toBe(false);
  });

  it('la admin entra a todo', () => {
    expect(hasRole(admin, 'customer')).toBe(true);
    expect(hasRole(admin, 'admin')).toBe(true);
  });
});

describe('safeRedirectPath', () => {
  it('vuelve a rutas internas', () => {
    expect(safeRedirectPath('/disena-tu-cuaderno', '/mi-cuenta')).toBe('/disena-tu-cuaderno');
  });

  it('nunca a otro sitio ni a algo raro', () => {
    expect(safeRedirectPath('https://otro.com', '/mi-cuenta')).toBe('/mi-cuenta');
    expect(safeRedirectPath('//otro.com', '/mi-cuenta')).toBe('/mi-cuenta');
    expect(safeRedirectPath(undefined, '/mi-cuenta')).toBe('/mi-cuenta');
  });
});
