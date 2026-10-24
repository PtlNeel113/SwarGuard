/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface RiskScoreGaugeProps {
  score?: number; // 0 to 1000
  label?: string; // e.g. "High", "Medium", "Safe"
  maxScore?: number;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score = 741,
  label = 'High',
  maxScore = 1000,
}) => {
  // Clamped ratio for the 180-degree semi-circle
  const ratio = Math.min(Math.max(score / maxScore, 0), 1);

  // Radius and circumferences
  const radius = 75;
  const cx = 95;
  const cy = 95;
  // Circumference of semi-circle = PI * radius
  const semiCircumference = Math.PI * radius;
  const strokeDashoffset = semiCircumference * (1 - ratio);

  const getBadgeColor = (val: number) => {
    if (val >= 600) return 'bg-[#F59E0B] text-black font-extrabold';
    if (val >= 350) return 'bg-[#3B82F6] text-white font-bold';
    return 'bg-[#10B981] text-white font-bold';
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-48 h-28 flex items-center justify-center overflow-hidden">
        <svg
          className="w-48 h-48 -rotate-180"
          viewBox="0 0 190 190"
          style={{ transform: 'rotate(-180deg)' }}
        >
          {/* Background Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="transparent"
            stroke="#1F2937"
            strokeWidth="14"
            strokeDasharray={`${semiCircumference} ${semiCircumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="riskGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Filled Arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="transparent"
            stroke="url(#riskGaugeGrad)"
            strokeWidth="14"
            strokeDasharray={`${semiCircumference} ${semiCircumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Needle Marker Indicator */}
        <div
          className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-lg border-2 border-[#111827] transition-all duration-700"
          style={{
            top: `${cy - Math.sin(Math.PI * (1 - ratio)) * radius - 7}px`,
            left: `${cx + Math.cos(Math.PI * (1 - ratio)) * radius - 7}px`,
          }}
        />

        {/* Center Score Label */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-[10px] text-[#9AA6BC] font-medium tracking-wide uppercase">Score</span>
          <span className="text-3xl font-extrabold text-[#FFFFFF] font-mono tabular-nums leading-none">
            {score}
          </span>
          <span
            className={`mt-1.5 px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${getBadgeColor(
              score
            )}`}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Axis Scale */}
      <div className="w-44 flex justify-between text-[10px] font-mono text-[#9AA6BC] px-1 mt-1">
        <span>0</span>
        <span>{maxScore}</span>
      </div>
    </div>
  );
};
