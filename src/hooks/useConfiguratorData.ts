import { useCallback, useEffect, useState } from 'react';
import { getConfiguratorData } from '../services/configuratorService';
import type { ConfiguratorData } from '../types/notebook';

export type ConfiguratorDataState =
  | { status: 'loading' }
  | { status: 'error'; retry: () => void }
  | { status: 'ready'; data: ConfiguratorData };

/** Carga opciones y reglas del configurador, con estados de carga y error. */
export function useConfiguratorData(): ConfiguratorDataState {
  const [data, setData] = useState<ConfiguratorData | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getConfiguratorData()
      .then((result) => active && setData(result))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setFailed(false);
    setAttempt((value) => value + 1);
  }, []);

  if (failed) return { status: 'error', retry };
  if (!data) return { status: 'loading' };
  return { status: 'ready', data };
}
