import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import type { RouteObject } from 'react-router';
import { CartProvider } from '../hooks/CartProvider';
import { SessionProvider } from '../hooks/SessionProvider';

interface RenderWithRouterOptions {
  /** Ruta inicial (ej. '/tienda'). */
  path?: string;
  /** Rutas extra para poder navegar en el test (ej. verificar a dónde lleva un link). */
  routes?: RouteObject[];
}

/**
 * Renderiza un componente que usa `Link`, `useLocation`, el carrito, etc.
 * dentro de un router en memoria y los providers de la app. Usarlo en todos los tests que necesiten router, así
 * todos lo arman igual.
 */
export function renderWithRouter(
  ui: ReactElement,
  { path = '/', routes = [] }: RenderWithRouterOptions = {},
) {
  const router = createMemoryRouter([{ path: '*', element: ui }, ...routes], {
    initialEntries: [path],
  });
  return { router, ...render(<Providers router={router} />) };
}

/** Los mismos providers globales que `App`. */
function Providers({ router }: { router: ReturnType<typeof createMemoryRouter> }) {
  return (
    <SessionProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </SessionProvider>
  );
}

/** Renderiza un árbol de rutas completo (ej. el de la app) en memoria. */
export function renderRoutes(routes: RouteObject[], path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return { router, ...render(<Providers router={router} />) };
}
