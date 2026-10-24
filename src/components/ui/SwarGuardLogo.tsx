/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SwarGuardLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const SwarGuardLogo: React.FC<SwarGuardLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Custom Acoustic Wave Symbol */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-lg bg-gradient-to-br from-[#171F3A] to-[#0B1020] border border-[#F2A65A]/40 flex items-center justify-center p-1.5 shadow-sm`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-full h-full text-[#F2A65A]"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Shield outline */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          {/* Acoustic sound wave bars inside shield */}
          <path d="M8 12v1" strokeWidth="2.5" />
          <path d="M10.5 10v5" strokeWidth="2.5" />
          <path d="M13.5 8v9" strokeWidth="2.5" stroke="#56D6C2" />
          <path d="M16 11v3" strokeWidth="2.5" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight text-[#F6F3EC] leading-none ${textSizes[size]}`}
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          Swar<span className="text-[#F2A65A]">Guard</span>
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-[#9AA6BC] tracking-wider uppercase mt-1">
            Voice Safety Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
