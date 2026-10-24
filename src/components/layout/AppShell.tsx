/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  FileSearch,
  BookOpen,
  Menu,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { EvidenceDrawer } from '../analysis/EvidenceDrawer';
import { useAppStore } from '../../store/useAppStore';

export const AppShell: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const activeDrawerEvidence = useAppStore((state) => state.activeDrawerEvidence);
  const openEvidenceDrawer = useAppStore((state) => state.openEvidenceDrawer);
  const setPlaybackTime = useAppStore((state) => state.setPlaybackTime);

  const mobileBottomNavItems = [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/analysis', label: 'Analysis', icon: <ShieldAlert className="w-5 h-5" /> },
    { to: '/evidence', label: 'Evidence', icon: <FileSearch className="w-5 h-5" /> },
    { to: '/scenarios', label: 'Scams', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-[#FFFFFF] flex flex-col font-sans">
      {/* Skip-to-content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-[#A855F7] focus:text-white focus:font-bold focus:rounded-lg"
      >
        Skip to main content
      </a>

      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Desktop Sidebar */}
        <Sidebar className="hidden md:flex" />

        {/* Mobile Slide-Over Drawer */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-xs flex"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#030712] shadow-2xl">
              <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} className="w-full h-full" />
            </div>
            <div
              className="flex-1"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          <main
            id="main-content"
            className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8"
          >
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (compact, <= 15% viewport height) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#030712]/95 backdrop-blur-md border-t border-[#1F2937] px-3 flex items-center justify-around z-40"
      >
        {mobileBottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-[#A855F7] font-bold' : 'text-[#9AA6BC]'
              }`
            }
          >
            {item.icon}
            <span className="mt-0.5">{item.label}</span>
          </NavLink>
        ))}

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-[11px] font-medium text-[#9AA6BC]"
          aria-label="More navigation options"
        >
          <Menu className="w-5 h-5" />
          <span className="mt-0.5">More</span>
        </button>
      </nav>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Global Evidence Deep Dive Drawer */}
      <EvidenceDrawer
        evidence={activeDrawerEvidence}
        onClose={() => openEvidenceDrawer(null)}
        onSeekToAudio={(time) => {
          setPlaybackTime(time);
        }}
      />
    </div>
  );
};
