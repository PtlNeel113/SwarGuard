/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  BookOpen,
  X,
  Play,
  ArrowRight,
  AlertTriangle,
  FileText,
  PhoneOff,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FixtureTag } from '../components/ui/StatusBadge';
import { SCAM_LIBRARY } from '../data/fixtures/scamLibrary';
import { DEMO_SCENARIOS } from '../data/fixtures/scenarios';
import { ScamLibraryItem } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useI18n } from '../i18n/i18nContext';
import { formatCategoryLabel } from '../lib/formatters';

export const ScenariosPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const selectScenario = useAppStore((state) => state.selectScenario);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScamModal, setSelectedScamModal] = useState<ScamLibraryItem | null>(null);

  const filteredScams = SCAM_LIBRARY.filter((scam) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = scam.title[language] || scam.title.en;
    const summary = scam.summary[language] || scam.summary.en;
    return title.toLowerCase().includes(q) || summary.toLowerCase().includes(q);
  });

  const handleTryScenario = (item: ScamLibraryItem) => {
    const matchedScenario = DEMO_SCENARIOS.find((s) => s.id === item.scenarioId);
    if (matchedScenario) {
      selectScenario(matchedScenario);
      navigate('/analysis');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title={t('scenariosPage.title')}
        subtitle={t('scenariosPage.subtitle')}
        kicker="Citizen Threat Education"
        actions={<FixtureTag label="Educational Library" />}
      />

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-[#12192F] border border-[#263359] flex items-center gap-3">
        <Search className="w-4 h-4 text-[#9AA6BC]" />
        <input
          type="text"
          placeholder="Search scam types (Digital Arrest, KYC, Courier, Emergency...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-[#F6F3EC] placeholder-[#9AA6BC] focus:outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-[#9AA6BC] hover:text-[#F6F3EC]">
            Clear
          </button>
        )}
      </div>

      {/* 6 Scams Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredScams.map((scam) => {
          const hasRecording = Boolean(scam.scenarioId);
          const title = scam.title[language] || scam.title.en;
          const summary = scam.summary[language] || scam.summary.en;

          return (
            <Card
              key={scam.id}
              variant="base"
              interactive={true}
              onClick={() => setSelectedScamModal(scam)}
              className="flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-[#F2A65A] uppercase tracking-wider">
                    {formatCategoryLabel(scam.category)}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      scam.severity === 'critical'
                        ? 'bg-[#FF5B64]/10 text-[#FF5B64] border border-[#FF5B64]/30'
                        : 'bg-[#F2A65A]/10 text-[#F2A65A] border border-[#F2A65A]/30'
                    }`}
                  >
                    {scam.severity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F6F3EC] mb-2 leading-snug">
                  {title}
                </h3>

                <p className="text-xs text-[#9AA6BC] line-clamp-3 leading-relaxed">
                  {summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#263359] flex items-center justify-between text-xs">
                <span className="text-[#9AA6BC]">
                  {hasRecording ? 'Synthetic recording ready' : 'Educational dossier'}
                </span>
                <span className="text-[#F2A65A] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Scam Breakdown Modal */}
      {selectedScamModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-[#12192F] border border-[#263359] shadow-2xl overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#263359]">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#F2A65A] mb-1">
                  {formatCategoryLabel(selectedScamModal.category)}
                </div>
                <h2 className="text-xl font-extrabold text-[#F6F3EC]">
                  {selectedScamModal.title[language] || selectedScamModal.title.en}
                </h2>
              </div>
              <button
                onClick={() => setSelectedScamModal(null)}
                className="text-[#9AA6BC] hover:text-[#F6F3EC] p-1.5 rounded-lg hover:bg-[#171F3A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* How It Begins */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA6BC] mb-1.5">
                {t('scenariosPage.howItBegins')}
              </h4>
              <p className="text-xs text-[#F6F3EC] bg-[#0B1020] p-3 rounded-lg border border-[#263359] leading-relaxed">
                {selectedScamModal.howItBegins[language] || selectedScamModal.howItBegins.en}
              </p>
            </div>

            {/* Manipulation Techniques */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF5B64] mb-2">
                {t('scenariosPage.techniques')}
              </h4>
              <ul className="space-y-1.5 text-xs text-[#F6F3EC]">
                {(
                  selectedScamModal.manipulationTechniques[language] ||
                  selectedScamModal.manipulationTechniques.en
                ).map((tech, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#FF5B64] font-bold">•</span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning Signs */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F2A65A] mb-2">
                {t('scenariosPage.warningSigns')}
              </h4>
              <ul className="space-y-1.5 text-xs text-[#F6F3EC]">
                {(
                  selectedScamModal.warningSigns[language] ||
                  selectedScamModal.warningSigns.en
                ).map((sign, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#F2A65A] font-bold">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fictional Dialogue Snippet */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA6BC]">
                  {t('scenariosPage.fictionalSnippet')}
                </h4>
                <FixtureTag label="Fictional dialogue" />
              </div>
              <div className="space-y-2 bg-[#0B1020] p-4 rounded-xl border border-[#263359]">
                {selectedScamModal.fictionalDialogue.map((d, idx) => (
                  <div key={idx} className="text-xs leading-relaxed">
                    <span className="font-bold text-[#F2A65A] block">{d.speaker}:</span>
                    <span className="text-[#F6F3EC] italic font-mono">
                      "{d[language] || d.en}"
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#9AA6BC] mt-1.5 italic">
                Never claim a phrase alone proves fraud; evaluation must be grounded in multi-factor context.
              </p>
            </div>

            {/* Safe Response Protocol */}
            <div className="p-4 rounded-xl bg-[#171F3A] border border-[#56D6C2]/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#56D6C2] mb-1">
                {t('scenariosPage.safeAction')}
              </h4>
              <p className="text-xs text-[#F6F3EC] leading-relaxed font-medium">
                {selectedScamModal.safeResponse[language] || selectedScamModal.safeResponse.en}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#263359] flex items-center justify-end gap-3">
              <Button variant="outline" size="md" onClick={() => setSelectedScamModal(null)}>
                Close
              </Button>

              {selectedScamModal.scenarioId ? (
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Play className="w-4 h-4 fill-current" />}
                  onClick={() => handleTryScenario(selectedScamModal)}
                >
                  {t('scenariosPage.tryButton')}
                </Button>
              ) : (
                <span className="text-xs text-[#9AA6BC] italic">
                  Recording not available (Educational dossier only)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
