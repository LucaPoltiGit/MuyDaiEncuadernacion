---
description: Reglas para tests de componentes
globs: **/*.test.tsx
---

- Testear comportamiento observable por el usuario (qué se ve en pantalla,
  qué pasa al interactuar), no detalles internos de implementación (no
  testear estado interno, nombres de funciones privadas ni estructura del
  JSX).
- Usar React Testing Library con queries accesibles (`getByRole`,
  `getByText`, `getByLabelText`). Evitar `getByTestId` salvo que no haya
  otra forma razonable de encontrar el elemento.
- Simular interacción del usuario con `@testing-library/user-event`, no
  disparando eventos del DOM a mano (`fireEvent` solo si `user-event` no
  cubre el caso).
- Un test de componente no importa `data/mock` directamente: si el
  componente necesita datos, se los pasa por props en el test, para que
  el test no dependa de la forma de los datos reales.
