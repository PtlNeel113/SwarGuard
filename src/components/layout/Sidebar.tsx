/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  FileSearch,
  BookOpen,
  CheckCircle2,
  Languages,
  BarChart3,
  FlaskConical,
  Lock,
  Settings,
  HelpCircle,
  Bot,
  Microscope,
  LogOut,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';
import { useFirebaseAuth } from '../../features/auth/useFirebaseAuth';
import { useAppStore } from '../../store/useAppStore';

interface SidebarProps {
  onCloseMobile?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile, className = '' }) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user, signOut } = useFirebaseAuth();
  const exitDemoSession = useAppStore((state) => state.exitDemoSession);

  const handleLogout = async () => {
    if (user) {
      await signOut();
    }
    exitDemoSession();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'General',
      items: [
        { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { to: '/analysis', label: 'Forensic Analysis', icon: <ShieldAlert className="w-4 h-4" /> },
        { to: '/evidence', label: 'Threat Evidence', icon: <FileSearch className="w-4 h-4" /> },
        { to: '/ai-assistant', label: 'Gemini AI Hub', icon: <Bot className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Reports & Science',
      items: [
        { to: '/scenarios', label: 'Scam Scenarios', icon: <BookOpen className="w-4 h-4" /> },
        { to: '/science-lab', label: 'Acoustic Science Lab', icon: <Microscope className="w-4 h-4 text-[#A855F7]" /> },
        { to: '/safe-check', label: 'Safe Call Benchmark', icon: <CheckCircle2 className="w-4 h-4" /> },
        { to: '/insights', label: 'Threat Insights', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Settings',
      items: [
        { to: '/language', label: 'Language Guardian', icon: <Languages className="w-4 h-4" /> },
        { to: '/test-lab', label: 'Verification Lab', icon: <FlaskConical className="w-4 h-4" /> },
        { to: '/privacy', label: 'Help & Privacy', icon: <Lock className="w-4 h-4" /> },
        { to: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside
      className={`w-64 bg-[#030712] border-r border-[#1F2937] flex flex-col justify-between shrink-0 select-none ${className}`}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1F2937]">
          <NavLink to="/dashboard" onClick={onCloseMobile} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#A855F7] to-[#EC4899] flex items-center justify-center text-white shadow-md shadow-[#A855F7]/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-[#FFFFFF] flex items-center gap-1">
                <span>SwarGuard</span>
                <span className="text-[#A855F7] font-mono text-xs">SOC</span>
              </div>
              <div className="text-[10px] text-[#9AA6BC] font-medium leading-none">
                AI Voice Fraud Defense
              </div>
            </div>
          </NavLink>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-5">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                {sec.title}
              </div>
              {sec.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#A855F7] text-white shadow-lg shadow-[#A855F7]/25 font-bold'
                        : 'text-[#9AA6BC] hover:text-[#FFFFFF] hover:bg-[#111827]'
                    }`
                  }
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Promo Upgrade Card & Logout */}
      <div className="p-3 border-t border-[#1F2937] space-y-2.5 bg-[#030712]">
        {/* Upgrade / SOC Enhancement Card matching reference image */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] border border-[#A855F7]/30 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#A855F7]/20 flex items-center justify-center text-[#A855F7]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-white">Live Protection</span>
          </div>
          <p className="text-[10px] text-[#9AA6BC] leading-snug mb-2">
            Additional features to enhance your voice security.
          </p>
          <button
            onClick={() => navigate('/ai-assistant')}
            className="flex items-center gap-1 text-[11px] font-bold text-[#A855F7] hover:text-[#C084FC] transition-colors cursor-pointer"
          >
            <span>Live Voice SOS</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Log Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#9AA6BC] hover:text-[#EC4899] hover:bg-[#111827] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{user ? 'Log Out' : 'Exit Sandbox'}</span>
        </button>
      </div>
    </aside>
  );
};
