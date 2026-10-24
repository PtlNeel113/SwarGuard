/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Download,
  ExternalLink,
  ChevronDown,
  FileAudio,
  Calendar,
  Smartphone,
  CheckCircle,
} from 'lucide-react';
import { exportForensicReportPDF } from '../../utils/pdfExport';
import { DEMO_SCENARIOS } from '../../data/fixtures/scenarios';

export interface ThreatRow {
  id: string;
  date: string;
  deviceId: string;
  virusName: string;
  filePath: string;
  fileType: string;
  riskLevel: 'high' | 'medium' | 'low';
  scenarioRef?: (typeof DEMO_SCENARIOS)[0];
}

const DEFAULT_ROWS: ThreatRow[] = [
  {
    id: 'TR-1029',
    date: '12-05-2026',
    deviceId: '+91 98201 44821',
    virusName: 'Digital Arrest Intimidation',
    filePath: '/demo-audio/digital-arrest-synthetic.wav',
    fileType: 'VoIP (PCM)',
    riskLevel: 'high',
    scenarioRef: DEMO_SCENARIOS[0],
  },
  {
    id: 'TR-1030',
    date: '11-05-2026',
    deviceId: '+91 80102 99412',
    virusName: 'Fake KYC / Bank OTP Harvesting',
    filePath: '/demo-audio/bank-kyc-synthetic.wav',
    fileType: 'GSM / Opus',
    riskLevel: 'high',
    scenarioRef: DEMO_SCENARIOS[1],
  },
  {
    id: 'TR-1031',
    date: '09-05-2026',
    deviceId: '+91 97110 33819',
    virusName: 'Customs Courier Narcotics Extortion',
    filePath: '/demo-audio/customs-courier-synthetic.wav',
    fileType: 'SIP Trunk',
    riskLevel: 'high',
    scenarioRef: DEMO_SCENARIOS[2],
  },
  {
    id: 'TR-1032',
    date: '08-05-2026',
    deviceId: '+91 94220 18274',
    virusName: 'Coercive Bail Emergency Voice Clone',
    filePath: '/demo-audio/family-emergency-bail-synthetic.wav',
    fileType: 'VoIP Clone',
    riskLevel: 'high',
    scenarioRef: DEMO_SCENARIOS[3],
  },
  {
    id: 'TR-1033',
    date: '06-05-2026',
    deviceId: '1800 220 220',
    virusName: 'Legitimate Routine Support (Safe)',
    filePath: '/demo-audio/genuine-service-call-synthetic.wav',
    fileType: 'IVR / PCM',
    riskLevel: 'low',
  },
];

interface ThreatDetailsTableProps {
  onInspectScenario?: (scenario: (typeof DEMO_SCENARIOS)[0]) => void;
}

export const ThreatDetailsTable: React.FC<ThreatDetailsTableProps> = ({
  onInspectScenario,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'Daily' | 'Weekly' | 'All'>('Daily');

  const handleExportRowPDF = (row: ThreatRow) => {
    exportForensicReportPDF({
      caseId: row.id,
      scenarioName: row.virusName,
      callerId: row.deviceId,
      timestamp: row.date,
      overallRisk: row.riskLevel,
      riskScore: row.riskLevel === 'high' ? 840 : 120,
      durationSec: 42,
      summary: `Acoustic threat incident detected from caller ID ${row.deviceId}. Signature: ${row.virusName}. In-band coercion analysis identified high-urgency compliance extortion.`,
      indicators: row.scenarioRef
        ? row.scenarioRef.indicators.map((ind) => ({
            id: ind.id,
            timestampSec: ind.startSec,
            category: ind.category,
            quote: ind.phrase || 'Coercive telephonic marker',
            reason: ind.explanation.en,
            severity: ind.riskLevel,
            confidence: 94,
          }))
        : [],
    });
  };

  const handleExportAllPDF = () => {
    exportForensicReportPDF({
      caseId: `COMPREHENSIVE-SOC-${Date.now().toString().slice(-4)}`,
      scenarioName: 'Consolidated Threat Intelligence Summary',
      timestamp: new Date().toLocaleDateString('en-IN'),
      overallRisk: 'high',
      riskScore: 741,
      durationSec: 180,
      summary:
        'Consolidated incident intelligence log capturing active telephonic coercion, fake regulatory summons, and neural deepfake impersonation across monitored audio channels.',
      indicators: DEMO_SCENARIOS.flatMap((s) => s.indicators).map((ind) => ({
        id: ind.id,
        timestampSec: ind.startSec,
        category: ind.category,
        quote: ind.phrase || 'Coercive telephonic marker',
        reason: ind.explanation.en,
        severity: ind.riskLevel,
        confidence: 94,
      })),
    });
  };

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#FFFFFF]">Threat Details</h3>
          <p className="text-[11px] text-[#9AA6BC]">
            Forensic incident register with instant official PDF export for authorities
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export All Report PDF */}
          <button
            onClick={handleExportAllPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-xs font-semibold text-white shadow-md shadow-[#A855F7]/20 transition-all cursor-pointer"
            title="Export complete incident bundle into structured PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SOC PDF</span>
          </button>

          <span className="px-3 py-1.5 rounded-xl bg-[#1F2937] text-xs font-medium text-[#FFFFFF] border border-[#374151]">
            {filterPeriod}
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#1F2937] text-[#9AA6BC] font-medium text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>Date</span>
                </span>
              </th>
              <th className="py-2.5 px-3">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Caller / Device ID</span>
                </span>
              </th>
              <th className="py-2.5 px-3">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#EC4899]" />
                  <span>Threat Signature</span>
                </span>
              </th>
              <th className="py-2.5 px-3">
                <span className="flex items-center gap-1.5">
                  <FileAudio className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span>Audio Path</span>
                </span>
              </th>
              <th className="py-2.5 px-3">Format</th>
              <th className="py-2.5 px-3">Risk</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2937]">
            {DEFAULT_ROWS.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-[#1F2937]/50 transition-colors group"
              >
                <td className="py-3 px-3 font-mono text-[#9AA6BC]">{row.date}</td>
                <td className="py-3 px-3 font-mono font-medium text-[#FFFFFF]">
                  {row.deviceId}
                </td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-[#FFFFFF] group-hover:text-[#A855F7] transition-colors">
                    {row.virusName}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-[#64748B] truncate max-w-[140px]">
                  {row.filePath}
                </td>
                <td className="py-3 px-3 text-[#9AA6BC]">{row.fileType}</td>
                <td className="py-3 px-3">
                  {row.riskLevel === 'high' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30">
                      High Risk
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                      Verified Safe
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleExportRowPDF(row)}
                      className="p-1.5 rounded-lg bg-[#1F2937] hover:bg-[#374151] text-[#0EA5E9] transition-colors cursor-pointer"
                      title="Download legal-grade PDF report"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {row.scenarioRef && onInspectScenario && (
                      <button
                        onClick={() => onInspectScenario(row.scenarioRef!)}
                        className="px-2 py-1 rounded-lg bg-[#A855F7]/20 hover:bg-[#A855F7]/30 text-[#A855F7] text-[11px] font-semibold transition-colors cursor-pointer"
                        title="Analyze call audio in workspace"
                      >
                        Inspect
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
