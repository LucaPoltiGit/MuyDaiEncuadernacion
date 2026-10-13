import type { Testimonial } from '../../types/testimonial';

/** Testimonios de ejemplo (los reales los carga el admin). */
export const testimonialsMock: Testimonial[] = [
  {
    id: 't-ana',
    name: 'Ana',
    location: 'Palermo, CABA',
    text: 'Pedí uno con mis iniciales para regalarle a mi hermana y lloró. La costura es perfecta y abre completamente plano.',
    visible: true,
    createdAt: '2026-08-14T12:00:00.000Z',
  },
  {
    id: 't-caro',
    name: 'Caro',
    location: 'Córdoba',
    text: 'La bitácora de acuarela aguanta todo: pinté con mucha agua y las hojas ni se ondularon.',
    visible: true,
    createdAt: '2026-09-02T12:00:00.000Z',
  },
  {
    id: 't-lu',
    name: 'Lu',
    location: 'Rosario',
    text: 'Me encantó poder elegir la tela y ver cómo quedaba antes de comprar. Llegó súper bien envuelto.',
    visible: true,
    createdAt: '2026-09-20T12:00:00.000Z',
  },
  {
    id: 't-borrador',
    name: 'Marce',
    location: '',
    text: 'Todavía no lo uso pero es hermoso.',
    visible: false,
    createdAt: '2026-10-05T12:00:00.000Z',
  },
];
