/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind } from 'lucide-react';
import { formatDuration } from '../../lib/formatters';
import { useAppStore } from '../../store/useAppStore';

interface AudioPlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onRateChange: (rate: number) => void;
  className?: string;
}

export const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  onTogglePlay,
  onSeek,
  onRateChange,
  className = '',
}) => {
  const preferences = useAppStore((state) => state.preferences);
  const skipSec = preferences.skipIntervalSec || 5;

  const handleRewind = () => onSeek(Math.max(0, currentTime - skipSec));
  const handleFastForward = () => onSeek(Math.min(duration, currentTime + skipSec));
  const handleReset = () => onSeek(0);

  const rates = [0.75, 1.0, 1.25, 1.5];

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#12192F] border border-[#263359] ${className}`}
    >
      {/* Primary Playback Affordances */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRewind}
          className="p-2.5 rounded-lg text-[#9AA6BC] hover:text-[#F6F3EC] hover:bg-[#171F3A] transition-colors focus-visible:ring-2 focus-visible:ring-[#F2A65A]"
          title={`Rewind ${skipSec} seconds`}
          aria-label={`Rewind ${skipSec} seconds`}
        >
          <Rewind className="w-5 h-5" />
        </button>

        <button
          onClick={onTogglePlay}
          className="w-12 h-12 rounded-full bg-[#F2A65A] text-[#0B1020] flex items-center justify-center hover:bg-[#e0954b] active:scale-95 transition-all shadow-md focus-visible:ring-2 focus-visible:ring-[#F6F3EC]"
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause call recording' : 'Play call recording'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={handleFastForward}
          className="p-2.5 rounded-lg text-[#9AA6BC] hover:text-[#F6F3EC] hover:bg-[#171F3A] transition-colors focus-visible:ring-2 focus-visible:ring-[#F2A65A]"
          title={`Forward ${skipSec} seconds`}
          aria-label={`Forward ${skipSec} seconds`}
        >
          <FastForward className="w-5 h-5" />
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-lg text-[#9AA6BC] hover:text-[#F6F3EC] hover:bg-[#171F3A] transition-colors focus-visible:ring-2 focus-visible:ring-[#F2A65A]"
          title="Restart from beginning"
          aria-label="Restart audio from beginning"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Time Telemetry */}
      <div className="flex items-center gap-2 font-mono text-sm tabular-nums text-[#F6F3EC]">
        <span className="font-semibold text-[#F2A65A]">{formatDuration(currentTime)}</span>
        <span className="text-[#9AA6BC]">/</span>
        <span className="text-[#9AA6BC]">{formatDuration(duration)}</span>
      </div>

      {/* Playback Speed Segmented Buttons */}
      <div className="flex items-center gap-1 bg-[#0B1020] p-1 rounded-lg border border-[#263359]">
        {rates.map((rate) => (
          <button
            key={rate}
            onClick={() => onRateChange(rate)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              playbackRate === rate
                ? 'bg-[#171F3A] text-[#F2A65A] border border-[#263359]'
                : 'text-[#9AA6BC] hover:text-[#F6F3EC]'
            }`}
          >
            {rate}x
          </button>
        ))}
      </div>
    </div>
  );
};
