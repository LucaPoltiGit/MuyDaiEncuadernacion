/** Textos del layout global: header, menú, footer y botón de WhatsApp. */
export const layout = {
  skipLink: 'Saltar al contenido',
  brandName: 'MuyDai',
  homeLinkLabel: 'MuyDai, ir al inicio',

  nav: {
    label: 'Navegación principal',
    catalog: 'Tienda',
    about: 'Sobre mí',
    testimonials: 'Testimonios',
    faq: 'Preguntas frecuentes',
    configurator: 'Diseñá tu cuaderno',
    account: 'Mi cuenta',
    login: 'Ingresar',
  },

  menu: {
    open: 'Menú',
    close: 'Cerrar',
  },

  cart: {
    label: 'Carrito',
    withCount: (count: number) =>
      count === 1 ? 'Carrito, 1 producto' : `Carrito, ${count} productos`,
  },

  footer: {
    tagline: 'Cuadernos cosidos a mano, con la tela que elijas.',
    socialLabel: 'Redes sociales',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    helpTitle: 'Ayuda',
    faq: 'Preguntas frecuentes',
    shippingPolicy: 'Envíos',
    terms: 'Términos y condiciones',
    contactTitle: '¿Tenés una idea?',
    contactText: 'Si querés algo que no está en la tienda, escribime y lo charlamos.',
    contactButton: 'Escribime por WhatsApp',
    withdrawal: 'Botón de arrepentimiento',
    consumerDefense: 'Defensa de las y los Consumidores',
    copyright: (year: number) => `© ${year} MuyDai. Hecho a mano en Argentina.`,
  },

  whatsapp: {
    label: 'Escribinos por WhatsApp',
    message: '¡Hola MuyDai! Tengo una consulta sobre los cuadernos.',
  },
};
