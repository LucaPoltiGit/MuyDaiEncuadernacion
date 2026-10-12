import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { buttonClassName } from './buttonClassName';
import type { ButtonSize, ButtonVariant } from './buttonClassName';

export type { ButtonSize, ButtonVariant };

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, fullWidth, className })}
      {...rest}
    >
      {children}
    </button>
  );
}
