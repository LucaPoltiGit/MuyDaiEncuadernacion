import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  EmailTakenError,
  getCurrentUser,
  InvalidCredentialsError,
  login as loginService,
  logout as logoutService,
  register as registerService,
  SESSION_STORAGE_KEY,
} from '../services/authService';
import type { NewAccount } from '../services/authService';
import type { User } from '../types/user';
import { SessionActionsContext, SessionContext } from './sessionContext';
import type { AuthFailure, AuthResult, SessionActions, SessionState } from './sessionContext';

function toFailure(error: unknown): AuthFailure {
  if (error instanceof InvalidCredentialsError) return 'invalidCredentials';
  if (error instanceof EmailTakenError) return 'emailTaken';
  return 'generic';
}

/**
 * Sesión global: se consulta al abrir la app, se actualiza al ingresar o
 * salir, y se sincroniza si cambia en otra pestaña. Traduce los errores
 * del service a códigos, así las pantallas no dependen de él.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    function refresh() {
      getCurrentUser()
        .then((user) => active && setState({ status: 'ready', user }))
        .catch(() => active && setState({ status: 'ready', user: null }));
    }
    refresh();
    // Ingresar o salir en otra pestaña cambia la sesión acá también.
    function onStorage(event: StorageEvent) {
      if (event.key === SESSION_STORAGE_KEY || event.key === null) refresh();
    }
    window.addEventListener('storage', onStorage);
    return () => {
      active = false;
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const actions = useMemo<SessionActions>(() => {
    async function run(request: () => Promise<User>): Promise<AuthResult> {
      try {
        const user = await request();
        setState({ status: 'ready', user });
        return { ok: true, user };
      } catch (error) {
        return { ok: false, error: toFailure(error) };
      }
    }
    return {
      login: (email: string, password: string) => run(() => loginService(email, password)),
      register: (account: NewAccount) => run(() => registerService(account)),
      async logout() {
        await logoutService();
        setState({ status: 'ready', user: null });
      },
    };
  }, []);

  return (
    <SessionContext.Provider value={state}>
      <SessionActionsContext.Provider value={actions}>{children}</SessionActionsContext.Provider>
    </SessionContext.Provider>
  );
}
