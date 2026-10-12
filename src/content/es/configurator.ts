import { formatPrice } from '../../domain/money';

/** Textos del configurador de cuadernos. */
export const configurator = {
  eyebrow: 'Hecho a tu medida',
  title: 'Diseñá tu cuaderno',
  intro: 'Elegí cada detalle y mirá cómo queda. El precio se actualiza al instante.',

  loading: 'Preparando las telas…',
  paused: {
    title: 'El configurador está en pausa',
    text: 'Estamos reponiendo telas y materiales. Mientras tanto, podés ver los cuadernos listos de la tienda.',
    goToCatalog: 'Ver la tienda',
  },
  error: {
    title: 'No pudimos cargar el configurador',
    text: 'Revisá tu conexión y probá de nuevo.',
    retry: 'Reintentar',
  },

  steps: {
    fabric: 'Tela de la tapa',
    size: 'Tamaño',
    binding: 'Encuadernación',
    sheets: 'Cantidad de hojas',
    paper: 'Tipo de hoja',
    personalization: 'Texto en la tapa',
  },

  sizeDetail: (widthCm: number, heightCm: number) =>
    `${String(widthCm).replace('.', ',')} × ${String(heightCm).replace('.', ',')} cm`,
  surcharge: (amount: number) => `+ ${formatPrice(amount)}`,
  upToSheets: (max: number) => `Hasta ${max} hojas`,

  unavailable: {
    outOfStock: 'Sin stock',
    notForSize: (sizeName: string) => `No disponible en ${sizeName}`,
    noBindingForSize: 'Sin encuadernación disponible',
  },

  sheets: {
    unit: (count: number) => `${count} hojas`,
    decrease: (step: number) => `Restar ${step} hojas`,
    increase: (step: number) => `Sumar ${step} hojas`,
    hint: (min: number, max: number, bindingName: string) =>
      `Entre ${min} y ${max} hojas con ${bindingName.toLowerCase()}.`,
  },

  personalization: {
    toggle: 'Quiero un texto o iniciales en la tapa',
    toggleDetail: (amount: number, extraDays: number) =>
      extraDays > 0
        ? `+ ${formatPrice(amount)} · suma ${extraDays} días hábiles`
        : `+ ${formatPrice(amount)}`,
    inputLabel: 'Texto de la tapa',
    inputHint: (maxLength: number) =>
      `Hasta ${maxLength} caracteres: letras, números y signos simples.`,
    placeholder: 'Ej: M.D. o Mi diario',
  },

  adjustments: {
    option: (stepName: string, to: string) =>
      `${stepName}: lo que habías elegido ya no está disponible, elegimos ${to}.`,
    binding: (from: string, to: string, sizeName: string) =>
      `Cambiamos la encuadernación a ${to}: ${from} no se hace en ${sizeName}.`,
    sheets: (to: number, bindingName: string) =>
      `Ajustamos a ${to} hojas, el máximo con ${bindingName.toLowerCase()}.`,
    coverTextTrimmed: 'Ajustamos el texto de la tapa a los caracteres permitidos.',
    coverTextDisabled: 'La personalización de tapa no está disponible por ahora.',
  },

  preview: {
    label: 'Vista previa',
    alt: (fabric: string, size: string, binding: string, coverText: string) =>
      `Cuaderno ${size} con tela ${fabric}, ${binding.toLowerCase()}` +
      (coverText ? `, con el texto "${coverText}" en la tapa` : ', sin texto en la tapa'),
  },

  summary: {
    totalLabel: 'Total',
    production: (days: number) => `Se entrega en ${days} días hábiles`,
    addToCart: 'Agregar al carrito',
    added: 'Listo, lo agregamos al carrito.',
    cannotAdd: 'Esta combinación no está disponible ahora. Probá con otra opción.',
    goToCart: 'Ver carrito',
    breakdownToggle: 'Ver detalle del precio',
    lines: {
      base: (size: string) => `Cuaderno ${size}`,
      sheets: (quantity: number, paper: string, unitPrice: number) =>
        `${quantity} hojas ${paper.toLowerCase()} × ${formatPrice(unitPrice)}`,
      binding: (name: string) => `Encuadernación ${name.toLowerCase()}`,
      fabric: (name: string) => `Tela ${name.toLowerCase()}`,
      personalization: 'Texto en la tapa',
    },
  },

  saveDesign: {
    button: 'Guardar diseño',
    saving: 'Guardando…',
    saved: 'Diseño guardado. Lo vas a encontrar en Mi cuenta.',
    error: 'No pudimos guardar el diseño. Probá de nuevo.',
    loginPrompt: 'Ingresá para guardar tu diseño',
  },
};
