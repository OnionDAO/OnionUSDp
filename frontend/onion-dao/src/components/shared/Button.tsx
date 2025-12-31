import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  loadingText?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  disabled,
  className = '',
  type = 'button',
  ...props
}) => {
  const isDisabled = disabled || loading;

  const buttonClasses = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth ? 'button-full-width' : '',
    loading ? 'button-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="button-spinner" aria-hidden="true">
          <span className="spinner-circle" />
        </span>
      )}

      {icon && iconPosition === 'left' && !loading && (
        <span className="material-icons button-icon" aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="button-text">
        {loading && loadingText ? loadingText : children}
      </span>

      {icon && iconPosition === 'right' && !loading && (
        <span className="material-icons button-icon" aria-hidden="true">
          {icon}
        </span>
      )}

      {loading && (
        <span className="sr-only">Loading, please wait...</span>
      )}
    </button>
  );
};

export default Button;
