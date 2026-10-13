import { describe, expect, it } from 'vitest';
import {
  slugify,
  validateConfiguratorData,
  validateDiscount,
  validateProduct,
  validateShippingConfig,
  validateTestimonial,
} from './validation';
import { buildDiscount, buildProduct } from '../cart/testFixture';
import { buildShippingConfig } from '../checkout/testFixture';
import { buildConfiguration, buildTestData } from '../notebook/testFixture';

const configurator = buildTestData();
const catalog = {
  categories: [{ id: 'escribir', name: 'Para escribir' }],
  products: [buildProduct({ id: 'otro', slug: 'ya-existe' })],
};

describe('slugify', () => {
  it('arma una URL limpia a partir del nombre', () => {
    expect(slugify('  Cuaderno Jardín ñandú! ')).toBe('cuaderno-jardin-nandu');
  });
});

describe('validateProduct', () => {
  it('el precio es libre: no tiene que coincidir con el del configurador', () => {
    // Esta configuración costaría $16.200 armada; se vende a $99.999.
    expect(validateProduct(buildProduct({ price: 99999 }), catalog, configurator)).toEqual({});
  });

  it('pide nombre, una URL válida y única y un precio entero positivo', () => {
    const errors = validateProduct(
      buildProduct({ name: ' ', slug: 'ya-existe', price: 0 }),
      catalog,
      configurator,
    );
    expect(errors).toEqual({ name: 'required', slug: 'duplicate', price: 'positive' });
    expect(validateProduct(buildProduct({ slug: 'Con Espacios' }), catalog, configurator)).toEqual({
      slug: 'slugFormat',
    });
    expect(validateProduct(buildProduct({ price: 100.5 }), catalog, configurator)).toEqual({
      price: 'integer',
    });
  });

  it('acepta opciones sin stock (el cuaderno ya está hecho) pero no inexistentes', () => {
    const withSoldOutFabric = buildProduct({
      configuration: buildConfiguration({ fabricId: 'lunares' }),
    });
    expect(validateProduct(withSoldOutFabric, catalog, configurator)).toEqual({});
    const withMissing = buildProduct({ configuration: buildConfiguration({ fabricId: 'nada' }) });
    expect(validateProduct(withMissing, catalog, configurator)).toEqual({
      configuration: 'unknownOption',
    });
  });
});

describe('validateDiscount', () => {
  const others = [buildDiscount({ id: 'otro', code: 'YAESTA' })];

  it('un código completo no tiene errores', () => {
    expect(validateDiscount(buildDiscount(), others)).toEqual({});
  });

  it('el código es único (sin importar mayúsculas) y con letras y números', () => {
    expect(validateDiscount(buildDiscount({ code: 'yaesta' }), others)).toEqual({
      code: 'duplicate',
    });
    expect(validateDiscount(buildDiscount({ code: 'hola-10' }), others)).toEqual({
      code: 'codeFormat',
    });
  });

  it('un porcentaje va de 1 a 100 y un monto fijo es positivo', () => {
    expect(validateDiscount(buildDiscount({ value: 120 }), others)).toEqual({
      value: 'percentRange',
    });
    expect(validateDiscount(buildDiscount({ type: 'fixed', value: 0 }), others)).toEqual({
      value: 'positive',
    });
  });

  it('el máximo de usos no puede ser menor a los ya usados', () => {
    expect(validateDiscount(buildDiscount({ maxUses: 5, usedCount: 8 }), others)).toEqual({
      maxUses: 'belowUsed',
    });
  });
});

describe('validateShippingConfig', () => {
  it('una configuración correcta no tiene problemas', () => {
    expect(validateShippingConfig(buildShippingConfig())).toEqual([]);
  });

  it('detecta zonas que se superponen', () => {
    const config = buildShippingConfig();
    config.zones[1].postalCodes = [{ from: 1400, to: 9399 }];
    expect(validateShippingConfig(config)).toContainEqual({
      zoneIndex: 1,
      field: 'postalCodes',
      error: 'overlap',
    });
  });

  it('revisa rangos, días y precios de cada zona', () => {
    const config = buildShippingConfig();
    config.zones[0] = {
      ...config.zones[0],
      name: '',
      price: -1,
      days: { min: 5, max: 2 },
      postalCodes: [{ from: 1499, to: 1000 }],
    };
    const fields = validateShippingConfig(config).map((issue) => issue.field);
    expect(fields).toEqual(expect.arrayContaining(['name', 'price', 'days', 'postalCodes']));
  });
});

describe('validateConfiguratorData', () => {
  it('los datos de prueba son válidos', () => {
    expect(validateConfiguratorData(configurator)).toEqual([]);
  });

  it('no deja precios negativos ni reglas de hojas imposibles', () => {
    const data = buildTestData({ sheets: { min: 40, step: 0, default: 80 } });
    data.pricing.bindingSurcharge.cosido = -10;
    expect(validateConfiguratorData(data)).toEqual(
      expect.arrayContaining(['negativePrice', 'sheetsRule']),
    );
  });

  it('avisa si con todo sin stock ya no se puede armar ningún cuaderno', () => {
    const data = buildTestData();
    data.fabrics = data.fabrics.map((fabric) => ({ ...fabric, inStock: false }));
    expect(validateConfiguratorData(data)).toEqual(['notConfigurable']);
  });
});

describe('validateTestimonial', () => {
  it('pide nombre y texto, con un largo máximo', () => {
    const base = {
      id: 't',
      name: 'Ana',
      location: '',
      text: 'Hermoso',
      visible: true,
      createdAt: '',
    };
    expect(validateTestimonial(base)).toEqual({});
    expect(validateTestimonial({ ...base, name: '', text: 'x'.repeat(401) })).toEqual({
      name: 'required',
      text: 'tooLong',
    });
  });
});
