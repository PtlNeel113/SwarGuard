/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActivityLogItem } from '../../types';

export const SAMPLE_ACTIVITY_HISTORY: ActivityLogItem[] = [
  {
    id: 'sample-act-1',
    type: 'threat_detected',
    title: 'Digital Arrest Threat Identified',
    description: 'Simulated call flagged 3 high-risk markers: authority impersonation, virtual custody demand, and escrow payment.',
    timestamp: '2 hours ago',
    isSession: false,
    riskLevel: 'high',
  },
  {
    id: 'sample-act-2',
    type: 'threat_detected',
    title: 'Bank KYC Urgent Suspension Blocked',
    description: 'Artificial urgency and OTP harvesting intent detected at 00:16 timestamp.',
    timestamp: 'Yesterday',
    isSession: false,
    riskLevel: 'high',
  },
  {
    id: 'sample-act-3',
    type: 'safe_cleared',
    title: 'Broadband Service Query Verified',
    description: 'Routine call confirmed: no coercive language or credential requests present. Safety disclaimer provided.',
    timestamp: '2 days ago',
    isSession: false,
    riskLevel: 'low',
  },
];
