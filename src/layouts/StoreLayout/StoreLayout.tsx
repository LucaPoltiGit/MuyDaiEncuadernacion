import { useEffect, useRef } from 'react';
import { Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router';
import { SiteFooter } from '../../components/sections/SiteFooter/SiteFooter';
import { SiteHeader } from '../../components/sections/SiteHeader/SiteHeader';
import { WhatsAppButton } from '../../components/sections/WhatsAppButton/WhatsAppButton';
import { content } from '../../content';
import { useCart } from '../../hooks/useCart';
import type { LayoutOptions, RouteHandle } from '../../types/route';
import styles from './StoreLayout.module.css';

const MAIN_ID = 'contenido';

/** Junta las opciones de layout de las rutas activas; gana la más específica. */
function useLayoutOptions(): LayoutOptions {
  const matches = useMatches();
  return matches.reduce<LayoutOptions>(
    (options, match) => ({ ...options, ...(match.handle as RouteHandle | undefined)?.layout }),
    {},
  );
}

/** Layout de la tienda: header, contenido de la ruta, footer y WhatsApp. */
export function StoreLayout() {
  const { pathname } = useLocation();
  const options = useLayoutOptions();
  const { count } = useCart();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);

  // Al navegar a otra página, el foco va al contenido nuevo para que el
  // lector de pantalla lo anuncie. No en la primera carga, ni cuando solo
  // cambian los parámetros (?filtro=...).
  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [pathname]);

  return (
    <div
      className={[styles.layout, options.bottomBar ? styles.withBottomBar : '']
        .filter(Boolean)
        .join(' ')}
    >
      <a href={`#${MAIN_ID}`} className={styles.skipLink}>
        {content.layout.skipLink}
      </a>
      <SiteHeader sticky={options.stickyHeader ?? true} cartCount={count} />
      <main id={MAIN_ID} ref={mainRef} tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      <SiteFooter />
      {!options.hideWhatsApp && <WhatsAppButton aboveBottomBar={options.bottomBar} />}
      <ScrollRestoration />
    </div>
  );
}
