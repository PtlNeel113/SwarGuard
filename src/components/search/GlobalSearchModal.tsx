/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FileSearch,
  BookOpen,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  Play,
  ArrowRight,
  X,
  Globe,
  Loader2,
  Sparkles,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../../data/fixtures/scenarios';
import { useAppStore } from '../../store/useAppStore';
import { exportForensicReportPDF } from '../../utils/pdfExport';

export interface HelpArticle {
  id: string;
  title: string;
  category: 'Legal' | 'Helpline' | 'RBI Policy' | 'Prevention';
  summary: string;
  officialSource: string;
  url: string;
  tags: string[];
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'art-1930',
    title: 'National Cyber Crime Helpline (1930) & Golden Hour Protocol',
    category: 'Helpline',
    summary:
      'Reporting telephonic financial fraud within 1-2 hours triggers the citizen financial fraud freeze mechanism across Indian banking networks and payment gateways.',
    officialSource: 'Indian Cybercrime Coordination Centre (I4C), MHA',
    url: 'https://cybercrime.gov.in',
    tags: ['1930', 'helpline', 'golden hour', 'freeze', 'bank'],
  },
  {
    id: 'art-digital-arrest',
    title: 'Why "Digital Arrest" is 100% Illegal & Fictitious in India',
    category: 'Legal',
    summary:
      'Neither the Code of Criminal Procedure nor the Bharatiya Nagarik Suraksha Sanhita (BNSS) allows arrest via Skype, WhatsApp, or video calls. Police cannot demand money deposits for clearance.',
    officialSource: 'CBI & Ministry of Home Affairs Official Warning',
    url: 'https://pib.gov.in',
    tags: ['digital arrest', 'cbi', 'police', 'skype', 'video call', 'extortion'],
  },
  {
    id: 'art-rbi-zero-liability',
    title: 'RBI Master Circular on Unauthorized Electronic Banking Transactions',
    category: 'RBI Policy',
    summary:
      'Customer liability is zero if fraud is notified to the bank within three working days where unauthorized transactions are due to third-party breach or phishing without negligence.',
    officialSource: 'Reserve Bank of India (RBI/2017-18/15)',
    url: 'https://rbi.org.in',
    tags: ['rbi', 'zero liability', 'refund', 'unauthorized', 'otp'],
  },
  {
    id: 'art-courier-narcotics',
    title: 'Customs & Courier Contraband Scam Defense (FedEx / DHL)',
    category: 'Prevention',
    summary:
      'Customs officials never demand fines via UPI or private bank accounts over telephone. Legitimate summons are issued in physical writing with official dispatch references.',
    officialSource: 'Central Board of Indirect Taxes & Customs (CBIC)',
    url: 'https://cbic.gov.in',
    tags: ['customs', 'courier', 'contraband', 'narcotics', 'dhl', 'fedex'],
  },
  {
    id: 'art-voice-deepfakes',
    title: 'Family Emergency & AI Voice Cloning Bail Impersonation',
    category: 'Prevention',
    summary:
      'Always hang up and call back your family member or their friends directly on known numbers. Establish a private family passphrase that an AI synthetic clone cannot guess.',
    officialSource: 'CERT-In Cyber Advisory',
    url: 'https://cert-in.org.in',
    tags: ['deepfake', 'voice clone', 'bail', 'family emergency', 'passphrase'],
  },
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'evidence' | 'scenarios' | 'articles' | 'web'>('all');

  // Web grounded search state
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [groundedResult, setGroundedResult] = useState<{
    text: string;
    sources: { title: string; url: string }[];
  } | null>(null);

  const selectScenario = useAppStore((state) => state.selectScenario);
  const openEvidenceDrawer = useAppStore((state) => state.openEvidenceDrawer);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Extract all evidence items across all scenarios
  const allEvidence = useMemo(() => {
    const items: Array<{
      id: string;
      scenarioName: string;
      scenarioId: string;
      category: string;
      quote: string;
      reason: string;
      timestampSec: number;
      severity: string;
    }> = [];

    DEMO_SCENARIOS.forEach((sc) => {
      sc.indicators.forEach((ind) => {
        items.push({
          id: ind.id,
          scenarioName: sc.name.en,
          scenarioId: sc.id,
          category: ind.category,
          quote: ind.phrase || 'Coercive telephonic marker',
          reason: ind.explanation.en,
          timestampSec: ind.startSec,
          severity: ind.riskLevel,
        });
      });
    });

    return items;
  }, []);

  // Filtered Evidence
  const filteredEvidence = useMemo(() => {
    if (!query.trim()) return allEvidence.slice(0, 6);
    const q = query.toLowerCase();
    return allEvidence.filter(
      (ev) =>
        ev.quote.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q) ||
        ev.reason.toLowerCase().includes(q) ||
        ev.scenarioName.toLowerCase().includes(q)
    );
  }, [allEvidence, query]);

  // Filtered Scenarios
  const filteredScenarios = useMemo(() => {
    if (!query.trim()) return DEMO_SCENARIOS;
    const q = query.toLowerCase();
    return DEMO_SCENARIOS.filter(
      (sc) =>
        sc.name.en.toLowerCase().includes(q) ||
        sc.subtitle.en.toLowerCase().includes(q) ||
        sc.category.toLowerCase().includes(q) ||
        sc.description.en.toLowerCase().includes(q)
    );
  }, [query]);

  // Filtered Help Articles
  const filteredArticles = useMemo(() => {
    if (!query.trim()) return HELP_ARTICLES;
    const q = query.toLowerCase();
    return HELP_ARTICLES.filter(
      (art) =>
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  // Trigger Grounded Search using gemini-3.8-flash
  const handlePerformGroundedSearch = async () => {
    if (!query.trim()) return;
    setIsSearchingWeb(true);
    setActiveTab('web');
    try {
      const res = await fetch('/api/gemini/grounded-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (res.ok) {
        setGroundedResult(data);
      } else {
        setGroundedResult({
          text: data.error || 'Failed to fetch search intelligence.',
          sources: [],
        });
      }
    } catch (err: any) {
      setGroundedResult({
        text: 'Network error communicating with threat intelligence service.',
        sources: [],
      });
    } finally {
      setIsSearchingWeb(false);
    }
  };

  const handleLaunchScenario = (sc: (typeof DEMO_SCENARIOS)[0]) => {
    selectScenario(sc);
    navigate('/analysis');
    onClose();
  };

  const handleExportEvidenceReport = (ev: (typeof allEvidence)[0]) => {
    exportForensicReportPDF({
      caseId: `EV-${ev.id.toUpperCase()}`,
      scenarioName: ev.scenarioName,
      timestamp: new Date().toLocaleString('en-IN'),
      overallRisk: 'high',
      riskScore: 820,
      durationSec: 45,
      summary: `Specific threat marker identified in ${ev.scenarioName}: "${ev.quote}". Classified under category: ${ev.category}. Reason: ${ev.reason}.`,
      indicators: [
        {
          id: ev.id,
          timestampSec: ev.timestampSec,
          category: ev.category,
          quote: ev.quote,
          reason: ev.reason,
          severity: ev.severity as any,
          confidence: 94,
        },
      ],
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Global Cyber Threat & Evidence Search"
    >
      <div className="w-full max-w-3xl rounded-2xl bg-[#111827] border border-[#1F2937] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Header Bar with Purple Brand Glow */}
        <div className="p-4 border-b border-[#1F2937] bg-[#030712] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#A855F7]/20 border border-[#A855F7]/40 flex items-center justify-center text-[#A855F7]">
            <Search className="w-5 h-5" />
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePerformGroundedSearch();
                }
              }}
              placeholder="Search past evidence, call scenarios, legal help articles or press Enter to ground-search web..."
              className="w-full bg-transparent text-[#FFFFFF] placeholder-[#9AA6BC] text-sm focus:outline-none pr-10"
              autoFocus
            />
          </div>

          {/* Web Ground Search Button */}
          <button
            onClick={handlePerformGroundedSearch}
            disabled={isSearchingWeb || !query.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] disabled:opacity-50 text-xs font-semibold text-white shadow-md shadow-[#A855F7]/20 transition-all cursor-pointer"
            title="Search Google Grounded Live Threat Intelligence via gemini-3.8-flash"
          >
            {isSearchingWeb ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Web Intel</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9AA6BC] hover:text-[#FFFFFF] rounded-lg hover:bg-[#1F2937]"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters Bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1F2937] bg-[#111827] text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#A855F7] text-white shadow-xs'
                : 'text-[#9AA6BC] hover:text-[#FFFFFF] hover:bg-[#1F2937]'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-[#A855F7] text-white'
                : 'text-[#9AA6BC] hover:text-[#FFFFFF] hover:bg-[#1F2937]'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Past Evidence ({filteredEvidence.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'scenarios'
                ? 'bg-[#A855F7] text-white'
                : 'text-[#9AA6BC] hover:text-[#FFFFFF] hover:bg-[#1F2937]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Call Scenarios ({filteredScenarios.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-[#A855F7] text-white'
                : 'text-[#9AA6BC] hover:text-[#FFFFFF] hover:bg-[#1F2937]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Articles ({filteredArticles.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('web');
              if (!groundedResult && query.trim()) {
                handlePerformGroundedSearch();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'web'
                ? 'bg-[#A855F7] text-white'
                : 'text-[#9AA6BC] hover:text-[#FFFFFF] hover:bg-[#1F2937]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google Grounded Intel</span>
          </button>
        </div>

        {/* Scrollable Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Web Grounded Intelligence View */}
          {activeTab === 'web' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#030712] border border-[#1F2937]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#A855F7]">
                    <Sparkles className="w-4 h-4" />
                    <span>Real-Time Web Grounded Intelligence (gemini-3.8-flash)</span>
                  </div>
                  <span className="text-[10px] text-[#9AA6BC] font-mono">Google Search Grounded</span>
                </div>

                {isSearchingWeb ? (
                  <div className="py-8 text-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#A855F7] mx-auto" />
                    <p className="text-xs text-[#9AA6BC]">
                      Querying live government advisories, cybercrime warnings, and bank circulars...
                    </p>
                  </div>
                ) : groundedResult ? (
                  <div className="space-y-3">
                    <div className="text-xs text-[#FFFFFF] leading-relaxed whitespace-pre-line">
                      {groundedResult.text}
                    </div>

                    {groundedResult.sources && groundedResult.sources.length > 0 && (
                      <div className="pt-2 border-t border-[#1F2937] space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9AA6BC]">
                          Verified Web Citations & Sources:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {groundedResult.sources.map((s, idx) => (
                            <a
                              key={idx}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1F2937] hover:bg-[#374151] text-[11px] text-[#0EA5E9] hover:underline"
                            >
                              <span>{s.title}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-[#9AA6BC]">
                    Enter a scam topic (e.g. "digital arrest police video call" or "fedex parcel parcel") and click "Web Intel" to retrieve live advisories.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 1: Past Evidence Items */}
          {(activeTab === 'all' || activeTab === 'evidence') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#9AA6BC]">
                <span>Threat Evidence Database</span>
                <span className="text-[11px] font-mono text-[#A855F7]">
                  {filteredEvidence.length} matches
                </span>
              </div>

              {filteredEvidence.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#9AA6BC] bg-[#030712] rounded-xl border border-[#1F2937]">
                  No past evidence items matched "{query}".
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredEvidence.slice(0, activeTab === 'all' ? 3 : 15).map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl bg-[#030712] border border-[#1F2937] hover:border-[#A855F7]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30">
                            {ev.category.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs font-semibold text-[#FFFFFF]">
                            {ev.scenarioName}
                          </span>
                          <span className="text-[10px] text-[#9AA6BC] font-mono">
                            @{ev.timestampSec}s
                          </span>
                        </div>
                        <p className="text-xs text-[#9AA6BC] italic">"{ev.quote}"</p>
                        <p className="text-[11px] text-[#64748B]">{ev.reason}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleExportEvidenceReport(ev)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1F2937] hover:bg-[#374151] text-xs font-medium text-[#FFFFFF] transition-colors cursor-pointer"
                          title="Export Structured Forensic PDF Report"
                        >
                          <Download className="w-3.5 h-3.5 text-[#0EA5E9]" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                        <button
                          onClick={() => {
                            const sc = DEMO_SCENARIOS.find((s) => s.id === ev.scenarioId);
                            if (sc) {
                              selectScenario(sc);
                              navigate('/analysis');
                              onClose();
                            }
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-xs font-semibold text-white transition-colors cursor-pointer"
                        >
                          <span>Analyze</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 2: Call Scenarios */}
          {(activeTab === 'all' || activeTab === 'scenarios') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#9AA6BC]">
                <span>Call Safety Scenarios</span>
                <span className="text-[11px] font-mono text-[#3B82F6]">
                  {filteredScenarios.length} cases
                </span>
              </div>

              {filteredScenarios.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#9AA6BC] bg-[#030712] rounded-xl border border-[#1F2937]">
                  No call scenarios matched "{query}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredScenarios.slice(0, activeTab === 'all' ? 4 : 10).map((sc) => {
                    const isHigh = sc.expected === 'high';
                    return (
                      <div
                        key={sc.id}
                        onClick={() => handleLaunchScenario(sc)}
                        className="p-3 rounded-xl bg-[#030712] border border-[#1F2937] hover:border-[#3B82F6]/50 transition-colors cursor-pointer flex items-start justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {isHigh ? (
                              <ShieldAlert className="w-4 h-4 text-[#EC4899] shrink-0" />
                            ) : (
                              <Play className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                            )}
                            <h5 className="text-xs font-bold text-[#FFFFFF] line-clamp-1">
                              {sc.name.en}
                            </h5>
                          </div>
                          <p className="text-[11px] text-[#9AA6BC] line-clamp-2">
                            {sc.subtitle.en}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-[#A855F7] bg-[#1F2937] px-1.5 py-0.5 rounded shrink-0">
                          {sc.durationSec}s
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Section 3: Legal & Help Articles */}
          {(activeTab === 'all' || activeTab === 'articles') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#9AA6BC]">
                <span>Legal Guidance & Citizen Protection Articles</span>
                <span className="text-[11px] font-mono text-[#0EA5E9]">
                  {filteredArticles.length} guides
                </span>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#9AA6BC] bg-[#030712] rounded-xl border border-[#1F2937]">
                  No help articles matched "{query}".
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredArticles.map((art) => (
                    <div
                      key={art.id}
                      className="p-3.5 rounded-xl bg-[#030712] border border-[#1F2937] hover:border-[#0EA5E9]/40 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#0EA5E9]/15 text-[#0EA5E9]">
                            {art.category}
                          </span>
                          <h5 className="text-xs font-bold text-[#FFFFFF]">{art.title}</h5>
                        </div>
                        <a
                          href={art.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#0EA5E9] hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-[#9AA6BC] leading-relaxed">{art.summary}</p>
                      <div className="text-[10px] text-[#64748B]">
                        Source: {art.officialSource}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-[#030712] border-t border-[#1F2937] flex items-center justify-between text-[11px] text-[#9AA6BC]">
          <span>Tip: Press Enter to run Google Search Grounding with gemini-3.8-flash</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
