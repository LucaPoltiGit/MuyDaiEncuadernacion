import type {
  BindingOption,
  ConfiguratorData,
  NotebookConfiguration,
  OptionKind,
} from '../../types/notebook';

/** Por qué una opción no se puede elegir. El texto lo arma la UI desde content. */
export type UnavailableReason =
  { type: 'outOfStock' } | { type: 'notForSize'; sizeId: string } | { type: 'noBindingForSize' };

/** Cambios automáticos que hizo el sistema para que la combinación siga siendo válida. */
export type Adjustment =
  /** Una opción elegida ya no existe o se agotó (ej. diseño guardado hace tiempo). */
  | { type: 'option'; kind: Exclude<OptionKind, 'binding'>; toId: string }
  | { type: 'binding'; fromId: string; toId: string; sizeId: string }
  | { type: 'sheets'; from: number; to: number; bindingId: string }
  | { type: 'coverText'; reason: 'trimmed' | 'disabled' };

export interface NormalizeResult {
  configuration: NotebookConfiguration;
  adjustments: Adjustment[];
}

/** Letras (con acentos y ñ), números, espacio y algunos signos simples. */
const COVER_TEXT_ALLOWED = /[^\p{L}\p{N} .,&'!?♥-]/gu;

export function sanitizeCoverText(text: string, maxLength: number) {
  return text.replace(COVER_TEXT_ALLOWED, '').replace(/\s+/g, ' ').slice(0, maxLength);
}

export function hasCoverText(configuration: NotebookConfiguration) {
  return configuration.coverText.trim().length > 0;
}

function findBinding(data: ConfiguratorData, bindingId: string) {
  return data.bindings.find((binding) => binding.id === bindingId);
}

function bindingWorksForSize(binding: BindingOption, sizeId: string) {
  return binding.inStock && !binding.unavailableSizes.includes(sizeId);
}

export function getMaxSheets(data: ConfiguratorData, bindingId: string) {
  return findBinding(data, bindingId)?.maxSheets ?? data.sheets.min;
}

/** Valores posibles de hojas para una encuadernación (min, min+step, ... hasta el máximo). */
export function getSheetLimits(data: ConfiguratorData, bindingId: string) {
  const { min } = data.sheets;
  // Protege contra un paso inválido cargado por error (evita divisiones por 0).
  const step = Math.max(1, data.sheets.step);
  const max = Math.max(min, getMaxSheets(data, bindingId));
  return { min, step, max: min + Math.floor((max - min) / step) * step };
}

function clampSheets(data: ConfiguratorData, bindingId: string, sheets: number) {
  const { min, step, max } = getSheetLimits(data, bindingId);
  const stepped = min + Math.round((sheets - min) / step) * step;
  return Math.min(max, Math.max(min, stepped));
}

/**
 * Indica si una opción se puede elegir dada la configuración actual, y si
 * no, por qué. Elegir un tamaño puede cambiar la encuadernación (se avisa),
 * así que un tamaño solo se bloquea si no hay ninguna encuadernación posible.
 */
export function getUnavailableReason(
  data: ConfiguratorData,
  configuration: NotebookConfiguration,
  kind: OptionKind,
  optionId: string,
): UnavailableReason | null {
  switch (kind) {
    case 'size': {
      const size = data.sizes.find((option) => option.id === optionId);
      if (!size?.inStock) return { type: 'outOfStock' };
      const anyBinding = data.bindings.some((binding) => bindingWorksForSize(binding, optionId));
      return anyBinding ? null : { type: 'noBindingForSize' };
    }
    case 'binding': {
      const binding = findBinding(data, optionId);
      if (!binding?.inStock) return { type: 'outOfStock' };
      if (binding.unavailableSizes.includes(configuration.sizeId)) {
        return { type: 'notForSize', sizeId: configuration.sizeId };
      }
      return null;
    }
    case 'paper': {
      const paper = data.papers.find((option) => option.id === optionId);
      return paper?.inStock ? null : { type: 'outOfStock' };
    }
    case 'fabric': {
      const fabric = data.fabrics.find((option) => option.id === optionId);
      return fabric?.inStock ? null : { type: 'outOfStock' };
    }
  }
}

function sizeIsUsable(data: ConfiguratorData, sizeId: string) {
  return getUnavailableReason(data, emptyConfiguration, 'size', sizeId) === null;
}

/** Configuración "neutra" para preguntar por opciones que no dependen de otras. */
const emptyConfiguration: NotebookConfiguration = {
  sizeId: '',
  paperId: '',
  bindingId: '',
  fabricId: '',
  sheets: 0,
  coverText: '',
};

/**
 * Indica si con estos datos se puede armar al menos un cuaderno: hay
 * opciones en stock de todo, una encuadernación posible, reglas de hojas
 * coherentes y precio para cada tamaño. Si no, el configurador no se muestra.
 */
export function isConfigurable(data: ConfiguratorData) {
  const { min, step, default: initial } = data.sheets;
  return (
    data.sizes.some((size) => sizeIsUsable(data, size.id)) &&
    data.papers.some((paper) => paper.inStock) &&
    data.fabrics.some((fabric) => fabric.inStock) &&
    min > 0 &&
    step > 0 &&
    initial >= min &&
    data.sizes.every(
      (size) =>
        data.pricing.basePriceBySize[size.id] !== undefined &&
        data.pricing.sheetPriceBySize[size.id] !== undefined,
    )
  );
}

/**
 * Corrige una configuración para que sea válida y devuelve qué cambió, para
 * avisarle a la persona. Cubre: opciones que ya no existen o se agotaron
 * (diseños guardados), encuadernación que no se hace en el tamaño, hojas
 * fuera de los límites y texto de tapa no permitido.
 */
export function normalizeConfiguration(
  data: ConfiguratorData,
  configuration: NotebookConfiguration,
): NormalizeResult {
  const adjustments: Adjustment[] = [];
  let next = { ...configuration };

  if (!sizeIsUsable(data, next.sizeId)) {
    const replacement = data.sizes.find((size) => sizeIsUsable(data, size.id));
    if (replacement) {
      adjustments.push({ type: 'option', kind: 'size', toId: replacement.id });
      next = { ...next, sizeId: replacement.id };
    }
  }

  for (const [kind, key, options] of [
    ['paper', 'paperId', data.papers],
    ['fabric', 'fabricId', data.fabrics],
  ] as const) {
    const current = options.find((option) => option.id === next[key]);
    if (!current?.inStock) {
      const replacement = options.find((option) => option.inStock);
      if (replacement) {
        adjustments.push({ type: 'option', kind, toId: replacement.id });
        next = { ...next, [key]: replacement.id };
      }
    }
  }

  const currentBinding = findBinding(data, next.bindingId);
  if (!currentBinding || !bindingWorksForSize(currentBinding, next.sizeId)) {
    const replacement = data.bindings.find((binding) => bindingWorksForSize(binding, next.sizeId));
    if (replacement) {
      adjustments.push({
        type: 'binding',
        fromId: next.bindingId,
        toId: replacement.id,
        sizeId: next.sizeId,
      });
      next = { ...next, bindingId: replacement.id };
    }
  }

  const sheets = clampSheets(data, next.bindingId, next.sheets);
  if (sheets !== next.sheets) {
    adjustments.push({ type: 'sheets', from: next.sheets, to: sheets, bindingId: next.bindingId });
    next = { ...next, sheets };
  }

  if (!data.personalization.enabled && next.coverText !== '') {
    adjustments.push({ type: 'coverText', reason: 'disabled' });
    next = { ...next, coverText: '' };
  } else {
    const coverText = sanitizeCoverText(next.coverText, data.personalization.maxLength);
    if (coverText.length < next.coverText.length) {
      adjustments.push({ type: 'coverText', reason: 'trimmed' });
    }
    next = { ...next, coverText };
  }

  return { configuration: next, adjustments };
}

/**
 * La configuración se puede comprar tal cual: opciones existentes y en
 * stock, compatibles, dentro de los límites y con precio cargado.
 */
export function isValidConfiguration(data: ConfiguratorData, configuration: NotebookConfiguration) {
  const kinds: [OptionKind, string][] = [
    ['size', configuration.sizeId],
    ['paper', configuration.paperId],
    ['binding', configuration.bindingId],
    ['fabric', configuration.fabricId],
  ];
  if (kinds.some(([kind, id]) => getUnavailableReason(data, configuration, kind, id))) {
    return false;
  }
  const { pricing } = data;
  if (
    pricing.basePriceBySize[configuration.sizeId] === undefined ||
    pricing.sheetPriceBySize[configuration.sizeId] === undefined
  ) {
    return false;
  }
  const { min, max, step } = getSheetLimits(data, configuration.bindingId);
  const { sheets, coverText } = configuration;
  if (sheets < min || sheets > max || (sheets - min) % step !== 0) return false;
  if (coverText && !data.personalization.enabled) return false;
  return coverText === sanitizeCoverText(coverText, data.personalization.maxLength);
}

/**
 * Primera combinación válida: lo que ve alguien al abrir el configurador.
 * Requiere `isConfigurable(data)`; si no, devuelve null.
 */
export function createDefaultConfiguration(data: ConfiguratorData): NotebookConfiguration | null {
  if (!isConfigurable(data)) return null;
  return normalizeConfiguration(data, {
    sizeId: '',
    paperId: '',
    bindingId: '',
    fabricId: '',
    sheets: data.sheets.default,
    coverText: '',
  }).configuration;
}

/** Clave estable de una configuración: para comparar diseños o juntar renglones iguales del carrito. */
export function configurationKey(configuration: NotebookConfiguration) {
  const { sizeId, paperId, bindingId, fabricId, sheets, coverText } = configuration;
  return [sizeId, paperId, bindingId, fabricId, sheets, coverText.trim()].join('|');
}
