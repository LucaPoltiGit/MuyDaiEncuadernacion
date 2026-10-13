import type { ReactNode } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { buttonClassName } from '../../components/ui/Button/buttonClassName';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { ROUTES } from '../../constants/routes';
import { StandaloneLayout } from '../StandaloneLayout/StandaloneLayout';
import { content } from '../../content';
import { hasRole } from '../../domain/auth';
import { useSession } from '../../hooks/useSession';
import type { AuthLocationState } from '../../types/route';
import type { UserRole } from '../../types/user';

const text = content.auth;

export interface RequireRoleProps {
  requiredRole: UserRole;
  /**
   * Fuera del layout de la tienda (ej. el panel): los avisos de carga y de
   * acceso se muestran en una pantalla suelta, con su propio `main`.
   */
  standalone?: boolean;
}

/**
 * Guardia de un grupo de rutas (se usa como `element` de una ruta sin
 * path). Sin sesión, manda a ingresar y vuelve acá después; con sesión pero
 * sin el rol, explica que no tiene acceso.
 */
export function RequireRole({ requiredRole, standalone = false }: RequireRoleProps) {
  const session = useSession();
  const location = useLocation();

  const frame = (node: ReactNode) =>
    standalone ? <StandaloneLayout>{node}</StandaloneLayout> : node;

  if (session.status === 'loading') return frame(<LoadingState label={text.checking} />);

  if (!session.user) {
    const state: AuthLocationState = { from: location.pathname + location.search };
    return <Navigate to={ROUTES.login} replace state={state} />;
  }

  if (!hasRole(session.user, requiredRole)) {
    return frame(
      <PageMessage
        title={text.forbidden.title}
        text={text.forbidden.text}
        actions={
          <>
            <Link to={ROUTES.home} className={buttonClassName()}>
              {text.forbidden.action}
            </Link>
            <Link to={ROUTES.account} className={buttonClassName({ variant: 'secondary' })}>
              {text.forbidden.account}
            </Link>
          </>
        }
      />,
    );
  }

  return <Outlet />;
}
