/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Radio,
  FileSearch,
  Sparkles,
  Download,
  MoreVertical,
  ChevronDown,
  Microscope,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { CurrentRiskCards } from '../components/dashboard/CurrentRiskCards';
import { RiskScoreGauge } from '../components/dashboard/RiskScoreGauge';
import { ThreatSummaryChart } from '../components/dashboard/ThreatSummaryChart';
import { ThreatsByClassificationChart } from '../components/dashboard/ThreatsByClassificationChart';
import { ThreatDetailsTable } from '../components/dashboard/ThreatDetailsTable';
import { ThreatByDeviceList } from '../components/dashboard/ThreatByDeviceList';
import { SwarSignalWaveform } from '../components/audio/SwarSignalWaveform';
import { AudioPlayerControls } from '../components/audio/AudioPlayerControls';
import { useAudioPlayer } from '../audio/useAudioPlayer';
import { DemoFixtureProvider } from '../services/analysis/DemoFixtureProvider';
import { useAppStore } from '../store/useAppStore';
import { DEMO_SCENARIOS } from '../data/fixtures/scenarios';
import { exportForensicReportPDF } from '../utils/pdfExport';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const currentScenario = useAppStore((state) => state.currentScenario);
  const selectScenario = useAppStore((state) => state.selectScenario);
  const currentResult = useAppStore((state) => state.currentResult);
  const setCurrentResult = useAppStore((state) => state.setCurrentResult);

  const [riskPeriod, setRiskPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  const fixtureProvider = useMemo(() => new DemoFixtureProvider(), []);

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
    src: currentScenario?.audioUrl,
    onTimeUpdate: (time) => {
      fixtureProvider.onPlaybackTimeUpdate(time);
    },
  });

  useEffect(() => {
    if (currentScenario) {
      fixtureProvider.startAnalysis(
        { scenario: currentScenario, durationSec: currentScenario.durationSec },
        (res) => {
          setCurrentResult(res);
        }
      );
    }
    return () => {
      fixtureProvider.stopAnalysis();
    };
  }, [currentScenario, fixtureProvider, setCurrentResult]);

  const handleExportCurrentCallPDF = () => {
    exportForensicReportPDF({
      caseId: `LIVE-SOC-${currentScenario?.id?.toUpperCase() || 'SCAN-01'}`,
      scenarioName: currentScenario?.name?.en || 'Telephonic Incident Analysis',
      timestamp: new Date().toLocaleString('en-IN'),
      overallRisk: currentScenario?.expected || 'high',
      riskScore: 741,
      durationSec: currentScenario?.durationSec || 42,
      summary:
        currentScenario?.description?.en ||
        'Real-time acoustic analysis flagged severe regulatory coercion and synthetic voice characteristics.',
      indicators: (currentScenario?.indicators || []).map((ind) => ({
        id: ind.id,
        timestampSec: ind.startSec,
        category: ind.category,
        quote: ind.phrase || 'Coercive telephonic marker',
        reason: ind.explanation.en,
        severity: ind.riskLevel,
        confidence: 95,
      })),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Current Risk & Risk Score Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Current Risk with 5 cards */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#FFFFFF]">Current Risk</h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#111827] border border-[#1F2937] text-xs text-[#9AA6BC]">
              <span>{riskPeriod}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <CurrentRiskCards />
        </div>

        {/* Right 1 col: Risk Score Gauge */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-[#FFFFFF]">Risk Score</h3>
            <button className="text-[#9AA6BC] hover:text-[#FFFFFF] p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <RiskScoreGauge score={741} label="High" maxScore={1000} />
          <div className="pt-2 text-center text-[11px] text-[#9AA6BC]">
            Critical Coercive Vector Detected
          </div>
        </div>
      </div>

      {/* 2. Threat Summary Graph & Threats By Vector Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThreatSummaryChart />
        </div>
        <div className="lg:col-span-1">
          <ThreatsByClassificationChart />
        </div>
      </div>

      {/* 3. Live Acoustic Waveform Console & Quick Scenario Switcher */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1F2937]">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-[#A855F7] animate-pulse" />
            <h3 className="text-base font-bold text-[#FFFFFF]">
              Live Acoustic Forensics Console
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#A855F7]/15 text-[#A855F7] font-semibold border border-[#A855F7]/30">
              {currentScenario?.name?.en || 'Digital Arrest Scenario'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCurrentCallPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-xs font-semibold text-white shadow-md shadow-[#A855F7]/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Call PDF</span>
            </button>
            <button
              onClick={() => navigate('/analysis')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F2937] hover:bg-[#374151] text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <span>Full Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Waveform */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#9AA6BC]">
            <span>Decoded Acoustic Amplitude & Formant Peaks</span>
            <span>Click waveform bar to seek</span>
          </div>
          <SwarSignalWaveform
            peaks={peaks}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            evidence={currentScenario?.indicators}
            onSeek={seek}
            height={90}
            showRings={true}
          />
        </div>

        {/* Player Controls */}
        <AudioPlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          playbackRate={playbackRate}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onRateChange={setSpeed}
        />

        {/* Quick Scenario Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
          {DEMO_SCENARIOS.map((sc) => {
            const isSelected = currentScenario?.id === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => selectScenario(sc)}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#1F2937] border-[#A855F7] shadow-md shadow-[#A855F7]/10'
                    : 'bg-[#030712] border-[#1F2937] hover:bg-[#1F2937]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#FFFFFF] truncate">
                    {sc.name.en}
                  </span>
                  <span className="text-[10px] font-mono text-[#A855F7]">
                    {sc.durationSec}s
                  </span>
                </div>
                <p className="text-[11px] text-[#9AA6BC] line-clamp-1">{sc.subtitle.en}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Threat Details Table & Threat By Device List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThreatDetailsTable
            onInspectScenario={(sc) => {
              selectScenario(sc);
              navigate('/analysis');
            }}
          />
        </div>
        <div className="lg:col-span-1">
          <ThreatByDeviceList />
        </div>
      </div>

      {/* 5. Acoustic Science & Gemini Intelligence Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#111827] via-[#1F2937] to-[#111827] border border-[#1F2937] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#A855F7]/20 border border-[#A855F7]/40 flex items-center justify-center text-[#A855F7] shrink-0">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#FFFFFF]">
              Acoustic Phonetics, Vocal Biomarkers & Europe PMC Science
            </h4>
            <p className="text-xs text-[#9AA6BC]">
              Inspect vocal tract formants ($F_1, F_2, F_3$), glottal pulse jitter/shimmer, and peer-reviewed scientific studies.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/science-lab')}
          className="px-4 py-2 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-xs font-semibold text-white shadow-md shadow-[#A855F7]/20 transition-all cursor-pointer shrink-0 flex items-center gap-2"
        >
          <span>Open Science Lab</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
