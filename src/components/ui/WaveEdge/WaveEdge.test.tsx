import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WaveEdge } from './WaveEdge';

describe('WaveEdge', () => {
  it('es decorativa y queda oculta para lectores de pantalla', () => {
    const { container } = render(<WaveEdge edge="bottom" fill="var(--color-bg)" />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container).toHaveTextContent('');
  });
});
