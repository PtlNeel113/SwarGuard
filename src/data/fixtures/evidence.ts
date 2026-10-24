/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EvidenceIndicator } from '../../types';
import { DEMO_SCENARIOS } from './scenarios';

// Aggregate all indicators from demo scenarios and additional verified sample catalog
export const ALL_SAMPLE_EVIDENCE: EvidenceIndicator[] = DEMO_SCENARIOS.flatMap((s) => s.indicators);
