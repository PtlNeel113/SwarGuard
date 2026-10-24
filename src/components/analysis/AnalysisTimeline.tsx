/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EvidenceIndicator } from '../../types';
import { formatDuration, formatCategoryLabel } from '../../lib/formatters';
import { useI18n } from '../../i18n/i18nContext';
import { ShieldAlert, AlertTriangle, Play } from 'lucide-react';

interface AnalysisTimelineProps {
  evidence: EvidenceIndicator[];
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  className?: string;
}

export const AnalysisTimeline: React.FC<AnalysisTimelineProps> = ({
  evidence,
  currentTime,
  duration,
  onSeek,
  className = '',
}) => {
  const { language } = useI18n();

  if (evidence.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-[#9AA6BC] rounded-xl border border-[#263359] bg-[#0B1020]">
        Threat indicators will unlock dynamically as the call recording plays to their specific timestamps.
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {evidence.map((ev, idx) => {
        const isCurrent = currentTime >= ev.startSec && currentTime <= ev.endSec;
        const isPast = currentTime > ev.endSec;
        const isHighRisk = ev.riskLevel === 'high';
        const explanation = ev.explanation[language] || ev.explanation.en;

        return (
          <div
            key={ev.id || idx}
            onClick={() => onSeek(ev.startSec)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
              isCurrent
                ? 'bg-[#171F3A] border-[#F2A65A] shadow-md ring-1 ring-[#F2A65A]/40'
                : isPast
                ? 'bg-[#12192F] border-[#263359]'
                : 'bg-[#0B1020] border-[#263359]/60 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                {isHighRisk ? (
                  <ShieldAlert className="w-4 h-4 text-[#FF5B64] shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#F2A65A] shrink-0" />
                )}
                <span className="text-xs font-bold text-[#F6F3EC]">
                  {formatCategoryLabel(ev.category)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tabular-nums text-[#F2A65A]">
                  {formatDuration(ev.startSec)}
                </span>
                <button
                  className="p-1 rounded text-[#9AA6BC] hover:text-[#F6F3EC]"
                  title="Jump to audio"
                  aria-label={`Jump audio to ${formatDuration(ev.startSec)}`}
                >
                  <Play className="w-3 h-3 fill-current" />
                </button>
              </div>
            </div>

            {ev.phrase && (
              <p className="text-xs font-mono text-[#F6F3EC] bg-[#0B1020] p-2 rounded border border-[#263359]/70 mb-2">
                "{ev.phrase}"
              </p>
            )}

            <p className="text-xs text-[#9AA6BC] leading-relaxed">{explanation}</p>
          </div>
        );
      })}
    </div>
  );
};
