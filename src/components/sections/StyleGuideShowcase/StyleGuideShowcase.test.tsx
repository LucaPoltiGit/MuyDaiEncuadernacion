import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { StyleGuideShowcase } from './StyleGuideShowcase';
import { content } from '../../../content';

const text = content.styleGuide;

describe('StyleGuideShowcase', () => {
  it('muestra el título y un bloque por cada grupo de componentes', () => {
    render(<StyleGuideShowcase />);
    expect(screen.getByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
    for (const title of [text.colors.title, text.buttons.title, text.badges.title]) {
      expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
    }
  });

  it('permite cambiar la tela elegida y no deja elegir una sin stock', async () => {
    render(<StyleGuideShowcase />);
    const group = screen.getByRole('group', { name: text.optionGroup.fabricLegend });
    expect(group).toBeInTheDocument();

    await userEvent.click(screen.getByText('Rayas'));
    expect(screen.getByRole('radio', { name: 'Rayas' })).toBeChecked();
    expect(screen.getByRole('radio', { name: /Lunares/ })).toHaveAttribute('aria-disabled', 'true');
  });
});
