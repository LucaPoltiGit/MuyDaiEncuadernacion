import { NotebookPreview } from '../../ui/NotebookPreview/NotebookPreview';
import { content } from '../../../content';
import {
  largestHeightCm,
  maxSheetsOverall,
  resolveConfiguration,
} from '../../../domain/notebook/resolve';
import type { ConfiguratorData, NotebookConfiguration } from '../../../types/notebook';

export interface NotebookFigureProps {
  configuration: NotebookConfiguration;
  data: ConfiguratorData;
}

/**
 * Dibujo de un cuaderno a partir de su configuración (catálogo, ficha y
 * carrito). Usa la misma escala que el configurador, así un A6 se ve más
 * chico que un A4. Ocupa todo el alto y ancho de su contenedor.
 */
export function NotebookFigure({ configuration, data }: NotebookFigureProps) {
  const { size, binding, fabric } = resolveConfiguration(configuration, data);
  const fallbackSize = data.sizes[0];
  const widthCm = size?.widthCm ?? fallbackSize?.widthCm ?? 1;
  const heightCm = size?.heightCm ?? fallbackSize?.heightCm ?? 1;
  const coverText = configuration.coverText.trim();

  return (
    <NotebookPreview
      fabricImage={fabric?.image ?? ''}
      widthCm={widthCm}
      heightCm={heightCm}
      referenceHeightCm={largestHeightCm(data)}
      binding={binding?.previewStyle ?? 'exposed'}
      thickness={configuration.sheets / maxSheetsOverall(data)}
      coverText={coverText}
      alt={content.configurator.preview.alt(
        fabric?.name ?? content.notebook.unknownOption,
        size?.name ?? content.notebook.unknownOption,
        binding?.name ?? content.notebook.unknownOption,
        coverText,
      )}
    />
  );
}
