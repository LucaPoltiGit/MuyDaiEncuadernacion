import { describe, expect, it } from 'vitest';
import { calculatePrice } from './pricing';
import { getProductionDays } from './production';
import { buildConfiguration, buildTestData } from './testFixture';

const data = buildTestData();

describe('calculatePrice', () => {
  it('suma base del tamaño + hojas + encuadernación', () => {
    // A5: 10000 base + 80 hojas × $40 + cosido 3000
    const { total, lines } = calculatePrice(buildConfiguration(), data);
    expect(total).toBe(10000 + 80 * 40 + 3000);
    expect(lines.map((line) => line.kind)).toEqual(['base', 'sheets', 'binding']);
  });

  it('el valor por hoja depende del tamaño y del tipo de papel', () => {
    const { lines } = calculatePrice(
      buildConfiguration({ sizeId: 'a4', paperId: 'acuarela', sheets: 40 }),
      data,
    );
    const sheets = lines.find((line) => line.kind === 'sheets');
    expect(sheets).toMatchObject({ quantity: 40, unitPrice: 70 + 60, amount: 40 * 130 });
  });

  it('suma el recargo de la tela cuando tiene', () => {
    const sinRecargo = calculatePrice(buildConfiguration({ fabricId: 'flores' }), data).total;
    const conRecargo = calculatePrice(buildConfiguration({ fabricId: 'lino' }), data).total;
    expect(conRecargo - sinRecargo).toBe(1500);
  });

  it('cobra la personalización solo si hay texto en la tapa', () => {
    const sinTexto = calculatePrice(buildConfiguration({ coverText: '' }), data);
    const soloEspacios = calculatePrice(buildConfiguration({ coverText: '   ' }), data);
    const conTexto = calculatePrice(buildConfiguration({ coverText: 'M.D.' }), data);

    expect(soloEspacios.total).toBe(sinTexto.total);
    expect(conTexto.total - sinTexto.total).toBe(2500);
    expect(conTexto.lines.at(-1)).toMatchObject({ kind: 'personalization', amount: 2500 });
  });

  it('no cobra personalización si el admin la desactivó', () => {
    const disabled = buildTestData({ personalization: { enabled: false, maxLength: 12 } });
    const { lines } = calculatePrice(buildConfiguration({ coverText: 'Hola' }), disabled);
    expect(lines.some((line) => line.kind === 'personalization')).toBe(false);
  });

  it('el total siempre es la suma de las líneas', () => {
    const { total, lines } = calculatePrice(
      buildConfiguration({ sizeId: 'a6', fabricId: 'lino', sheets: 120, coverText: 'Ana' }),
      data,
    );
    expect(total).toBe(lines.reduce((sum, line) => sum + line.amount, 0));
  });

  it('si cambian las reglas en datos, cambia el precio sin tocar código', () => {
    const inflated = buildTestData({
      pricing: { ...data.pricing, basePriceBySize: { ...data.pricing.basePriceBySize, a5: 20000 } },
    });
    const before = calculatePrice(buildConfiguration(), data).total;
    const after = calculatePrice(buildConfiguration(), inflated).total;
    expect(after - before).toBe(10000);
  });
});

describe('getProductionDays', () => {
  it('usa los días base del admin', () => {
    expect(getProductionDays(buildConfiguration(), data)).toBe(7);
  });

  it('suma días si lleva texto en la tapa', () => {
    expect(getProductionDays(buildConfiguration({ coverText: 'Ana' }), data)).toBe(9);
  });
});
