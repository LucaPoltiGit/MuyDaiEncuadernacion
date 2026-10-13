import type { ConfiguratorData } from '../../types/notebook';

/**
 * Datos de ejemplo del configurador. Simulan lo que vendría del backend
 * (y lo que el admin edita): opciones con stock, límites, reglas de precio,
 * personalización y tiempos de producción. Precios en pesos, enteros.
 */
export const configuratorMock: ConfiguratorData = {
  sizes: [
    { id: 'a6', name: 'A6', widthCm: 10.5, heightCm: 14.8, inStock: true },
    { id: 'a5', name: 'A5', widthCm: 14.8, heightCm: 21, inStock: true },
    { id: 'a4', name: 'A4', widthCm: 21, heightCm: 29.7, inStock: true },
  ],
  papers: [
    { id: 'lisa', name: 'Lisa', description: 'Libre, para dibujar o escribir.', inStock: true },
    { id: 'rayada', name: 'Rayada', description: 'Renglones de 7 mm.', inStock: true },
    { id: 'punteada', name: 'Punteada', description: 'Ideal para bullet journal.', inStock: true },
    { id: 'cuadriculada', name: 'Cuadriculada', description: 'Cuadros de 5 mm.', inStock: true },
    { id: 'acuarela', name: 'Acuarela', description: 'Papel grueso de 200 g.', inStock: true },
    { id: 'kraft', name: 'Kraft', description: 'Papel madera reciclado.', inStock: false },
  ],
  bindings: [
    {
      id: 'cosido',
      name: 'Cosido a la vista',
      description: 'Abre completamente plano. Costura copta.',
      previewStyle: 'exposed',
      inStock: true,
      maxSheets: 160,
      unavailableSizes: [],
    },
    {
      id: 'tapa-dura',
      name: 'Tapa dura cosida',
      description: 'Lomo cubierto, el más resistente.',
      previewStyle: 'hardcover',
      inStock: true,
      maxSheets: 240,
      unavailableSizes: ['a6'],
    },
    {
      id: 'japonesa',
      name: 'Japonesa',
      description: 'Costura decorativa en el lomo.',
      previewStyle: 'japanese',
      inStock: true,
      maxSheets: 80,
      unavailableSizes: ['a4'],
    },
    {
      id: 'espiral',
      name: 'Espiral',
      description: 'Práctico, se dobla al medio.',
      previewStyle: 'spiral',
      inStock: false,
      maxSheets: 200,
      unavailableSizes: [],
    },
  ],
  fabrics: [
    { id: 'flores', name: 'Flores', image: '/images/telas/flores.svg', inStock: true },
    { id: 'cuadrille', name: 'Cuadrillé', image: '/images/telas/cuadrille.svg', inStock: true },
    { id: 'ondas', name: 'Ondas', image: '/images/telas/ondas.svg', inStock: true },
    { id: 'lino', name: 'Lino crudo', image: '/images/telas/lino.svg', inStock: true },
    { id: 'rayas', name: 'Rayas', image: '/images/telas/rayas.svg', inStock: true },
    { id: 'lunares', name: 'Lunares', image: '/images/telas/lunares.svg', inStock: false },
  ],
  sheets: { min: 40, step: 20, default: 80 },
  personalization: { enabled: true, maxLength: 12 },
  production: { baseDays: 7, personalizationExtraDays: 2 },
  pricing: {
    basePriceBySize: { a6: 9000, a5: 12500, a4: 17500 },
    sheetPriceBySize: { a6: 25, a5: 40, a4: 70 },
    paperExtraPerSheet: {
      lisa: 0,
      rayada: 5,
      punteada: 5,
      cuadriculada: 5,
      acuarela: 60,
      kraft: 15,
    },
    bindingSurcharge: { cosido: 3000, 'tapa-dura': 4500, japonesa: 2500, espiral: 1500 },
    fabricSurcharge: { flores: 0, cuadrille: 0, ondas: 1500, lino: 2000, rayas: 0, lunares: 0 },
    personalizationSurcharge: 2500,
  },
};
