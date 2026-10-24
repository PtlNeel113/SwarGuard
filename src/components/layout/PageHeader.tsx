/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  kicker?: string;
  documentTitle?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  kicker,
  documentTitle,
  className = '',
}) => {
  useEffect(() => {
    if (documentTitle) {
      document.title = `${documentTitle} · SwarGuard`;
    } else {
      document.title = `${title} · SwarGuard`;
    }
  }, [title, documentTitle]);

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#263359] ${className}`}
    >
      <div>
        {kicker && (
          <div className="text-xs uppercase tracking-wider font-bold text-[#F2A65A] mb-1">
            {kicker}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#F6F3EC] tracking-tight text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[#9AA6BC] mt-1.5 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};
