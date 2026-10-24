/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Copy, Check, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useFirebaseAuth } from '../../features/auth/useFirebaseAuth';
import { formatDuration } from '../../lib/formatters';

interface AudioTranscriberProps {
  onTranscriptReady?: (transcript: string) => void;
  className?: string;
}

export const AudioTranscriber: React.FC<AudioTranscriberProps> = ({
  onTranscriptReady,
  className = '',
}) => {
  const { user, saveTranscriptionToFirestore } = useFirebaseAuth();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleTranscribeBlob(audioBlob);
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setErrorMessage(err.message || 'Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleTranscribeBlob = async (blob: Blob) => {
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];

        const response = await fetch('/api/gemini/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Audio: base64Data,
            mimeType: 'audio/webm',
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Transcription failed');
        }

        const text = data.transcript || '';
        setTranscript(text);
        onTranscriptReady?.(text);

        // Persist to Firestore if user is authenticated
        if (user && text) {
          await saveTranscriptionToFirestore(text, recordingSeconds, 'gemini-3.5-transcribe');
        }

        setIsTranscribing(false);
      };
    } catch (err: any) {
      console.error('Transcription API error:', err);
      setErrorMessage(err.message || 'Failed to transcribe audio. Verify GEMINI_API_KEY on the server.');
      setIsTranscribing(false);
    }
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card variant="base" className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-[#263359]">
        <div className="flex items-center gap-2 text-[#56D6C2]">
          <Mic className="w-5 h-5" />
          <h3 className="font-bold text-sm text-[#F6F3EC]">Microphone Voice Transcription</h3>
        </div>
        <span className="text-[11px] font-mono text-[#F2A65A] bg-[#0B1020] px-2 py-0.5 rounded border border-[#263359]">
          gemini-3.5-transcribe
        </span>
      </div>

      <p className="text-xs text-[#9AA6BC] leading-relaxed">
        Speak into your microphone in English, Hindi, or Gujarati. Audio is transcribed verbatim using Google’s specialized voice transcription model.
      </p>

      {/* Recording Status & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0B1020] border border-[#263359]">
        <div className="flex items-center gap-3">
          {isRecording ? (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5B64] animate-ping" />
              <span className="text-xs font-bold text-[#FF5B64] font-mono tabular-nums">
                Recording: {formatDuration(recordingSeconds)}
              </span>
            </div>
          ) : isTranscribing ? (
            <div className="flex items-center gap-2 text-xs text-[#F2A65A]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transcribing with gemini-3.5-transcribe...</span>
            </div>
          ) : (
            <span className="text-xs text-[#9AA6BC]">Ready to capture voice input</span>
          )}
        </div>

        <div>
          {isRecording ? (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Square className="w-3.5 h-3.5 fill-current" />}
              onClick={stopRecording}
            >
              Stop & Transcribe
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Mic className="w-4 h-4" />}
              disabled={isTranscribing}
              onClick={startRecording}
            >
              {isTranscribing ? 'Processing...' : 'Start Recording'}
            </Button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg border border-[#FF5B64]/40 bg-[#FF5B64]/10 text-xs text-[#FF5B64] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Transcript Result Box */}
      {transcript && (
        <div className="space-y-2 pt-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#F6F3EC] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#56D6C2]" />
              Verbatim Transcription
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] text-[#F2A65A] hover:underline cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#56D6C2]" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Text
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#263359] text-xs font-mono text-[#F6F3EC] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
            {transcript}
          </div>

          {user && (
            <span className="text-[10px] text-[#56D6C2] block">
              ✓ Saved to your Firestore transcription history
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
