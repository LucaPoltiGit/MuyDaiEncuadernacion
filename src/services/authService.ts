import type { StoredUser } from '../data/mock/users';
import { createId } from '../domain/id';
import { normalizeEmail } from '../domain/validation';
import type { User } from '../types/user';
import { readDb, updateDb } from './mockDb';
import { simulateRequest } from './mockNetwork';

/**
 * Sesión simulada. Las cuentas viven en la base del navegador y la sesión
 * es un id guardado en localStorage. Con API real, este archivo pasa a
 * llamar al backend (que valida la contraseña y entrega una cookie o
 * token); el resto de la app no cambia.
 */

const SESSION_KEY = 'muydai:session:v1';

/** Email o contraseña incorrectos (sin decir cuál: no se revela si la cuenta existe). */
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Email o contraseña incorrectos.');
  }
}

export class EmailTakenError extends Error {
  constructor() {
    super('Ya hay una cuenta con ese email.');
  }
}

/**
 * "Hash" de mentira, solo para no guardar la contraseña en texto plano en
 * el mock. NO es seguro: el backend real usa bcrypt/argon2.
 */
export function mockPasswordHash(password: string) {
  let hash = 5381;
  for (const char of password) hash = (hash * 33 + char.charCodeAt(0)) % 2_147_483_647;
  return `mock:${hash.toString(36)}`;
}

/** Lo que sale del service: nunca el hash de la contraseña. */
function toUser(stored: StoredUser): User {
  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    phone: stored.phone,
    role: stored.role,
  };
}

function readSessionUserId() {
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSessionUserId(userId: string | null) {
  try {
    if (userId) window.localStorage.setItem(SESSION_KEY, userId);
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Sin almacenamiento, la sesión dura lo que dure la pestaña.
  }
}

/** Hace falta una sesión para esta operación. */
export class NotAuthenticatedError extends Error {
  constructor() {
    super('Hace falta iniciar sesión.');
  }
}

/** Usuario de la sesión actual (o `null`). Si la cuenta ya no existe, limpia la sesión. */
function sessionUser(): StoredUser | null {
  const userId = readSessionUserId();
  if (!userId) return null;
  const stored = readDb().users.find((user) => user.id === userId);
  if (!stored) writeSessionUserId(null);
  return stored ?? null;
}

/**
 * Para los demás services: quién hace el pedido, sacado de la sesión (como
 * haría el backend con el token), nunca de lo que mande la pantalla.
 */
export function currentUserId(): string | null {
  return sessionUser()?.id ?? null;
}

export function requireUserId(): string {
  const userId = currentUserId();
  if (!userId) throw new NotAuthenticatedError();
  return userId;
}

/** Clave de la sesión: el `SessionProvider` escucha sus cambios para sincronizar pestañas. */
export const SESSION_STORAGE_KEY = SESSION_KEY;

export function getCurrentUser(): Promise<User | null> {
  const stored = sessionUser();
  return simulateRequest(stored ? toUser(stored) : null, 0);
}

export async function login(email: string, password: string): Promise<User> {
  const wanted = normalizeEmail(email);
  const stored = readDb().users.find((user) => normalizeEmail(user.email) === wanted);
  if (!stored || stored.passwordHash !== mockPasswordHash(password)) {
    // Misma demora que un acierto: no da pistas de si la cuenta existe.
    await simulateRequest(null);
    throw new InvalidCredentialsError();
  }
  writeSessionUserId(stored.id);
  return simulateRequest(toUser(stored));
}

export interface NewAccount {
  name: string;
  email: string;
  phone: string;
  password: string;
}

/** Crea una cuenta de clienta e inicia sesión. */
export async function register(account: NewAccount): Promise<User> {
  const email = normalizeEmail(account.email);
  if (readDb().users.some((user) => normalizeEmail(user.email) === email)) {
    await simulateRequest(null);
    throw new EmailTakenError();
  }
  const stored: StoredUser = {
    id: createId(),
    name: account.name.trim(),
    email,
    phone: account.phone.trim(),
    role: 'customer',
    passwordHash: mockPasswordHash(account.password),
  };
  updateDb((db) => ({ ...db, users: [...db.users, stored] }));
  writeSessionUserId(stored.id);
  return simulateRequest(toUser(stored));
}

export function logout(): Promise<void> {
  writeSessionUserId(null);
  return simulateRequest(undefined, 0);
}
