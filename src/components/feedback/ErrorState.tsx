/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-6 rounded-xl border border-[#FF5B64]/40 bg-[#12192F] flex flex-col items-start ${className}`}
      role="alert"
    >
      <div className="flex items-center gap-3 mb-2 text-[#FF5B64]">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <h3 className="font-semibold text-[#F6F3EC]">{title}</h3>
      </div>
      <p className="text-sm text-[#9AA6BC] mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
