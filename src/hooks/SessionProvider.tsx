import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getCurrentUser } from '../services/authService';
import { SessionContext } from './sessionContext';
import type { SessionState } from './sessionContext';

/**
 * Sesión global: se consulta una sola vez para toda la app.
 * En la Parte 6 suma login, logout y roles.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getCurrentUser().then((user) => active && setState({ status: 'ready', user }));
    return () => {
      active = false;
    };
  }, []);

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}
