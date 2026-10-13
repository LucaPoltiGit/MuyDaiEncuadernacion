import { describe, expect, it } from 'vitest';
import { isValidEmail, isValidPhone, normalizeEmail, toWhatsappNumber } from './validation';

describe('isValidEmail', () => {
  it('acepta emails comunes y rechaza incompletos', () => {
    expect(isValidEmail(' ana@example.com ')).toBe(true);
    expect(isValidEmail('ana@')).toBe(false);
    expect(isValidEmail('ana@example')).toBe(false);
  });
});

describe('normalizeEmail', () => {
  it('ignora mayúsculas y espacios', () => {
    expect(normalizeEmail('  Ana@Example.COM ')).toBe('ana@example.com');
  });
});

describe('isValidPhone', () => {
  it('acepta formatos comunes de Argentina', () => {
    expect(isValidPhone('11 5555-1234')).toBe(true);
    expect(isValidPhone('+54 9 11 5555 1234')).toBe(true);
    expect(isValidPhone('(0351) 555-1234')).toBe(true);
  });

  it('rechaza letras o muy pocos dígitos', () => {
    expect(isValidPhone('11 5555 abcd')).toBe(false);
    expect(isValidPhone('5555')).toBe(false);
  });
});

describe('toWhatsappNumber', () => {
  it('lleva los formatos comunes al de WhatsApp', () => {
    expect(toWhatsappNumber('11 5555 1234')).toBe('5491155551234');
    expect(toWhatsappNumber('011 15-5555-1234')).toBe('5491155551234');
    expect(toWhatsappNumber('+54 9 11 5555 1234')).toBe('5491155551234');
    expect(toWhatsappNumber('(0351) 155-551234')).toBe('5493515551234');
  });
});
