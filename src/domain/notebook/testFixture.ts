import type { ConfiguratorData, NotebookConfiguration } from '../../types/notebook';

/**
 * Datos de prueba propios de los tests de dominio: números redondos para
 * que las cuentas sean fáciles de verificar, independientes de los mocks.
 */
export function buildTestData(overrides: Partial<ConfiguratorData> = {}): ConfiguratorData {
  return {
    sizes: [
      { id: 'a6', name: 'A6', widthCm: 10.5, heightCm: 14.8, inStock: true },
      { id: 'a5', name: 'A5', widthCm: 14.8, heightCm: 21, inStock: true },
      { id: 'a4', name: 'A4', widthCm: 21, heightCm: 29.7, inStock: true },
      { id: 'a3', name: 'A3', widthCm: 29.7, heightCm: 42, inStock: false },
    ],
    papers: [
      { id: 'lisa', name: 'Lisa', description: '', inStock: true },
      { id: 'acuarela', name: 'Acuarela', description: '', inStock: true },
      { id: 'kraft', name: 'Kraft', description: '', inStock: false },
    ],
    bindings: [
      {
        id: 'cosido',
        name: 'Cosido',
        description: '',
        previewStyle: 'exposed',
        inStock: true,
        maxSheets: 160,
        unavailableSizes: [],
      },
      {
        id: 'japonesa',
        name: 'Japonesa',
        description: '',
        previewStyle: 'japanese',
        inStock: true,
        maxSheets: 80,
        unavailableSizes: ['a4'],
      },
      {
        id: 'espiral',
        name: 'Espiral',
        description: '',
        previewStyle: 'spiral',
        inStock: false,
        maxSheets: 200,
        unavailableSizes: [],
      },
    ],
    fabrics: [
      { id: 'flores', name: 'Flores', image: '', inStock: true },
      { id: 'lino', name: 'Lino', image: '', inStock: true },
      { id: 'lunares', name: 'Lunares', image: '', inStock: false },
    ],
    sheets: { min: 40, step: 20, default: 80 },
    personalization: { enabled: true, maxLength: 12 },
    production: { baseDays: 7, personalizationExtraDays: 2 },
    pricing: {
      basePriceBySize: { a6: 8000, a5: 10000, a4: 15000, a3: 20000 },
      sheetPriceBySize: { a6: 20, a5: 40, a4: 70, a3: 100 },
      paperExtraPerSheet: { lisa: 0, acuarela: 60, kraft: 10 },
      bindingSurcharge: { cosido: 3000, japonesa: 2000, espiral: 1000 },
      fabricSurcharge: { flores: 0, lino: 1500, lunares: 0 },
      personalizationSurcharge: 2500,
    },
    ...overrides,
  };
}

export function buildConfiguration(
  overrides: Partial<NotebookConfiguration> = {},
): NotebookConfiguration {
  return {
    sizeId: 'a5',
    paperId: 'lisa',
    bindingId: 'cosido',
    fabricId: 'flores',
    sheets: 80,
    coverText: '',
    ...overrides,
  };
}
