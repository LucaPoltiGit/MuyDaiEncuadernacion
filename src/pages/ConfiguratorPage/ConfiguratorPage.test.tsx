import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfiguratorPage } from './ConfiguratorPage';
import { content } from '../../content';
import { buildTestData } from '../../domain/notebook/testFixture';
import { getConfiguratorData } from '../../services/configuratorService';
import { renderWithRouter } from '../../test/renderWithRouter';

vi.mock('../../services/configuratorService', () => ({ getConfiguratorData: vi.fn() }));

const text = content.configurator;
const mockedGetData = vi.mocked(getConfiguratorData);

describe('ConfiguratorPage', () => {
  beforeEach(() => {
    mockedGetData.mockReset();
  });

  it('muestra un aviso de carga y después el configurador', async () => {
    mockedGetData.mockResolvedValue(buildTestData());
    renderWithRouter(<ConfiguratorPage />);
    expect(screen.getByRole('status')).toHaveTextContent(text.loading);
    expect(await screen.findByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
  });

  it('si falla la carga, permite reintentar', async () => {
    mockedGetData.mockRejectedValueOnce(new Error('sin red')).mockResolvedValue(buildTestData());
    renderWithRouter(<ConfiguratorPage />);

    expect(await screen.findByRole('heading', { name: text.error.title })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: text.error.retry }));
    expect(await screen.findByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
  });

  it('si no hay opciones para armar un cuaderno, lo avisa y ofrece la tienda', async () => {
    mockedGetData.mockResolvedValue(buildTestData({ fabrics: [] }));
    renderWithRouter(<ConfiguratorPage />);
    expect(await screen.findByRole('heading', { name: text.paused.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.paused.goToCatalog })).toHaveAttribute(
      'href',
      '/tienda',
    );
  });
});
