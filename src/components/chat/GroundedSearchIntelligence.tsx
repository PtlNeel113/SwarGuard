/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  Sparkles,
  Loader2,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  'Latest CBI warning on digital arrest video call fraud',
  'RBI circular on refund for unauthorized OTP transactions',
  'TRAI advisory on +92 and international spoofed calls',
  'Indian Cybercrime 1930 golden hour money recovery process',
];

export const GroundedSearchIntelligence: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    sources: { title: string; url: string }[];
    searchQueries: string[];
  } | null>(null);

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;
    setIsLoading(true);
    setQuery(q);

    try {
      const res = await fetch('/api/gemini/grounded-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setResult({
          text: data.error || 'Failed to fetch grounded intelligence from Gemini.',
          sources: [],
          searchQueries: [],
        });
      }
    } catch (err: any) {
      setResult({
        text: 'Network error connecting to search grounding service.',
        sources: [],
        searchQueries: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1F2937]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#A855F7]/20 text-[#A855F7]">
              <Globe className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7]">
              Google Search Grounding Engine
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#FFFFFF]">
            Live Cybercrime Grounded Intelligence (gemini-3.8-flash)
          </h3>
          <p className="text-xs text-[#9AA6BC]">
            Directly queries up-to-date Indian government advisories (I4C, CERT-In, RBI, CBI) using Google Search Grounding.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-[#030712] border border-[#1F2937] text-xs font-mono text-[#0EA5E9] shrink-0">
          tools: [googleSearch]
        </span>
      </div>

      {/* Search Input Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#9AA6BC] absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="Ask for latest scams, police advisories, legal rights, or bank guidelines..."
              className="w-full bg-[#030712] border border-[#1F2937] focus:border-[#A855F7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#9AA6BC] focus:outline-none"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={isLoading || !query.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] disabled:opacity-50 text-xs font-semibold text-white shadow-md shadow-[#A855F7]/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Ground-Search</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-[11px] text-[#9AA6BC] py-1">Quick prompts:</span>
          {SUGGESTED_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => handleSearch(q)}
              className="px-2.5 py-1 rounded-lg bg-[#030712] hover:bg-[#1F2937] text-[11px] text-[#9AA6BC] hover:text-[#FFFFFF] border border-[#1F2937] transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {isLoading ? (
        <div className="py-12 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#A855F7] mx-auto" />
          <p className="text-xs text-[#9AA6BC]">
            Querying Google Search Grounding with gemini-3.8-flash for official advisories...
          </p>
        </div>
      ) : result ? (
        <div className="p-5 rounded-2xl bg-[#030712] border border-[#1F2937] space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#A855F7]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0EA5E9]" />
              <span>Grounded Response Briefing</span>
            </div>
            <span className="text-[10px] text-[#9AA6BC] font-mono">Real-time Verified</span>
          </div>

          <div className="text-xs text-[#FFFFFF] leading-relaxed whitespace-pre-line space-y-2">
            {result.text}
          </div>

          {result.sources && result.sources.length > 0 && (
            <div className="pt-3 border-t border-[#1F2937] space-y-2">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#9AA6BC]">
                Authoritative Citations & Web Grounding Sources:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#A855F7]/40 flex items-center justify-between gap-2 text-xs text-[#0EA5E9] hover:underline"
                  >
                    <span className="truncate">{src.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-[#030712] border border-[#1F2937] text-xs text-[#9AA6BC] space-y-1">
          <Globe className="w-8 h-8 text-[#A855F7]/40 mx-auto mb-2" />
          <p className="font-semibold text-white">No query initiated yet</p>
          <p>Type a cyber fraud topic or click one of the suggested prompts above to retrieve live advisories.</p>
        </div>
      )}
    </div>
  );
};
