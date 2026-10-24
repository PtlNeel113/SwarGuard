/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  ShieldAlert,
  FileText,
  BookOpen,
  CheckCircle2,
  Languages,
  BarChart3,
  FlaskConical,
  Lock,
  Settings,
  X,
  Play,
  Trash2,
  Bot,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { DEMO_SCENARIOS } from '../../data/fixtures/scenarios';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const selectScenario = useAppStore((state) => state.selectScenario);
  const clearDemoSession = useAppStore((state) => state.clearDemoSession);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const routes = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Gemini AI Hub & Voice Assistant', path: '/ai-assistant', icon: <Bot className="w-4 h-4 text-[#56D6C2]" /> },
    { label: 'Live Call Analysis', path: '/analysis', icon: <ShieldAlert className="w-4 h-4" /> },
    { label: 'Threat Evidence Catalog', path: '/evidence', icon: <FileText className="w-4 h-4" /> },
    { label: 'Scam Manipulation Library', path: '/scenarios', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Safe Call Benchmark', path: '/safe-check', icon: <CheckCircle2 className="w-4 h-4" /> },
    { label: 'Language Guardian', path: '/language', icon: <Languages className="w-4 h-4" /> },
    { label: 'Protection Insights', path: '/insights', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Acoustic Science & Vocal Biomarker Lab', path: '/science-lab', icon: <FlaskConical className="w-4 h-4 text-[#A855F7]" /> },
    { label: 'Verification Test Lab', path: '/test-lab', icon: <FlaskConical className="w-4 h-4" /> },
    { label: 'Privacy Architecture', path: '/privacy', icon: <Lock className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const filteredRoutes = routes.filter((r) =>
    r.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredScenarios = DEMO_SCENARIOS.filter((s) =>
    s.name.en.toLowerCase().includes(query.toLowerCase())
  );

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLaunchScenario = (scenario: (typeof DEMO_SCENARIOS)[0]) => {
    selectScenario(scenario);
    navigate('/analysis');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Quick Command Navigation"
    >
      <div className="w-full max-w-xl rounded-2xl bg-[#111827] border border-[#1F2937] shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1F2937] bg-[#030712]">
          <Search className="w-5 h-5 text-[#A855F7]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, scenarios, or actions... (Esc to close)"
            className="flex-1 bg-transparent text-sm text-[#FFFFFF] placeholder-[#9AA6BC] focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-[#9AA6BC] hover:text-[#FFFFFF] p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          <div className="text-[11px] font-bold text-[#9AA6BC] uppercase tracking-wider px-3 py-1.5">
            Navigation Routes
          </div>
          {filteredRoutes.map((r) => (
            <button
              key={r.path}
              onClick={() => handleNavigate(r.path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#FFFFFF] hover:bg-[#1F2937] hover:text-[#A855F7] transition-colors text-left cursor-pointer"
            >
              <span className="text-[#9AA6BC]">{r.icon}</span>
              <span>{r.label}</span>
            </button>
          ))}

          {filteredScenarios.length > 0 && (
            <>
              <div className="text-[11px] font-bold text-[#9AA6BC] uppercase tracking-wider px-3 py-1.5 mt-2">
                Launch Audio Scenarios
              </div>
              {filteredScenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleLaunchScenario(s)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#F6F3EC] hover:bg-[#171F3A] transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-[#F2A65A]" />
                    <span>{s.name.en}</span>
                  </div>
                  <span className="text-[10px] text-[#9AA6BC] uppercase font-mono">
                    {s.kind}
                  </span>
                </button>
              ))}
            </>
          )}

          <div className="text-[11px] font-bold text-[#9AA6BC] uppercase tracking-wider px-3 py-1.5 mt-2">
            Quick Actions
          </div>
          <button
            onClick={() => {
              navigate('/test-lab');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#F6F3EC] hover:bg-[#171F3A] transition-colors text-left"
          >
            <FlaskConical className="w-4 h-4 text-[#56D6C2]" />
            <span>Open Verification Test Lab</span>
          </button>
          <button
            onClick={() => {
              clearDemoSession();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#FF5B64] hover:bg-[#171F3A] transition-colors text-left"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset / Clear Demo Session</span>
          </button>
        </div>

        <div className="px-4 py-2 bg-[#0B1020] border-t border-[#263359] text-[11px] text-[#9AA6BC] flex items-center justify-between">
          <span>Tip: Press Ctrl+K anytime</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
