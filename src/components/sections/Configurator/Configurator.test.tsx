import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Configurator } from './Configurator';
import { content } from '../../../content';
import { formatPrice } from '../../../domain/money';
import { buildConfiguration, buildTestData } from '../../../domain/notebook/testFixture';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.configurator;
const data = buildTestData();

/** Testing Library normaliza los espacios del DOM; hacemos lo mismo con lo esperado. */
const norm = (value: string) => value.replace(/\s+/g, ' ');
const price = (amount: number) => norm(formatPrice(amount));

function renderConfigurator(overrides = {}) {
  return renderWithRouter(
    <Configurator data={data} initialConfiguration={buildConfiguration(overrides)} />,
  );
}

function getTotal() {
  return screen.getByText(text.summary.production(7), { exact: false }).parentElement!;
}

describe('Configurator', () => {
  it('muestra el precio y el plazo de la configuración inicial', () => {
    renderConfigurator();
    // A5: 10000 + 80 × 40 + cosido 3000
    expect(getTotal()).toHaveTextContent(price(16200));
    expect(screen.getByText(text.summary.production(7))).toBeInTheDocument();
  });

  it('actualiza el precio al elegir una tela con recargo', async () => {
    renderConfigurator();
    await userEvent.click(screen.getByRole('radio', { name: /Lino/ }));
    expect(getTotal()).toHaveTextContent(price(16200 + 1500));
  });

  it('deshabilita las opciones sin stock y dice por qué', () => {
    renderConfigurator();
    const lunares = screen.getByRole('radio', { name: /Lunares/ });
    expect(lunares).toHaveAttribute('aria-disabled', 'true');
    expect(lunares).toHaveAccessibleName(expect.stringContaining(text.unavailable.outOfStock));
  });

  it('al pasar a un tamaño incompatible cambia la encuadernación y lo avisa', async () => {
    renderConfigurator({ bindingId: 'japonesa' });
    await userEvent.click(screen.getByRole('radio', { name: /^A4/ }));

    expect(screen.getByRole('radio', { name: /^Cosido/ })).toBeChecked();
    expect(
      screen.getByText(text.adjustments.binding('Japonesa', 'Cosido', 'A4')),
    ).toBeInTheDocument();
    const japonesa = screen.getByRole('radio', { name: /^Japonesa/ });
    expect(japonesa).toHaveAttribute('aria-disabled', 'true');
    expect(japonesa).toHaveAccessibleName(
      expect.stringContaining(text.unavailable.notForSize('A4')),
    );
  });

  it('limita las hojas según la encuadernación y ajusta si hace falta', async () => {
    renderConfigurator({ sheets: 160 });
    await userEvent.click(screen.getByRole('radio', { name: /^Japonesa/ }));

    const sheets = screen.getByRole('group', { name: text.steps.sheets });
    expect(within(sheets).getByText(text.sheets.unit(80))).toBeInTheDocument();
    expect(within(sheets).getByRole('button', { name: text.sheets.increase(20) })).toBeDisabled();
    expect(screen.getByText(text.adjustments.sheets(80, 'Japonesa'))).toBeInTheDocument();
  });

  it('suma hojas con el contador y el precio acompaña', async () => {
    renderConfigurator();
    await userEvent.click(screen.getByRole('button', { name: text.sheets.increase(20) }));
    expect(getTotal()).toHaveTextContent(price(16200 + 20 * 40));
  });

  it('la personalización agrega texto a la vista previa, recargo y días', async () => {
    renderConfigurator();
    await userEvent.click(screen.getByRole('switch', { name: text.personalization.toggle }));
    await userEvent.type(screen.getByLabelText(text.personalization.inputLabel), 'M.D.');

    expect(screen.getByRole('img', { name: /"M\.D\."/ })).toBeInTheDocument();
    expect(screen.getByText(text.summary.production(9))).toBeInTheDocument();
    expect(screen.getByText(text.summary.production(9)).parentElement).toHaveTextContent(
      price(16200 + 2500),
    );
  });

  it('no deja escribir más caracteres que el límite', async () => {
    renderConfigurator();
    await userEvent.click(screen.getByRole('switch', { name: text.personalization.toggle }));
    const input = screen.getByLabelText(text.personalization.inputLabel);
    await userEvent.type(input, 'Un texto demasiado largo');
    expect(input).toHaveValue('Un texto dem');
  });

  it('si el admin desactivó la personalización, no aparece', () => {
    renderWithRouter(
      <Configurator data={buildTestData({ personalization: { enabled: false, maxLength: 12 } })} />,
    );
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  it('agrega el diseño al carrito y lo confirma', async () => {
    renderConfigurator();
    await userEvent.click(screen.getByRole('button', { name: text.summary.addToCart }));
    expect(screen.getByText(text.summary.added)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.summary.goToCart })).toHaveAttribute(
      'href',
      '/carrito',
    );
  });

  it('sin sesión, invita a ingresar para guardar el diseño', async () => {
    renderConfigurator();
    expect(await screen.findByRole('link', { name: text.saveDesign.loginPrompt })).toHaveAttribute(
      'href',
      '/ingresar',
    );
  });

  it('el detalle del precio muestra cada concepto', async () => {
    renderConfigurator();
    await userEvent.click(screen.getByText(text.summary.breakdownToggle));
    expect(screen.getByText(text.summary.lines.base('A5'))).toBeInTheDocument();
    expect(screen.getByText(norm(text.summary.lines.sheets(80, 'Lisa', 40)))).toBeInTheDocument();
    expect(screen.getByText(text.summary.lines.binding('Cosido'))).toBeInTheDocument();
  });
});
