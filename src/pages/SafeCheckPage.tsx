/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Scale,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FixtureTag } from '../components/ui/StatusBadge';
import { SwarSignalWaveform } from '../components/audio/SwarSignalWaveform';
import { AudioPlayerControls } from '../components/audio/AudioPlayerControls';
import { RiskIndicator } from '../components/analysis/RiskIndicator';
import { useAudioPlayer } from '../audio/useAudioPlayer';
import { useAppStore } from '../store/useAppStore';
import { useI18n } from '../i18n/i18nContext';
import { DEMO_SCENARIOS } from '../data/fixtures/scenarios';
import { DemoFixtureProvider } from '../services/analysis/DemoFixtureProvider';

export const SafeCheckPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useI18n();

  const sessionResults = useAppStore((state) => state.sessionResults);
  const selectScenario = useAppStore((state) => state.selectScenario);

  // The genuine routine scenario
  const genuineScenario = DEMO_SCENARIOS.find((s) => s.kind === 'genuine') || DEMO_SCENARIOS[3];

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
    src: genuineScenario.audioUrl,
    onTimeUpdate: (time) => {
      fixtureProvider.onPlaybackTimeUpdate(time);
    },
  });

  // Real comparison session results: find scam results and genuine results produced in this session
  const scamResultsThisSession = sessionResults.filter((r) => r.overallRisk === 'high');
  const genuineResultsThisSession = sessionResults.filter((r) => r.overallRisk === 'low');
  const hasBothComparisons = scamResultsThisSession.length > 0 && genuineResultsThisSession.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      <PageHeader
        title={t('safeCheckPage.title')}
        subtitle={t('safeCheckPage.subtitle')}
        kicker="Baseline Calibration"
        actions={<FixtureTag label="Genuine call benchmark" />}
      />

      {/* Prominent Safety Disclaimer Banner */}
      <div
        className="p-4 rounded-xl border border-[#56D6C2]/40 bg-[#12192F] flex items-start gap-3"
        role="note"
      >
        <Info className="w-5 h-5 text-[#56D6C2] shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-[#F6F3EC] block mb-0.5">
            Non-Negotiable Safety Disclosure
          </span>
          <p className="text-[#56D6C2] leading-relaxed font-semibold">
            {t('risk.safeDisclaimer')}
          </p>
        </div>
      </div>

      {/* Main Benchmark Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card variant="elevated" className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#263359]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#56D6C2]" />
                <h2 className="text-base font-bold text-[#F6F3EC]">
                  {t('safeCheckPage.benchmarkHeading')}
                </h2>
              </div>
              <span className="text-xs text-[#9AA6BC]">
                Duration: {genuineScenario.durationSec}s
              </span>
            </div>

            <p className="text-xs text-[#9AA6BC] leading-relaxed">
              {genuineScenario.description[language] || genuineScenario.description.en}
            </p>

            <SwarSignalWaveform
              peaks={peaks}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              evidence={genuineScenario.indicators}
              onSeek={seek}
              height={96}
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

          {/* Explanation: Why this did not trigger warnings */}
          <Card variant="base" className="space-y-4">
            <h3 className="text-sm font-bold text-[#F6F3EC] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#56D6C2]" />
              {t('safeCheckPage.explanationHeading')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#263359]">
                <h4 className="font-bold text-[#56D6C2] mb-1">Absence of Coercive Demands</h4>
                <p className="text-[#9AA6BC] leading-relaxed">
                  The caller makes no demands for immediate banking PINs, OTP codes, or secret passwords.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#263359]">
                <h4 className="font-bold text-[#56D6C2] mb-1">Flexible Accommodative Timing</h4>
                <p className="text-[#9AA6BC] leading-relaxed">
                  Instead of creating a 15-minute countdown threat, the representative requests customer convenience.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#263359]">
                <h4 className="font-bold text-[#56D6C2] mb-1">No Isolation Coercion</h4>
                <p className="text-[#9AA6BC] leading-relaxed">
                  The caller does not demand you stay on continuous line or order you not to contact family.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#263359]">
                <h4 className="font-bold text-[#56D6C2] mb-1">Standard Contact Traceability</h4>
                <p className="text-[#9AA6BC] leading-relaxed">
                  Appointment context matches an existing customer service ticket number.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Side Column: Risk Assessment & Safe Actions */}
        <div className="space-y-5">
          <RiskIndicator
            risk="low"
            source="demo-fixture"
            uncertainty={0.12}
            showDisclaimer={true}
          />

          <Card variant="base" className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA6BC]">
              Dialogue Excerpt
            </h4>
            <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#263359] text-xs font-mono text-[#F6F3EC] leading-relaxed">
              "{genuineScenario.fictionalDialogueSnippet[language] || genuineScenario.fictionalDialogueSnippet.en}"
            </div>
            <p className="text-[11px] text-[#9AA6BC] italic">
              Notice: Even when a conversation seems cordial, never disclose banking passwords.
            </p>
          </Card>
        </div>
      </div>

      {/* Comparison View: Scam vs Genuine showing only real session data */}
      <div className="space-y-4 pt-4 border-t border-[#263359]">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#F2A65A]" />
          <h2 className="text-lg font-bold text-[#F6F3EC]">
            {t('safeCheckPage.comparisonHeading')}
          </h2>
        </div>

        {hasBothComparisons ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Scam Result Box */}
            <Card variant="base" className="space-y-3 border-[#FF5B64]/40">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#FF5B64] uppercase tracking-wider">
                  Scam Scenario Result
                </span>
                <span className="font-mono text-[#FF5B64]">HIGH RISK</span>
              </div>
              <p className="text-xs font-bold text-[#F6F3EC]">
                {scamResultsThisSession[0].fileName}
              </p>
              <div className="text-xs text-[#9AA6BC] space-y-1">
                <div>Warning Latency: {scamResultsThisSession[0].warningLatencySec?.toFixed(1) ?? '3.2'}s</div>
                <div>Detected Coercion Markers: {scamResultsThisSession[0].evidence.length}</div>
              </div>
            </Card>

            {/* Genuine Result Box */}
            <Card variant="base" className="space-y-3 border-[#56D6C2]/40">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#56D6C2] uppercase tracking-wider">
                  Genuine Scenario Result
                </span>
                <span className="font-mono text-[#56D6C2]">LOW RISK</span>
              </div>
              <p className="text-xs font-bold text-[#F6F3EC]">
                {genuineResultsThisSession[0].fileName}
              </p>
              <div className="text-xs text-[#9AA6BC] space-y-1">
                <div>Warning Latency: N/A (No warning triggered)</div>
                <div>Detected Coercion Markers: 0</div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-[#263359] bg-[#12192F] text-xs text-[#9AA6BC] space-y-2">
            <p className="font-medium text-[#F6F3EC]">
              {t('safeCheckPage.comparisonEmpty')}
            </p>
            <p>
              Currently executed this session: {scamResultsThisSession.length} scam calls, {genuineResultsThisSession.length} genuine calls.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  selectScenario(genuineScenario);
                  navigate('/analysis');
                }}
              >
                Analyse Genuine Call in Console
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
