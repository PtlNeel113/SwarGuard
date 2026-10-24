/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult, AudioScenario } from '../../types';

export type AnalysisListener = (result: AnalysisResult) => void;

export interface AnalysisProvider {
  readonly id: string;
  readonly name: string;
  readonly isAvailable: boolean;

  /**
   * Starts or attaches an analysis for a scenario or user-uploaded audio file.
   */
  startAnalysis(
    target: { scenario?: AudioScenario; file?: File; durationSec: number },
    onUpdate: AnalysisListener
  ): void;

  /**
   * Updates current playback position so the provider can emit synchronised results.
   */
  onPlaybackTimeUpdate(currentTimeSec: number): void;

  /**
   * Cancels active analysis stream.
   */
  stopAnalysis(): void;
}
