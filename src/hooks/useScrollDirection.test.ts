import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useScrollDirection } from './useScrollDirection';

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  window.dispatchEvent(new Event('scroll'));
}

describe('useScrollDirection', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    scrollTo(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('empieza en "up"', () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).toBe('up');
  });

  it('detecta cuando se baja y cuando se vuelve a subir', () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => scrollTo(300));
    expect(result.current).toBe('down');
    act(() => scrollTo(200));
    expect(result.current).toBe('up');
  });

  it('ignora movimientos muy chicos', () => {
    const { result } = renderHook(() => useScrollDirection(8));
    act(() => scrollTo(300));
    act(() => scrollTo(296));
    expect(result.current).toBe('down');
  });

  it('cerca del tope siempre informa "up"', () => {
    const { result } = renderHook(() => useScrollDirection(8, 64));
    act(() => scrollTo(300));
    act(() => scrollTo(40));
    expect(result.current).toBe('up');
  });
});
