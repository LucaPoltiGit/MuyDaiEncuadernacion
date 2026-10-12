import { createBrowserRouter, RouterProvider } from 'react-router';
import { CartProvider } from './hooks/CartProvider';
import { SessionProvider } from './hooks/SessionProvider';
import { routes } from './router';

const router = createBrowserRouter(routes);

// App se mantiene mínimo a propósito: solo monta el router.
// Las rutas viven en `src/router.tsx` y las pantallas en `src/pages/`.
function App() {
  return (
    <SessionProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </SessionProvider>
  );
}

export default App;
