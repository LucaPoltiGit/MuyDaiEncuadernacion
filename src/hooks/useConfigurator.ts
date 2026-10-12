import { useMemo, useState } from 'react';
import { calculatePrice } from '../domain/notebook/pricing';
import { getProductionDays } from '../domain/notebook/production';
import {
  createDefaultConfiguration,
  getSheetLimits,
  getUnavailableReason,
  isValidConfiguration,
  normalizeConfiguration,
} from '../domain/notebook/restrictions';
import type { NormalizeResult } from '../domain/notebook/restrictions';
import type { ConfiguratorData, NotebookConfiguration, OptionKind } from '../types/notebook';

function initialState(data: ConfiguratorData, initial?: NotebookConfiguration): NormalizeResult {
  // Un diseño retomado puede tener opciones que ya no existen: se ajusta y se avisa.
  if (initial) return normalizeConfiguration(data, initial);
  const configuration = createDefaultConfiguration(data);
  if (!configuration) {
    throw new Error('El configurador necesita datos configurables (ver isConfigurable).');
  }
  return { configuration, adjustments: [] };
}

/**
 * Estado del configurador: la configuración elegida y todo lo que se deriva
 * de ella (precio, plazo, límites, opciones bloqueadas). Cada cambio pasa
 * por `normalizeConfiguration`, así nunca queda una combinación inválida;
 * si hubo que ajustar algo, se informa en `adjustments`. `version` cambia
 * con cada actualización (sirve para mostrar/ocultar avisos).
 */
export function useConfigurator(data: ConfiguratorData, initial?: NotebookConfiguration) {
  const [state, setState] = useState(() => ({ ...initialState(data, initial), version: 0 }));
  const { configuration, adjustments, version } = state;

  function update(changes: Partial<NotebookConfiguration>) {
    setState((current) => ({
      ...normalizeConfiguration(data, { ...current.configuration, ...changes }),
      version: current.version + 1,
    }));
  }

  const derived = useMemo(
    () => ({
      price: calculatePrice(configuration, data),
      productionDays: getProductionDays(configuration, data),
      sheetLimits: getSheetLimits(data, configuration.bindingId),
      isValid: isValidConfiguration(data, configuration),
    }),
    [configuration, data],
  );

  return {
    configuration,
    adjustments,
    version,
    ...derived,
    update,
    unavailableReason: (kind: OptionKind, optionId: string) =>
      getUnavailableReason(data, configuration, kind, optionId),
  };
}
