/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  onClose: (id: string) => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  onClose,
  durationMs = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), durationMs);
    return () => clearTimeout(timer);
  }, [id, durationMs, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#56D6C2]" />,
    error: <AlertCircle className="w-4 h-4 text-[#FF5B64]" />,
    info: <Info className="w-4 h-4 text-[#F2A65A]" />,
  };

  return (
    <div
      role="status"
      className="flex items-start gap-3 p-4 rounded-xl bg-[#171F3A] border border-[#263359] shadow-xl text-[#F6F3EC] max-w-sm pointer-events-auto animate-in slide-in-from-bottom-2"
    >
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 text-xs">
        <p className="font-semibold text-sm mb-0.5">{title}</p>
        {message && <p className="text-[#9AA6BC] leading-relaxed">{message}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-[#9AA6BC] hover:text-[#F6F3EC] p-1 rounded transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
