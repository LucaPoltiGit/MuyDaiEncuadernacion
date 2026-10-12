# Base para diseñar páginas web

Proyecto base (no un producto final): el objetivo es tener una arquitectura
prolija y escalable para probar diseños de página rápido.

## Stack

- React + Vite + TypeScript
- Tests: Vitest + React Testing Library
- Lint: ESLint · Formato: Prettier (se corre solo vía hook, ver abajo)
- Estilos: CSS Modules + design tokens. Sin librerías de UI por ahora.

## Comandos

- `npm run dev` — servidor de desarrollo
- `npm run test` — tests en modo watch
- `npm run test:run` — tests una vez (para CI o antes de cerrar una tarea)
- `npm run lint` — ESLint
- `npm run format` — Prettier sobre todo el repo
- `npm run typecheck` — chequeo de tipos
- `npm run build` — typecheck + build de producción

## Arquitectura por capas

Cada capa tiene una sola responsabilidad. Los componentes nunca saltan capas
(ej. una `page` no lee `data/mock` directo, pasa por un `service`).

| Carpeta                    | Qué va ahí                                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/tokens.css`    | Todas las variables de diseño: color, tipografía, espaciado, radios, sombras. Primitivos + semánticos.                        |
| `src/constants/`           | Constantes de la app: rutas, breakpoints, límites.                                                                            |
| `src/content/`             | Todos los textos visibles, en español, organizados por página/sección. Preparado para agregar otro idioma después.            |
| `src/data/mock/`           | Datos falsos (JSON o TS) para desarrollar sin backend.                                                                        |
| `src/services/`            | Única capa que sabe de dónde vienen los datos. Hoy lee `data/mock`; cuando haya API real, solo cambia este archivo, nada más. |
| `src/hooks/`               | Lógica reutilizable (llaman a `services/`, manejan estado de carga/error).                                                    |
| `src/types/`               | Tipos compartidos entre capas.                                                                                                |
| `src/components/ui/`       | Componentes visuales genéricos (botón, tarjeta...), sin lógica de negocio, sin textos ni datos propios.                       |
| `src/components/sections/` | Combinan componentes `ui/` + un hook + contenido de `content/` en un bloque de página.                                        |
| `src/pages/`               | Componen secciones en una pantalla completa.                                                                                  |
| `src/test/`                | Configuración global de tests (`setup.ts`).                                                                                   |

Reglas específicas por tipo de archivo (CSS, componentes, tests) están en
`.claude/rules/` y se cargan automáticamente según el archivo que se esté
tocando.

## Reglas generales

1. **Nada hardcodeado**: ningún color, tamaño, espaciado o string suelto en
   un componente. Los estilos usan tokens; los textos vienen de `content/`.
2. **Textos siempre en `src/content/`**, nunca escritos directo en el JSX.
3. **Datos siempre a través de `src/services/`**, nunca importando
   `data/mock` directamente desde un componente o página.
4. **Todo componente nuevo se crea junto con su test** (`Componente.test.tsx`
   al lado del componente).
5. **Antes de dar por terminada una tarea de diseño visual**, revisar el
   resultado con Playwright: sacar capturas en mobile (~390px) y desktop
   (~1440px) y mirarlas antes de avisar que está listo.

## Decisiones de diseño importantes

Para una decisión de diseño con peso (una pantalla nueva, un cambio de
layout, un patrón visual que se va a repetir — no para un ajuste menor),
consultar en paralelo a los tres subagentes de `.claude/agents/`:

- `critico-ux` — usabilidad, accesibilidad, claridad.
- `director-de-arte` — identidad visual, originalidad, coherencia con los
  tokens.
- `abogado-del-diablo` — qué no escala, qué es inconsistente, qué se va a
  romper.

Después, presentar una síntesis breve (no las tres respuestas completas):
en qué coinciden, en qué no, y la recomendación final.

Para exploración simple de archivos o tareas chicas de búsqueda, usar el
subagente `buscador` (corre en Haiku, rápido y barato) en vez de leer todo
el repo con el agente principal.
