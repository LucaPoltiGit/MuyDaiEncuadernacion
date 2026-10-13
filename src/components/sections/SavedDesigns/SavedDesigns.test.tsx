import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SavedDesigns } from './SavedDesigns';
import { content } from '../../../content';
import { buildConfiguration, buildTestData } from '../../../domain/notebook/testFixture';
import { renderWithRouter } from '../../../test/renderWithRouter';
import type { SavedDesign } from '../../../types/design';

const text = content.account.designs;
const data = buildTestData();

function buildDesign(overrides: Partial<SavedDesign> = {}): SavedDesign {
  return {
    id: 'd1',
    userId: 'u1',
    configuration: buildConfiguration({ coverText: 'Ana' }),
    createdAt: '2026-10-01T12:00:00.000Z',
    ...overrides,
  };
}

describe('SavedDesigns', () => {
  it('sin diseños, invita al configurador', () => {
    renderWithRouter(<SavedDesigns designs={[]} data={data} onRemove={async () => {}} />);
    expect(screen.getByRole('link', { name: text.empty.action })).toHaveAttribute(
      'href',
      '/disena-tu-cuaderno',
    );
  });

  it('muestra cada diseño con su precio de hoy y deja retomarlo', () => {
    renderWithRouter(
      <SavedDesigns designs={[buildDesign()]} data={data} onRemove={async () => {}} />,
    );
    // A5 $10.000 + 80 hojas × $40 + cosido $3.000 + texto $2.500
    expect(screen.getByText(text.priceNow(18700).replace(/\s+/g, ' '))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.edit })).toHaveAttribute(
      'href',
      '/disena-tu-cuaderno',
    );
  });

  it('si una opción se agotó, lo avisa en vez del precio', () => {
    renderWithRouter(
      <SavedDesigns
        designs={[buildDesign({ configuration: buildConfiguration({ fabricId: 'lunares' }) })]}
        data={data}
        onRemove={async () => {}}
      />,
    );
    expect(screen.getByText(text.unavailable)).toBeInTheDocument();
  });

  it('borrar pide confirmar y se puede cancelar', async () => {
    const onRemove = vi.fn(async () => {});
    renderWithRouter(<SavedDesigns designs={[buildDesign()]} data={data} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: /Borrar el diseño/ }));
    expect(screen.getByRole('group', { name: text.removeQuestion })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: text.cancel }));
    expect(screen.queryByRole('group', { name: text.removeQuestion })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Borrar el diseño/ }));
    await userEvent.click(screen.getByRole('button', { name: text.removeConfirm }));
    expect(onRemove).toHaveBeenCalledWith('d1');
    expect(screen.getByText(text.count(1))).toHaveFocus();
  });
});
