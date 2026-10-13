import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminSaveStatus } from './AdminSaveStatus';
import { content } from '../../../content';

const text = content.admin;

describe('AdminSaveStatus', () => {
  it('anuncia el guardado, los datos inválidos y los errores inesperados', () => {
    const { rerender } = render(<AdminSaveStatus state={{ status: 'saved' }} />);
    expect(screen.getByRole('status')).toHaveTextContent(text.saved);
    rerender(<AdminSaveStatus state={{ status: 'error', issues: { name: 'required' } }} />);
    expect(screen.getByRole('status')).toHaveTextContent(text.saveError);
    rerender(<AdminSaveStatus state={{ status: 'error', issues: null }} />);
    expect(screen.getByRole('status')).toHaveTextContent(text.unexpectedError);
  });
});
