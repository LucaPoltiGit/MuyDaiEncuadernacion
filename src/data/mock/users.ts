import type { User } from '../../types/user';

/**
 * Usuario como lo guardaría el backend. La contraseña nunca se guarda tal
 * cual: acá va un "hash" de mentira (ver `authService`); el backend real usa
 * bcrypt o similar y esto no existe en el navegador.
 */
export interface StoredUser extends User {
  passwordHash: string;
}

/**
 * Cuentas de prueba para desarrollar:
 * - Clienta: ana@example.com / cuadernos
 * - Admin:   admin@muydai.com / muydai123
 */
export const usersMock: StoredUser[] = [
  {
    id: 'user-ana',
    name: 'Ana Pérez',
    email: 'ana@example.com',
    phone: '11 5555 1234',
    role: 'customer',
    passwordHash: 'mock:7f05j5',
  },
  {
    id: 'user-admin',
    name: 'Dai',
    email: 'admin@muydai.com',
    phone: '',
    role: 'admin',
    passwordHash: 'mock:qady2n',
  },
];
