/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A65A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1020] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap shrink-0 rounded-lg cursor-pointer';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 min-h-[36px] gap-1.5',
      md: 'text-sm px-4 py-2 min-h-[44px] gap-2',
      lg: 'text-base px-5 py-2.5 min-h-[48px] gap-2.5 font-semibold',
    };

    const variantStyles = {
      primary:
        'bg-[#F2A65A] text-[#0B1020] font-semibold hover:bg-[#e0954b] active:bg-[#cc8540] shadow-sm',
      secondary:
        'bg-[#171F3A] text-[#F6F3EC] border border-[#263359] hover:bg-[#1E2849] hover:border-[#394B7D] active:bg-[#12192F]',
      outline:
        'bg-transparent text-[#F6F3EC] border border-[#263359] hover:bg-[#171F3A]/60 hover:border-[#394B7D]',
      danger:
        'bg-[#FF5B64] text-[#0B1020] font-semibold hover:bg-[#e64e56] active:bg-[#cc3e46]',
      ghost:
        'bg-transparent text-[#9AA6BC] hover:text-[#F6F3EC] hover:bg-[#171F3A]/50',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
