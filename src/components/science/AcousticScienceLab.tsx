/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  BookOpen,
  ExternalLink,
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  Radio,
  Microscope,
  Info,
  Loader2,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ScientificPaper {
  id: string;
  title: string;
  authorString: string;
  journalTitle: string;
  pubYear: string;
  doi: string;
  citedByCount: number;
  isOpenAccess: boolean;
  abstractText?: string;
}

export const AcousticScienceLab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('voice deepfake acoustic biometric detection');
  const [papers, setPapers] = useState<ScientificPaper[]>([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState(false);
  const [activeFormantTest, setActiveFormantTest] = useState<'synthetic' | 'natural'>('synthetic');

  // Simulated real-time vocal biomarker metrics
  const biomarkerData = {
    synthetic: {
      f0: 138.2, // Hz
      jitter: 0.12, // % (abnormally low jitter = synthetic vocoder signature)
      shimmer: 0.85, // % (unnatural amplitude stability)
      hnr: 28.4, // dB
      f1: 520, // Hz
      f2: 1740, // Hz
      f3: 2650, // Hz
      spectralRolloff: 3800, // Hz
      anomalyScore: 92, // % synthetic likelihood
    },
    natural: {
      f0: 142.6, // Hz
      jitter: 0.68, // % (healthy human micro-tremor)
      shimmer: 2.34, // % (natural glottal dynamics)
      hnr: 21.6, // dB
      f1: 580, // Hz
      f2: 1690, // Hz
      f3: 2580, // Hz
      spectralRolloff: 4200, // Hz
      anomalyScore: 8, // % synthetic likelihood
    },
  }[activeFormantTest];

  const fetchScientificPapers = async (query: string) => {
    setIsLoadingPapers(true);
    try {
      const res = await fetch(`/api/science/literature?q=${encodeURIComponent(query)}&pageSize=6`);
      const data = await res.json();
      if (res.ok && data.papers) {
        setPapers(data.papers);
      }
    } catch (err) {
      console.error('Failed to load scientific literature:', err);
    } finally {
      setIsLoadingPapers(false);
    }
  };

  useEffect(() => {
    fetchScientificPapers(searchQuery);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#A855F7]/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#A855F7]/20 text-[#A855F7]">
                <Microscope className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7]">
                Science Skills & Forensic Acoustic Lab
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#FFFFFF]">
              Acoustic Phonetics & Vocal Biomarker Spectroscopy
            </h2>
            <p className="text-xs text-[#9AA6BC] max-w-2xl leading-relaxed">
              Biophysical vocal tract resonance analysis ($F_1, F_2, F_3$), glottal pulse jitter/shimmer estimation, and peer-reviewed forensic literature integration via Europe PMC.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFormantTest('synthetic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFormantTest === 'synthetic'
                  ? 'bg-[#EC4899] text-white shadow-md shadow-[#EC4899]/20'
                  : 'bg-[#1F2937] text-[#9AA6BC] hover:text-white'
              }`}
            >
              Synthetic Vocoder Sample
            </button>
            <button
              onClick={() => setActiveFormantTest('natural')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFormantTest === 'natural'
                  ? 'bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/20'
                  : 'bg-[#1F2937] text-[#9AA6BC] hover:text-white'
              }`}
            >
              Natural Human Baseline
            </button>
          </div>
        </div>
      </div>

      {/* Acoustic Biomarker Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#9AA6BC] uppercase">Pitch Jitter (F0)</span>
            <Activity className="w-3.5 h-3.5 text-[#A855F7]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#FFFFFF] tabular-nums">
            {biomarkerData.jitter}%
          </div>
          <p className="text-[10px] text-[#9AA6BC]">
            {biomarkerData.jitter < 0.2 ? 'Abnormally robotic (<0.2%)' : 'Natural human tremor (0.4-1.0%)'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#9AA6BC] uppercase">Amplitude Shimmer</span>
            <Zap className="w-3.5 h-3.5 text-[#EC4899]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#FFFFFF] tabular-nums">
            {biomarkerData.shimmer}%
          </div>
          <p className="text-[10px] text-[#9AA6BC]">
            Cycle-to-cycle glottal amplitude variation
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#9AA6BC] uppercase">Harmonic/Noise (HNR)</span>
            <Radio className="w-3.5 h-3.5 text-[#3B82F6]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#FFFFFF] tabular-nums">
            {biomarkerData.hnr} dB
          </div>
          <p className="text-[10px] text-[#9AA6BC]">
            Glottal turbulence vs vocal cord periodicity
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#9AA6BC] uppercase">Synthetic Probability</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#0EA5E9]" />
          </div>
          <div
            className={`text-2xl font-mono font-bold tabular-nums ${
              biomarkerData.anomalyScore > 50 ? 'text-[#EC4899]' : 'text-[#0EA5E9]'
            }`}
          >
            {biomarkerData.anomalyScore}%
          </div>
          <p className="text-[10px] text-[#9AA6BC]">
            Neural voice clone spectral artifact match
          </p>
        </div>
      </div>

      {/* Formants & Resonance Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
              <span>Vocal Tract Formants ($F_1, F_2, F_3$)</span>
            </h3>
            <span className="text-[11px] text-[#9AA6BC] font-mono">24kHz Acoustic FFT</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#9AA6BC]">Formant F1 (Pharyngeal Cavity Resonance):</span>
                <span className="font-mono text-[#A855F7] font-semibold">{biomarkerData.f1} Hz</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#030712] overflow-hidden">
                <div
                  className="h-full bg-[#A855F7] rounded-full transition-all duration-300"
                  style={{ width: `${(biomarkerData.f1 / 1000) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#9AA6BC]">Formant F2 (Oral Cavity & Tongue Position):</span>
                <span className="font-mono text-[#3B82F6] font-semibold">{biomarkerData.f2} Hz</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#030712] overflow-hidden">
                <div
                  className="h-full bg-[#3B82F6] rounded-full transition-all duration-300"
                  style={{ width: `${(biomarkerData.f2 / 3000) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#9AA6BC]">Formant F3 (Lip Rounding & Vocal Tract Length):</span>
                <span className="font-mono text-[#0EA5E9] font-semibold">{biomarkerData.f3} Hz</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#030712] overflow-hidden">
                <div
                  className="h-full bg-[#0EA5E9] rounded-full transition-all duration-300"
                  style={{ width: `${(biomarkerData.f3 / 4000) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#030712] border border-[#1F2937] text-xs text-[#9AA6BC] leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
            <p>
              In synthetic voice cloning (neural TTS/vocoders), formants exhibit unnaturally sharp spectral band transitions without human articulatory trajectory drift.
            </p>
          </div>
        </div>

        {/* Peer-Reviewed Scientific Literature Search (Europe PMC) */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0EA5E9]" />
              <h3 className="text-sm font-bold text-[#FFFFFF]">
                Europe PMC Peer-Reviewed Studies
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1F2937] text-[#9AA6BC] font-mono">
              Science Skill API
            </span>
          </div>

          {/* Search box */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchScientificPapers(searchQuery);
                  }
                }}
                placeholder="Search Europe PMC literature..."
                className="w-full bg-[#030712] border border-[#1F2937] focus:border-[#A855F7] rounded-xl px-3 py-2 text-xs text-white placeholder-[#9AA6BC] focus:outline-none"
              />
            </div>
            <button
              onClick={() => fetchScientificPapers(searchQuery)}
              disabled={isLoadingPapers}
              className="px-3 py-2 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isLoadingPapers ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Search</span>
            </button>
          </div>

          {/* Papers List */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {isLoadingPapers ? (
              <div className="py-8 text-center text-xs text-[#9AA6BC] space-y-2">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#A855F7]" />
                <p>Querying Europe PMC scientific citations...</p>
              </div>
            ) : papers.length > 0 ? (
              papers.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-[#030712] border border-[#1F2937] hover:border-[#0EA5E9]/40 transition-colors space-y-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-[#FFFFFF] line-clamp-1">{p.title}</h5>
                    <a
                      href={p.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0EA5E9] hover:underline text-[11px] shrink-0 flex items-center gap-0.5"
                    >
                      <span>Read</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[11px] text-[#9AA6BC] line-clamp-1">
                    {p.authorString} ({p.pubYear}) • {p.journalTitle}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-[#64748B]">
                    <span>Cited by {p.citedByCount}</span>
                    {p.isOpenAccess && (
                      <span className="text-[#0EA5E9] font-medium">• Open Access</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-[#9AA6BC]">
                No scientific papers found for this query.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
