import { findShippingZone, normalizePostalCode } from '../shipping';
import { isValidEmail, isValidPhone } from '../validation';
import type { DeliveryMethod, ShippingConfig } from '../../types/shipping';

/** Lo que completa la persona en el checkout. */
export interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  method: DeliveryMethod;
  postalCode: string;
  street: string;
  apartment: string;
  city: string;
  province: string;
  pickupPointId: string;
}

export type CheckoutField = keyof CheckoutForm;

/** Por qué un campo no es válido (el texto lo arma la UI). */
export type FieldError = 'required' | 'email' | 'phone' | 'postalCode' | 'noCoverage';

export type CheckoutErrors = Partial<Record<CheckoutField, FieldError>>;

export function emptyCheckoutForm(): CheckoutForm {
  return {
    name: '',
    email: '',
    phone: '',
    method: 'shipping',
    postalCode: '',
    street: '',
    apartment: '',
    city: '',
    province: '',
    pickupPointId: '',
  };
}

/**
 * Valida el formulario completo. Solo pide los datos del método elegido
 * (dirección para envío, punto de retiro para retirar). Devuelve un objeto
 * vacío si está todo bien.
 */
export function validateCheckoutForm(form: CheckoutForm, shipping: ShippingConfig): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const required = (field: CheckoutField) => {
    if (!String(form[field]).trim()) errors[field] = 'required';
  };

  required('name');
  if (!form.email.trim()) errors.email = 'required';
  else if (!isValidEmail(form.email)) errors.email = 'email';
  if (!form.phone.trim()) errors.phone = 'required';
  else if (!isValidPhone(form.phone)) errors.phone = 'phone';

  if (form.method === 'shipping') {
    const postalCode = normalizePostalCode(form.postalCode);
    if (!form.postalCode.trim()) errors.postalCode = 'required';
    else if (postalCode === null) errors.postalCode = 'postalCode';
    else if (!findShippingZone(postalCode, shipping.zones)) errors.postalCode = 'noCoverage';
    required('street');
    required('city');
    required('province');
  } else if (!shipping.pickupPoints.some((point) => point.id === form.pickupPointId)) {
    errors.pickupPointId = 'required';
  }

  return errors;
}

/** Orden en que aparecen los campos: para llevar el foco al primer error. */
export const CHECKOUT_FIELD_ORDER: CheckoutField[] = [
  'name',
  'email',
  'phone',
  'postalCode',
  'street',
  'apartment',
  'city',
  'province',
  'pickupPointId',
];
