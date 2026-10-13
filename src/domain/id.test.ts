import { afterEach, describe, expect, it, vi } from 'vitest';
import { createId } from './id';

describe('createId', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('genera ids distintos', () => {
    expect(createId()).not.toBe(createId());
  });

  it('funciona aunque el navegador no tenga randomUUID (http en la red local)', () => {
    vi.stubGlobal('crypto', {});
    const first = createId();
    expect(first).toMatch(/\w+-\w+/);
    expect(createId()).not.toBe(first);
  });
});
