import { content } from '../../../content';
import { resolveConfiguration } from '../../../domain/notebook/resolve';
import type { ConfiguratorData, NotebookConfiguration } from '../../../types/notebook';

const text = content.notebook;

/** Valores legibles de cada característica; "Opción no disponible" si se borró. */
export function notebookSpecValues(configuration: NotebookConfiguration, data: ConfiguratorData) {
  const { size, paper, binding, fabric } = resolveConfiguration(configuration, data);
  const missing = text.unknownOption;
  return {
    size: size
      ? `${size.name} (${content.configurator.sizeDetail(size.widthCm, size.heightCm)})`
      : missing,
    sizeName: size?.name ?? missing,
    binding: binding?.name ?? missing,
    sheets: text.sheetsValue(configuration.sheets),
    paper: paper?.name ?? missing,
    fabric: fabric?.name ?? missing,
    coverText: configuration.coverText.trim(),
  };
}

/** Resumen en una línea, para el carrito: "A5 · Cosido · 80 hojas lisa · Tela flores". */
export function notebookSummary(configuration: NotebookConfiguration, data: ConfiguratorData) {
  const values = notebookSpecValues(configuration, data);
  return text.summary({
    size: values.sizeName,
    binding: values.binding,
    sheets: text.sheetsWithPaper(configuration.sheets, values.paper),
    fabric: values.fabric,
  });
}
