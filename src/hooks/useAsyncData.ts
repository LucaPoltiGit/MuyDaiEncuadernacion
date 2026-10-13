import { useCallback, useEffect, useState } from 'react';

export type AsyncDataState<T> =
  { status: 'loading' } | { status: 'error'; retry: () => void } | { status: 'ready'; data: T };

/**
 * Carga datos de un service con estados de carga y error, y permite
 * reintentar. `load` tiene que ser estable (una función del service o un
 * `useCallback`): si cambia, se vuelve a cargar.
 */
export function useAsyncData<T>(load: () => Promise<T>): AsyncDataState<T> {
  const [result, setResult] = useState<{ load: () => Promise<T>; data: T } | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    load()
      .then((data) => active && setResult({ load, data }))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [load, attempt]);

  const retry = useCallback(() => {
    setFailed(false);
    setAttempt((value) => value + 1);
  }, []);

  if (failed) return { status: 'error', retry };
  // Si cambió `load`, los datos anteriores ya no corresponden.
  if (!result || result.load !== load) return { status: 'loading' };
  return { status: 'ready', data: result.data };
}
