import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { Badge } from '../../components/ui/Badge/Badge';
import { Butterfly } from '../../components/ui/Butterfly/Butterfly';
import { Button } from '../../components/ui/Button/Button';
import { Wordmark } from '../../components/ui/Wordmark/Wordmark';
import { ROUTES } from '../../constants/routes';
import { content } from '../../content';
import { useSession } from '../../hooks/useSession';
import { useSessionActions } from '../../hooks/useSessionActions';
import styles from './AdminLayout.module.css';

const text = content.admin;

const NAV = [
  { to: ROUTES.admin, label: text.nav.orders, end: true },
  { to: ROUTES.adminProducts, label: text.nav.products },
  { to: ROUTES.adminConfigurator, label: text.nav.configurator },
  { to: ROUTES.adminShipping, label: text.nav.shipping },
  { to: ROUTES.adminDiscounts, label: text.nav.discounts },
  { to: ROUTES.adminTestimonials, label: text.nav.testimonials },
];

function navClass({ isActive }: { isActive: boolean }) {
  return [styles.navLink, isActive ? styles.active : ''].filter(Boolean).join(' ');
}

/**
 * Estructura del panel: barra propia (sin la navegación de la tienda),
 * secciones a un costado y el contenido. Lo funcional manda: menos
 * decoración que la tienda, pero la misma familia.
 */
export function AdminLayout() {
  const session = useSession();
  const { logout } = useSessionActions();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const user = session.status === 'ready' ? session.user : null;

  // Al cambiar de sección, el foco va al contenido (como en la tienda).
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  async function handleLogout() {
    await logout();
    navigate(ROUTES.home, { replace: true });
  }

  return (
    <div className={styles.admin}>
      <header className={styles.bar}>
        <Link to={ROUTES.admin} className={styles.brand}>
          <Butterfly size="sm" />
          <Wordmark name={content.layout.brandName} />
          <Badge tone="brand">{text.brand}</Badge>
        </Link>
        <div className={styles.barActions}>
          <Link to={ROUTES.home} className={styles.barLink}>
            {text.viewStore}
          </Link>
          {user && <span className={styles.user}>{user.name}</span>}
          <Button variant="ghost" onClick={handleLogout}>
            {text.logout}
          </Button>
        </div>
      </header>

      <div className={styles.body}>
        <nav aria-label={text.navLabel} className={styles.nav}>
          <ul className={styles.navList}>
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <main ref={mainRef} tabIndex={-1} className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
