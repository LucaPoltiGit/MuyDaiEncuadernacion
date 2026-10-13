import { createContext } from 'react';
import type { NewAccount } from '../services/authService';
import type { User } from '../types/user';

export type SessionState = { status: 'loading' } | { status: 'ready'; user: User | null };

/** Por qué no se pudo ingresar o registrar (el texto lo arma la UI). */
export type AuthFailure = 'invalidCredentials' | 'emailTaken' | 'generic';

export type AuthResult = { ok: true; user: User } | { ok: false; error: AuthFailure };

export interface SessionActions {
  login: (email: string, password: string) => Promise<AuthResult>;
  /** Crea la cuenta e ingresa. */
  register: (account: NewAccount) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

export const SessionContext = createContext<SessionState | null>(null);

/** Separado del estado: quien solo necesita las acciones no se re-renderiza al cambiar la sesión. */
export const SessionActionsContext = createContext<SessionActions | null>(null);
