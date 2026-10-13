import { createId } from '../domain/id';
import type { SavedDesign } from '../types/design';
import type { NotebookConfiguration } from '../types/notebook';
import { requireUserId } from './authService';
import { readDb, updateDb } from './mockDb';
import { simulateRequest } from './mockNetwork';

/**
 * Diseños guardados de la persona logueada (la identidad sale de la sesión,
 * como en un backend). Viven en la base simulada; con API real solo cambia
 * este archivo.
 */
export async function saveDesign(configuration: NotebookConfiguration): Promise<SavedDesign> {
  const design: SavedDesign = {
    id: createId(),
    userId: requireUserId(),
    // Copia: el diseño guardado no cambia si después se edita en pantalla.
    configuration: structuredClone(configuration),
    createdAt: new Date().toISOString(),
  };
  updateDb((db) => ({ ...db, designs: [...db.designs, design] }));
  return simulateRequest(design);
}

/** Mis diseños, del más nuevo al más viejo. */
export async function getMyDesigns(): Promise<SavedDesign[]> {
  const userId = requireUserId();
  return simulateRequest(
    readDb()
      .designs.filter((design) => design.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
}

/** Borra uno de mis diseños (los de otras personas no se tocan). */
export async function deleteDesign(designId: string): Promise<void> {
  const userId = requireUserId();
  updateDb((db) => ({
    ...db,
    designs: db.designs.filter((design) => !(design.id === designId && design.userId === userId)),
  }));
  return simulateRequest(undefined);
}
