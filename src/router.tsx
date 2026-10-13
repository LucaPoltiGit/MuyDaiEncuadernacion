import type { RouteObject } from 'react-router';
import { AccountLayout } from './layouts/AccountLayout/AccountLayout';
import { RequireRole } from './layouts/RequireRole/RequireRole';
import { StandaloneLayout } from './layouts/StandaloneLayout/StandaloneLayout';
import { StoreLayout } from './layouts/StoreLayout/StoreLayout';
import { AccountDesignsPage } from './pages/AccountDesignsPage/AccountDesignsPage';
import { AccountOrdersPage } from './pages/AccountOrdersPage/AccountOrdersPage';
import { CartPage } from './pages/CartPage/CartPage';
import { CatalogPage } from './pages/CatalogPage/CatalogPage';
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage';
import { CheckoutResultPage } from './pages/CheckoutResultPage/CheckoutResultPage';
import { ComingSoonPage } from './pages/ComingSoonPage/ComingSoonPage';
import { ConfiguratorPage } from './pages/ConfiguratorPage/ConfiguratorPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { PaymentSimulatorPage } from './pages/PaymentSimulatorPage/PaymentSimulatorPage';
import { ProductPage } from './pages/ProductPage/ProductPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
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
        element: <CheckoutPage />,
        handle: { layout: { hideWhatsApp: true } } satisfies RouteHandle,
      },
      { path: ROUTES.checkoutResult, element: <CheckoutResultPage /> },
      // Sin WhatsApp: en mobile tapaba los campos del formulario.
      {
        path: ROUTES.login,
        element: <LoginPage />,
        handle: { layout: { hideWhatsApp: true } } satisfies RouteHandle,
      },
      {
        path: ROUTES.register,
        element: <RegisterPage />,
        handle: { layout: { hideWhatsApp: true } } satisfies RouteHandle,
      },
      { path: ROUTES.terms, element: <ComingSoonPage pageKey="terms" /> },
      { path: ROUTES.shippingPolicy, element: <ComingSoonPage pageKey="shippingPolicy" /> },
      { path: ROUTES.withdrawal, element: <ComingSoonPage pageKey="withdrawal" /> },
      { path: ROUTES.styleGuide, element: <StyleGuidePage /> },

      // Mi cuenta: solo con sesión iniciada.
      {
        element: <RequireRole requiredRole="customer" />,
        children: [
          {
            element: <AccountLayout />,
            children: [
              { path: ROUTES.account, element: <AccountOrdersPage /> },
              { path: ROUTES.accountDesigns, element: <AccountDesignsPage /> },
            ],
          },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Pantallas fuera de la tienda (sin header ni footer ni WhatsApp):
  // - pago de prueba: reemplaza a Mercado Pago, una página externa;
  // - admin: solo para el rol admin (Parte 7 suma su AdminLayout).
  {
    element: <StandaloneLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: ROUTES.paymentSimulator, element: <PaymentSimulatorPage /> },
      {
        element: <RequireRole requiredRole="admin" />,
        children: [{ path: ROUTES.admin, element: <ComingSoonPage pageKey="admin" /> }],
      },
    ],
  },
];
