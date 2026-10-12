import { useEffect, useState } from 'react';

export type ScrollDirection = 'up' | 'down';

/**
 * Devuelve hacia dónde scrollea el usuario. Ignora movimientos chicos
 * (`threshold`) para que el header no parpadee, y cerca del tope siempre
 * informa 'up' para que el header quede visible.
 */
export function useScrollDirection(threshold = 8, topOffset = 64): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>('up');

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      if (y <= topOffset) {
        setDirection('up');
      } else if (Math.abs(y - lastY) >= threshold) {
        setDirection(y > lastY ? 'down' : 'up');
      }
      lastY = y;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, topOffset]);

  return direction;
}
