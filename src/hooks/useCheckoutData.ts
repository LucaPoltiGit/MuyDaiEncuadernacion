import { getCatalog } from '../services/catalogService';
import { getConfiguratorData } from '../services/configuratorService';
import { getShippingConfig } from '../services/shippingService';
import type { ShippingConfig } from '../types/shipping';
import { useAsyncData } from './useAsyncData';
import type { ShopData } from './useShopData';

export interface CheckoutData extends ShopData {
  shipping: ShippingConfig;
}

async function loadCheckoutData(): Promise<CheckoutData> {
  const [catalog, configurator, shipping] = await Promise.all([
    getCatalog(),
    getConfiguratorData(),
    getShippingConfig(),
  ]);
  return { catalog, configurator, shipping };
}

/** Todo lo que necesita el checkout: tienda, reglas y envíos vigentes. */
export function useCheckoutData() {
  return useAsyncData(loadCheckoutData);
}
