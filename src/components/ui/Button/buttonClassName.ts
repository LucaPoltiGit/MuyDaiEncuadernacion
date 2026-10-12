import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse';
export type ButtonSize = 'md' | 'lg';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Clases del botón, separadas del componente para poder darle aspecto de
 * botón a un link (ej. un `Link` del router) sin que `ui/` dependa del router.
 */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}) {
  return [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}
