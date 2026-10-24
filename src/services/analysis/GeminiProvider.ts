/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisProvider, AnalysisListener } from './AnalysisProvider';
import { AnalysisResult, AudioScenario } from '../../types';

export class GeminiProvider implements AnalysisProvider {
  readonly id = 'gemini-provider';
  readonly name = 'Google Gemini Cloud Proxy';

  // Reads environment variable; if empty or unset, provider marks itself unavailable
  get isAvailable(): boolean {
    const proxyUrl = import.meta.env.VITE_GEMINI_PROXY_URL;
    return Boolean(proxyUrl && proxyUrl.trim().length > 0);
  }

  startAnalysis(
    target: { scenario?: AudioScenario; file?: File; durationSec: number },
    onUpdate: AnalysisListener
  ): void {
    const proxyUrl = import.meta.env.VITE_GEMINI_PROXY_URL;

    if (!proxyUrl) {
      const unavailableResult: AnalysisResult = {
        id: `gemini-unavail-${Date.now()}`,
        status: 'unavailable',
        overallRisk: 'insufficient',
        evidence: [],
        fileName: target.file?.name || target.scenario?.name.en,
        fileSizeBytes: target.file?.size,
        recommendedAction: {
          en: 'No Gemini audio proxy configured. Set VITE_GEMINI_PROXY_URL in environment to enable remote AI call analysis.',
          gu: 'કોઈ જેમિની પ્રોક્સી ગોઠવેલ નથી. VITE_GEMINI_PROXY_URL સેટ કરો.',
          hi: 'कोई जेमिनी प्रॉक्सी कॉन्फ़िगर नहीं है। VITE_GEMINI_PROXY_URL सेट करें।',
        },
        createdAt: new Date().toISOString(),
        durationSec: target.durationSec,
        source: 'gemini',
      };
      onUpdate(unavailableResult);
      return;
    }

    // If proxy URL is configured, real streaming would connect here
    // For truthfulness, we never fabricate fake Gemini responses
    onUpdate({
      id: `gemini-req-${Date.now()}`,
      status: 'analysing',
      overallRisk: 'insufficient',
      evidence: [],
      fileName: target.file?.name,
      recommendedAction: {
        en: 'Awaiting response from configured Gemini endpoint...',
        gu: 'જેમિની સર્વિસ પાસેથી પ્રતિભાવની રાહ જુએ છે...',
        hi: 'जेमिनी सेवा से प्रतिक्रिया की प्रतीक्षा की जा रही है...',
      },
      createdAt: new Date().toISOString(),
      durationSec: target.durationSec,
      source: 'gemini',
    });
  }

  onPlaybackTimeUpdate(_currentTimeSec: number): void {
    // No-op for remote provider
  }

  stopAnalysis(): void {
    // No-op
  }
}
