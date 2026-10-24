/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { extractWaveformPeaks } from '../lib/audioUtils';

interface UseAudioPlayerOptions {
  src?: string;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
}

export const useAudioPlayer = ({ src, onTimeUpdate, onEnded }: UseAudioPlayerOptions = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [isLoadingPeaks, setIsLoadingPeaks] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      onEnded?.();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
    };
  }, []);

  // Update src and extract peaks via Web Audio decodeAudioData
  useEffect(() => {
    if (!audioRef.current || !src) return;

    audioRef.current.src = src;
    audioRef.current.load();
    setCurrentTime(0);
    setIsPlaying(false);

    // Fetch and decode arrayBuffer for real waveform peaks
    let isCancelled = false;
    setIsLoadingPeaks(true);

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        return audioCtx.decodeAudioData(arrayBuffer);
      })
      .then((audioBuffer) => {
        if (!isCancelled) {
          const extracted = extractWaveformPeaks(audioBuffer, 220);
          setPeaks(extracted);
          setDuration(audioBuffer.duration);
          setIsLoadingPeaks(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn('Could not decode audio buffer for waveform:', err);
          // If network fetch fails or file missing, produce empty peaks
          setPeaks([]);
          setIsLoadingPeaks(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [src]);

  // RequestAnimationFrame loop for high-frequency playhead sync
  const updateLoop = useCallback(() => {
    if (!audioRef.current || audioRef.current.paused) {
      return;
    }
    const t = audioRef.current.currentTime;
    setCurrentTime(t);
    onTimeUpdate?.(t);
    animFrameRef.current = requestAnimationFrame(updateLoop);
  }, [onTimeUpdate]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      animFrameRef.current = requestAnimationFrame(updateLoop);
    } catch (err) {
      console.warn('Audio playback was prevented by browser policy:', err);
      setIsPlaying(false);
    }
  }, [updateLoop]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback(
    (seconds: number) => {
      if (!audioRef.current) return;
      const clamped = Math.max(0, Math.min(seconds, duration || 100));
      audioRef.current.currentTime = clamped;
      setCurrentTime(clamped);
      onTimeUpdate?.(clamped);
    },
    [duration, onTimeUpdate]
  );

  const setSpeed = useCallback((rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  return {
    audioElement: audioRef.current,
    isPlaying,
    currentTime,
    duration,
    peaks,
    isLoadingPeaks,
    playbackRate,
    play,
    pause,
    togglePlay,
    seek,
    setSpeed,
  };
};
