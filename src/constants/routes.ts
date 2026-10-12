/**
 * Rutas de la app. Centralizadas acá para no escribir strings de rutas
 * sueltos en los componentes. Las rutas con parámetros tienen además
 * un helper para construir el link (ej. `productPath('cuaderno-flores')`).
 */
export const ROUTES = {
  home: '/',
  catalog: '/tienda',
  product: '/tienda/:slug',
  configurator: '/disena-tu-cuaderno',
  testimonials: '/testimonios',
  about: '/sobre-mi',
  faq: '/preguntas-frecuentes',
  cart: '/carrito',
  checkout: '/checkout',
  login: '/ingresar',
  register: '/crear-cuenta',
  account: '/mi-cuenta',
  admin: '/admin',
  terms: '/terminos-y-condiciones',
  shippingPolicy: '/envios',
  styleGuide: '/guia-de-estilo',
} as const;

export type RouteKey = keyof typeof ROUTES;

export function productPath(slug: string) {
  return ROUTES.product.replace(':slug', slug);
}
