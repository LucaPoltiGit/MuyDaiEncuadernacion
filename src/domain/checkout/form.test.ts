import { describe, expect, it } from 'vitest';
import { isValidPhone, validateCheckoutForm } from './form';
import { buildCheckoutForm, buildShippingConfig } from './testFixture';

const shipping = buildShippingConfig();

describe('validateCheckoutForm', () => {
  it('un formulario completo no tiene errores', () => {
    expect(validateCheckoutForm(buildCheckoutForm(), shipping)).toEqual({});
  });

  it('pide nombre, email y teléfono', () => {
    const errors = validateCheckoutForm(
      buildCheckoutForm({ name: ' ', email: '', phone: '' }),
      shipping,
    );
    expect(errors).toMatchObject({ name: 'required', email: 'required', phone: 'required' });
  });

  it('revisa el formato del email y del teléfono', () => {
    const errors = validateCheckoutForm(
      buildCheckoutForm({ email: 'ana@', phone: '123' }),
      shipping,
    );
    expect(errors).toMatchObject({ email: 'email', phone: 'phone' });
  });

  it('para envío pide dirección y un código postal con cobertura', () => {
    expect(
      validateCheckoutForm(buildCheckoutForm({ street: '', city: '', province: '' }), shipping),
    ).toMatchObject({ street: 'required', city: 'required', province: 'required' });
    expect(validateCheckoutForm(buildCheckoutForm({ postalCode: '14' }), shipping)).toMatchObject({
      postalCode: 'postalCode',
    });
    expect(validateCheckoutForm(buildCheckoutForm({ postalCode: '9410' }), shipping)).toMatchObject(
      { postalCode: 'noCoverage' },
    );
  });

  it('el depto es opcional', () => {
    expect(validateCheckoutForm(buildCheckoutForm({ apartment: '' }), shipping)).toEqual({});
  });

  it('para retirar no pide dirección pero sí un punto de retiro que exista', () => {
    const pickup = buildCheckoutForm({
      method: 'pickup',
      postalCode: '',
      street: '',
      city: '',
      province: '',
    });
    expect(validateCheckoutForm({ ...pickup, pickupPointId: 'taller' }, shipping)).toEqual({});
    expect(validateCheckoutForm({ ...pickup, pickupPointId: 'otro' }, shipping)).toEqual({
      pickupPointId: 'required',
    });
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
