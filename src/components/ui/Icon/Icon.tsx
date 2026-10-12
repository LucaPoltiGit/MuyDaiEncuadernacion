import type { ReactNode } from 'react';
import styles from './Icon.module.css';

/**
 * Íconos SVG propios (trazo de 24×24), sin librería externa. Toman el color
 * del texto (currentColor). Son decorativos por defecto: el nombre accesible
 * lo da el botón o link que los contiene. Si un ícono va solo y transmite
 * información, pasar `label`.
 */
const paths: Record<IconName, ReactNode> = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  cart: (
    <>
      <path d="M3 4h2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L20 8H6.2" />
      <circle cx="9.5" cy="19.5" r="1.3" />
      <circle cx="17" cy="19.5" r="1.3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20c1.4-3.6 4.2-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.9z" />
      <path d="M9.2 8.6c.2-.5.6-.6.9-.6h.5l.9 2.1-.7.9a5.6 5.6 0 0 0 2.4 2.4l.9-.7 2.1.9v.5c0 .3-.1.7-.6.9-.8.4-2 .4-3.7-.7a8.3 8.3 0 0 1-2.6-2.6c-.6-1.1-.6-2.2-.1-3.1z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" />
    </>
  ),
  facebook: (
    <path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5z" />
  ),
};

export type IconName = 'menu' | 'close' | 'cart' | 'user' | 'whatsapp' | 'instagram' | 'facebook';

export interface IconProps {
  name: IconName;
  /** Solo si el ícono transmite información por sí mismo. */
  label?: string;
  size?: 'md' | 'lg';
}

export function Icon({ name, label, size = 'md' }: IconProps) {
  return (
    <svg
      className={[styles.icon, styles[size]].join(' ')}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
