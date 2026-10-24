/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FixtureTag } from '../components/ui/StatusBadge';
import { useAppStore } from '../store/useAppStore';
import { useI18n } from '../i18n/i18nContext';
import { DEMO_SCENARIOS } from '../data/fixtures/scenarios';
import { RiskLevel } from '../types';

export const TestLabPage: React.FC = () => {
  const { t } = useI18n();
  const testResults = useAppStore((state) => state.testResults);
  const runTestScenario = useAppStore((state) => state.runTestScenario);
  const runAllTests = useAppStore((state) => state.runAllTests);
  const resetTests = useAppStore((state) => state.resetTests);

  const [isRunningAll, setIsRunningAll] = useState(false);

  const handleRunAll = async () => {
    setIsRunningAll(true);
    await runAllTests();
    setIsRunningAll(false);
  };

  const passedCount = testResults.filter((t) => t.status === 'pass').length;
  const failedCount = testResults.filter((t) => t.status === 'fail').length;
  const totalRan = passedCount + failedCount;

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      <PageHeader
        title={t('testLabPage.title')}
        subtitle={t('testLabPage.subtitle')}
        kicker="Automated Verification Suite"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={resetTests}
            >
              {t('testLabPage.reset')}
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play className="w-4 h-4 fill-current" />}
              isLoading={isRunningAll}
              onClick={handleRunAll}
            >
              {t('testLabPage.runAll')}
            </Button>
          </div>
        }
      />

      {/* Summary Scoreboard (Derived purely from computed pass/fails) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="base" className="p-4">
          <div className="text-[11px] font-bold text-[#9AA6BC] uppercase tracking-wider mb-1">
            Total Test Cases
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-[#F6F3EC]">
            {testResults.length}
          </div>
          <div className="text-[11px] text-[#9AA6BC] mt-1">Ground truth calibrated</div>
        </Card>

        <Card variant="base" className="p-4">
          <div className="text-[11px] font-bold text-[#56D6C2] uppercase tracking-wider mb-1">
            Tests Passed
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-[#56D6C2]">
            {passedCount}
          </div>
          <div className="text-[11px] text-[#9AA6BC] mt-1">Derived from comparison</div>
        </Card>

        <Card variant="base" className="p-4">
          <div className="text-[11px] font-bold text-[#FF5B64] uppercase tracking-wider mb-1">
            Tests Failed
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-[#FF5B64]">
            {failedCount}
          </div>
          <div className="text-[11px] text-[#9AA6BC] mt-1">Mismatch against expectation</div>
        </Card>

        <Card variant="base" className="p-4">
          <div className="text-[11px] font-bold text-[#F2A65A] uppercase tracking-wider mb-1">
            Evaluation Source
          </div>
          <div className="text-sm font-bold text-[#F2A65A] mt-1 truncate">
            Demo Fixture Replay
          </div>
          <div className="text-[11px] text-[#9AA6BC] mt-1">Zero fabricated accuracy %</div>
        </Card>
      </div>

      {/* Test Execution Table */}
      <div className="overflow-x-auto rounded-xl border border-[#263359] bg-[#12192F]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#263359] bg-[#171F3A]/60 text-[#9AA6BC] uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 font-semibold">Scenario Case</th>
              <th className="py-3.5 px-4 font-semibold">Recording</th>
              <th className="py-3.5 px-4 font-semibold">Expected</th>
              <th className="py-3.5 px-4 font-semibold">Actual Result</th>
              <th className="py-3.5 px-4 font-semibold">Verification Status</th>
              <th className="py-3.5 px-4 font-semibold">Latency</th>
              <th className="py-3.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#263359]">
            {testResults.map((test) => {
              const scenario = DEMO_SCENARIOS.find((s) => s.id === test.scenarioId);
              const isRunning = test.status === 'running';

              return (
                <tr key={test.scenarioId} className="hover:bg-[#171F3A]/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#F6F3EC]">
                    <div className="font-bold">{test.scenarioName}</div>
                    <span className="text-[11px] text-[#9AA6BC] block mt-0.5">
                      Source: demo fixture replay
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#56D6C2] font-mono">
                      <span className="w-2 h-2 rounded-full bg-[#56D6C2]" />
                      available ({scenario?.durationSec}s)
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-mono uppercase text-xs font-bold text-[#9AA6BC]">
                    {test.expected}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-mono uppercase text-xs font-bold">
                    {test.actual ? (
                      <span
                        className={
                          test.actual === 'high'
                            ? 'text-[#FF5B64]'
                            : test.actual === 'low'
                            ? 'text-[#56D6C2]'
                            : 'text-[#F2A65A]'
                        }
                      >
                        {test.actual}
                      </span>
                    ) : (
                      <span className="text-[#9AA6BC] font-normal italic">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {test.status === 'pass' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#56D6C2]/10 border border-[#56D6C2]/30 text-[#56D6C2]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PASS
                      </span>
                    )}
                    {test.status === 'fail' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#FF5B64]/10 border border-[#FF5B64]/30 text-[#FF5B64]">
                        <XCircle className="w-3.5 h-3.5" />
                        FAIL
                      </span>
                    )}
                    {test.status === 'running' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#F2A65A]/10 border border-[#F2A65A]/30 text-[#F2A65A] animate-pulse">
                        RUNNING
                      </span>
                    )}
                    {test.status === 'not-run' && (
                      <span className="text-[#9AA6BC] italic">Not executed</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono tabular-nums text-xs text-[#F2A65A] whitespace-nowrap">
                    {test.latencySec ? `${test.latencySec.toFixed(1)}s` : '—'}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      isLoading={isRunning}
                      onClick={() => runTestScenario(test.scenarioId)}
                    >
                      Run Test
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Known Engineering Limitations & Disclosures */}
      <Card variant="base" className="space-y-4">
        <div className="flex items-center gap-2 text-[#F2A65A] font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <h3>{t('testLabPage.limitationsTitle')}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#263359] space-y-1">
            <h4 className="font-bold text-[#F6F3EC]">False Alarms & Over-Sensitivity</h4>
            <p className="text-[#9AA6BC] leading-relaxed">
              Legitimate urgency (such as an authentic hospital notifying a donor or a legitimate courier delay) can trigger caution markers if the language mimics coercive pressure.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#263359] space-y-1">
            <h4 className="font-bold text-[#F6F3EC]">Simulated Calls vs. Real Telephony Interception</h4>
            <p className="text-[#9AA6BC] leading-relaxed">
              SwarGuard analyzes recorded or submitted audio files in-browser. It does not wiretap live cellular networks or intercept carrier voice packets.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#263359] space-y-1">
            <h4 className="font-bold text-[#F6F3EC]">Acoustic Quality & Environmental Noise</h4>
            <p className="text-[#9AA6BC] leading-relaxed">
              Compressed GSM audio (8 kHz), heavy street noise, or dual-speaker cross-talk can decrease phrase alignment accuracy.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#263359] space-y-1">
            <h4 className="font-bold text-[#F6F3EC]">Regional Dialect Variations</h4>
            <p className="text-[#9AA6BC] leading-relaxed">
              Code-mixing (Hinglish/Gujlish) and colloquial expressions require native-speaker review and continual benchmark expansion beyond initial static fixtures.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
