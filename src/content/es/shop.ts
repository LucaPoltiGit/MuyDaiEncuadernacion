import { formatPrice } from '../../domain/money';

const units = (count: number) => (count === 1 ? '1 cuaderno' : `${count} cuadernos`);

/** Textos compartidos para describir un cuaderno (catálogo, ficha, carrito). */
export const notebook = {
  specs: {
    size: 'Tamaño',
    binding: 'Encuadernación',
    sheets: 'Hojas',
    paper: 'Tipo de hoja',
    fabric: 'Tela',
    coverText: 'Texto en la tapa',
  },
  sheetsValue: (sheets: number) => `${sheets} hojas`,
  /** Para el resumen en una línea: "80 hojas (lisa)". */
  sheetsWithPaper: (sheets: number, paper: string) => `${sheets} hojas (${paper.toLowerCase()})`,
  coverTextValue: (text: string) => `“${text}”`,
  /** Resumen en una línea: "A5 · Cosido · 80 hojas lisa · Tela Flores". */
  summary: (parts: { size: string; binding: string; sheets: string; fabric: string }) =>
    [parts.size, parts.binding, parts.sheets, `Tela ${parts.fabric.toLowerCase()}`].join(' · '),
  customName: 'Cuaderno a medida',
  unknownOption: 'Opción no disponible',
};

/** Textos del catálogo (/tienda). */
export const catalog = {
  eyebrow: 'Tienda',
  title: 'Cuadernos listos para enviar',
  intro: 'Ya están cosidos y listos para salir: se despachan en 48 h hábiles.',
  loading: 'Acomodando los cuadernos…',
  error: {
    title: 'No pudimos cargar la tienda',
    text: 'Revisá tu conexión y probá de nuevo.',
    retry: 'Reintentar',
  },
  filterLegend: 'Mostrar',
  allCategories: 'Todos',
  count: (count: number) => (count === 1 ? '1 cuaderno' : `${count} cuadernos`),
  empty: 'No hay cuadernos en esta categoría por ahora.',
  lowStock: (stock: number) => (stock === 1 ? '¡Queda 1!' : `¡Quedan ${stock}!`),
  outOfStock: 'Sin stock',
  customCard: {
    title: '¿No está el tuyo?',
    text: 'Elegí la tela, el tamaño, las hojas y hasta el texto de la tapa.',
    action: 'Diseñá tu cuaderno',
  },
};

/** Textos de la ficha de producto (/tienda/:slug). */
export const product = {
  backToCatalog: 'Volver a la tienda',
  breadcrumbLabel: 'Estás en',
  notFound: {
    title: 'Este cuaderno ya no está',
    text: 'Puede que se haya vendido o que el link esté mal. Fijate los que quedan en la tienda.',
    action: 'Ver la tienda',
  },
  specsTitle: 'Cómo es',
  readyToShip: 'Sale en 48 h hábiles',
  stock: (stock: number) => (stock === 1 ? 'Queda 1 disponible' : `Quedan ${stock} disponibles`),
  outOfStock: 'Sin stock por ahora',
  outOfStockHint: 'Lo cosemos para vos a medida',
  orderCustom: 'Pedirlo a medida',
  quantity: {
    label: 'Cantidad',
    unit: units,
    decrease: 'Restar uno',
    increase: 'Sumar uno',
    hint: (max: number) => `Podés llevar hasta ${units(max)}.`,
    alreadyInCart: (count: number) => `Ya tenés ${units(count)} en el carrito.`,
    allInCart: 'Ya tenés en el carrito todos los disponibles.',
  },
  priceLabel: 'Precio',
  addToCart: 'Agregar al carrito',
  added: '¡Listo, está en tu carrito!',
  goToCart: 'Ver carrito',
  customize: {
    title: '¿Lo querés distinto?',
    text: 'Usalo de base en el configurador y cambiale lo que quieras.',
    action: 'Personalizar este cuaderno',
  },
};

/** Textos del carrito (/carrito). */
export const cart = {
  title: 'Tu carrito',
  count: units,
  loading: 'Revisando tu carrito…',
  error: {
    title: 'No pudimos cargar tu carrito',
    text: 'Tus cuadernos siguen guardados. Revisá tu conexión y probá de nuevo.',
    retry: 'Reintentar',
  },
  empty: {
    title: 'Tu carrito está vacío',
    text: 'Elegí uno de los cuadernos listos o diseñá el tuyo desde cero.',
    catalog: 'Ver la tienda',
    configurator: 'Diseñá tu cuaderno',
  },
  itemsLabel: 'Cuadernos en tu carrito',
  line: {
    unitPrice: (price: number) => `${formatPrice(price)} c/u`,
    quantity: 'Cantidad',
    decrease: (name: string) => `Restar uno de ${name}`,
    increase: (name: string) => `Sumar uno de ${name}`,
    remove: 'Quitar',
    excluded: 'No suma al total',
    removeLabel: (name: string) => `Quitar ${name} del carrito`,
    madeToOrder: (days: number) => `Se hace a medida: ${days} días hábiles.`,
    readyToShip: 'Listo para enviar.',
    priceChanged: (before: number) => `El precio se actualizó (antes ${formatPrice(before)}).`,
  },
  problems: {
    productRemoved: 'Este cuaderno ya no está en la tienda. Quitalo para seguir.',
    outOfStock: 'Se agotó mientras lo tenías en el carrito. Quitalo para seguir.',
    tooMany: (max: number) => `Podés llevar hasta ${units(max)}. Bajá la cantidad para seguir.`,
    invalidConfiguration:
      'Alguna opción de este diseño se agotó. Quitalo y armalo de nuevo en el configurador.',
  },
  summary: {
    title: 'Resumen',
    subtotal: 'Subtotal',
    discount: (code: string) => `Descuento ${code}`,
    removeDiscount: 'Quitar código',
    removeDiscountLabel: (code: string) => `Quitar el código ${code}`,
    total: 'Total',
    shippingNote: 'El envío se calcula en el siguiente paso.',
    checkout: 'Finalizar compra',
    blocked: 'Revisá los cuadernos marcados antes de seguir.',
    keepShopping: 'Seguir comprando',
  },
  discount: {
    label: 'Código de descuento',
    apply: 'Aplicar',
    applying: 'Aplicando…',
    applied: (code: string) => `¡Listo! Aplicamos el código ${code}.`,
    checking: 'Revisando el código…',
    empty: 'Escribí un código.',
    error: 'No pudimos revisar el código. Probá de nuevo.',
    retry: 'Reintentar',
    rejected: {
      notFound: 'Ese código no existe. Revisá cómo lo escribiste.',
      inactive: 'Ese código no está activo en este momento.',
      expired: 'Ese código ya venció.',
      exhausted: 'Ese código ya alcanzó su máximo de usos.',
      notApplicable: {
        all: 'Este código no aplica a los cuadernos de tu carrito.',
        custom: 'Este código es solo para cuadernos diseñados a medida.',
        product: 'Este código es solo para cuadernos de la tienda.',
      },
      belowMinimum: (minSubtotal: number, missing: number) =>
        `Este código es para compras desde ${formatPrice(minSubtotal)}: te faltan ${formatPrice(missing)}.`,
    },
  },
};
