/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, Radio, AlertCircle, PhoneCall, PhoneOff, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const LiveVoiceConversation: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error'
  >('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Convert Float32Array channel data to 16-bit linear PCM base64
  const floatTo16BitPCMBase64 = (float32Array: Float32Array): string => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Play incoming 24kHz 16-bit PCM chunks scheduled gaplessly
  const play24kHzAudioChunk = useCallback((base64PCM: string) => {
    if (!outputAudioCtxRef.current) return;
    const ctx = outputAudioCtxRef.current;

    const binary = atob(base64PCM);
    const numSamples = binary.length / 2;
    const audioBuffer = ctx.createBuffer(1, numSamples, 24000);
    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      const byte1 = binary.charCodeAt(i * 2);
      const byte2 = binary.charCodeAt(i * 2 + 1);
      let int16 = byte1 | (byte2 << 8);
      if (int16 >= 0x8000) int16 -= 0x10000;
      channelData[i] = int16 / 32768.0;
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const currentTime = ctx.currentTime;
    const startTime = Math.max(currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + audioBuffer.duration;

    scheduledSourcesRef.current.push(source);
    source.onended = () => {
      scheduledSourcesRef.current = scheduledSourcesRef.current.filter((s) => s !== source);
      if (scheduledSourcesRef.current.length === 0) {
        setStatus('listening');
      }
    };

    setStatus('speaking');
  }, []);

  const stopAllScheduledAudio = () => {
    scheduledSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    scheduledSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
  };

  const startLiveSession = async () => {
    setErrorMessage(null);
    setStatus('connecting');

    try {
      // 1. Establish Audio Contexts
      // Input at 16kHz for Gemini Live
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      // Output at 24kHz for Gemini Live model audio
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });

      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // 2. Capture Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      // 3. Connect to WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        setIsActive(true);

        // Pipe mic audio into WebSocket
        const micSource = inputCtx.createMediaStreamSource(stream);
        const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
        micSource.connect(scriptProcessor);
        scriptProcessor.connect(inputCtx.destination);

        scriptProcessor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            const base64PCM = floatTo16BitPCMBase64(inputData);
            ws.send(JSON.stringify({ audio: base64PCM }));
          }
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setErrorMessage(msg.error);
            setStatus('error');
          } else if (msg.interrupted) {
            stopAllScheduledAudio();
            setStatus('listening');
          } else if (msg.audio) {
            play24kHzAudioChunk(msg.audio);
          }
        } catch (err) {
          console.error('Failed to parse Live WS message:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket Live Error:', err);
        setErrorMessage('Failed to connect to Live API endpoint.');
        setStatus('error');
      };

      ws.onclose = () => {
        stopLiveSession();
      };
    } catch (err: any) {
      console.error('Live session initialization error:', err);
      setErrorMessage(err.message || 'Microphone access denied or connection failed.');
      setStatus('error');
      stopLiveSession();
    }
  };

  const stopLiveSession = () => {
    stopAllScheduledAudio();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }

    setIsActive(false);
    setStatus('disconnected');
  };

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  return (
    <Card variant="base" className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-[#263359]">
        <div className="flex items-center gap-2 text-[#F2A65A]">
          <Radio className="w-5 h-5 animate-pulse" />
          <h3 className="font-bold text-sm text-[#F6F3EC]">Live API Real-Time Voice Guardian</h3>
        </div>
        <span className="text-[11px] font-mono text-[#56D6C2] bg-[#0B1020] px-2 py-0.5 rounded border border-[#263359]">
          gemini-3.8-live
        </span>
      </div>

      <p className="text-xs text-[#9AA6BC] leading-relaxed">
        Engage in an authentic hands-free voice conversation. Powered by Google’s low-latency Live API model (`gemini-3.8-live`), you can talk and receive instantaneous spoken responses in real-time.
      </p>

      {/* Voice Status Sphere & Animation */}
      <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-[#0B1020] border border-[#263359] relative overflow-hidden">
        {/* Concentric sound rings responding to speaking state */}
        <div
          className={`w-36 h-36 rounded-full border border-[#F2A65A]/30 flex items-center justify-center transition-transform duration-500 ${
            status === 'speaking'
              ? 'scale-125 border-[#56D6C2]/60 animate-pulse'
              : status === 'listening'
              ? 'scale-110 border-[#F2A65A]/50'
              : 'scale-100'
          }`}
        >
          <div
            className={`w-24 h-24 rounded-full border border-[#56D6C2]/40 flex items-center justify-center transition-transform duration-300 ${
              status === 'speaking' ? 'scale-115 bg-[#56D6C2]/10' : 'scale-100 bg-[#171F3A]'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                status === 'speaking'
                  ? 'bg-[#56D6C2] text-[#0B1020]'
                  : status === 'listening'
                  ? 'bg-[#F2A65A] text-[#0B1020]'
                  : 'bg-[#263359] text-[#9AA6BC]'
              }`}
            >
              {status === 'speaking' ? (
                <Volume2 className="w-7 h-7 animate-bounce" />
              ) : status === 'listening' ? (
                <Mic className="w-7 h-7" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>

        {/* Status Text Indicator */}
        <div className="mt-4 text-center">
          <div className="text-xs font-bold text-[#F6F3EC] uppercase tracking-wider mb-1">
            {status === 'speaking' && 'Gemini is Speaking...'}
            {status === 'listening' && 'Listening to you... (Speak freely)'}
            {status === 'connecting' && 'Connecting to Gemini Live...'}
            {status === 'connected' && 'Live Session Active'}
            {status === 'disconnected' && 'Live Voice Session Inactive'}
            {status === 'error' && 'Session Interrupted'}
          </div>
          <span className="text-[11px] text-[#9AA6BC]">
            {isActive
              ? 'Real-time bi-directional audio stream active (16kHz in / 24kHz out)'
              : 'Click "Start Voice Call" to initiate conversation with gemini-3.8-live'}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg border border-[#FF5B64]/40 bg-[#FF5B64]/10 text-xs text-[#FF5B64] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4 pt-1">
        {!isActive ? (
          <Button
            variant="primary"
            size="lg"
            leftIcon={<PhoneCall className="w-5 h-5" />}
            onClick={startLiveSession}
            disabled={status === 'connecting'}
          >
            {status === 'connecting' ? 'Connecting...' : 'Start Voice Call with Gemini Live'}
          </Button>
        ) : (
          <Button
            variant="danger"
            size="lg"
            leftIcon={<PhoneOff className="w-5 h-5" />}
            onClick={stopLiveSession}
          >
            End Live Voice Call
          </Button>
        )}
      </div>
    </Card>
  );
};
