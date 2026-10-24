/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, AlertCircle, Radio, HelpCircle } from 'lucide-react';

export type SystemStatusType = 'Demo Mode' | 'Connecting' | 'Analysis Available' | 'Unavailable';

interface StatusBadgeProps {
  status: SystemStatusType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const configs: Record<
    SystemStatusType,
    { text: string; icon: React.ReactNode; textClass: string; borderClass: string }
  > = {
    'Demo Mode': {
      text: 'Demo Mode',
      icon: <Radio className="w-3.5 h-3.5 text-[#F2A65A]" />,
      textClass: 'text-[#F2A65A]',
      borderClass: 'border-[#F2A65A]/30 bg-[#F2A65A]/10',
    },
    'Connecting': {
      text: 'Connecting',
      icon: <Radio className="w-3.5 h-3.5 text-[#9AA6BC] animate-pulse" />,
      textClass: 'text-[#9AA6BC]',
      borderClass: 'border-[#263359] bg-[#171F3A]',
    },
    'Analysis Available': {
      text: 'Analysis Available',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#56D6C2]" />,
      textClass: 'text-[#56D6C2]',
      borderClass: 'border-[#56D6C2]/30 bg-[#56D6C2]/10',
    },
    'Unavailable': {
      text: 'Unavailable',
      icon: <AlertCircle className="w-3.5 h-3.5 text-[#9AA6BC]" />,
      textClass: 'text-[#9AA6BC]',
      borderClass: 'border-[#263359] bg-[#12192F]',
    },
  };

  const current = configs[status] || configs['Demo Mode'];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${current.borderClass} ${current.textClass} ${className}`}
      role="status"
    >
      {current.icon}
      <span>{current.text}</span>
    </div>
  );
};

export const FixtureTag: React.FC<{ label?: string; className?: string }> = ({
  label = 'Sample data',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium text-[#9AA6BC] tracking-wide uppercase border border-[#263359] bg-[#12192F] px-2 py-0.5 rounded ${className}`}
      title="This content is sourced from a pre-authored demonstration fixture, not a live call wiretap."
    >
      <HelpCircle className="w-3 h-3 text-[#9AA6BC]" />
      {label}
    </span>
  );
};
