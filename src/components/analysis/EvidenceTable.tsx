/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EvidenceIndicator, EvidenceCategory, RiskLevel } from '../../types';
import { formatCategoryLabel, formatDuration } from '../../lib/formatters';
import { useI18n } from '../../i18n/i18nContext';
import { ShieldAlert, AlertTriangle, ShieldCheck, Play, ArrowRight } from 'lucide-react';

interface EvidenceTableProps {
  evidenceList: EvidenceIndicator[];
  onSelectRow: (evidence: EvidenceIndicator) => void;
  onSeekAudio?: (seconds: number) => void;
  className?: string;
}

export const EvidenceTable: React.FC<EvidenceTableProps> = ({
  evidenceList,
  onSelectRow,
  onSeekAudio,
  className = '',
}) => {
  const { language } = useI18n();

  if (evidenceList.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl border border-[#263359] bg-[#12192F] text-[#9AA6BC]">
        No evidence markers match the active filter criteria.
      </div>
    );
  }

  const getRiskIcon = (risk: RiskLevel) => {
    if (risk === 'high') return <ShieldAlert className="w-4 h-4 text-[#FF5B64] shrink-0" />;
    if (risk === 'medium') return <AlertTriangle className="w-4 h-4 text-[#F2A65A] shrink-0" />;
    return <ShieldCheck className="w-4 h-4 text-[#56D6C2] shrink-0" />;
  };

  return (
    <div className={`overflow-x-auto rounded-xl border border-[#263359] bg-[#12192F] ${className}`}>
      {/* Desktop Table View */}
      <table className="w-full text-left text-xs hidden md:table border-collapse">
        <thead>
          <tr className="border-b border-[#263359] bg-[#171F3A]/60 text-[#9AA6BC] uppercase tracking-wider text-[11px]">
            <th className="py-3 px-4 font-semibold">Category</th>
            <th className="py-3 px-4 font-semibold">Phrase Segment</th>
            <th className="py-3 px-4 font-semibold">Timestamp</th>
            <th className="py-3 px-4 font-semibold">Risk Level</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#263359]">
          {evidenceList.map((item) => {
            const isHigh = item.riskLevel === 'high';
            return (
              <tr
                key={item.id}
                onClick={() => onSelectRow(item)}
                className="hover:bg-[#171F3A] transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-4 font-medium text-[#F6F3EC]">
                  <div className="flex items-center gap-2">
                    {getRiskIcon(item.riskLevel)}
                    <span>{formatCategoryLabel(item.category)}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#F6F3EC] max-w-xs truncate">
                  {item.phrase ? `"${item.phrase}"` : '—'}
                </td>
                <td className="py-3.5 px-4 font-mono tabular-nums text-[#F2A65A] whitespace-nowrap">
                  {formatDuration(item.startSec)} - {formatDuration(item.endSec)}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`font-semibold capitalize ${
                      isHigh ? 'text-[#FF5B64]' : item.riskLevel === 'medium' ? 'text-[#F2A65A]' : 'text-[#56D6C2]'
                    }`}
                  >
                    {item.riskLevel}
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-[#9AA6BC]">
                  <span className="capitalize">{item.reviewStatus}</span>
                  <span className="text-[10px] block text-[#9AA6BC]/70">Sample evidence</span>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    {onSeekAudio && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeekAudio(item.startSec);
                        }}
                        className="p-1 rounded text-[#F2A65A] hover:bg-[#0B1020]"
                        title="Seek to Audio"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                    <span className="text-[#9AA6BC] group-hover:text-[#F6F3EC] inline-flex items-center gap-1">
                      Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-[#263359]">
        {evidenceList.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectRow(item)}
            className="p-4 hover:bg-[#171F3A] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {getRiskIcon(item.riskLevel)}
                <span className="text-xs font-bold text-[#F6F3EC]">
                  {formatCategoryLabel(item.category)}
                </span>
              </div>
              <span className="text-xs font-mono text-[#F2A65A] tabular-nums">
                {formatDuration(item.startSec)} - {formatDuration(item.endSec)}
              </span>
            </div>

            {item.phrase && (
              <p className="text-xs font-mono text-[#F6F3EC] bg-[#0B1020] p-2 rounded border border-[#263359] mb-2">
                "{item.phrase}"
              </p>
            )}

            <div className="flex items-center justify-between text-[11px] text-[#9AA6BC]">
              <span className="capitalize">Risk: {item.riskLevel}</span>
              <span className="text-[#F2A65A] font-medium">Tap to Inspect &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
