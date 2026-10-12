import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from './SiteFooter';
import { SOCIAL_LINKS } from '../../../constants/contact';
import { content } from '../../../content';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.layout.footer;

describe('SiteFooter', () => {
  it('tiene los links de ayuda', () => {
    renderWithRouter(<SiteFooter />);
    const help = screen.getByRole('navigation', { name: text.helpTitle });
    expect(within(help).getByRole('link', { name: text.faq })).toHaveAttribute(
      'href',
      '/preguntas-frecuentes',
    );
    expect(within(help).getByRole('link', { name: text.shippingPolicy })).toHaveAttribute(
      'href',
      '/envios-y-devoluciones',
    );
    expect(within(help).getByRole('link', { name: text.terms })).toHaveAttribute(
      'href',
      '/terminos-y-condiciones',
    );
  });

  it('tiene el Botón de arrepentimiento', () => {
    renderWithRouter(<SiteFooter />);
    expect(screen.getByRole('link', { name: text.withdrawalButton })).toHaveAttribute(
      'href',
      '/boton-de-arrepentimiento',
    );
  });

  it('las redes tienen nombre accesible y abren en otra pestaña', () => {
    renderWithRouter(<SiteFooter />);
    const instagram = screen.getByRole('link', { name: text.instagram });
    expect(instagram).toHaveAttribute('href', SOCIAL_LINKS.instagram);
    expect(instagram).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: text.facebook })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.whatsapp })).toBeInTheDocument();
  });
});
