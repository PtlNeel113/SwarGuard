/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'base' | 'elevated' | 'subtle';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'base',
  interactive = false,
  ...props
}) => {
  const variantStyles = {
    base: 'bg-[#12192F] border border-[#263359]',
    elevated: 'bg-[#171F3A] border border-[#394B7D]',
    subtle: 'bg-[#0B1020] border border-[#263359]/70',
  };

  const interactiveStyles = interactive
    ? 'hover:border-[#F2A65A]/50 hover:bg-[#171F3A] transition-colors cursor-pointer'
    : '';

  return (
    <div
      className={`rounded-xl p-5 ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
