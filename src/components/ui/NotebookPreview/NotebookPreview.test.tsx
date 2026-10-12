import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NotebookPreview } from './NotebookPreview';
import type { NotebookPreviewProps } from './NotebookPreview';

const baseProps: NotebookPreviewProps = {
  fabricImage: '/tela.svg',
  widthCm: 14.8,
  heightCm: 21,
  referenceHeightCm: 29.7,
  binding: 'exposed',
  thickness: 0.5,
  coverText: '',
  alt: 'Cuaderno A5 con tela Flores',
};

describe('NotebookPreview', () => {
  it('se describe con el texto alternativo completo', () => {
    render(<NotebookPreview {...baseProps} />);
    expect(screen.getByRole('img', { name: 'Cuaderno A5 con tela Flores' })).toBeInTheDocument();
  });

  it('muestra el texto de la tapa cuando hay', () => {
    render(<NotebookPreview {...baseProps} coverText="M.D." />);
    expect(screen.getByText('M.D.')).toBeInTheDocument();
  });

  it('no muestra etiqueta si el texto está vacío', () => {
    const { container } = render(<NotebookPreview {...baseProps} coverText="   " />);
    expect(container.querySelector('text')).toBeNull();
  });
});
