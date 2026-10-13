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
  paymentSimulator: '/checkout/pago-de-prueba',
  checkoutResult: '/checkout/resultado',
  login: '/ingresar',
  register: '/crear-cuenta',
  account: '/mi-cuenta',
  accountDesigns: '/mi-cuenta/disenos',
  admin: '/admin',
  adminProducts: '/admin/productos',
  adminConfigurator: '/admin/configurador',
  adminShipping: '/admin/envios',
  adminDiscounts: '/admin/descuentos',
  adminTestimonials: '/admin/testimonios',
  terms: '/terminos-y-condiciones',
  shippingPolicy: '/envios',
  withdrawal: '/boton-de-arrepentimiento',
  styleGuide: '/guia-de-estilo',
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Query params de las rutas del pago (como los que usa Mercado Pago al volver). */
export const PAYMENT_PARAMS = { preference: 'preferencia', order: 'pedido' } as const;

export function paymentSimulatorPath(preferenceId: string) {
  return `${ROUTES.paymentSimulator}?${PAYMENT_PARAMS.preference}=${encodeURIComponent(preferenceId)}`;
}

export function checkoutResultPath(orderId: string) {
  return `${ROUTES.checkoutResult}?${PAYMENT_PARAMS.order}=${encodeURIComponent(orderId)}`;
}

export function productPath(slug: string) {
  return ROUTES.product.replace(':slug', slug);
}
