/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, Play } from 'lucide-react';
import { EvidenceIndicator } from '../../types';
import { formatCategoryLabel, formatDuration } from '../../lib/formatters';
import { useI18n } from '../../i18n/i18nContext';

interface EvidenceCardProps {
  evidence: EvidenceIndicator;
  onInspect: (evidence: EvidenceIndicator) => void;
  onSeek?: (seconds: number) => void;
  className?: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  onInspect,
  onSeek,
  className = '',
}) => {
  const { language } = useI18n();
  const isHighRisk = evidence.riskLevel === 'high';

  const explanationText =
    evidence.explanation[language] || evidence.explanation.en;

  return (
    <div
      onClick={() => onInspect(evidence)}
      className={`rounded-xl p-4 border bg-[#12192F] hover:bg-[#171F3A] transition-all cursor-pointer select-none group ${
        isHighRisk ? 'border-[#FF5B64]/40 hover:border-[#FF5B64]' : 'border-[#263359] hover:border-[#F2A65A]/50'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {isHighRisk ? (
            <ShieldAlert className="w-4 h-4 text-[#FF5B64] shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-[#F2A65A] shrink-0" />
          )}
          <span className="text-xs font-bold text-[#F6F3EC]">
            {formatCategoryLabel(evidence.category)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#F2A65A] bg-[#0B1020] px-2 py-0.5 rounded border border-[#263359]">
            {formatDuration(evidence.startSec)} - {formatDuration(evidence.endSec)}
          </span>
          <span className="text-[10px] text-[#9AA6BC] uppercase tracking-wider">
            Sample evidence
          </span>
        </div>
      </div>

      {evidence.phrase && (
        <p className="text-xs font-semibold text-[#F6F3EC] bg-[#0B1020]/70 p-2 rounded border border-[#263359]/70 mb-2 font-mono">
          "{evidence.phrase}"
        </p>
      )}

      <p className="text-xs text-[#9AA6BC] line-clamp-2 leading-relaxed mb-3">
        {explanationText}
      </p>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-[#263359]/50">
        {onSeek && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSeek(evidence.startSec);
            }}
            className="inline-flex items-center gap-1 text-[#F2A65A] hover:underline font-medium"
          >
            <Play className="w-3 h-3 fill-current" />
            Seek Audio
          </button>
        )}
        <span className="inline-flex items-center gap-1 text-[#9AA6BC] group-hover:text-[#F6F3EC] font-medium ml-auto">
          Inspect Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
};
