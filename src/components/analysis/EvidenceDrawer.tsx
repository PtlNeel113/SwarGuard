/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X, Play, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { EvidenceIndicator } from '../../types';
import { formatCategoryLabel, formatDuration } from '../../lib/formatters';
import { useI18n } from '../../i18n/i18nContext';
import { Button } from '../ui/Button';

interface EvidenceDrawerProps {
  evidence: EvidenceIndicator | null;
  onClose: () => void;
  onSeekToAudio?: (seconds: number) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  evidence,
  onClose,
  onSeekToAudio,
}) => {
  const { language } = useI18n();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && evidence) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [evidence, onClose]);

  if (!evidence) return null;

  const isHighRisk = evidence.riskLevel === 'high';
  const explanationText = evidence.explanation[language] || evidence.explanation.en;
  const altText =
    evidence.alternativeInterpretation?.[language] ||
    evidence.alternativeInterpretation?.en ||
    'Authentic institutional processes adhere to formal verifiable written notices without requiring immediate telephonic compliance.';
  const actionText =
    evidence.recommendedAction?.[language] ||
    evidence.recommendedAction?.en ||
    'Refuse requests for phone verification. Disconnect immediately and call official customer helpline or dial 1930.';

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div className="w-full max-w-lg bg-[#12192F] border-l border-[#263359] h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 animate-in slide-in-from-right-4">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#263359]">
            <div className="flex items-center gap-2.5">
              {isHighRisk ? (
                <ShieldAlert className="w-5 h-5 text-[#FF5B64]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#F2A65A]" />
              )}
              <h2 id="drawer-title" className="text-base font-bold text-[#F6F3EC]">
                Evidence Deep Dive
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#9AA6BC] hover:text-[#F6F3EC] p-1.5 rounded-lg hover:bg-[#171F3A] transition-colors"
              aria-label="Close evidence details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-2 mb-5 text-xs">
            <span className="px-2.5 py-1 rounded bg-[#171F3A] border border-[#263359] text-[#F6F3EC] font-medium">
              {formatCategoryLabel(evidence.category)}
            </span>
            <span className="px-2.5 py-1 rounded bg-[#0B1020] border border-[#263359] text-[#F2A65A] font-mono tabular-nums">
              {formatDuration(evidence.startSec)} - {formatDuration(evidence.endSec)}
            </span>
            <span className="px-2.5 py-1 rounded bg-[#0B1020] border border-[#263359] text-[#9AA6BC]">
              Review: {evidence.reviewStatus}
            </span>
            <span className="px-2.5 py-1 rounded bg-[#0B1020] border border-[#263359] text-[#9AA6BC] uppercase tracking-wider text-[10px]">
              Sample evidence
            </span>
          </div>

          {/* Transcribed Phrase */}
          {evidence.phrase && (
            <div className="mb-5">
              <label className="text-xs uppercase font-bold tracking-wider text-[#9AA6BC] block mb-1.5">
                Transcribed Audio Segment
              </label>
              <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#263359] text-sm font-mono text-[#F6F3EC] leading-relaxed">
                "{evidence.phrase}"
              </div>
            </div>
          )}

          {/* Why Concerning */}
          <div className="mb-5">
            <label className="text-xs uppercase font-bold tracking-wider text-[#FF5B64] block mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Why this is concerning
            </label>
            <div className="p-3.5 rounded-lg bg-[#171F3A] border border-[#263359] text-xs text-[#F6F3EC] leading-relaxed">
              {explanationText}
            </div>
          </div>

          {/* Legitimate Alternative Interpretations */}
          <div className="mb-5">
            <label className="text-xs uppercase font-bold tracking-wider text-[#56D6C2] block mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Legitimate Alternative Interpretations
            </label>
            <div className="p-3.5 rounded-lg bg-[#171F3A] border border-[#263359] text-xs text-[#9AA6BC] leading-relaxed">
              {altText}
            </div>
          </div>

          {/* Recommended Safe Protocol */}
          <div className="mb-6">
            <label className="text-xs uppercase font-bold tracking-wider text-[#F2A65A] block mb-1.5 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              Recommended Protective Action
            </label>
            <div className="p-3.5 rounded-lg bg-[#171F3A] border border-[#F2A65A]/30 text-xs text-[#F6F3EC] leading-relaxed font-medium">
              {actionText}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#263359] flex items-center gap-3">
          {onSeekToAudio && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play className="w-4 h-4 fill-current" />}
              onClick={() => {
                onSeekToAudio(evidence.startSec);
                onClose();
              }}
              className="flex-1 justify-center"
            >
              Seek to Audio ({formatDuration(evidence.startSec)})
            </Button>
          )}
          <Button variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
