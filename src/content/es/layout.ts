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
    withdrawal: 'Botón de arrepentimiento',
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
    facebook: 'Facebook',
    whatsapp: 'WhatsApp',
    helpTitle: 'Ayuda',
    faq: 'Preguntas frecuentes',
    shippingPolicy: 'Envíos y devoluciones',
    terms: 'Términos y condiciones',
    withdrawalTitle: '¿Te arrepentiste de una compra?',
    withdrawalText: 'Tenés 10 días corridos desde que recibís tu pedido para cancelarlo.',
    withdrawalButton: 'Botón de arrepentimiento',
    consumerDefense: 'Defensa de las y los Consumidores',
    copyright: (year: number) => `© ${year} MuyDai. Hecho a mano en Argentina.`,
  },

  whatsapp: {
    label: 'Escribinos por WhatsApp',
    message: '¡Hola MuyDai! Tengo una consulta sobre los cuadernos.',
  },
};
