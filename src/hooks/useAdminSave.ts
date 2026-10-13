import { useCallback, useState } from 'react';
import { AdminValidationError } from '../services/adminService';

export type AdminSaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved' }
  /** `issues`: los códigos de validación del service, si fue por datos inválidos. */
  | { status: 'error'; issues: unknown };

/**
 * Ejecuta un cambio del panel (guardar, borrar, cambiar estado) y lleva su
 * estado. Traduce los errores del service a `issues`, así las pantallas no
 * dependen de sus clases de error.
 */
export function useAdminSave<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
) {
  const [state, setState] = useState<AdminSaveState>({ status: 'idle' });

  const run = useCallback(
    async (...args: Args): Promise<Result | null> => {
      setState({ status: 'saving' });
      try {
        const result = await action(...args);
        setState({ status: 'saved' });
        return result;
      } catch (error) {
        setState({
          status: 'error',
          issues: error instanceof AdminValidationError ? error.issues : null,
        });
        return null;
      }
    },
    [action],
  );

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { state, run, reset };
}
