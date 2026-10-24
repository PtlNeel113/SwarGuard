/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertOctagon, X, PhoneOff, ShieldAlert, Globe } from 'lucide-react';
import { EvidenceIndicator, SupportedLanguage } from '../../types';
import { useI18n } from '../../i18n/i18nContext';
import { Button } from '../ui/Button';

interface WarningBannerProps {
  highRiskEvidence: EvidenceIndicator[];
  onAcknowledge: () => void;
  recommendedAction?: {
    en: string;
    gu: string;
    hi: string;
  };
  className?: string;
}

export const WarningBanner: React.FC<WarningBannerProps> = ({
  highRiskEvidence,
  onAcknowledge,
  recommendedAction,
  className = '',
}) => {
  const { language, setLanguage, t } = useI18n();

  if (!highRiskEvidence || highRiskEvidence.length === 0) {
    return null;
  }

  const primaryEvidence = highRiskEvidence[0];
  const phrase = primaryEvidence.phrase ? `"${primaryEvidence.phrase}"` : primaryEvidence.category;
  const explanation =
    primaryEvidence.explanation[language] || primaryEvidence.explanation.en;

  const safeActionText =
    recommendedAction?.[language] ||
    recommendedAction?.en ||
    'Disconnect this call immediately. Never transfer money, share OTPs, or agree to digital custody.';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`rounded-xl border-2 border-[#FF5B64] bg-[#12192F] shadow-2xl p-5 relative overflow-hidden animate-in slide-in-from-top-4 duration-200 ${className}`}
    >
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[#263359]">
        <div className="flex items-center gap-2.5 text-[#FF5B64]">
          <AlertOctagon className="w-6 h-6 shrink-0 fill-[#FF5B64]/20" />
          <span className="font-extrabold text-base tracking-wide uppercase">
            High-Risk Coercion Alert Detected
          </span>
        </div>

        {/* In-Banner Language Switcher */}
        <div className="flex items-center gap-1.5 text-xs">
          <Globe className="w-3.5 h-3.5 text-[#9AA6BC]" />
          {(['en', 'gu', 'hi'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                language === lang
                  ? 'bg-[#F2A65A] text-[#0B1020] font-bold'
                  : 'text-[#9AA6BC] hover:text-[#F6F3EC]'
              }`}
            >
              {lang === 'en' ? 'EN' : lang === 'gu' ? 'ગુજરાતી' : 'हिन्दी'}
            </button>
          ))}

          <button
            onClick={onAcknowledge}
            className="ml-3 text-[#9AA6BC] hover:text-[#F6F3EC] p-1 rounded transition-colors"
            title="Acknowledge and dismiss warning"
            aria-label="Acknowledge and dismiss warning"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Warning Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 space-y-2">
          <div className="text-xs text-[#9AA6BC] uppercase tracking-wider font-semibold">
            Triggering Threat Pattern
          </div>
          <p className="text-sm font-semibold text-[#F6F3EC] bg-[#0B1020] p-2.5 rounded-lg border border-[#263359]">
            {phrase}
          </p>
          <p className="text-xs text-[#F6F3EC]/80 leading-relaxed pt-1">
            {explanation}
          </p>
        </div>

        {/* Mandatory One Safe Action */}
        <div className="bg-[#171F3A] p-3.5 rounded-lg border border-[#263359] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2A65A] uppercase tracking-wider mb-1.5">
              <ShieldAlert className="w-4 h-4" />
              One Immediate Safe Step
            </div>
            <p className="text-xs text-[#F6F3EC] leading-relaxed font-medium">
              {safeActionText}
            </p>
          </div>

          <div className="mt-3 pt-2">
            <Button
              variant="danger"
              size="sm"
              leftIcon={<PhoneOff className="w-4 h-4" />}
              onClick={onAcknowledge}
              className="w-full justify-center"
            >
              Acknowledge & Protect
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#9AA6BC] pt-2 border-t border-[#263359]/60">
        <span>Detected at timestamp {primaryEvidence.startSec}s in recorded audio</span>
        <span>Sample fixture source</span>
      </div>
    </div>
  );
};
