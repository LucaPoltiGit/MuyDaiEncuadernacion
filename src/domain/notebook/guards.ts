import type { NotebookConfiguration } from '../../types/notebook';

/**
 * Verifica que un valor desconocido (localStorage, estado de navegación)
 * tenga la forma de una configuración. Si sus opciones siguen existiendo
 * lo decide `normalizeConfiguration`.
 */
export function isNotebookConfiguration(value: unknown): value is NotebookConfiguration {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.sizeId === 'string' &&
    typeof candidate.paperId === 'string' &&
    typeof candidate.bindingId === 'string' &&
    typeof candidate.fabricId === 'string' &&
    typeof candidate.sheets === 'number' &&
    Number.isFinite(candidate.sheets) &&
    typeof candidate.coverText === 'string'
  );
}
