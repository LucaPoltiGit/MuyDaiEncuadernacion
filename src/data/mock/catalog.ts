import type { CatalogData } from '../../types/catalog';

/**
 * Cuadernos hechos, listos para enviar. Cada uno es una configuración del
 * configurador con precio y stock propios. Precios en pesos, enteros.
 */
export const catalogMock: CatalogData = {
  categories: [
    { id: 'escribir', name: 'Para escribir' },
    { id: 'dibujar', name: 'Para dibujar' },
    { id: 'regalar', name: 'Para regalar' },
  ],
  products: [
    {
      id: 'p-jardin',
      slug: 'cuaderno-jardin',
      name: 'Cuaderno Jardín',
      tagline: 'A5 de flores, cosido a la vista',
      description:
        'El clásico de MuyDai: tela de flores, costura copta a la vista y hojas lisas que abren completamente planas. Para escribir, pegar, dibujar o lo que pida el día.',
      categoryId: 'escribir',
      configuration: {
        sizeId: 'a5',
        paperId: 'lisa',
        bindingId: 'cosido',
        fabricId: 'flores',
        sheets: 80,
        coverText: '',
      },
      price: 19900,
      stock: 4,
    },
    {
      id: 'p-acuarela',
      slug: 'bitacora-de-acuarela',
      name: 'Bitácora de acuarela',
      tagline: 'A5 de lino, papel de 200 g',
      description:
        'Tapa dura forrada en lino crudo y papel grueso que aguanta el agua. Pensada para salir a pintar: no se dobla y las hojas no se ondulan.',
      categoryId: 'dibujar',
      configuration: {
        sizeId: 'a5',
        paperId: 'acuarela',
        bindingId: 'tapa-dura',
        fabricId: 'lino',
        sheets: 40,
        coverText: '',
      },
      price: 24500,
      stock: 2,
    },
    {
      id: 'p-bolsillo',
      slug: 'libretita-de-bolsillo',
      name: 'Libretita de bolsillo',
      tagline: 'A6 cuadrillé, encuadernación japonesa',
      description:
        'Chiquita, para llevar a todos lados. Hojas punteadas y costura japonesa en el lomo. Entra en cualquier cartera.',
      categoryId: 'escribir',
      configuration: {
        sizeId: 'a6',
        paperId: 'punteada',
        bindingId: 'japonesa',
        fabricId: 'cuadrille',
        sheets: 40,
        coverText: '',
      },
      price: 12900,
      stock: 8,
    },
    {
      id: 'p-recetario',
      slug: 'recetario',
      name: 'Recetario',
      tagline: 'A4 rayado, con "Recetas" en la tapa',
      description:
        'Grande y resistente, para las recetas de la familia. Tapa dura con tela a rayas, 120 hojas rayadas y la etiqueta bordada en la tapa.',
      categoryId: 'regalar',
      configuration: {
        sizeId: 'a4',
        paperId: 'rayada',
        bindingId: 'tapa-dura',
        fabricId: 'rayas',
        sheets: 120,
        coverText: 'Recetas',
      },
      price: 29900,
      stock: 1,
    },
    {
      id: 'p-ondas',
      slug: 'diario-de-ondas',
      name: 'Diario de ondas',
      tagline: 'A5 punteado, encuadernación japonesa',
      description:
        'Tela con ondas rosas y naranjas y costura japonesa a la vista. Hojas punteadas, ideal para bullet journal.',
      categoryId: 'escribir',
      configuration: {
        sizeId: 'a5',
        paperId: 'punteada',
        bindingId: 'japonesa',
        fabricId: 'ondas',
        sheets: 80,
        coverText: '',
      },
      price: 18900,
      stock: 0,
    },
    {
      id: 'p-viaje',
      slug: 'cuaderno-de-viaje',
      name: 'Cuaderno de viaje',
      tagline: 'A6 de lino, hojas cuadriculadas',
      description:
        'Liviano y discreto, para anotar direcciones, gastos y recuerdos del viaje. Cosido a la vista, abre plano en cualquier mesa.',
      categoryId: 'escribir',
      configuration: {
        sizeId: 'a6',
        paperId: 'cuadriculada',
        bindingId: 'cosido',
        fabricId: 'lino',
        sheets: 80,
        coverText: '',
      },
      price: 14500,
      stock: 5,
    },
    {
      id: 'p-croquera',
      slug: 'croquera-grande',
      name: 'Croquera grande',
      tagline: 'A4 cuadrillé, 120 hojas lisas',
      description:
        'Mucho lugar para bocetar. Cosida a la vista para que cada doble página quede completamente plana.',
      categoryId: 'dibujar',
      configuration: {
        sizeId: 'a4',
        paperId: 'lisa',
        bindingId: 'cosido',
        fabricId: 'cuadrille',
        sheets: 120,
        coverText: '',
      },
      price: 26900,
      stock: 3,
    },
    {
      id: 'p-agenda',
      slug: 'agenda-floral-2027',
      name: 'Agenda floral 2027',
      tagline: 'A5 de flores, tapa dura, "2027" en la tapa',
      description:
        'Para planear el año que viene: 160 hojas rayadas, tapa dura con tela de flores y el año en la etiqueta de la tapa.',
      categoryId: 'regalar',
      configuration: {
        sizeId: 'a5',
        paperId: 'rayada',
        bindingId: 'tapa-dura',
        fabricId: 'flores',
        sheets: 160,
        coverText: '2027',
      },
      price: 27500,
      stock: 6,
    },
  ],
};
