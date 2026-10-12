import { es } from './es';

/**
 * Punto único de acceso a los textos. Hoy solo hay español; para sumar
 * otro idioma se agrega `src/content/<idioma>/` con la misma forma (`Content`)
 * y se elige acá cuál exportar.
 */
export type Content = typeof es;

export const content: Content = es;
