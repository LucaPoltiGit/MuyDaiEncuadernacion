import { useCallback, useState } from 'react';
import { deleteDesign, getMyDesigns } from '../services/designsService';
import { getMyOrders } from '../services/orderService';
import type { SavedDesign } from '../types/design';
import type { Order } from '../types/order';
import { useAsyncData } from './useAsyncData';
import { useSession } from './useSession';

/**
 * Id de la persona logueada: `undefined` mientras se consulta la sesión y
 * `null` si no hay. Los services toman la identidad de la sesión; acá solo
 * sirve para esperar a que esté lista y recargar si cambia.
 */
function useUserId() {
  const session = useSession();
  if (session.status === 'loading') return undefined;
  return session.user?.id ?? null;
}

/** Mientras no se sabe quién es, la carga queda esperando (no muestra "vacío" de más). */
const waitForSession = () => new Promise<never>(() => {});

/** Compras de la persona logueada. */
export function useMyOrders() {
  const userId = useUserId();
  const load = useCallback((): Promise<Order[]> => {
    if (userId === undefined) return waitForSession();
    return userId ? getMyOrders() : Promise.resolve([]);
  }, [userId]);
  return useAsyncData(load);
}

/** Diseños guardados de la persona logueada, con borrar. */
export function useMyDesigns() {
  const userId = useUserId();
  const load = useCallback((): Promise<SavedDesign[]> => {
    if (userId === undefined) return waitForSession();
    return userId ? getMyDesigns() : Promise.resolve([]);
  }, [userId]);
  const state = useAsyncData(load);
  // Los borrados se ocultan al instante, sin esperar a recargar la lista.
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  async function remove(designId: string) {
    setRemovedIds((current) => [...current, designId]);
    try {
      await deleteDesign(designId);
    } catch {
      setRemovedIds((current) => current.filter((id) => id !== designId));
      throw new Error('No se pudo borrar el diseño.');
    }
  }

  const designs =
    state.status === 'ready' ? state.data.filter((design) => !removedIds.includes(design.id)) : [];

  return { state, designs, remove };
}
