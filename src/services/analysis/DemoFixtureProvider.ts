/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisProvider, AnalysisListener } from './AnalysisProvider';
import { AnalysisResult, AudioScenario, EvidenceIndicator, RiskLevel } from '../../types';

export class DemoFixtureProvider implements AnalysisProvider {
  readonly id = 'demo-fixture-provider';
  readonly name = 'Demo Fixture Replay Provider';
  readonly isAvailable = true;

  private currentScenario: AudioScenario | null = null;
  private onUpdateCallback: AnalysisListener | null = null;
  private currentResult: AnalysisResult | null = null;
  private emittedEvidenceIds = new Set<string>();

  startAnalysis(
    target: { scenario?: AudioScenario; file?: File; durationSec: number },
    onUpdate: AnalysisListener
  ): void {
    this.onUpdateCallback = onUpdate;
    this.emittedEvidenceIds.clear();

    if (!target.scenario) {
      // User uploaded custom file without a scenario fixture
      const initialResult: AnalysisResult = {
        id: `res-${Date.now()}`,
        status: 'unavailable',
        overallRisk: 'insufficient',
        evidence: [],
        fileName: target.file?.name,
        fileSizeBytes: target.file?.size,
        recommendedAction: {
          en: 'No analysis provider configured for custom audio files. Connect a verified Gemini proxy service to inspect custom recordings.',
          gu: 'કસ્ટમ ઓડિયો ફાઇલો માટે વિશ્લેષણ સેવા કનેક્ટ કરેલ નથી.',
          hi: 'कस्टम ऑडियो फाइलों के लिए कोई विश्लेषण सेवा कनेक्ट नहीं है।',
        },
        createdAt: new Date().toISOString(),
        durationSec: target.durationSec || 0,
        source: 'manual',
      };
      this.currentResult = initialResult;
      onUpdate(initialResult);
      return;
    }

    this.currentScenario = target.scenario;

    const initialResult: AnalysisResult = {
      id: `res-${target.scenario.id}-${Date.now()}`,
      scenarioId: target.scenario.id,
      fileName: target.scenario.name.en,
      status: 'analysing',
      overallRisk: target.scenario.kind === 'genuine' ? 'low' : 'insufficient',
      evidence: [],
      recommendedAction: target.scenario.safeResponse,
      createdAt: new Date().toISOString(),
      durationSec: target.scenario.durationSec,
      source: 'demo-fixture',
    };

    this.currentResult = initialResult;
    onUpdate(initialResult);
  }

  onPlaybackTimeUpdate(currentTimeSec: number): void {
    if (!this.currentScenario || !this.currentResult || !this.onUpdateCallback) {
      return;
    }

    const availableIndicators = this.currentScenario.indicators.filter(
      (ind) => ind.startSec <= currentTimeSec
    );

    let hasNew = false;
    const mergedEvidence: EvidenceIndicator[] = [...this.currentResult.evidence];

    for (const ind of availableIndicators) {
      if (!this.emittedEvidenceIds.has(ind.id)) {
        this.emittedEvidenceIds.add(ind.id);
        mergedEvidence.push(ind);
        hasNew = true;
      }
    }

    // Determine highest risk level dynamically from unlocked evidence
    let overallRisk: RiskLevel = this.currentScenario.kind === 'genuine' ? 'low' : 'insufficient';
    let firstWarningLatencySec: number | undefined = this.currentResult.warningLatencySec;

    for (const ev of mergedEvidence) {
      if (ev.riskLevel === 'high') {
        overallRisk = 'high';
        if (firstWarningLatencySec === undefined) {
          firstWarningLatencySec = ev.startSec;
        }
      } else if (ev.riskLevel === 'medium' && overallRisk !== 'high') {
        overallRisk = 'medium';
        if (firstWarningLatencySec === undefined) {
          firstWarningLatencySec = ev.startSec;
        }
      }
    }

    const isComplete = currentTimeSec >= this.currentScenario.durationSec - 0.5;

    if (hasNew || (isComplete && this.currentResult.status !== 'complete')) {
      const updatedResult: AnalysisResult = {
        ...this.currentResult,
        status: isComplete ? 'complete' : 'analysing',
        overallRisk: isComplete && this.currentScenario.kind === 'genuine' ? 'low' : overallRisk,
        evidence: mergedEvidence,
        warningLatencySec: firstWarningLatencySec,
      };

      this.currentResult = updatedResult;
      this.onUpdateCallback(updatedResult);
    }
  }

  revealAllEvidence(): void {
    if (!this.currentScenario || !this.currentResult || !this.onUpdateCallback) return;

    this.currentScenario.indicators.forEach((i) => this.emittedEvidenceIds.add(i.id));

    const updatedResult: AnalysisResult = {
      ...this.currentResult,
      status: 'complete',
      overallRisk: this.currentScenario.expected,
      evidence: [...this.currentScenario.indicators],
      warningLatencySec: this.currentScenario.indicators[0]?.startSec || 0,
    };

    this.currentResult = updatedResult;
    this.onUpdateCallback(updatedResult);
  }

  stopAnalysis(): void {
    this.onUpdateCallback = null;
    this.currentScenario = null;
    this.currentResult = null;
    this.emittedEvidenceIds.clear();
  }
}
