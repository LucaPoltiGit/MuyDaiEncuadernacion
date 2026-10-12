import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { routes } from '../../router';
import { content } from '../../content';
import { renderRoutes } from '../../test/renderWithRouter';

const text = content.layout;

describe('StoreLayout', () => {
  it('muestra header, contenido y footer', () => {
    renderRoutes(routes, '/preguntas-frecuentes');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: content.pages.comingSoon.titles.faq }),
    ).toBeInTheDocument();
  });

  it('el primer Tab llega a "Saltar al contenido"', async () => {
    renderRoutes(routes, '/');
    await userEvent.tab();
    expect(screen.getByRole('link', { name: text.skipLink })).toHaveFocus();
  });

  it('muestra WhatsApp en la tienda pero no en el checkout', () => {
    const { unmount } = renderRoutes(routes, '/tienda');
    expect(screen.getByRole('link', { name: text.whatsapp.label })).toBeInTheDocument();
    unmount();

    renderRoutes(routes, '/checkout');
    expect(screen.queryByRole('link', { name: text.whatsapp.label })).not.toBeInTheDocument();
  });

  it('al navegar mueve el foco al contenido nuevo', async () => {
    renderRoutes(routes, '/');
    await userEvent.click(screen.getAllByRole('link', { name: text.footer.faq })[0]);
    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('muestra la página 404 para rutas que no existen', () => {
    renderRoutes(routes, '/esto-no-existe');
    expect(
      screen.getByRole('heading', { level: 1, name: content.pages.notFound.title }),
    ).toBeInTheDocument();
  });

  it('la guía de estilo sigue disponible en su propia ruta', () => {
    renderRoutes(routes, '/guia-de-estilo');
    expect(
      screen.getByRole('heading', { level: 1, name: content.styleGuide.title }),
    ).toBeInTheDocument();
  });
});
