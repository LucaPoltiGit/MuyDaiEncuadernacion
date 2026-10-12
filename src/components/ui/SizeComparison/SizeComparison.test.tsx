import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SizeComparison } from './SizeComparison';

const sizes = [
  { id: 'a6', name: 'A6', widthCm: 10.5, heightCm: 14.8 },
  { id: 'a5', name: 'A5', widthCm: 14.8, heightCm: 21 },
];

describe('SizeComparison', () => {
  it('es decorativo para lectores de pantalla', () => {
    const { container } = render(<SizeComparison sizes={sizes} selectedId="a5" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('no dibuja nada si no hay tamaños', () => {
    const { container } = render(<SizeComparison sizes={[]} selectedId="a5" />);
    expect(container).toBeEmptyDOMElement();
  });
});
