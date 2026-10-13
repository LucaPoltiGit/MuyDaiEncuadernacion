import { describe, expect, it } from 'vitest';
import { isValidEmail, isValidPhone, normalizeEmail } from './validation';

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
