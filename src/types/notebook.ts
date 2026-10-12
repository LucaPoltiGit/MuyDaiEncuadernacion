/**
 * Modelo del cuaderno configurable. Es el mismo para el configurador, el
 * carrito, los diseños guardados y el admin: un producto de catálogo es
 * una configuración armada de antemano.
 *
 * Los precios son enteros en pesos argentinos (sin centavos).
 */

export interface SizeOption {
  id: string;
  name: string;
  widthCm: number;
  heightCm: number;
  inStock: boolean;
}

export interface PaperOption {
  id: string;
  name: string;
  description: string;
  inStock: boolean;
}

/** Cómo se dibuja cada encuadernación en la vista previa. */
export type BindingPreviewStyle = 'exposed' | 'hardcover' | 'japanese' | 'spiral';

export interface BindingOption {
  id: string;
  name: string;
  description: string;
  previewStyle: BindingPreviewStyle;
  inStock: boolean;
  /** Máximo de hojas que admite esta encuadernación. */
  maxSheets: number;
  /** Tamaños en los que NO se puede hacer. */
  unavailableSizes: string[];
}

export interface FabricOption {
  id: string;
  name: string;
  /** Textura que se repite en la vista previa y en la muestra. */
  image: string;
  inStock: boolean;
}

export interface SheetsRule {
  min: number;
  step: number;
  default: number;
}

export interface PersonalizationConfig {
  /** El admin puede activarla o desactivarla. */
  enabled: boolean;
  maxLength: number;
}

export interface ProductionConfig {
  /** Días hábiles de producción de un cuaderno. */
  baseDays: number;
  /** Días hábiles extra si lleva texto en la tapa. */
  personalizationExtraDays: number;
}

export interface PricingRules {
  basePriceBySize: Record<string, number>;
  /** Precio de cada hoja según el tamaño. */
  sheetPriceBySize: Record<string, number>;
  /** Extra por hoja según el tipo de papel. */
  paperExtraPerSheet: Record<string, number>;
  bindingSurcharge: Record<string, number>;
  fabricSurcharge: Record<string, number>;
  personalizationSurcharge: number;
}

/** Todo lo que el configurador necesita, tal como lo entrega el service. */
export interface ConfiguratorData {
  sizes: SizeOption[];
  papers: PaperOption[];
  bindings: BindingOption[];
  fabrics: FabricOption[];
  sheets: SheetsRule;
  personalization: PersonalizationConfig;
  production: ProductionConfig;
  pricing: PricingRules;
}

/** Las elecciones de una persona: lo que se guarda y va al carrito. */
export interface NotebookConfiguration {
  sizeId: string;
  paperId: string;
  bindingId: string;
  fabricId: string;
  sheets: number;
  /** Texto en la tapa; vacío = sin personalización. */
  coverText: string;
}

export type OptionKind = 'size' | 'paper' | 'binding' | 'fabric';
