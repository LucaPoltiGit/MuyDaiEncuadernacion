import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccountDesignsPage } from './AccountDesignsPage';
import { content } from '../../content';
import { buildConfiguration, buildTestData } from '../../domain/notebook/testFixture';
import { login, logout } from '../../services/authService';
import { getConfiguratorData } from '../../services/configuratorService';
import { saveDesign } from '../../services/designsService';
import { renderWithRouter } from '../../test/renderWithRouter';

vi.mock('../../services/configuratorService', () => ({ getConfiguratorData: vi.fn() }));

const text = content.account.designs;

describe('AccountDesignsPage', () => {
  beforeEach(() => {
    vi.mocked(getConfiguratorData).mockResolvedValue(buildTestData());
  });

  it('lista los diseños guardados y deja borrarlos', async () => {
    await login('ana@example.com', 'cuadernos');
    await saveDesign(buildConfiguration());
    renderWithRouter(<AccountDesignsPage />);

    expect(await screen.findByText(text.count(1))).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Borrar el diseño/ }));
    await userEvent.click(screen.getByRole('button', { name: text.removeConfirm }));
    expect(await screen.findByRole('heading', { name: text.empty.title })).toBeInTheDocument();
  });

  it('no muestra diseños de otras personas', async () => {
    // Otra persona guarda un diseño y sale.
    await login('admin@muydai.com', 'muydai123');
    await saveDesign(buildConfiguration());
    await logout();
    await login('ana@example.com', 'cuadernos');
    renderWithRouter(<AccountDesignsPage />);
    expect(await screen.findByRole('heading', { name: text.empty.title })).toBeInTheDocument();
  });
});
