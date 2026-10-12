import { useContext } from 'react';
import { SessionContext } from './sessionContext';
import type { SessionState } from './sessionContext';

export type { SessionState };

/** Usuario logueado (o null). Requiere `<SessionProvider>` (está en `App`). */
export function useSession(): SessionState {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession tiene que usarse dentro de <SessionProvider>');
  return context;
}
