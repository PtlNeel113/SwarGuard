/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo } from 'react';
import { EvidenceIndicator } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface SwarSignalWaveformProps {
  peaks: number[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  evidence?: EvidenceIndicator[];
  onSeek: (timeSec: number) => void;
  className?: string;
  height?: number;
  showRings?: boolean;
}

export const SwarSignalWaveform: React.FC<SwarSignalWaveformProps> = ({
  peaks,
  currentTime,
  duration,
  isPlaying,
  evidence = [],
  onSeek,
  className = '',
  height = 96,
  showRings = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const preferences = useAppStore((state) => state.preferences);

  // Fallback to default peaks if empty (e.g. while loading)
  const displayPeaks = useMemo(() => {
    if (peaks && peaks.length > 0) return peaks;
    // Generate clean static baseline bars
    return Array.from({ length: 180 }, (_, i) => 0.12 + 0.18 * Math.sin(i * 0.1));
  }, [peaks]);

  const progressFraction = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  const activeBarIndex = Math.floor(progressFraction * displayPeaks.length);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || duration <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(fraction * duration);
  };

  const isReducedMotion = preferences.reducedMotion === 'on';

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className={`relative w-full rounded-xl bg-[#0B1020] border border-[#263359] overflow-hidden select-none cursor-pointer flex items-center justify-center ${className}`}
      style={{ height: `${height}px` }}
      role="slider"
      aria-label="Acoustic waveform timeline"
      aria-valuemin={0}
      aria-valuemax={duration || 100}
      aria-valuenow={currentTime}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onSeek(currentTime + 5);
        if (e.key === 'ArrowLeft') onSeek(currentTime - 5);
      }}
    >
      {/* Concentric sound-ring motif behind waveform (pulses only when playing and motion allowed) */}
      {showRings && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"
          aria-hidden="true"
        >
          <div
            className={`absolute w-32 h-32 rounded-full border border-[#F2A65A] transition-transform ${
              isPlaying && !isReducedMotion ? 'scale-110 opacity-60' : 'scale-100 opacity-30'
            }`}
          />
          <div
            className={`absolute w-56 h-56 rounded-full border border-[#56D6C2] transition-transform ${
              isPlaying && !isReducedMotion ? 'scale-105 opacity-40' : 'scale-100 opacity-20'
            }`}
          />
          <div
            className={`absolute w-80 h-80 rounded-full border border-[#263359] transition-transform ${
              isPlaying && !isReducedMotion ? 'scale-102 opacity-30' : 'scale-100 opacity-15'
            }`}
          />
        </div>
      )}

      {/* Waveform Bars */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-3 gap-[2px]">
        {displayPeaks.map((peak, idx) => {
          const isPlayed = idx <= activeBarIndex;
          const barHeightPercent = Math.max(8, peak * 100);

          return (
            <div
              key={idx}
              className="flex-1 flex items-center justify-center h-full"
            >
              <div
                className="w-full rounded-full transition-colors duration-75"
                style={{
                  height: `${barHeightPercent}%`,
                  backgroundColor: isPlayed ? '#F2A65A' : '#394B7D',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Real playhead line */}
      <div
        className="absolute top-0 bottom-0 z-20 w-[2px] bg-[#F6F3EC] shadow-[0_0_8px_rgba(242,166,90,0.8)] pointer-events-none transition-[left] ease-linear"
        style={{ left: `${progressFraction * 100}%` }}
        aria-hidden="true"
      >
        <div className="w-2.5 h-2.5 -ml-[4px] -top-1 absolute rounded-full bg-[#F2A65A] border border-[#0B1020]" />
      </div>

      {/* Evidence Markers overlaid at exact timestamps */}
      {duration > 0 &&
        evidence.map((ev) => {
          const markerLeftPercent = (ev.startSec / duration) * 100;
          const isHighRisk = ev.riskLevel === 'high';
          const isUnlocked = currentTime >= ev.startSec;

          return (
            <button
              key={ev.id}
              onClick={(e) => {
                e.stopPropagation();
                onSeek(ev.startSec);
              }}
              className="absolute bottom-1 z-30 transform -translate-x-1/2 p-1 group focus:outline-none"
              style={{ left: `${markerLeftPercent}%` }}
              title={`[${isHighRisk ? 'High Risk' : 'Evidence'}] ${ev.phrase || ev.category} (Click to jump)`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-sm rotate-45 border transition-transform group-hover:scale-125 ${
                  isHighRisk
                    ? 'bg-[#FF5B64] border-[#0B1020]'
                    : 'bg-[#F2A65A] border-[#0B1020]'
                } ${isUnlocked ? 'ring-2 ring-white/50' : 'opacity-60'}`}
              />
              <span className="sr-only">
                Seek to evidence at {ev.startSec}s: {ev.category}
              </span>
            </button>
          );
        })}
    </div>
  );
};
