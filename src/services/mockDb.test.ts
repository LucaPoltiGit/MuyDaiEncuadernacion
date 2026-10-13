import { describe, expect, it } from 'vitest';
import { readDb } from './mockDb';

describe('mockDb', () => {
  it('arranca con los usuarios de prueba', () => {
    expect(readDb().users.map((user) => user.email)).toContain('ana@example.com');
  });

  it('una base vieja se migra: re-siembra los de prueba y conserva los creados', () => {
    window.localStorage.setItem(
      'muydai:mockdb:v1',
      JSON.stringify({
        orders: [],
        users: [
          {
            id: 'user-ana',
            name: 'Nombre viejo',
            email: 'ana@example.com',
            phone: '',
            role: 'customer',
            passwordHash: 'x',
          },
          {
            id: 'u-luz',
            name: 'Luz',
            email: 'luz@example.com',
            phone: '',
            role: 'customer',
            passwordHash: 'y',
          },
        ],
      }),
    );
    const db = readDb();
    expect(db.users.find((user) => user.id === 'user-ana')?.name).toBe('Ana Pérez');
    expect(db.users.some((user) => user.id === 'u-luz')).toBe(true);
    expect(db.designs).toEqual([]);
  });
});
