import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { Button } from '../../components/ui/Button/Button';
import { PageIntro } from '../../components/sections/PageIntro/PageIntro';
import { ROUTES } from '../../constants/routes';
import { content } from '../../content';
import { useSession } from '../../hooks/useSession';
import { useSessionActions } from '../../hooks/useSessionActions';
import styles from './AccountLayout.module.css';

const text = content.account;

function tabClass({ isActive }: { isActive: boolean }) {
  return [styles.tab, isActive ? styles.activeTab : ''].filter(Boolean).join(' ');
}

/** Estructura de Mi cuenta: saludo, salir y pestañas (compras / diseños). */
export function AccountLayout() {
  const session = useSession();
  const { logout } = useSessionActions();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  // Esta ruta está detrás de RequireRole: siempre hay usuario.
  const user = session.status === 'ready' ? session.user : null;

  async function handleLogout() {
    setLeaving(true);
    await logout();
    navigate(ROUTES.home, { replace: true });
  }

  return (
    <div className={styles.account}>
      <div className={styles.header}>
        <PageIntro eyebrow={text.eyebrow} title={text.greeting(user?.name.split(' ')[0] ?? '')} />
        <div className={styles.actions}>
          {user?.role === 'admin' && (
            <Link to={ROUTES.admin} className={styles.adminLink}>
              {text.adminLink}
            </Link>
          )}
          <Button variant="ghost" onClick={handleLogout} disabled={leaving}>
            {leaving ? text.loggingOut : text.logout}
          </Button>
        </div>
      </div>
      {user && <p className={styles.email}>{user.email}</p>}

      <nav aria-label={text.tabsLabel} className={styles.tabs}>
        <NavLink to={ROUTES.account} end className={tabClass}>
          {text.tabs.orders}
        </NavLink>
        <NavLink to={ROUTES.accountDesigns} className={tabClass}>
          {text.tabs.designs}
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
}
