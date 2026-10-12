/**
 * Metadata que cada ruta puede declarar en su `handle` para ajustar el
 * layout global, sin efectos ni registros desde la página. El layout la lee
 * con `useMatches` (gana la ruta más específica).
 */
export interface LayoutOptions {
  /** La página tiene una barra fija abajo (precio, CTA): WhatsApp se eleva sobre ella. */
  bottomBar?: boolean;
  /** Oculta el botón flotante de WhatsApp (ej. checkout). */
  hideWhatsApp?: boolean;
  /** `false` deja el header fijo arriba del todo (no acompaña el scroll), ej. configurador. */
  stickyHeader?: boolean;
}

export interface RouteHandle {
  layout?: LayoutOptions;
}
