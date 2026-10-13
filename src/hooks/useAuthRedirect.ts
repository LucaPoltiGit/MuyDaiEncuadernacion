import { useLocation } from 'react-router';
import { ROUTES } from '../constants/routes';
import { safeRedirectPath } from '../domain/auth';
import { isNotebookConfiguration } from '../domain/notebook/guards';
import type { AuthLocationState, ConfiguratorLocationState } from '../types/route';

/**
 * A dónde ir después de ingresar o registrarse, leído del estado de la
 * navegación (validado: puede venir cualquier cosa). Si venía del
 * configurador con un diseño a medio armar, se lo devuelve.
 */
export function useAuthRedirect() {
  const { state } = useLocation();
  const raw: Partial<Record<keyof AuthLocationState, unknown>> =
    typeof state === 'object' && state !== null ? state : {};

  const target = safeRedirectPath(raw.from, ROUTES.account);
  const baseConfiguration = isNotebookConfiguration(raw.baseConfiguration)
    ? raw.baseConfiguration
    : undefined;

  /** Estado para la pantalla de destino (ej. el configurador). */
  const forwardState: ConfiguratorLocationState | undefined = baseConfiguration
    ? { baseConfiguration }
    : undefined;
  /** Estado para pasar entre "Ingresar" y "Crear cuenta" sin perder nada. */
  const returnState: AuthLocationState = { from: target, baseConfiguration };

  return { target, forwardState, returnState };
}
