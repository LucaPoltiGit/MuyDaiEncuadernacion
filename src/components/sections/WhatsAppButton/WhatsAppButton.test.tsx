import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WhatsAppButton } from './WhatsAppButton';
import { WHATSAPP_NUMBER } from '../../../constants/contact';
import { content } from '../../../content';

const text = content.layout.whatsapp;

describe('WhatsAppButton', () => {
  it('abre WhatsApp con el número y el mensaje pre-armado', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link', { name: text.label });
    const url = new URL(link.getAttribute('href') ?? '');
    expect(url.hostname).toBe('wa.me');
    expect(url.pathname).toBe(`/${WHATSAPP_NUMBER}`);
    expect(url.searchParams.get('text')).toBe(text.message);
  });

  it('se abre en otra pestaña sin perder la tienda', () => {
    render(<WhatsAppButton />);
    expect(screen.getByRole('link', { name: text.label })).toHaveAttribute('target', '_blank');
  });
});
