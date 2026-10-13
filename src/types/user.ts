export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  /** Vacío si no lo cargó. Sirve para completar el checkout. */
  phone: string;
  role: UserRole;
}
