/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = 'low' | 'medium' | 'high' | 'insufficient';

export type AnalysisStatus = 'waiting' | 'analysing' | 'complete' | 'unavailable' | 'error';

export type SupportedLanguage = 'en' | 'gu' | 'hi';

export type EvidenceCategory =
  | 'authority_impersonation'
  | 'threats'
  | 'artificial_urgency'
  | 'isolation'
  | 'credential_requests'
  | 'coercive_money_demands'
  | 'suspicious_kyc_claims'
  | 'suspicious_parcel_claims';

export type EvidenceReviewStatus = 'verified' | 'unreviewed' | 'disputed';

export interface EvidenceIndicator {
  id: string;
  category: EvidenceCategory;
  phrase?: string;
  originalLanguage: SupportedLanguage;
  startSec: number;
  endSec: number;
  explanation: {
    en: string;
    gu: string;
    hi: string;
  };
  riskLevel: RiskLevel;
  reviewStatus: EvidenceReviewStatus;
  uncertainty?: number; // 0 to 1, labelled as uncertainty
  source: 'demo-fixture' | 'gemini' | 'manual';
  alternativeInterpretation?: {
    en: string;
    gu: string;
    hi: string;
  };
  recommendedAction?: {
    en: string;
    gu: string;
    hi: string;
  };
}

export interface AnalysisResult {
  id: string;
  scenarioId?: string;
  fileName?: string;
  fileSizeBytes?: number;
  status: AnalysisStatus;
  overallRisk: RiskLevel;
  evidence: EvidenceIndicator[];
  recommendedAction: {
    en: string;
    gu: string;
    hi: string;
  };
  createdAt: string;
  durationSec: number;
  warningLatencySec?: number;
  source: 'demo-fixture' | 'gemini' | 'manual';
  confidenceScore?: number;
}

export interface AudioScenario {
  id: string;
  name: {
    en: string;
    gu: string;
    hi: string;
  };
  subtitle: {
    en: string;
    gu: string;
    hi: string;
  };
  kind: 'scam' | 'genuine';
  expected: RiskLevel;
  category: EvidenceCategory;
  audioUrl?: string;
  recordingStatus: 'available' | 'missing';
  synthetic: true;
  durationSec: number;
  description: {
    en: string;
    gu: string;
    hi: string;
  };
  fictionalDialogueSnippet: {
    en: string;
    gu: string;
    hi: string;
  };
  warningSigns: {
    en: string[];
    gu: string[];
    hi: string[];
  };
  safeResponse: {
    en: string;
    gu: string;
    hi: string;
  };
  indicators: EvidenceIndicator[];
}

export interface TestResult {
  scenarioId: string;
  scenarioName: string;
  expected: RiskLevel;
  actual?: RiskLevel;
  status: 'not-run' | 'running' | 'pass' | 'fail' | 'error';
  latencySec?: number;
  notes: string;
  ranAt?: string;
  groundTruthVerified: boolean;
  evidenceCount?: number;
  source: 'demo fixture replay' | 'gemini' | 'untested';
}

export interface UserPreferences {
  language: SupportedLanguage;
  reducedMotion: 'system' | 'on' | 'off';
  playbackSpeed: number;
  autoplay: boolean;
  skipIntervalSec: number;
  warningPosition: 'top' | 'floating';
  autoDismissWarnings: boolean;
  showTranslatedWarning: boolean;
}

export interface ScamLibraryItem {
  id: string;
  title: {
    en: string;
    gu: string;
    hi: string;
  };
  category: EvidenceCategory;
  severity: 'high' | 'critical';
  summary: {
    en: string;
    gu: string;
    hi: string;
  };
  howItBegins: {
    en: string;
    gu: string;
    hi: string;
  };
  manipulationTechniques: {
    en: string[];
    gu: string[];
    hi: string[];
  };
  warningSigns: {
    en: string[];
    gu: string[];
    hi: string[];
  };
  fictionalDialogue: {
    speaker: string;
    en: string;
    gu: string;
    hi: string;
  }[];
  safeResponse: {
    en: string;
    gu: string;
    hi: string;
  };
  scenarioId?: string;
}

export interface ActivityLogItem {
  id: string;
  type: 'analysis_started' | 'threat_detected' | 'safe_cleared' | 'test_run' | 'session_reset';
  title: string;
  description: string;
  timestamp: string;
  isSession: boolean; // false = sample history, true = this session
  riskLevel?: RiskLevel;
}
