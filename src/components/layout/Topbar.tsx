/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  Settings,
  Shield,
  X,
  ExternalLink,
  User as UserIcon,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { StatusBadge } from '../ui/StatusBadge';
import { useAppStore } from '../../store/useAppStore';
import { useI18n } from '../../i18n/i18nContext';
import { useFirebaseAuth } from '../../features/auth/useFirebaseAuth';
import { GlobalSearchModal } from '../search/GlobalSearchModal';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  onOpenCommandPalette,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const exitDemoSession = useAppStore((state) => state.exitDemoSession);
  const activityLog = useAppStore((state) => state.activityLog);
  const { user, signOut, signInWithGoogle } = useFirebaseAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');

  const displayName = user?.displayName || 'Kathryn Murphy';

  const handleExitOrSignOut = async () => {
    if (user) {
      await signOut();
    }
    exitDemoSession();
    navigate('/login');
  };

  const handleSearchFocus = () => {
    setIsGlobalSearchOpen(true);
  };

  return (
    <>
      <header className="h-20 px-4 md:px-8 bg-[#030712] border-b border-[#1F2937] flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
        {/* Left: Mobile Toggle & User Welcome Greeting matching reference image */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-[#9AA6BC] hover:text-[#FFFFFF] rounded-xl hover:bg-[#111827]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {user && user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#A855F7] shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#A855F7] to-[#EC4899] border-2 border-[#1F2937] flex items-center justify-center text-sm font-bold text-white shadow-sm">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-[#FFFFFF] leading-tight flex items-center gap-1.5">
                <span>Welcome!</span>
                <span className="text-[#A855F7]">{displayName}</span>
              </h1>
              <p className="text-[11px] text-[#9AA6BC] font-medium leading-tight">
                Security is a process, not a product.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Prominent Global Search Bar matching reference image */}
        <div className="flex-1 max-w-lg mx-2 md:mx-6">
          <div
            onClick={handleSearchFocus}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#111827] border border-[#1F2937] hover:border-[#A855F7]/50 text-xs text-[#9AA6BC] hover:text-[#FFFFFF] transition-all cursor-pointer shadow-inner"
          >
            <Search className="w-4 h-4 text-[#A855F7] shrink-0" />
            <span className="flex-1 truncate">Search Here (Evidence, Scenarios, Help, Web Intel)...</span>
            <kbd className="hidden md:inline-block font-mono text-[10px] bg-[#030712] px-2 py-0.5 rounded border border-[#1F2937] text-[#A855F7]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Actions, Notifications, Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* AI Advisor Direct Action */}
          <button
            onClick={() => navigate('/ai-assistant')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#A855F7] text-xs font-semibold text-[#A855F7] transition-all cursor-pointer"
            title="Open Gemini Multi-Turn Scam Chatbot & Live Audio SOS"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Advisor</span>
          </button>

          {/* Language Selector */}
          <LanguageSelector />

          {/* Real Notification Bell with Badge */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2.5 rounded-xl text-[#9AA6BC] hover:text-[#FFFFFF] hover:bg-[#111827] relative transition-colors cursor-pointer"
              aria-label="View security event notifications"
            >
              <Bell className="w-4 h-4" />
              {activityLog.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EC4899] ring-2 ring-[#030712]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1F2937]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
                    SOC Security Events ({activityLog.length})
                  </h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#9AA6BC] hover:text-[#FFFFFF]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {activityLog.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="text-xs p-2.5 rounded-xl bg-[#030712] border border-[#1F2937]"
                    >
                      <div className="flex items-center justify-between font-semibold text-[#FFFFFF] mb-0.5">
                        <span className="truncate">{item.title}</span>
                        <span className="text-[10px] font-mono text-[#A855F7] tabular-nums shrink-0 ml-2">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9AA6BC] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="p-1 rounded-full hover:ring-2 hover:ring-[#A855F7] transition-all cursor-pointer"
              aria-label="User account menu"
            >
              {user && user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#111827] border border-[#A855F7]/40 flex items-center justify-center text-xs font-bold text-[#A855F7]">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-[#1F2937] mb-1">
                  <p className="text-xs font-bold text-[#FFFFFF] truncate">{displayName}</p>
                  <p className="text-[11px] text-[#9AA6BC] truncate">
                    {user ? user.email : 'Local SOC Sandbox'}
                  </p>
                </div>

                {!user && (
                  <button
                    onClick={() => {
                      signInWithGoogle();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#A855F7] hover:bg-[#1F2937] rounded-xl transition-colors text-left"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Sign in with Google</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#9AA6BC] hover:text-[#FFFFFF] hover:bg-[#1F2937] rounded-xl transition-colors text-left"
                >
                  <Settings className="w-4 h-4" />
                  <span>{t('nav.settings')}</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/privacy');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#9AA6BC] hover:text-[#FFFFFF] hover:bg-[#1F2937] rounded-xl transition-colors text-left"
                >
                  <Shield className="w-4 h-4" />
                  <span>{t('nav.privacy')}</span>
                </button>

                <div className="my-1 border-t border-[#1F2937]" />

                <button
                  onClick={handleExitOrSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#EC4899] hover:bg-[#1F2937] rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{user ? 'Sign Out of Google' : 'Exit Sandbox'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        initialQuery={searchInputValue}
      />
    </>
  );
};
