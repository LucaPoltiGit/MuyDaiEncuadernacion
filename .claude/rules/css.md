---
description: Reglas para hojas de estilo (CSS Modules)
globs: **/*.css
---

- Usar siempre variables de `src/styles/tokens.css` (`var(--...)`). Ningún
  color, tamaño de fuente, espaciado, radio o sombra "hardcodeado" en un
  componente — si falta un token, se agrega a `tokens.css`, no se escribe
  el valor suelto.
- Mobile-first: los estilos base (sin media query) son para mobile. Para
  escalar hacia arriba usar `@media (min-width: 640px)` (tablet) y
  `@media (min-width: 1024px)` (desktop) — estos números están
  documentados en `tokens.css`, mantenerlos sincronizados si cambian.
- Accesibilidad:
  - Contraste de texto sobre fondo de al menos WCAG AA (4.5:1 para texto
    normal, 3:1 para texto grande).
  - Nunca `outline: none` sin reemplazo. El foco visible global ya está
    en `src/styles/global.css` (`:focus-visible`); no lo pises salvo que
    ofrezcas un estilo igual o más visible.
- Un archivo `.module.css` por componente, con el mismo nombre que el
  componente (`Button.tsx` ↔ `Button.module.css`).
