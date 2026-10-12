import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('muestra su contenido', () => {
    render(
      <Card>
        <p>Cuaderno A5</p>
      </Card>,
    );
    expect(screen.getByText('Cuaderno A5')).toBeInTheDocument();
  });

  it('puede renderizarse como artículo', () => {
    render(
      <Card as="article">
        <h3>Tela Flores</h3>
      </Card>,
    );
    expect(screen.getByRole('article')).toContainElement(
      screen.getByRole('heading', { name: 'Tela Flores' }),
    );
  });

  it('puede renderizarse como ítem de lista', () => {
    render(
      <ul>
        <Card as="li">Uno</Card>
        <Card as="li">Dos</Card>
      </ul>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
