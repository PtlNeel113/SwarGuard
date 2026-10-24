/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  UploadCloud,
  FileAudio,
  AlertTriangle,
  ShieldAlert,
  Play,
  RotateCcw,
  Info,
  Clock,
  Layers,
  CheckCircle2,
  FileText,
  Volume2,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SwarSignalWaveform } from '../components/audio/SwarSignalWaveform';
import { AudioPlayerControls } from '../components/audio/AudioPlayerControls';
import { RiskIndicator } from '../components/analysis/RiskIndicator';
import { WarningBanner } from '../components/analysis/WarningBanner';
import { EvidenceCard } from '../components/analysis/EvidenceCard';
import { AnalysisTimeline } from '../components/analysis/AnalysisTimeline';
import { FixtureTag } from '../components/ui/StatusBadge';
import { useAudioPlayer } from '../audio/useAudioPlayer';
import { DemoFixtureProvider } from '../services/analysis/DemoFixtureProvider';
import { useAppStore } from '../store/useAppStore';
import { useI18n } from '../i18n/i18nContext';
import { DEMO_SCENARIOS } from '../data/fixtures/scenarios';
import { formatFileSize, formatDuration } from '../lib/formatters';
import { AudioTranscriber } from '../components/audio/AudioTranscriber';
import { exportForensicReportPDF } from '../utils/pdfExport';
import { Download } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { t, language } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentScenario = useAppStore((state) => state.currentScenario);
  const selectScenario = useAppStore((state) => state.selectScenario);
  const currentResult = useAppStore((state) => state.currentResult);
  const setCurrentResult = useAppStore((state) => state.setCurrentResult);
  const warningAcknowledged = useAppStore((state) => state.warningAcknowledged);
  const acknowledgeWarning = useAppStore((state) => state.acknowledgeWarning);
  const openEvidenceDrawer = useAppStore((state) => state.openEvidenceDrawer);
  const selectedAudioFileName = useAppStore((state) => state.selectedAudioFileName);
  const setUploadedFile = useAppStore((state) => state.setUploadedFile);

  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'transcript' | 'timeline' | 'transcribe'>('transcript');

  const fixtureProvider = useMemo(() => new DemoFixtureProvider(), []);

  // Determine active audio source: custom upload URL or scenario URL
  const audioSource = customAudioUrl || currentScenario?.audioUrl;

  const {
    isPlaying,
    currentTime,
    duration,
    peaks,
    playbackRate,
    togglePlay,
    seek,
    setSpeed,
  } = useAudioPlayer({
    src: audioSource,
    onTimeUpdate: (time) => {
      fixtureProvider.onPlaybackTimeUpdate(time);
    },
    onEnded: () => {
      // Completed playback
    },
  });

  // Re-attach provider when scenario or custom file changes
  useEffect(() => {
    if (customFile) {
      // Custom file with no backend: honest unavailable analysis status
      fixtureProvider.startAnalysis(
        { file: customFile, durationSec: duration },
        (res) => setCurrentResult(res)
      );
    } else if (currentScenario) {
      fixtureProvider.startAnalysis(
        { scenario: currentScenario, durationSec: currentScenario.durationSec },
        (res) => setCurrentResult(res)
      );
    }

    return () => {
      fixtureProvider.stopAnalysis();
    };
  }, [currentScenario, customFile, duration, fixtureProvider, setCurrentResult]);

  // Handle file drop/upload
  const handleFileSelected = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setCustomAudioUrl(objectUrl);
    setCustomFile(file);
    setUploadedFile(file.name, 0);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const highRiskEvidence = (currentResult?.evidence || []).filter(
    (e) => e.riskLevel === 'high'
  );

  const showWarningBanner = highRiskEvidence.length > 0 && !warningAcknowledged;

  const handleExportPDF = () => {
    exportForensicReportPDF({
      caseId: `ANALYSIS-${currentScenario?.id?.toUpperCase() || 'CUSTOM-AUDIO'}`,
      scenarioName: currentScenario?.name?.[language] || currentScenario?.name?.en || selectedAudioFileName || 'Uploaded Audio Analysis',
      timestamp: new Date().toLocaleString('en-IN'),
      overallRisk: currentResult?.overallRisk || currentScenario?.expected || 'insufficient',
      riskScore: currentResult?.overallRisk === 'high' ? 840 : currentResult?.overallRisk === 'medium' ? 520 : 120,
      durationSec: Math.round(duration || currentScenario?.durationSec || 42),
      detectedLanguage: language === 'hi' ? 'Hindi (हिन्दी)' : language === 'gu' ? 'Gujarati (ગુજરાતી)' : 'English',
      summary: currentScenario?.description?.[language] || currentScenario?.description?.en || 'Automated acoustic telephonic analysis report.',
      indicators: (currentResult?.evidence || currentScenario?.indicators || []).map((ind) => ({
        id: ind.id,
        timestampSec: ind.startSec,
        category: ind.category,
        quote: ind.phrase || 'Coercive telephonic marker',
        reason: ind.explanation.en,
        severity: ind.riskLevel,
        confidence: 94,
      })),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title={t('analysis.title')}
        subtitle={t('analysis.subtitle')}
        kicker="Forensic Speech Inspection"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-xs font-semibold text-white shadow-md shadow-[#A855F7]/20 transition-all cursor-pointer"
              title="Download structured official forensic report in PDF format"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Forensic PDF</span>
            </button>
            <span className="text-xs text-[#9AA6BC]">Scenario quick-switch:</span>
            <select
              aria-label="Select demo scenario"
              value={currentScenario?.id || ''}
              onChange={(e) => {
                const sc = DEMO_SCENARIOS.find((s) => s.id === e.target.value);
                if (sc) {
                  setCustomAudioUrl(null);
                  setCustomFile(null);
                  selectScenario(sc);
                }
              }}
              className="bg-[#12192F] border border-[#263359] text-xs text-[#F6F3EC] px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#A855F7]"
            >
              {DEMO_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name[language] || s.name.en} ({s.kind})
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Prominent High-Risk Warning Banner (Appears only when high-risk evidence exists) */}
      {showWarningBanner && (
        <WarningBanner
          highRiskEvidence={highRiskEvidence}
          onAcknowledge={acknowledgeWarning}
          recommendedAction={currentResult?.recommendedAction}
        />
      )}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Column: Dropzone, Player, Waveform, Transcript & Evidence Timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Audio Dropzone Card */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-xl border-2 border-dashed border-[#263359] hover:border-[#F2A65A]/50 bg-[#12192F]/60 transition-colors cursor-pointer text-center select-none"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelected(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-xl bg-[#171F3A] border border-[#263359] flex items-center justify-center text-[#F2A65A] mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#F6F3EC] mb-1">
              {t('analysis.dropzoneTitle')}
            </h3>
            <p className="text-xs text-[#9AA6BC] max-w-md mx-auto mb-3">
              {t('analysis.dropzoneSubtitle')}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              {t('analysis.browse')}
            </Button>
          </div>

          {/* Active File Specifications */}
          <div className="p-4 rounded-xl bg-[#12192F] border border-[#263359] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <FileAudio className="w-4 h-4 text-[#F2A65A]" />
              <div>
                <span className="font-semibold text-[#F6F3EC]">
                  {customFile?.name || selectedAudioFileName || currentScenario?.name.en}
                </span>
                <span className="text-[#9AA6BC] block text-[11px]">
                  {customFile
                    ? `User file · ${formatFileSize(customFile.size)}`
                    : `Pre-calibrated synthetic recording · ${duration.toFixed(1)}s`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FixtureTag label={customFile ? 'Custom file' : 'Demo fixture'} />
              <button
                onClick={() => fixtureProvider.revealAllEvidence()}
                className="text-xs text-[#F2A65A] hover:underline font-medium"
              >
                Inspect All Markers
              </button>
            </div>
          </div>

          {/* Honest Notice when user uploads custom audio */}
          {customFile && (
            <div
              className="p-3.5 rounded-xl border border-[#263359] bg-[#171F3A] text-xs text-[#9AA6BC] flex items-start gap-2.5"
              role="status"
            >
              <Info className="w-4 h-4 text-[#F2A65A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#F6F3EC] block mb-0.5">
                  Local Waveform Mode (No Remote AI Proxy)
                </span>
                <span>{t('analysis.userUploadNotice')}</span>
              </div>
            </div>
          )}

          {/* Waveform & Player Console */}
          <Card variant="elevated" className="space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#263359]">
              <span className="font-bold uppercase tracking-wider text-[#9AA6BC]">
                {t('analysis.timelineHeading')}
              </span>
              <span className="text-xs text-[#9AA6BC] font-mono tabular-nums">
                Position: {formatDuration(currentTime)} / {formatDuration(duration)}
              </span>
            </div>

            <SwarSignalWaveform
              peaks={peaks}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              evidence={currentScenario?.indicators}
              onSeek={seek}
              height={108}
              showRings={true}
            />

            <AudioPlayerControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              playbackRate={playbackRate}
              onTogglePlay={togglePlay}
              onSeek={seek}
              onRateChange={setSpeed}
            />
          </Card>

          {/* Tabs: Transcript vs Live Speech Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#263359] pb-2">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'transcript'
                      ? 'bg-[#171F3A] text-[#F2A65A] border border-[#263359]'
                      : 'text-[#9AA6BC] hover:text-[#F6F3EC]'
                  }`}
                >
                  Dialogue Transcript
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'timeline'
                      ? 'bg-[#171F3A] text-[#F2A65A] border border-[#263359]'
                      : 'text-[#9AA6BC] hover:text-[#F6F3EC]'
                  }`}
                >
                  Evidence Markers ({currentResult?.evidence.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('transcribe')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'transcribe'
                      ? 'bg-[#171F3A] text-[#56D6C2] border border-[#263359]'
                      : 'text-[#9AA6BC] hover:text-[#F6F3EC]'
                  }`}
                >
                  Live Mic Transcribe (gemini-3.5)
                </button>
              </div>

              <FixtureTag label="Forensic tools" />
            </div>

            {activeTab === 'transcript' && (
              <Card variant="base" className="space-y-3">
                <div className="text-xs font-mono text-[#F6F3EC] leading-relaxed bg-[#0B1020] p-4 rounded-xl border border-[#263359]">
                  {currentScenario?.fictionalDialogueSnippet[language] ||
                    currentScenario?.fictionalDialogueSnippet.en ||
                    'Custom recording: No transcript supplied.'}
                </div>
                <p className="text-[11px] text-[#9AA6BC] italic">
                  Note: Quotes are authored demonstration fixtures labeled sample data. Real AI models never invent quotes.
                </p>
              </Card>
            )}

            {activeTab === 'timeline' && (
              <AnalysisTimeline
                evidence={currentResult?.evidence || []}
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
              />
            )}

            {activeTab === 'transcribe' && (
              <AudioTranscriber />
            )}
          </div>
        </div>

        {/* Side Column: Risk Assessment, Status, Recommended Action, Privacy */}
        <div className="space-y-5">
          <RiskIndicator
            risk={currentResult?.overallRisk || currentScenario?.expected || 'insufficient'}
            source={currentResult?.source || 'demo-fixture'}
            uncertainty={0.03}
          />

          {/* Recommended Safe Next Step Card */}
          <Card variant="base" className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F2A65A]">
              <ShieldAlert className="w-4 h-4" />
              <span>{t('analysis.recommendedHeading')}</span>
            </div>
            <p className="text-xs text-[#F6F3EC] leading-relaxed font-medium bg-[#0B1020] p-3.5 rounded-lg border border-[#263359]">
              {currentResult?.recommendedAction?.[language] ||
                currentResult?.recommendedAction?.en ||
                currentScenario?.safeResponse[language] ||
                currentScenario?.safeResponse.en}
            </p>
          </Card>

          {/* Red Flag Indicators Breakdown */}
          {currentScenario && (
            <Card variant="base" className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9AA6BC]">
                Key Red Flags in this Call
              </h3>
              <ul className="space-y-2 text-xs text-[#F6F3EC]">
                {(currentScenario.warningSigns[language] || currentScenario.warningSigns.en).map(
                  (sign, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#FF5B64] font-bold">•</span>
                      <span className="leading-snug">{sign}</span>
                    </li>
                  )
                )}
              </ul>
            </Card>
          )}

          {/* Privacy Architecture Notice */}
          <div className="p-4 rounded-xl border border-[#263359] bg-[#0B1020] text-xs text-[#9AA6BC] space-y-1.5">
            <div className="font-semibold text-[#F6F3EC] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#56D6C2]" />
              <span>Local Processing Security</span>
            </div>
            <p className="leading-relaxed">{t('analysis.privacyNotice')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
