import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// `defineConfig` viene de `vitest/config` (en vez de `vite`) para que un
// solo archivo tipe tanto la configuración de Vite como la de `test`.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
