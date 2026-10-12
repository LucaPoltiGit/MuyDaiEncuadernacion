import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { Icon } from '../../ui/Icon/Icon';
import { WaveEdge } from '../../ui/WaveEdge/WaveEdge';
import { Wordmark } from '../../ui/Wordmark/Wordmark';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import { useScrollDirection } from '../../../hooks/useScrollDirection';
import styles from './SiteHeader.module.css';

const text = content.layout;

const NAV_LINKS = [
  { to: ROUTES.catalog, label: text.nav.catalog },
  { to: ROUTES.about, label: text.nav.about },
  { to: ROUTES.testimonials, label: text.nav.testimonials },
  { to: ROUTES.faq, label: text.nav.faq },
];

export interface SiteHeaderProps {
  /** Cantidad de productos en el carrito. Sin valor, no se muestra contador. */
  cartCount?: number;
  /** `false` en páginas con mucho contenido fijo (ej. configurador): el header no acompaña el scroll. */
  sticky?: boolean;
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [styles.navLink, isActive ? styles.active : ''].filter(Boolean).join(' ');
}

export function SiteHeader({ cartCount, sticky = true }: SiteHeaderProps) {
  const { pathname } = useLocation();
  // El menú queda abierto solo para la ruta donde se abrió: al navegar
  // (por un link o con "atrás") se cierra solo, sin efectos.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const isMenuOpen = openOnPath === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const direction = useScrollDirection();
  const isHidden = sticky && direction === 'down' && !isMenuOpen;

  function closeMenu({ returnFocus = false } = {}) {
    setOpenOnPath(null);
    if (returnFocus) toggleRef.current?.focus();
  }

  useEffect(() => {
    if (!isMenuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenOnPath(null);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  const cartLabel = cartCount === undefined ? text.cart.label : text.cart.withCount(cartCount);

  return (
    <>
      <header
        className={[styles.header, sticky ? styles.sticky : '', isHidden ? styles.hidden : '']
          .filter(Boolean)
          .join(' ')}
      >
        <div className={styles.bar}>
          <button
            ref={toggleRef}
            type="button"
            className={styles.menuToggle}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            onClick={() => (isMenuOpen ? closeMenu() : setOpenOnPath(pathname))}
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} />
            <span>{isMenuOpen ? text.menu.close : text.menu.open}</span>
          </button>

          <Link to={ROUTES.home} className={styles.brand}>
            <Wordmark name={text.brandName} size="responsive" />
          </Link>

          <nav aria-label={text.nav.label} className={styles.desktopNav}>
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={navLinkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Link
              to={ROUTES.configurator}
              className={buttonClassName({ className: styles.desktopCta })}
            >
              {text.nav.configurator}
            </Link>
            <Link to={ROUTES.account} className={styles.iconLink} aria-label={text.nav.account}>
              <Icon name="user" />
            </Link>
            <Link to={ROUTES.cart} className={styles.iconLink} aria-label={cartLabel}>
              <Icon name="cart" />
              {cartCount !== undefined && cartCount > 0 && (
                <span className={styles.cartCount} aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </Link>
            {cartCount !== undefined && (
              <span className="visually-hidden" aria-live="polite">
                {cartLabel}
              </span>
            )}
          </div>
        </div>
        {/* Con el menú abierto, la onda la pone el panel (abajo de todo). */}
        {!isMenuOpen && <WaveEdge edge="bottom" fill="var(--color-bg)" />}

        <div id={menuId} className={styles.menuPanel} hidden={!isMenuOpen}>
          <nav aria-label={text.nav.label} className={styles.menuInner}>
            <Link
              to={ROUTES.configurator}
              className={buttonClassName({ size: 'lg', fullWidth: true })}
            >
              {text.nav.configurator}
            </Link>
            <ul className={styles.menuList}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={styles.menuLink}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <ul className={styles.menuSecondary}>
              <li>
                <Link to={ROUTES.account} className={styles.menuSecondaryLink}>
                  <Icon name="user" />
                  {text.nav.account}
                </Link>
              </li>
            </ul>
          </nav>
          <WaveEdge edge="bottom" fill="var(--color-bg)" />
        </div>
        {isMenuOpen && (
          <div className={styles.backdrop} aria-hidden="true" onClick={() => closeMenu()} />
        )}
      </header>
    </>
  );
}
