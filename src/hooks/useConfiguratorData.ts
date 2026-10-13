import { getConfiguratorData } from '../services/configuratorService';
import type { ConfiguratorData } from '../types/notebook';
import { useAsyncData } from './useAsyncData';
import type { AsyncDataState } from './useAsyncData';

export type ConfiguratorDataState = AsyncDataState<ConfiguratorData>;

/** Carga opciones y reglas del configurador, con estados de carga y error. */
export function useConfiguratorData(): ConfiguratorDataState {
  return useAsyncData(getConfiguratorData);
}
