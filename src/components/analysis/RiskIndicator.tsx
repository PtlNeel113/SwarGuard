/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, HelpCircle, Info } from 'lucide-react';
import { RiskLevel } from '../../types';
import { useI18n } from '../../i18n/i18nContext';

interface RiskIndicatorProps {
  risk: RiskLevel;
  source?: 'demo-fixture' | 'gemini' | 'manual';
  uncertainty?: number;
  showDisclaimer?: boolean;
  className?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  risk,
  source = 'demo-fixture',
  uncertainty,
  showDisclaimer = true,
  className = '',
}) => {
  const { t } = useI18n();

  const configs: Record<
    RiskLevel,
    {
      label: string;
      desc: string;
      icon: React.ReactNode;
      colorClass: string;
      bgClass: string;
      borderClass: string;
    }
  > = {
    high: {
      label: t('risk.high'),
      desc: 'Severe coercive pressure, legal threats, or credential demands detected in recording.',
      icon: <ShieldAlert className="w-6 h-6 text-[#FF5B64] shrink-0" />,
      colorClass: 'text-[#FF5B64]',
      bgClass: 'bg-[#FF5B64]/10',
      borderClass: 'border-[#FF5B64]/30',
    },
    medium: {
      label: t('risk.medium'),
      desc: 'Moderate urgency pressure, unverified identity claims, or suspicious account statements.',
      icon: <AlertTriangle className="w-6 h-6 text-[#F2A65A] shrink-0" />,
      colorClass: 'text-[#F2A65A]',
      bgClass: 'bg-[#F2A65A]/10',
      borderClass: 'border-[#F2A65A]/30',
    },
    low: {
      label: t('risk.low'),
      desc: 'No significant coercive linguistic markers found in the analyzed segments.',
      icon: <ShieldCheck className="w-6 h-6 text-[#56D6C2] shrink-0" />,
      colorClass: 'text-[#56D6C2]',
      bgClass: 'bg-[#56D6C2]/10',
      borderClass: 'border-[#56D6C2]/30',
    },
    insufficient: {
      label: t('risk.insufficient'),
      desc: 'Audio too brief, silent, or awaiting analysis provider connection.',
      icon: <HelpCircle className="w-6 h-6 text-[#9AA6BC] shrink-0" />,
      colorClass: 'text-[#9AA6BC]',
      bgClass: 'bg-[#171F3A]',
      borderClass: 'border-[#263359]',
    },
  };

  const current = configs[risk] || configs.insufficient;

  return (
    <div className={`rounded-xl p-4 border ${current.borderClass} ${current.bgClass} ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          {current.icon}
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#9AA6BC]">
              Assessment Classification
            </span>
            <h4 className={`text-lg font-extrabold leading-tight ${current.colorClass}`}>
              {current.label}
            </h4>
          </div>
        </div>

        {/* Source badge: Truthful disclosure */}
        <span className="text-[11px] font-medium text-[#9AA6BC] border border-[#263359] bg-[#0B1020] px-2 py-0.5 rounded whitespace-nowrap">
          Source: {source}
        </span>
      </div>

      <p className="text-xs text-[#F6F3EC]/80 leading-relaxed mb-3">{current.desc}</p>

      {uncertainty !== undefined && (
        <div className="text-[11px] text-[#9AA6BC] mb-2 flex items-center gap-1.5 font-mono">
          <Info className="w-3.5 h-3.5 text-[#9AA6BC]" />
          <span>Estimated model uncertainty: {(uncertainty * 100).toFixed(0)}%</span>
        </div>
      )}

      {/* Mandatory Non-Negotiable Safety Disclaimer for low risk */}
      {risk === 'low' && showDisclaimer && (
        <div className="mt-3 pt-3 border-t border-[#56D6C2]/20 flex items-start gap-2 text-xs text-[#56D6C2] font-medium">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-snug">{t('risk.safeDisclaimer')}</p>
        </div>
      )}
    </div>
  );
};
