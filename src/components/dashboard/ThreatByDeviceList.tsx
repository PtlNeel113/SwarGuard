/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Smartphone, MoreVertical } from 'lucide-react';

interface DeviceItem {
  id: string;
  name: string;
  riskPercent: number;
}

const MONITORED_DEVICES: DeviceItem[] = [
  { id: 'crazyfish228', name: 'VoIP Trunk PBX-01', riskPercent: 43 },
  { id: 'angryswan732', name: 'Senior Galaxy S24', riskPercent: 72 },
  { id: 'silverfox901', name: 'Home Landline Gateway', riskPercent: 18 },
  { id: 'goldenowl411', name: 'Executive iPhone 16', riskPercent: 55 },
];

export const ThreatByDeviceList: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#FFFFFF]">Threat by Device</h3>
        <button className="text-[#9AA6BC] hover:text-[#FFFFFF] p-1 rounded-lg">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {MONITORED_DEVICES.map((dev) => (
          <div
            key={dev.id}
            className="p-3 rounded-xl bg-[#030712] border border-[#1F2937] flex items-center justify-between gap-3 hover:border-[#A855F7]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center text-[#9AA6BC]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#FFFFFF]">{dev.name}</div>
                <div className="text-[10px] text-[#9AA6BC] font-mono">Device ID: {dev.id}</div>
              </div>
            </div>

            {/* Circular Mini Progress Ring */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#1F2937"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke={dev.riskPercent > 50 ? '#EC4899' : '#F59E0B'}
                  strokeWidth="3.5"
                  strokeDasharray={`${(dev.riskPercent / 100) * 88} 88`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[8px] font-mono font-bold text-white">
                {dev.riskPercent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
