import { normalizeDiscountCode } from '../cart/discounts';
import { isConfigurable } from '../notebook/restrictions';
import type { CatalogData, Product } from '../../types/catalog';
import type { DiscountCode } from '../../types/discount';
import type { ConfiguratorData } from '../../types/notebook';
import type { ShippingConfig } from '../../types/shipping';
import type { Testimonial } from '../../types/testimonial';

/**
 * Validaciones de lo que carga el admin. Devuelven códigos por campo (el
 * texto lo arma la UI) y un objeto vacío si está todo bien.
 */
export type AdminFieldError =
  | 'required'
  | 'positive'
  | 'nonNegative'
  | 'integer'
  | 'slugFormat'
  | 'duplicate'
  | 'codeFormat'
  | 'percentRange'
  | 'unknownOption'
  | 'rangeOrder'
  | 'postalCodeRange'
  | 'overlap'
  | 'daysOrder'
  | 'belowUsed'
  | 'invalidDate'
  | 'tooLong';

export type AdminErrors<T extends string> = Partial<Record<T, AdminFieldError>>;

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const CODE = /^[A-Z0-9]{3,20}$/;
export const TESTIMONIAL_MAX_LENGTH = 400;

/** Arma un slug para la URL a partir del nombre: "Cuaderno Jardín" → "cuaderno-jardin". */
export function slugify(name: string) {
  return name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function checkPrice(value: number): AdminFieldError | undefined {
  if (!Number.isFinite(value) || value <= 0) return 'positive';
  if (!Number.isInteger(value)) return 'integer';
  return undefined;
}

export type ProductField = 'name' | 'slug' | 'price' | 'categoryId' | 'configuration';

/**
 * Producto de la tienda. El precio es libre: lo decide el admin y no tiene
 * que coincidir con lo que costaría armado en el configurador. Las opciones
 * tienen que existir (aunque estén sin stock: el cuaderno ya está hecho).
 */
export function validateProduct(
  product: Product,
  catalog: CatalogData,
  configurator: ConfiguratorData,
): AdminErrors<ProductField> {
  const errors: AdminErrors<ProductField> = {};
  if (!product.name.trim()) errors.name = 'required';
  if (!product.slug) errors.slug = 'required';
  else if (!SLUG.test(product.slug)) errors.slug = 'slugFormat';
  else if (
    catalog.products.some((other) => other.id !== product.id && other.slug === product.slug)
  ) {
    errors.slug = 'duplicate';
  }
  const priceError = checkPrice(product.price);
  if (priceError) errors.price = priceError;
  if (!catalog.categories.some((category) => category.id === product.categoryId)) {
    errors.categoryId = 'required';
  }
  const { sizeId, paperId, bindingId, fabricId, sheets } = product.configuration;
  const exists = (options: { id: string }[], id: string) => options.some((o) => o.id === id);
  if (
    !exists(configurator.sizes, sizeId) ||
    !exists(configurator.papers, paperId) ||
    !exists(configurator.bindings, bindingId) ||
    !exists(configurator.fabrics, fabricId) ||
    !Number.isInteger(sheets) ||
    sheets <= 0
  ) {
    errors.configuration = 'unknownOption';
  }
  return errors;
}

export type DiscountField = 'code' | 'value' | 'minSubtotal' | 'maxUses' | 'expiresAt';

export function validateDiscount(
  discount: DiscountCode,
  others: DiscountCode[],
): AdminErrors<DiscountField> {
  const errors: AdminErrors<DiscountField> = {};
  const code = normalizeDiscountCode(discount.code);
  if (!code) errors.code = 'required';
  else if (!CODE.test(code)) errors.code = 'codeFormat';
  else if (
    others.some((other) => other.id !== discount.id && normalizeDiscountCode(other.code) === code)
  ) {
    errors.code = 'duplicate';
  }
  if (discount.type === 'percentage') {
    if (!Number.isInteger(discount.value) || discount.value < 1 || discount.value > 100) {
      errors.value = 'percentRange';
    }
  } else {
    const valueError = checkPrice(discount.value);
    if (valueError) errors.value = valueError;
  }
  if (!Number.isFinite(discount.minSubtotal) || discount.minSubtotal < 0) {
    errors.minSubtotal = 'nonNegative';
  }
  if (discount.maxUses !== null) {
    if (!Number.isInteger(discount.maxUses) || discount.maxUses <= 0) errors.maxUses = 'positive';
    else if (discount.maxUses < discount.usedCount) errors.maxUses = 'belowUsed';
  }
  if (discount.expiresAt !== null && Number.isNaN(new Date(discount.expiresAt).getTime())) {
    errors.expiresAt = 'invalidDate';
  }
  return errors;
}

/** Problema de una zona (por posición) o de la configuración general de envíos. */
export interface ShippingIssue {
  /** Índice de la zona, o `null` si es general (puntos de retiro, despacho). */
  zoneIndex: number | null;
  field: 'name' | 'price' | 'freeFrom' | 'days' | 'postalCodes' | 'pickupPoints' | 'dispatchDays';
  error: AdminFieldError;
}

/**
 * Zonas de envío: datos completos, rangos de código postal válidos (4
 * dígitos, desde ≤ hasta) y sin superponerse entre zonas (un CP no puede
 * caer en dos zonas con precios distintos).
 */
export function validateShippingConfig(config: ShippingConfig): ShippingIssue[] {
  const issues: ShippingIssue[] = [];
  const ranges: { zoneIndex: number; from: number; to: number }[] = [];

  config.zones.forEach((zone, zoneIndex) => {
    const add = (field: ShippingIssue['field'], error: AdminFieldError) =>
      issues.push({ zoneIndex, field, error });
    if (!zone.name.trim()) add('name', 'required');
    if (!Number.isInteger(zone.price) || zone.price < 0) add('price', 'nonNegative');
    if (zone.freeFrom !== null && (!Number.isFinite(zone.freeFrom) || zone.freeFrom <= 0)) {
      add('freeFrom', 'positive');
    }
    if (zone.days.min < 0 || zone.days.max < zone.days.min) add('days', 'daysOrder');
    if (zone.postalCodes.length === 0) add('postalCodes', 'required');
    for (const range of zone.postalCodes) {
      if (range.from < 1000 || range.to > 9999) add('postalCodes', 'postalCodeRange');
      else if (range.from > range.to) add('postalCodes', 'rangeOrder');
      else ranges.push({ zoneIndex, ...range });
    }
  });

  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const a = ranges[i];
      const b = ranges[j];
      if (a.from <= b.to && b.from <= a.to) {
        issues.push({ zoneIndex: b.zoneIndex, field: 'postalCodes', error: 'overlap' });
      }
    }
  }

  if (config.pickupPoints.some((point) => !point.name.trim() || !point.address.trim())) {
    issues.push({ zoneIndex: null, field: 'pickupPoints', error: 'required' });
  }
  if (!Number.isInteger(config.dispatchDays) || config.dispatchDays < 0) {
    issues.push({ zoneIndex: null, field: 'dispatchDays', error: 'nonNegative' });
  }
  return issues;
}

/** Problemas del configurador, como códigos simples (la UI los explica). */
export type ConfiguratorIssue =
  | 'notConfigurable'
  | 'negativePrice'
  | 'sheetsRule'
  | 'maxSheetsBelowMin'
  | 'productionDays'
  | 'personalizationLength'
  | 'missingName';

/**
 * El configurador tiene que poder armar al menos un cuaderno, con precios
 * no negativos y límites coherentes. Si algo queda sin stock, vale (se
 * pausa esa opción), pero no puede quedar todo sin stock.
 */
export function validateConfiguratorData(data: ConfiguratorData): ConfiguratorIssue[] {
  const issues = new Set<ConfiguratorIssue>();
  const options = [...data.sizes, ...data.papers, ...data.bindings, ...data.fabrics];
  if (options.some((option) => !option.name.trim())) issues.add('missingName');
  const prices = [
    ...Object.values(data.pricing.basePriceBySize),
    ...Object.values(data.pricing.sheetPriceBySize),
    ...Object.values(data.pricing.paperExtraPerSheet),
    ...Object.values(data.pricing.bindingSurcharge),
    ...Object.values(data.pricing.fabricSurcharge),
    data.pricing.personalizationSurcharge,
  ];
  if (prices.some((price) => !Number.isFinite(price) || price < 0)) issues.add('negativePrice');
  const { min, step, default: initial } = data.sheets;
  if (min <= 0 || step <= 0 || initial < min || (initial - min) % step !== 0) {
    issues.add('sheetsRule');
  }
  if (data.bindings.some((binding) => binding.maxSheets < min)) issues.add('maxSheetsBelowMin');
  if (data.production.baseDays < 0 || data.production.personalizationExtraDays < 0) {
    issues.add('productionDays');
  }
  if (data.personalization.maxLength <= 0) issues.add('personalizationLength');
  if (issues.size === 0 && !isConfigurable(data)) issues.add('notConfigurable');
  return [...issues];
}

export type TestimonialField = 'name' | 'text';

export function validateTestimonial(testimonial: Testimonial): AdminErrors<TestimonialField> {
  const errors: AdminErrors<TestimonialField> = {};
  if (!testimonial.name.trim()) errors.name = 'required';
  if (!testimonial.text.trim()) errors.text = 'required';
  else if (testimonial.text.length > TESTIMONIAL_MAX_LENGTH) errors.text = 'tooLong';
  return errors;
}
