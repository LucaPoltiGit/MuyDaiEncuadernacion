import { useState } from 'react';
import { configurationKey } from '../domain/notebook/restrictions';
import { saveDesign } from '../services/designsService';
import type { NotebookConfiguration } from '../types/notebook';
import { useSession } from './useSession';

export type SaveDesignStatus = 'loading' | 'anonymous' | 'idle' | 'saving' | 'saved' | 'error';

/**
 * Guardar un diseño: solo para personas logueadas. "Guardado" vale para
 * ese diseño exacto: si después se cambia algo, vuelve a ofrecer guardar.
 */
export function useSaveDesign(configuration: NotebookConfiguration) {
  const session = useSession();
  const [result, setResult] = useState<{
    key: string;
    status: 'saving' | 'saved' | 'error';
  } | null>(null);
  const key = configurationKey(configuration);

  async function save() {
    if (session.status !== 'ready' || !session.user) return;
    setResult({ key, status: 'saving' });
    try {
      await saveDesign(session.user.id, configuration);
      setResult({ key, status: 'saved' });
    } catch {
      setResult({ key, status: 'error' });
    }
  }

  let status: SaveDesignStatus;
  if (session.status === 'loading') status = 'loading';
  else if (!session.user) status = 'anonymous';
  else status = result && result.key === key ? result.status : 'idle';

  return { status, save };
}
