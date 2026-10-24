/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { AcousticScienceLab } from '../components/science/AcousticScienceLab';

export const ScienceLabPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Acoustic Science & Vocal Biomarker Lab"
        subtitle="Biophysical speech science, formant spectroscopy ($F_1, F_2, F_3$), glottal pulse jitter/shimmer, and peer-reviewed literature from Europe PMC."
        kicker="Biophysical Acoustic Forensics"
      />
      <AcousticScienceLab />
    </div>
  );
};
