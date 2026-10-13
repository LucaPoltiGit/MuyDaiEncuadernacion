import type { RouteKey } from '../../constants/routes';

/** Textos de páginas genéricas: "próximamente", 404 y error. */
export const pages = {
  comingSoon: {
    eyebrow: 'Próximamente',
    text: 'Estamos cosiendo esta página. Mientras tanto, podés volver al inicio.',
    backHome: 'Volver al inicio',
    titles: {
      home: 'Inicio',
      catalog: 'Tienda',
      product: 'Producto',
      configurator: 'Diseñá tu cuaderno',
      testimonials: 'Testimonios',
      about: 'Sobre mí',
      faq: 'Preguntas frecuentes',
      cart: 'Carrito',
      checkout: 'Finalizar compra',
      login: 'Ingresar',
      register: 'Crear cuenta',
      account: 'Mi cuenta',
      admin: 'Panel de administración',
      terms: 'Términos y condiciones',
      shippingPolicy: 'Envíos',
      withdrawal: 'Botón de arrepentimiento',
      styleGuide: 'Guía de estilo',
    } satisfies Record<RouteKey, string>,
  },

  notFound: {
    title: 'No encontramos esta página',
    text: 'Puede que el link esté mal escrito o que la página ya no exista.',
    backHome: 'Volver al inicio',
    goToCatalog: 'Ver la tienda',
  },

  error: {
    title: 'Algo salió mal',
    text: 'Tuvimos un problema al mostrar esta página. Probá recargarla en unos segundos.',
    backHome: 'Volver al inicio',
  },
};
