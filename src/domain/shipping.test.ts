import { describe, expect, it } from 'vitest';
import {
  estimateDelivery,
  findShippingZone,
  normalizePostalCode,
  quotePickup,
  quoteShipping,
} from './shipping';
import type { PickupPoint, ShippingZone } from '../types/shipping';

const caba: ShippingZone = {
  id: 'caba',
  name: 'CABA',
  postalCodes: [{ from: 1000, to: 1499 }],
  price: 3500,
  freeFrom: 60000,
  days: { min: 1, max: 2 },
};
const interior: ShippingZone = {
  id: 'interior',
  name: 'Resto del país',
  postalCodes: [
    { from: 2000, to: 3999 },
    { from: 5000, to: 9399 },
  ],
  price: 7900,
  freeFrom: null,
  days: { min: 4, max: 8 },
};
const zones = [caba, interior];
const taller: PickupPoint = { id: 'taller', name: 'Taller', address: '', schedule: '' };

describe('normalizePostalCode', () => {
  it('acepta el formato de 4 dígitos y el CPA', () => {
    expect(normalizePostalCode('1414')).toBe(1414);
    expect(normalizePostalCode('C1414ABC')).toBe(1414);
    expect(normalizePostalCode(' c 1414 abc ')).toBe(1414);
    expect(normalizePostalCode('X5000')).toBe(5000);
  });

  it('rechaza lo que no es un código postal', () => {
    expect(normalizePostalCode('')).toBeNull();
    expect(normalizePostalCode('141')).toBeNull();
    expect(normalizePostalCode('14145')).toBeNull();
    expect(normalizePostalCode('abcd')).toBeNull();
    expect(normalizePostalCode('0999')).toBeNull();
  });
});

describe('findShippingZone', () => {
  it('encuentra la zona por rango, incluidos los extremos', () => {
    expect(findShippingZone(1000, zones)).toBe(caba);
    expect(findShippingZone(1499, zones)).toBe(caba);
    expect(findShippingZone(5000, zones)).toBe(interior);
  });

  it('una zona puede tener varios rangos', () => {
    expect(findShippingZone(2500, zones)).toBe(interior);
    expect(findShippingZone(9399, zones)).toBe(interior);
  });

  it('si ninguna zona lo cubre, devuelve null', () => {
    expect(findShippingZone(1500, zones)).toBeNull();
    expect(findShippingZone(4500, zones)).toBeNull();
    expect(findShippingZone(9410, zones)).toBeNull();
  });
});

describe('quoteShipping', () => {
  it('cobra el precio de la zona y dice cuánto falta para el envío gratis', () => {
    expect(quoteShipping(caba, 40000)).toMatchObject({
      price: 3500,
      free: false,
      missingForFree: 20000,
    });
  });

  it('es gratis desde el mínimo, justo en el valor exacto', () => {
    expect(quoteShipping(caba, 60000)).toMatchObject({
      price: 0,
      free: true,
      missingForFree: null,
    });
  });

  it('una zona sin envío gratis nunca lo es', () => {
    expect(quoteShipping(interior, 999999)).toMatchObject({
      price: 7900,
      free: false,
      missingForFree: null,
    });
  });

  it('retirar no tiene costo', () => {
    expect(quotePickup(taller)).toMatchObject({ method: 'pickup', price: 0 });
  });
});

describe('estimateDelivery', () => {
  const config = { dispatchDays: 2 };

  it('manda el cuaderno que más tarda en hacerse, más el correo', () => {
    expect(estimateDelivery([7, 9], config, quoteShipping(caba, 0))).toEqual({ min: 10, max: 11 });
  });

  it('si son todos de la tienda, solo cuenta el despacho', () => {
    expect(estimateDelivery([], config, quoteShipping(interior, 0))).toEqual({ min: 6, max: 10 });
  });

  it('para retirar, es el día en que está listo', () => {
    expect(estimateDelivery([7], config, quotePickup(taller))).toEqual({ min: 7, max: 7 });
  });
});
