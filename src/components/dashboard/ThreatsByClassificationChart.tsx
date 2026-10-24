/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MoreVertical } from 'lucide-react';

interface ThreatClassification {
  name: string;
  value: number;
  color: string;
}

const CLASSIFICATION_DATA: ThreatClassification[] = [
  { name: 'Digital Arrest Extortion', value: 38, color: '#A855F7' }, // Purple
  { name: 'Fake Bank KYC / OTP', value: 27, color: '#EC4899' }, // Pink
  { name: 'Customs Courier Narcotics', value: 20, color: '#3B82F6' }, // Blue
  { name: 'Coercive Bail Demands', value: 15, color: '#0EA5E9' }, // Cyan
];

export const ThreatsByClassificationChart: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#FFFFFF]">Threats By Vector</h3>
        <button className="text-[#9AA6BC] hover:text-[#FFFFFF] p-1 rounded-lg">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="relative h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={CLASSIFICATION_DATA}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {CLASSIFICATION_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ThreatClassification;
                  return (
                    <div className="px-3 py-1.5 rounded-lg bg-[#030712] border border-[#1F2937] text-xs shadow-xl">
                      <span className="font-semibold text-white">{data.name}: </span>
                      <span className="font-bold text-[#A855F7]">{data.value}%</span>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-[#9AA6BC] uppercase tracking-wider font-semibold">Total</span>
          <span className="text-xl font-extrabold text-[#FFFFFF] font-mono leading-none">65%</span>
        </div>
      </div>

      {/* Legend Dots List */}
      <div className="space-y-1.5 pt-1">
        {CLASSIFICATION_DATA.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[#9AA6BC] truncate max-w-[160px]">{item.name}</span>
            </div>
            <span className="font-mono font-semibold text-[#FFFFFF] text-[11px]">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
