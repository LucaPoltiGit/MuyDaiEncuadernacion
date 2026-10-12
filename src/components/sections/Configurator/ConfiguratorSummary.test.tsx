import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConfiguratorBar, ConfiguratorExtras } from './ConfiguratorSummary';
import { content } from '../../../content';
import { calculatePrice } from '../../../domain/notebook/pricing';
import { buildConfiguration, buildTestData } from '../../../domain/notebook/testFixture';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.configurator;
const data = buildTestData();
const configuration = buildConfiguration({ coverText: 'Ana' });
const props = {
  data,
  configuration,
  price: calculatePrice(configuration, data),
  productionDays: 9,
};
const barProps = { ...props, canAdd: true, notices: [], noticeVersion: 0 };

describe('ConfiguratorBar', () => {
  it('muestra el plazo y deja agregar al carrito', async () => {
    renderWithRouter(<ConfiguratorBar {...barProps} />);
    expect(screen.getByText(text.summary.production(9))).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: text.summary.addToCart }));
    expect(screen.getByText(text.summary.added)).toBeInTheDocument();
  });

  it('no deja agregar una combinación inválida y explica por qué', () => {
    renderWithRouter(<ConfiguratorBar {...barProps} canAdd={false} />);
    const button = screen.getByRole('button', { name: text.summary.addToCart });
    expect(button).toBeDisabled();
    expect(button).toHaveAccessibleDescription(text.summary.cannotAdd);
  });

  it('los avisos de ajuste se ocultan solos después de unos segundos', () => {
    vi.useFakeTimers();
    renderWithRouter(
      <ConfiguratorBar {...barProps} notices={['Ajustamos a 80 hojas.']} noticeVersion={1} />,
    );
    expect(screen.getByText('Ajustamos a 80 hojas.')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.queryByText('Ajustamos a 80 hojas.')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe('ConfiguratorExtras', () => {
  it('incluye la personalización en el detalle del precio', async () => {
    renderWithRouter(<ConfiguratorExtras {...props} />);
    await userEvent.click(screen.getByText(text.summary.breakdownToggle));
    expect(screen.getByText(text.summary.lines.personalization)).toBeInTheDocument();
  });
});
