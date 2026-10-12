---
description: Reglas para componentes de React
globs: src/components/**
---

- Componentes chicos, de una sola responsabilidad. Si un componente mezcla
  demasiadas cosas (ej. presentación + fetching + lógica de negocio),
  separarlo.
- Props siempre tipadas con una `interface` o `type`, nunca `any`.
- Sin textos visibles escritos directo en el JSX: todo string que vea el
  usuario llega por props, definido en `src/content/`.
- `components/ui/` es puramente visual: nada de datos de `data/mock` ni
  llamadas a `services/` ahí adentro. Si un componente necesita datos, los
  recibe por props desde una `section` o `page`.
- Todo componente nuevo se crea junto con su test (`Componente.test.tsx`
  al lado del componente, mismo nombre).
