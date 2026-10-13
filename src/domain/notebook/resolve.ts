import type { ConfiguratorData, NotebookConfiguration } from '../../types/notebook';

/**
 * Busca las opciones elegidas en una configuración. Cualquiera puede no
 * existir más (el admin la borró): quien la usa decide qué mostrar.
 */
export function resolveConfiguration(configuration: NotebookConfiguration, data: ConfiguratorData) {
  return {
    size: data.sizes.find((option) => option.id === configuration.sizeId),
    paper: data.papers.find((option) => option.id === configuration.paperId),
    binding: data.bindings.find((option) => option.id === configuration.bindingId),
    fabric: data.fabrics.find((option) => option.id === configuration.fabricId),
  };
}

/** Altura del tamaño más grande: escala común para dibujar cuadernos comparables. */
export function largestHeightCm(data: ConfiguratorData) {
  return Math.max(...data.sizes.map((size) => size.heightCm));
}

/** Máximo de hojas entre todas las encuadernaciones: referencia para el grosor dibujado. */
export function maxSheetsOverall(data: ConfiguratorData) {
  return Math.max(data.sheets.min, ...data.bindings.map((binding) => binding.maxSheets));
}
