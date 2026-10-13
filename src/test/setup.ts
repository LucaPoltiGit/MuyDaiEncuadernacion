// Se carga antes de cada archivo de test (ver `test.setupFiles` en vite.config.ts).
// Agrega matchers de jest-dom (toBeInTheDocument, toHaveTextContent, etc.)
// ya tipados para Vitest.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Sin `globals: true`, Testing Library no puede registrar su limpieza
// automática: se desmonta a mano lo renderizado después de cada test.
afterEach(() => {
  cleanup();
  // El carrito se guarda en localStorage: cada test arranca con uno vacío.
  window.localStorage.clear();
});

// jsdom no implementa scroll; `ScrollRestoration` del router lo llama al navegar.
window.scrollTo = () => {};
