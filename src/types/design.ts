import type { NotebookConfiguration } from './notebook';

/** Un diseño guardado por una persona logueada para retomarlo después. */
export interface SavedDesign {
  id: string;
  userId: string;
  configuration: NotebookConfiguration;
  createdAt: string;
}
