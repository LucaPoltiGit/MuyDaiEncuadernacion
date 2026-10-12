import type { ConfiguratorData, NotebookConfiguration } from '../../types/notebook';
import { hasCoverText } from './restrictions';

export type PriceLineKind = 'base' | 'sheets' | 'binding' | 'fabric' | 'personalization';

export interface PriceLine {
  kind: PriceLineKind;
  /** Id de la opción que genera la línea (tamaño, encuadernación, tela...). */
  optionId?: string;
  /** Para `sheets`: cantidad y precio unitario por hoja. */
  quantity?: number;
  unitPrice?: number;
  amount: number;
}

export interface PriceBreakdown {
  lines: PriceLine[];
  total: number;
}

/**
 * Calcula el precio de un cuaderno a partir de las reglas en datos.
 * Única fuente de verdad del precio: la usan el configurador, el carrito,
 * el checkout y el admin. Las líneas en $0 no se incluyen.
 */
export function calculatePrice(
  configuration: NotebookConfiguration,
  { pricing, personalization }: ConfiguratorData,
): PriceBreakdown {
  const { sizeId, paperId, bindingId, fabricId, sheets } = configuration;
  const unitSheetPrice =
    (pricing.sheetPriceBySize[sizeId] ?? 0) + (pricing.paperExtraPerSheet[paperId] ?? 0);

  const lines: PriceLine[] = [
    { kind: 'base', optionId: sizeId, amount: pricing.basePriceBySize[sizeId] ?? 0 },
    {
      kind: 'sheets',
      optionId: paperId,
      quantity: sheets,
      unitPrice: unitSheetPrice,
      amount: sheets * unitSheetPrice,
    },
    { kind: 'binding', optionId: bindingId, amount: pricing.bindingSurcharge[bindingId] ?? 0 },
    { kind: 'fabric', optionId: fabricId, amount: pricing.fabricSurcharge[fabricId] ?? 0 },
  ];

  if (personalization.enabled && hasCoverText(configuration)) {
    lines.push({ kind: 'personalization', amount: pricing.personalizationSurcharge });
  }

  const visibleLines = lines.filter((line) => line.kind === 'base' || line.amount > 0);
  return {
    lines: visibleLines,
    total: visibleLines.reduce((sum, line) => sum + line.amount, 0),
  };
}
