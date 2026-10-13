import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PurchaseBar } from './PurchaseBar';

describe('PurchaseBar', () => {
  it('muestra el precio con su rótulo, el detalle y la acción', () => {
    render(
      <PurchaseBar
        priceLabel="Total"
        price="$ 19.900"
        detail="Sale en 48 h"
        action={<button type="button">Agregar</button>}
        bottom={<p>Agregado</p>}
      />,
    );
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$ 19.900')).toBeInTheDocument();
    expect(screen.getByText('Sale en 48 h')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
    expect(screen.getByText('Agregado')).toBeInTheDocument();
  });
});
