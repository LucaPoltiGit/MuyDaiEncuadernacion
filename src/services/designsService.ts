import type { SavedDesign } from '../types/design';
import type { NotebookConfiguration } from '../types/notebook';
import { simulateRequest } from './mockNetwork';

/** Diseños guardados. Mock en memoria; con API real solo cambia este archivo. */
const savedDesigns: SavedDesign[] = [];

export function saveDesign(
  userId: string,
  configuration: NotebookConfiguration,
): Promise<SavedDesign> {
  const design: SavedDesign = {
    id: crypto.randomUUID(),
    userId,
    // Copia: el diseño guardado no cambia si después se edita en pantalla.
    configuration: structuredClone(configuration),
    createdAt: new Date().toISOString(),
  };
  savedDesigns.push(design);
  return simulateRequest(design);
}

export function getDesigns(userId: string): Promise<SavedDesign[]> {
  return simulateRequest(savedDesigns.filter((design) => design.userId === userId));
}
