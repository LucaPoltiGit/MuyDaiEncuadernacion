import type { RouteObject } from 'react-router';
import { StoreLayout } from './layouts/StoreLayout/StoreLayout';
import { CartPage } from './pages/CartPage/CartPage';
import { CatalogPage } from './pages/CatalogPage/CatalogPage';
import { ComingSoonPage } from './pages/ComingSoonPage/ComingSoonPage';
import { ConfiguratorPage } from './pages/ConfiguratorPage/ConfiguratorPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { ProductPage } from './pages/ProductPage/ProductPage';
import { RouteErrorPage } from './pages/RouteErrorPage/RouteErrorPage';
import { StyleGuidePage } from './pages/StyleGuidePage/StyleGuidePage';
import { ROUTES } from './constants/routes';
import type { RouteHandle } from './types/route';

/**
 * Árbol de rutas de la app. Se exporta aparte de `App` para poder montarlo
 * en tests con un router en memoria.
 *
 * Grupos (rutas sin `path`): tienda pública, cuenta del cliente y admin.
 * En la Parte 6 cada grupo protegido suma su guard de rol en un solo lugar.
 * Las páginas que todavía no existen muestran "Próximamente".
 */
export const routes: RouteObject[] = [
  {
    element: <StoreLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      // Tienda pública
      { index: true, element: <ComingSoonPage pageKey="home" /> },
      { path: ROUTES.catalog, element: <CatalogPage /> },
      {
        path: ROUTES.product,
        element: <ProductPage />,
        // Como en el configurador: WhatsApp competiría con la barra de compra.
        handle: { layout: { bottomBar: true, hideWhatsApp: true } } satisfies RouteHandle,
      },
      {
        path: ROUTES.configurator,
        element: <ConfiguratorPage />,
        // Sin WhatsApp: la pantalla ya tiene mucho fijo y compite con "Agregar al carrito".
        handle: {
          layout: { bottomBar: true, stickyHeader: false, hideWhatsApp: true },
        } satisfies RouteHandle,
      },
      { path: ROUTES.testimonials, element: <ComingSoonPage pageKey="testimonials" /> },
      { path: ROUTES.about, element: <ComingSoonPage pageKey="about" /> },
      { path: ROUTES.faq, element: <ComingSoonPage pageKey="faq" /> },
      {
        path: ROUTES.cart,
        element: <CartPage />,
        // WhatsApp tapaba precios y "Seguir comprando" en mobile.
        handle: { layout: { hideWhatsApp: true } } satisfies RouteHandle,
      },
      {
        path: ROUTES.checkout,
        element: <ComingSoonPage pageKey="checkout" />,
        handle: { layout: { hideWhatsApp: true } } satisfies RouteHandle,
      },
      { path: ROUTES.login, element: <ComingSoonPage pageKey="login" /> },
      { path: ROUTES.register, element: <ComingSoonPage pageKey="register" /> },
      { path: ROUTES.terms, element: <ComingSoonPage pageKey="terms" /> },
      { path: ROUTES.shippingPolicy, element: <ComingSoonPage pageKey="shippingPolicy" /> },
      { path: ROUTES.withdrawal, element: <ComingSoonPage pageKey="withdrawal" /> },
      { path: ROUTES.styleGuide, element: <StyleGuidePage /> },

      // Cuenta del cliente (Parte 6: guard de rol "cliente")
      {
        children: [{ path: ROUTES.account, element: <ComingSoonPage pageKey="account" /> }],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Admin: va fuera del layout de la tienda (sin footer ni WhatsApp).
  // Parte 7: AdminLayout propio + guard de rol "admin".
  {
    path: ROUTES.admin,
    errorElement: <RouteErrorPage />,
    element: (
      <main>
        <ComingSoonPage pageKey="admin" />
      </main>
    ),
  },
];
