/**
 * Textos de la guía de estilo: página interna para ver tokens y
 * componentes base de MuyDai. No es una página para clientes.
 */
export const styleGuide = {
  title: 'Guía de estilo',
  intro:
    'Colores, tipografía y componentes base de MuyDai. Todo lo que se ve acá sale de los design tokens.',

  colors: {
    title: 'Colores',
    swatches: [
      { token: '--color-action', name: 'Rosa MuyDai', use: 'Acciones: botones principales' },
      { token: '--color-link', name: 'Rosa profundo', use: 'Links y texto destacado' },
      { token: '--color-accent', name: 'Naranja', use: 'Acento puntual: sellos, detalles' },
      { token: '--color-text', name: 'Tinta', use: 'Texto principal' },
      { token: '--color-bg', name: 'Crema', use: 'Fondo de página' },
      { token: '--color-surface-muted', name: 'Papel', use: 'Bloques y fondos suaves' },
    ],
  },

  typography: {
    title: 'Tipografía',
    display: 'Cuadernos hechos a mano, uno por uno',
    displayNote: 'Títulos: Fraunces',
    body: 'Cada cuaderno se cose a mano con tela elegida por vos. Lo hacemos en nuestro taller y te avisamos cuando sale para tu casa.',
    bodyNote: 'Texto: DM Sans',
  },

  buttons: {
    title: 'Botones',
    primary: 'Agregar al carrito',
    secondary: 'Guardar diseño',
    ghost: 'Ver detalles',
    disabled: 'Sin stock',
    large: 'Diseñá tu cuaderno',
  },

  cards: {
    title: 'Tarjetas',
    plainTitle: 'Tarjeta simple',
    plainText: 'Para productos, pedidos y bloques de información.',
    mutedTitle: 'Tarjeta suave',
    mutedText: 'Para resúmenes o información secundaria.',
    stitchedTitle: 'Tarjeta con costura',
    stitchedText: 'El detalle propio de MuyDai: usar con moderación, en lo más importante.',
  },

  inputs: {
    title: 'Campos de texto',
    nameLabel: 'Nombre y apellido',
    emailLabel: 'Email',
    emailHint: 'Te mandamos el comprobante a este email.',
    postalLabel: 'Código postal',
    postalError: 'Ingresá un código postal de 4 dígitos.',
    initialsLabel: 'Texto en la tapa',
    initialsHint: 'Hasta 12 caracteres. Recargo de $2.500.',
  },

  select: {
    title: 'Desplegable',
    label: 'Zona de envío',
    placeholder: 'Elegí una zona',
    options: [
      { value: 'caba', label: 'CABA' },
      { value: 'gba', label: 'Gran Buenos Aires' },
      { value: 'interior', label: 'Interior del país' },
      { value: 'retiro', label: 'Retiro en persona' },
    ],
  },

  optionGroup: {
    title: 'Selector de opciones',
    sizeLegend: 'Tamaño',
    sizeHint: 'El precio se actualiza al elegir.',
    sizes: [
      { value: 'a6', label: 'A6', detail: '10,5 × 14,8 cm' },
      { value: 'a5', label: 'A5', detail: '14,8 × 21 cm' },
      {
        value: 'a4',
        label: 'A4',
        detail: '21 × 29,7 cm',
        disabled: true,
        disabledReason: 'Sin stock',
      },
    ],
    fabricLegend: 'Tela de la tapa',
    fabrics: [
      { value: 'flores', label: 'Flores', image: '/images/telas/flores.svg' },
      { value: 'cuadrille', label: 'Cuadrillé', image: '/images/telas/cuadrille.svg' },
      { value: 'rayas', label: 'Rayas', image: '/images/telas/rayas.svg' },
      {
        value: 'lunares',
        label: 'Lunares',
        image: '/images/telas/lunares.svg',
        disabled: true,
        disabledReason: 'Sin stock',
      },
    ],
  },

  decoration: {
    title: 'Decoración',
    flowerTitle: 'La flor MuyDai',
    flowerText:
      'Cinco pétalos redondos con costura y el centro naranja. Se usa poco: junto al logo, en textos chicos y alguna grande asomando en una esquina.',
    waveTitle: 'Costura ondulada',
    waveText: 'Cierra el header y abre el footer. Lo funcional (formularios, precios) queda recto.',
  },

  badges: {
    title: 'Etiquetas de estado',
    items: [
      { tone: 'neutral', label: 'Pendiente de pago' },
      { tone: 'brand', label: 'En producción' },
      { tone: 'info', label: 'Enviado' },
      { tone: 'success', label: 'Entregado' },
      { tone: 'danger', label: 'Cancelado' },
      { tone: 'accent', label: 'Nuevo' },
      { tone: 'warning', label: 'Últimas unidades' },
    ],
  },
} as const;
