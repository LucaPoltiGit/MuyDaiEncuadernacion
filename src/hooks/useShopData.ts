import { getCatalog } from '../services/catalogService';
import { getConfiguratorData } from '../services/configuratorService';
import type { CatalogData } from '../types/catalog';
import type { ConfiguratorData } from '../types/notebook';
import { useAsyncData } from './useAsyncData';

export interface ShopData {
  catalog: CatalogData;
  /** Opciones y reglas: para dibujar los cuadernos y calcular precios a medida. */
  configurator: ConfiguratorData;
}

async function loadShopData(): Promise<ShopData> {
  const [catalog, configurator] = await Promise.all([getCatalog(), getConfiguratorData()]);
  return { catalog, configurator };
}

/** Catálogo + reglas del configurador: lo que necesitan la tienda, la ficha y el carrito. */
export function useShopData() {
  return useAsyncData(loadShopData);
}
