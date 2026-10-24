/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-xl border border-[#263359] bg-[#12192F]/60 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-[#171F3A] border border-[#263359] flex items-center justify-center text-[#9AA6BC] mb-4">
        {icon || <Inbox className="w-6 h-6 text-[#9AA6BC]" />}
      </div>
      <h3 className="text-base font-semibold text-[#F6F3EC] mb-1.5">{title}</h3>
      <p className="text-sm text-[#9AA6BC] max-w-md mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
