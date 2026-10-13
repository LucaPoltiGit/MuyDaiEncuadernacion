import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NotebookFigure } from './NotebookFigure';
import { buildConfiguration, buildTestData } from '../../../domain/notebook/testFixture';

describe('NotebookFigure', () => {
  it('describe el cuaderno para lectores de pantalla', () => {
    render(
      <NotebookFigure
        configuration={buildConfiguration({ fabricId: 'lino', coverText: 'Ana' })}
        data={buildTestData()}
      />,
    );
    const image = screen.getByRole('img');
    expect(image).toHaveAccessibleName(/A5 con tela Lino/);
    expect(image).toHaveAccessibleName(/"Ana"/);
  });

  it('no se rompe si una opción ya no existe', () => {
    render(
      <NotebookFigure
        configuration={buildConfiguration({ fabricId: 'borrada' })}
        data={buildTestData()}
      />,
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
