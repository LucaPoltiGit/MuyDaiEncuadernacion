import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FabricSwatch } from './FabricSwatch';

describe('FabricSwatch', () => {
  it('se anuncia como imagen cuando tiene texto alternativo', () => {
    render(<FabricSwatch image="/images/telas/flores.svg" alt="Tela Flores" />);
    expect(screen.getByRole('img', { name: 'Tela Flores' })).toBeInTheDocument();
  });

  it('es decorativa cuando no tiene texto alternativo', () => {
    render(<FabricSwatch image="/images/telas/flores.svg" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
