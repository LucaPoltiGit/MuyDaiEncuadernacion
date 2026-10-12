import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './SiteHeader';
import { content } from '../../../content';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.layout;

function getMenuToggle() {
  return screen.getByRole('button', { name: new RegExp(`${text.menu.open}|${text.menu.close}`) });
}

describe('SiteHeader', () => {
  it('el logo lleva al inicio', () => {
    renderWithRouter(<SiteHeader />);
    expect(screen.getByRole('link', { name: text.brandName })).toHaveAttribute('href', '/');
  });

  it('muestra el Botón de arrepentimiento en la primera pantalla', () => {
    renderWithRouter(<SiteHeader />);
    expect(screen.getByRole('link', { name: text.nav.withdrawal })).toHaveAttribute(
      'href',
      '/boton-de-arrepentimiento',
    );
  });

  it('abre y cierra el menú con el botón', async () => {
    renderWithRouter(<SiteHeader />);
    const toggle = getMenuToggle();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName(text.menu.close);

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('cierra el menú con Escape y devuelve el foco al botón', async () => {
    renderWithRouter(<SiteHeader />);
    const toggle = getMenuToggle();
    await userEvent.click(toggle);
    await userEvent.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('cierra el menú al navegar a otra página', async () => {
    renderWithRouter(<SiteHeader />);
    const toggle = getMenuToggle();
    await userEvent.click(toggle);

    const menu = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
    expect(menu).toBeVisible();
    await userEvent.click(within(menu!).getByRole('link', { name: text.nav.faq }));

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(menu).not.toBeVisible();
  });

  it('el menú lleva al configurador como acción principal', async () => {
    renderWithRouter(<SiteHeader />);
    const toggle = getMenuToggle();
    await userEvent.click(toggle);
    const menu = document.getElementById(toggle.getAttribute('aria-controls') ?? '')!;
    const links = within(menu).getAllByRole('link');
    expect(links[0]).toHaveAccessibleName(text.nav.configurator);
    expect(links[0]).toHaveAttribute('href', '/disena-tu-cuaderno');
  });

  it('anuncia la cantidad de productos del carrito', () => {
    renderWithRouter(<SiteHeader cartCount={3} />);
    expect(screen.getByRole('link', { name: text.cart.withCount(3) })).toHaveAttribute(
      'href',
      '/carrito',
    );
  });

  it('sin cantidad, el carrito se llama solo "Carrito"', () => {
    renderWithRouter(<SiteHeader />);
    expect(screen.getByRole('link', { name: text.cart.label })).toBeInTheDocument();
  });
});
