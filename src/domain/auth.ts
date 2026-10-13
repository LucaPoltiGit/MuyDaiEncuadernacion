import { isValidEmail, isValidPhone } from './validation';
import type { User, UserRole } from '../types/user';

export const MIN_PASSWORD_LENGTH = 8;

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  /** Opcional: si lo deja, el checkout lo completa solo. */
  phone: string;
  password: string;
  passwordConfirmation: string;
}

/** Por qué un campo no es válido (el texto lo arma la UI). */
export type AuthFieldError = 'required' | 'email' | 'phone' | 'passwordShort' | 'passwordMismatch';

export type LoginErrors = Partial<Record<keyof LoginForm, AuthFieldError>>;
export type RegisterErrors = Partial<Record<keyof RegisterForm, AuthFieldError>>;

export function validateLogin(form: LoginForm): LoginErrors {
  const errors: LoginErrors = {};
  if (!form.email.trim()) errors.email = 'required';
  else if (!isValidEmail(form.email)) errors.email = 'email';
  if (!form.password) errors.password = 'required';
  return errors;
}

export function validateRegister(form: RegisterForm): RegisterErrors {
  const errors: RegisterErrors = {};
  if (!form.name.trim()) errors.name = 'required';
  if (!form.email.trim()) errors.email = 'required';
  else if (!isValidEmail(form.email)) errors.email = 'email';
  if (form.phone.trim() && !isValidPhone(form.phone)) errors.phone = 'phone';
  if (!form.password) errors.password = 'required';
  else if (form.password.length < MIN_PASSWORD_LENGTH) errors.password = 'passwordShort';
  if (!form.passwordConfirmation) errors.passwordConfirmation = 'required';
  else if (form.passwordConfirmation !== form.password) {
    errors.passwordConfirmation = 'passwordMismatch';
  }
  return errors;
}

/**
 * Qué puede ver cada rol: la admin también usa la tienda y su cuenta como
 * cualquier clienta; el panel es solo para admin.
 */
export function hasRole(user: User | null, required: UserRole) {
  if (!user) return false;
  return required === 'customer' || user.role === 'admin';
}

/**
 * A dónde volver después de ingresar. Solo rutas internas de la app (nunca
 * una URL externa que venga en el link: evita redirecciones a otros sitios).
 */
export function safeRedirectPath(candidate: unknown, fallback: string) {
  if (typeof candidate !== 'string') return fallback;
  if (!candidate.startsWith('/') || candidate.startsWith('//')) return fallback;
  return candidate;
}
