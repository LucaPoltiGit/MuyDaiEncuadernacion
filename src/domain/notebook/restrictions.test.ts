import { describe, expect, it } from 'vitest';
import {
  createDefaultConfiguration,
  isConfigurable,
  getSheetLimits,
  getUnavailableReason,
  isValidConfiguration,
  normalizeConfiguration,
  sanitizeCoverText,
} from './restrictions';
import { buildConfiguration, buildTestData } from './testFixture';

const data = buildTestData();

describe('getUnavailableReason', () => {
  it('marca sin stock las opciones agotadas', () => {
    const config = buildConfiguration();
    expect(getUnavailableReason(data, config, 'size', 'a3')).toEqual({ type: 'outOfStock' });
    expect(getUnavailableReason(data, config, 'paper', 'kraft')).toEqual({ type: 'outOfStock' });
    expect(getUnavailableReason(data, config, 'binding', 'espiral')).toEqual({
      type: 'outOfStock',
    });
    expect(getUnavailableReason(data, config, 'fabric', 'lunares')).toEqual({ type: 'outOfStock' });
  });

  it('no deja elegir una encuadernación que no se hace en el tamaño elegido', () => {
    const config = buildConfiguration({ sizeId: 'a4' });
    expect(getUnavailableReason(data, config, 'binding', 'japonesa')).toEqual({
      type: 'notForSize',
      sizeId: 'a4',
    });
    expect(getUnavailableReason(data, config, 'binding', 'cosido')).toBeNull();
  });

  it('un tamaño sigue disponible aunque la encuadernación actual no sirva (se ajusta)', () => {
    const config = buildConfiguration({ bindingId: 'japonesa' });
    expect(getUnavailableReason(data, config, 'size', 'a4')).toBeNull();
  });

  it('bloquea un tamaño si no hay ninguna encuadernación posible para él', () => {
    const onlyJaponesa = buildTestData({
      bindings: data.bindings.map((binding) =>
        binding.id === 'cosido' ? { ...binding, inStock: false } : binding,
      ),
    });
    expect(getUnavailableReason(onlyJaponesa, buildConfiguration(), 'size', 'a4')).toEqual({
      type: 'noBindingForSize',
    });
  });
});

describe('getSheetLimits', () => {
  it('el máximo de hojas depende de la encuadernación', () => {
    expect(getSheetLimits(data, 'cosido')).toEqual({ min: 40, step: 20, max: 160 });
    expect(getSheetLimits(data, 'japonesa')).toEqual({ min: 40, step: 20, max: 80 });
  });

  it('redondea el máximo hacia abajo al paso de hojas', () => {
    const odd = buildTestData({
      bindings: [{ ...data.bindings[0], maxSheets: 150 }],
    });
    expect(getSheetLimits(odd, 'cosido').max).toBe(140);
  });
});

describe('normalizeConfiguration', () => {
  it('no cambia nada si la combinación ya es válida', () => {
    const config = buildConfiguration();
    expect(normalizeConfiguration(data, config)).toEqual({
      configuration: config,
      adjustments: [],
    });
  });

  it('al pasar a un tamaño incompatible cambia la encuadernación y lo avisa', () => {
    const result = normalizeConfiguration(
      data,
      buildConfiguration({ sizeId: 'a4', bindingId: 'japonesa' }),
    );
    expect(result.configuration.bindingId).toBe('cosido');
    expect(result.adjustments).toContainEqual({
      type: 'binding',
      fromId: 'japonesa',
      toId: 'cosido',
      sizeId: 'a4',
    });
  });

  it('si la encuadernación admite menos hojas, baja la cantidad al máximo y lo avisa', () => {
    const result = normalizeConfiguration(
      data,
      buildConfiguration({ bindingId: 'japonesa', sheets: 160 }),
    );
    expect(result.configuration.sheets).toBe(80);
    expect(result.adjustments).toContainEqual({
      type: 'sheets',
      from: 160,
      to: 80,
      bindingId: 'japonesa',
    });
  });

  it('lleva una cantidad de hojas fuera de paso al valor válido más cercano', () => {
    const result = normalizeConfiguration(data, buildConfiguration({ sheets: 75 }));
    expect(result.configuration.sheets).toBe(80);
  });

  it('borra el texto de tapa si el admin desactivó la personalización', () => {
    const disabled = buildTestData({ personalization: { enabled: false, maxLength: 12 } });
    const result = normalizeConfiguration(disabled, buildConfiguration({ coverText: 'Ana' }));
    expect(result.configuration.coverText).toBe('');
    expect(result.adjustments).toContainEqual({ type: 'coverText', reason: 'disabled' });
  });

  it('recorta el texto de tapa al límite de caracteres', () => {
    const result = normalizeConfiguration(
      data,
      buildConfiguration({ coverText: 'Un texto demasiado largo' }),
    );
    expect(result.configuration.coverText).toHaveLength(12);
  });
});

describe('sanitizeCoverText', () => {
  it('acepta letras con acento, ñ, números y signos simples', () => {
    expect(sanitizeCoverText('Ñandú & Cía. 2027!', 30)).toBe('Ñandú & Cía. 2027!');
  });

  it('saca caracteres no permitidos y espacios repetidos', () => {
    expect(sanitizeCoverText('Hola   <b>mundo</b>', 30)).toBe('Hola bmundob');
  });
});

describe('isValidConfiguration', () => {
  it('acepta una combinación válida', () => {
    expect(isValidConfiguration(data, buildConfiguration({ coverText: 'Ana' }))).toBe(true);
  });

  it.each([
    ['tela sin stock', { fabricId: 'lunares' }],
    ['papel sin stock', { paperId: 'kraft' }],
    ['encuadernación incompatible con el tamaño', { sizeId: 'a4', bindingId: 'japonesa' }],
    ['más hojas que el máximo', { bindingId: 'japonesa', sheets: 100 }],
    ['menos hojas que el mínimo', { sheets: 20 }],
    ['hojas fuera de paso', { sheets: 70 }],
    ['texto más largo que el límite', { coverText: 'Trece letras!' }],
  ])('rechaza: %s', (_, overrides) => {
    expect(isValidConfiguration(data, buildConfiguration(overrides))).toBe(false);
  });
});

describe('createDefaultConfiguration', () => {
  it('arranca con opciones en stock y una combinación válida', () => {
    const config = createDefaultConfiguration(data);
    expect(config).not.toBeNull();
    expect(isValidConfiguration(data, config!)).toBe(true);
    expect(config!.sheets).toBe(80);
    expect(config!.coverText).toBe('');
  });

  it('devuelve null si no se puede armar ningún cuaderno', () => {
    expect(createDefaultConfiguration(buildTestData({ fabrics: [] }))).toBeNull();
  });
});

describe('isConfigurable', () => {
  it('acepta los datos completos', () => {
    expect(isConfigurable(data)).toBe(true);
  });

  it.each([
    ['sin tamaños', { sizes: [] }],
    ['sin telas en stock', { fabrics: data.fabrics.map((f) => ({ ...f, inStock: false })) }],
    ['sin papeles', { papers: [] }],
    ['sin encuadernaciones', { bindings: [] }],
    ['paso de hojas en 0', { sheets: { min: 40, step: 0, default: 80 } }],
    ['tamaño sin precio', { pricing: { ...data.pricing, basePriceBySize: { a5: 10000 } } }],
  ])('rechaza: %s', (_, overrides) => {
    expect(isConfigurable(buildTestData(overrides))).toBe(false);
  });
});

describe('diseños guardados con opciones que ya no existen', () => {
  it('reemplaza una tela borrada por el admin y lo avisa', () => {
    const result = normalizeConfiguration(data, buildConfiguration({ fabricId: 'borrada' }));
    expect(result.configuration.fabricId).toBe('flores');
    expect(result.adjustments).toContainEqual({ type: 'option', kind: 'fabric', toId: 'flores' });
  });

  it('reemplaza un papel agotado y un tamaño inexistente', () => {
    const result = normalizeConfiguration(
      data,
      buildConfiguration({ paperId: 'kraft', sizeId: 'carta' }),
    );
    expect(result.configuration.paperId).toBe('lisa');
    expect(result.configuration.sizeId).toBe('a6');
    expect(isValidConfiguration(data, result.configuration)).toBe(true);
  });
});

describe('isValidConfiguration con reglas de precio incompletas', () => {
  it('rechaza un tamaño sin precio cargado', () => {
    const noPrice = buildTestData({
      pricing: { ...data.pricing, basePriceBySize: { a6: 8000, a4: 15000 } },
    });
    expect(isValidConfiguration(noPrice, buildConfiguration({ sizeId: 'a5' }))).toBe(false);
  });
});
