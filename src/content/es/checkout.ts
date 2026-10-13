import { formatPrice } from '../../domain/money';

const days = (min: number, max: number) =>
  min === max ? `${min} días hábiles` : `${min} a ${max} días hábiles`;

/** Textos del checkout, el pago de prueba y el resultado del pago. */
export const checkout = {
  title: 'Finalizar compra',
  lead: 'Completá tus datos y elegí cómo recibirlo. Pagás al final, con Mercado Pago.',
  loading: 'Preparando tu compra…',
  error: {
    title: 'No pudimos cargar el checkout',
    text: 'Tu carrito sigue guardado. Revisá tu conexión y probá de nuevo.',
    retry: 'Reintentar',
  },
  emptyCart: {
    title: 'No hay nada para comprar todavía',
    text: 'Tu carrito está vacío. Elegí un cuaderno de la tienda o diseñá el tuyo.',
    action: 'Ver la tienda',
  },
  cartProblems: {
    title: 'Revisá tu carrito',
    text: 'Hay cuadernos que ya no se pueden comprar tal cual están. Arreglalo en el carrito y volvé.',
    action: 'Ir al carrito',
  },

  contact: {
    title: 'Tus datos',
    name: 'Nombre y apellido',
    email: 'Email',
    emailHint: 'Te mandamos ahí la confirmación del pedido.',
    phone: 'Teléfono (WhatsApp)',
    phoneHint: 'Para avisarte cuando esté listo.',
  },

  delivery: {
    title: 'Entrega',
    methodLegend: '¿Cómo lo querés recibir?',
    shipping: 'Envío a domicilio',
    shippingDetail: 'Por correo, con seguimiento.',
    pickup: 'Retiro en el taller',
    pickupDetail: 'Sin cargo.',
    postalCode: 'Código postal',
    postalCodeHint: 'Ej: 1414 o C1414ABC.',
    quote: (zone: string, minDays: number, maxDays: number) =>
      `${zone}: llega ${days(minDays, maxDays)} después de despachado.`,
    free: '¡Envío gratis!',
    missingForFree: (missing: number) => `Te faltan ${formatPrice(missing)} para el envío gratis.`,
    noCoverageHelp: 'Escribinos por WhatsApp y vemos cómo hacértelo llegar.',
    street: 'Calle y número',
    apartment: 'Piso / depto (opcional)',
    city: 'Localidad',
    province: 'Provincia',
    provincePlaceholder: 'Elegí tu provincia',
    pickupLegend: 'Dónde retirar',
    whatsappMessage: (postalCode: string) =>
      `¡Hola MuyDai! Quiero comprar y mi código postal es ${postalCode}. ¿Llegan hasta acá?`,
  },

  errors: {
    required: 'Completá este dato.',
    email: 'Revisá el email: parece incompleto.',
    phone: 'Revisá el teléfono: solo números, con característica.',
    postalCode: 'Revisá el código postal: son 4 números (o el formato C1414ABC).',
    noCoverage: 'Por ahora no hacemos envíos a ese código postal.',
    summary: (count: number) =>
      count === 1
        ? 'Falta 1 dato: revisalo antes de pagar.'
        : `Faltan ${count} datos: revisalos antes de pagar.`,
    submit: 'No pudimos iniciar el pago. Probá de nuevo en un momento.',
    conflict: (names: string) =>
      `${names} se vendió mientras comprabas: era una pieza única. Quitalo del carrito para seguir.`,
    conflictUnknown: 'Algún cuaderno de tu carrito ya no está disponible. Revisá el carrito.',
    discountUnavailable:
      'El código de descuento se quedó sin usos mientras comprabas. Quitalo en el carrito para seguir.',
  },

  summary: {
    title: 'Tu pedido',
    subtotal: 'Subtotal',
    discount: (code: string) => `Descuento ${code}`,
    shipping: 'Envío',
    shippingPending: 'Ingresá tu código postal',
    shippingFree: 'Gratis',
    pickup: 'Retiro',
    total: 'Total',
    estimateShipping: (min: number, max: number) => `Llega en ${days(min, max)}.`,
    estimatePickup: (count: number) => `Listo para retirar en ${days(count, count)}.`,
    madeToOrderNote: 'Los cuadernos a medida se cosen después de que pagás.',
    pay: 'Pagar con Mercado Pago',
    paying: 'Preparando el pago…',
    payNote: 'Te llevamos a Mercado Pago para pagar con tarjeta, transferencia o efectivo.',
    editCart: 'Editar carrito',
    jumpToSummary: (total: string) => `Total ${total} · Ver pedido`,
  },

  simulator: {
    eyebrow: 'Modo prueba',
    title: 'Pago de prueba',
    text: 'Esta pantalla reemplaza a Mercado Pago mientras no esté conectado. No se cobra nada: elegí cómo termina el pago.',
    order: (number: string) => `Pedido ${number}`,
    total: 'Total a pagar',
    approve: 'Aprobar pago',
    reject: 'Rechazar pago',
    pending: 'Dejar pendiente',
    back: 'Volver al checkout',
    processing: 'Procesando…',
    notFound: {
      title: 'Este pago no existe',
      text: 'El link del pago está incompleto o venció. Volvé al carrito para intentarlo de nuevo.',
      action: 'Ir al carrito',
    },
  },

  result: {
    loading: 'Confirmando tu pago…',
    approved: {
      eyebrow: '¡Pago aprobado!',
      title: (name: string) => `¡Gracias, ${name}!`,
      text: (number: string) =>
        `Recibimos tu pedido ${number}. Te mandamos la confirmación por email.`,
    },
    pending: {
      eyebrow: 'Pago pendiente',
      title: 'Tu pedido está reservado',
      text: (number: string) =>
        `El pedido ${number} queda en espera hasta que Mercado Pago confirme el pago. Te avisamos apenas se acredite.`,
    },
    rejected: {
      eyebrow: 'Pago rechazado',
      title: 'No se pudo completar el pago',
      text: 'No se cobró nada. Podés probar de nuevo con otro medio de pago.',
      retry: 'Probar de nuevo',
      retrying: 'Preparando el pago…',
      retryFailed:
        'No pudimos reintentar: puede que algún cuaderno ya no esté disponible. Revisá el carrito.',
      backToCart: 'Volver al carrito',
    },
    notFound: {
      title: 'No encontramos ese pedido',
      text: 'Si pagaste y no ves la confirmación, escribinos por WhatsApp con tu email.',
      action: 'Ir a la tienda',
    },
    nextTitle: 'Qué sigue',
    nextSteps: {
      custom: [
        'Coso tus cuadernos a mano.',
        'Te aviso por WhatsApp cuando estén listos.',
        'Los despacho o los pasás a buscar.',
      ],
      ready: ['Preparo tu paquete con cariño.', 'Te aviso por WhatsApp cuando sale.'],
    },
    estimateShipping: (min: number, max: number) => `Te llega en ${days(min, max)}.`,
    estimatePickup: (count: number) => `Lo podés retirar en ${days(count, count)}.`,
    keepShopping: 'Seguir mirando',
    whatsapp: 'Escribime por WhatsApp',
    whatsappMessage: (number: string) => `¡Hola MuyDai! Te escribo por mi pedido ${number}.`,
  },
};
