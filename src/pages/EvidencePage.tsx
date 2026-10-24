/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { EvidenceTable } from '../components/analysis/EvidenceTable';
import { ALL_SAMPLE_EVIDENCE } from '../data/fixtures/evidence';
import { DEMO_SCENARIOS } from '../data/fixtures/scenarios';
import { EvidenceCategory, RiskLevel, EvidenceIndicator } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useI18n } from '../i18n/i18nContext';
import { FixtureTag } from '../components/ui/StatusBadge';
import { Search, Filter, Play, Download } from 'lucide-react';
import { formatCategoryLabel } from '../lib/formatters';
import { exportForensicReportPDF } from '../utils/pdfExport';

export const EvidencePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const openEvidenceDrawer = useAppStore((state) => state.openEvidenceDrawer);
  const selectScenario = useAppStore((state) => state.selectScenario);
  const setPlaybackTime = useAppStore((state) => state.setPlaybackTime);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');

  const categories: EvidenceCategory[] = [
    'authority_impersonation',
    'threats',
    'artificial_urgency',
    'isolation',
    'credential_requests',
    'coercive_money_demands',
    'suspicious_kyc_claims',
    'suspicious_parcel_claims',
  ];

  // Filter evidence
  const filteredEvidence = ALL_SAMPLE_EVIDENCE.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedRisk !== 'all' && item.riskLevel !== selectedRisk) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPhrase = item.phrase?.toLowerCase().includes(q);
      const matchExp = item.explanation.en.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchPhrase && !matchExp && !matchCat) return false;
    }
    return true;
  });

  const handleSeekAndNavigate = (seconds: number) => {
    setPlaybackTime(seconds);
    navigate('/analysis');
  };

  const handleExportCatalogPDF = () => {
    exportForensicReportPDF({
      caseId: `EVID-CATALOG-${Date.now().toString().slice(-4)}`,
      scenarioName: 'Comprehensive Threat Evidence Repository',
      timestamp: new Date().toLocaleString('en-IN'),
      overallRisk: 'high',
      riskScore: 780,
      durationSec: 120,
      summary: `Export of ${filteredEvidence.length} cross-calibrated telephonic coercion indicators spanning authority impersonation, financial isolation, and extortion demands.`,
      indicators: filteredEvidence.map((ev) => ({
        id: ev.id,
        timestampSec: 0,
        category: ev.category,
        quote: ev.phrase || 'Exemplary threat phrase',
        reason: ev.explanation.en,
        severity: ev.riskLevel,
        confidence: 95,
      })),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title={t('evidencePage.title')}
        subtitle={t('evidencePage.subtitle')}
        kicker="Forensic Threat Repository"
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCatalogPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-xs font-semibold text-white shadow-md shadow-[#A855F7]/20 transition-all cursor-pointer"
              title="Export filtered evidence records into structured PDF report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Evidence PDF</span>
            </button>
            <FixtureTag label="Sample evidence catalog" />
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[#12192F] border border-[#263359] flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-4 h-4 text-[#9AA6BC] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search phrases, categories, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0B1020] border border-[#263359] text-xs text-[#F6F3EC] placeholder-[#9AA6BC] focus:outline-none focus:border-[#F2A65A]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#0B1020] border border-[#263359] text-xs text-[#F6F3EC] focus:outline-none focus:border-[#F2A65A]"
          >
            <option value="all">All Threat Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategoryLabel(cat)}
              </option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#0B1020] border border-[#263359] text-xs text-[#F6F3EC] focus:outline-none focus:border-[#F2A65A]"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Moderate Caution</option>
            <option value="low">Low Risk / Routine</option>
          </select>

          {(selectedCategory !== 'all' || selectedRisk !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedRisk('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#F2A65A] hover:underline px-2 py-1 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Evidence Table Component */}
      <EvidenceTable
        evidenceList={filteredEvidence}
        onSelectRow={(ev) => openEvidenceDrawer(ev)}
        onSeekAudio={handleSeekAndNavigate}
      />

      <div className="p-4 rounded-xl border border-[#263359] bg-[#0B1020] text-xs text-[#9AA6BC] flex items-center justify-between">
        <span>Showing {filteredEvidence.length} verified sample evidence records.</span>
        <span>Click any row to open forensic breakdown drawer.</span>
      </div>
    </div>
  );
};
