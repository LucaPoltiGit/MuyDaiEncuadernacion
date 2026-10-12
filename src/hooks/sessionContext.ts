import { createContext } from 'react';
import type { User } from '../types/user';

export type SessionState = { status: 'loading' } | { status: 'ready'; user: User | null };

export const SessionContext = createContext<SessionState | null>(null);
