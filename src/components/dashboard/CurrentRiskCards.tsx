/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Bug,
  Video,
  Image as ImageIcon,
  Cloud,
  Folder,
  MoreVertical,
  ShieldAlert,
  Mic,
  Fingerprint,
} from 'lucide-react';

interface RiskStat {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const STATS: RiskStat[] = [
  {
    id: 'total',
    label: 'Total Threats',
    value: '132%',
    icon: <Bug className="w-4 h-4" />,
    iconBg: 'bg-[#EC4899]',
    iconColor: 'text-white',
  },
  {
    id: 'voice',
    label: 'Voice Deepfake Risk',
    value: '16%',
    icon: <Mic className="w-4 h-4" />,
    iconBg: 'bg-[#A855F7]',
    iconColor: 'text-white',
  },
  {
    id: 'impersonation',
    label: 'Caller Impersonation',
    value: '43%',
    icon: <ImageIcon className="w-4 h-4" />,
    iconBg: 'bg-[#F43F5E]',
    iconColor: 'text-white',
  },
  {
    id: 'coercion',
    label: 'Coercion Vectors',
    value: '7%',
    icon: <Cloud className="w-4 h-4" />,
    iconBg: 'bg-[#3B82F6]',
    iconColor: 'text-white',
  },
  {
    id: 'biometric',
    label: 'Biometric Mismatch',
    value: '66%',
    icon: <Folder className="w-4 h-4" />,
    iconBg: 'bg-[#0EA5E9]',
    iconColor: 'text-white',
  },
];

export const CurrentRiskCards: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {STATS.map((stat) => (
        <div
          key={stat.id}
          className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-[#A855F7]/40 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-9 h-9 rounded-full ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shadow-md`}
            >
              {stat.icon}
            </div>
            <button className="text-[#9AA6BC] hover:text-[#FFFFFF] p-1">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-[#FFFFFF] font-mono tabular-nums leading-none mb-1">
              {stat.value}
            </div>
            <div className="text-[11px] text-[#9AA6BC] font-medium leading-tight">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
