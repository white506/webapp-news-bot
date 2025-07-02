import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    size !== 'md' && styles[`button--${size}`],
    block && styles['button--block'],
    disabled && styles['button--disabled'],
    className,
  ].filter(Boolean).join(' ');

  const iconClasses = [
    styles.button__icon,
    iconPosition === 'right' && styles['button__icon--right'],
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClasses} disabled={disabled} {...props}>
      {icon && iconPosition === 'left' && <span className={iconClasses}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className={iconClasses}>{icon}</span>}
    </button>
  );
};

export default Button; 