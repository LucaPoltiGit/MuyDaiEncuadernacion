import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NotebookSpecs } from './NotebookSpecs';
import { content } from '../../../content';
import { buildConfiguration, buildTestData } from '../../../domain/notebook/testFixture';

const text = content.notebook;

describe('NotebookSpecs', () => {
  it('muestra cada característica con su nombre', () => {
    render(
      <NotebookSpecs
        configuration={buildConfiguration({ sheets: 120, coverText: 'Recetas' })}
        data={buildTestData()}
      />,
    );
    expect(screen.getByText(text.specs.binding).nextSibling).toHaveTextContent('Cosido');
    expect(screen.getByText('120 hojas')).toBeInTheDocument();
    expect(screen.getByText(text.specs.paper).nextSibling).toHaveTextContent('Lisa');
    expect(screen.getByText('“Recetas”')).toBeInTheDocument();
  });

  it('sin texto en la tapa, no muestra esa fila', () => {
    render(<NotebookSpecs configuration={buildConfiguration()} data={buildTestData()} />);
    expect(screen.queryByText(text.specs.coverText)).not.toBeInTheDocument();
  });
});
