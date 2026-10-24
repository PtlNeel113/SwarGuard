/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MoreVertical, ChevronDown } from 'lucide-react';

interface ThreatDataPoint {
  month: string;
  threats: number;
}

const YEARLY_DATA: ThreatDataPoint[] = [
  { month: 'Jan', threats: 12 },
  { month: 'Feb', threats: 18 },
  { month: 'Mar', threats: 15 },
  { month: 'Apr', threats: 22 },
  { month: 'May', threats: 20 },
  { month: 'Jun', threats: 29 },
  { month: 'Jul', threats: 25 },
  { month: 'Aug', threats: 34 },
  { month: 'Sep', threats: 28 },
  { month: 'Oct', threats: 38 },
  { month: 'Nov', threats: 19 },
  { month: 'Dec', threats: 14 },
];

const MONTHLY_DATA: ThreatDataPoint[] = [
  { month: 'W1', threats: 7 },
  { month: 'W2', threats: 11 },
  { month: 'W3', threats: 15 },
  { month: 'W4', threats: 9 },
];

const DAILY_DATA: ThreatDataPoint[] = [
  { month: 'Mon', threats: 2 },
  { month: 'Tue', threats: 4 },
  { month: 'Wed', threats: 6 },
  { month: 'Thu', threats: 5 },
  { month: 'Fri', threats: 8 },
  { month: 'Sat', threats: 3 },
  { month: 'Sun', threats: 1 },
];

export const ThreatSummaryChart: React.FC = () => {
  const [period, setPeriod] = useState<'Yearly' | 'Monthly' | 'Daily'>('Yearly');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const data =
    period === 'Yearly'
      ? YEARLY_DATA
      : period === 'Monthly'
      ? MONTHLY_DATA
      : DAILY_DATA;

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#FFFFFF]">Threat Summary</h3>
          <p className="text-[11px] text-[#9AA6BC]">
            Acoustic anomaly & telephonic fraud velocity across active monitors
          </p>
        </div>

        {/* Period Selector Dropdown matching uploaded UI */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1F2937] hover:bg-[#374151] text-xs font-medium text-[#FFFFFF] border border-[#374151] transition-colors cursor-pointer"
          >
            <span>{period}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9AA6BC]" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-[#1F2937] border border-[#374151] rounded-xl shadow-xl py-1 z-20">
              {(['Yearly', 'Monthly', 'Daily'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    period === p
                      ? 'text-[#A855F7] font-bold bg-[#111827]'
                      : 'text-[#9AA6BC] hover:text-white hover:bg-[#111827]/50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleThreatArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1F2937' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value;
                  const label = payload[0].payload.month;
                  return (
                    <div className="px-3 py-2 rounded-xl bg-[#030712] border border-[#A855F7] shadow-xl text-xs space-y-0.5">
                      <div className="text-[10px] text-[#9AA6BC] font-semibold">{label} 2026</div>
                      <div className="text-sm font-bold text-[#A855F7] font-mono">
                        Threats: {val}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="threats"
              stroke="#A855F7"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#purpleThreatArea)"
              dot={{ r: 4, fill: '#A855F7', stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#A855F7', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
