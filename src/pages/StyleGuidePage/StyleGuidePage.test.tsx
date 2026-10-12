import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StyleGuidePage } from './StyleGuidePage';
import { content } from '../../content';

describe('StyleGuidePage', () => {
  it('muestra la guía de estilo', () => {
    render(<StyleGuidePage />);
    expect(
      screen.getByRole('heading', { level: 1, name: content.styleGuide.title }),
    ).toBeInTheDocument();
  });
});
