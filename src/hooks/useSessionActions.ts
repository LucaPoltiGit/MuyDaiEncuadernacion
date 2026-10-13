import { useContext } from 'react';
import { SessionActionsContext } from './sessionContext';

/** Ingresar, registrarse y salir. Requiere `<SessionProvider>` (está en `App`). */
export function useSessionActions() {
  const context = useContext(SessionActionsContext);
  if (!context) throw new Error('useSessionActions tiene que usarse dentro de <SessionProvider>');
  return context;
}
