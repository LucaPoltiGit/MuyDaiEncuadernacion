import type { ConfiguratorData, NotebookConfiguration } from '../../types/notebook';
import { hasCoverText } from './restrictions';

/** Días hábiles de producción de un cuaderno según cómo se configuró. */
export function getProductionDays(
  configuration: NotebookConfiguration,
  { production, personalization }: ConfiguratorData,
) {
  const extra =
    personalization.enabled && hasCoverText(configuration)
      ? production.personalizationExtraDays
      : 0;
  return production.baseDays + extra;
}
