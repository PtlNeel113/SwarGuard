/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Sliders,
  Volume2,
  Bell,
  RotateCcw,
  Info,
  Check,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { useAppStore } from '../store/useAppStore';
import { useI18n } from '../i18n/i18nContext';
import { SupportedLanguage } from '../types';

export const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  const preferences = useAppStore((state) => state.preferences);
  const updatePreferences = useAppStore((state) => state.updatePreferences);
  const clearDemoSession = useAppStore((state) => state.clearDemoSession);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    updatePreferences({ language: newLang });
    setToastMessage(`Interface language switched to ${newLang.toUpperCase()}`);
  };

  const handleReducedMotionChange = (val: 'system' | 'on' | 'off') => {
    updatePreferences({ reducedMotion: val });
    setToastMessage(`Reduced motion preference set to ${val}`);
  };

  const handleSkipIntervalChange = (val: number) => {
    updatePreferences({ skipIntervalSec: val });
    setToastMessage(`Playback skip interval set to ${val} seconds`);
  };

  const handleWarningPosition = (pos: 'top' | 'floating') => {
    updatePreferences({ warningPosition: pos });
    setToastMessage(`Warning alert position set to ${pos}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      <PageHeader
        title={t('settingsPage.title')}
        subtitle={t('settingsPage.subtitle')}
        kicker="Configuration & Preferences"
      />

      <div className="max-w-4xl space-y-6">
        {/* Language Preferences */}
        <Card variant="base" className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#263359] text-[#F2A65A]">
            <Globe className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#F6F3EC]">Interface Language</h3>
          </div>

          <p className="text-xs text-[#9AA6BC]">
            Choose the language for application navigation, risk alerts, and protective guidance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              { code: 'en' as const, label: 'English', desc: 'Default institutional' },
              { code: 'gu' as const, label: 'ગુજરાતી (Gujarati)', desc: 'Regional family safety' },
              { code: 'hi' as const, label: 'हिन्दी (Hindi)', desc: 'Devanagari dialect' },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => handleLanguageChange(item.code)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  language === item.code
                    ? 'bg-[#171F3A] border-[#F2A65A] ring-1 ring-[#F2A65A]'
                    : 'bg-[#0B1020] border-[#263359] hover:bg-[#171F3A]'
                }`}
              >
                <div className="font-bold text-xs text-[#F6F3EC] flex items-center justify-between">
                  <span>{item.label}</span>
                  {language === item.code && <Check className="w-4 h-4 text-[#F2A65A]" />}
                </div>
                <div className="text-[11px] text-[#9AA6BC] mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Accessibility & Motion */}
        <Card variant="base" className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#263359] text-[#56D6C2]">
            <Sliders className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#F6F3EC]">Accessibility & Motion</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#0B1020] border border-[#263359]">
              <div>
                <span className="font-bold text-[#F6F3EC] block">Reduced Motion</span>
                <span className="text-[#9AA6BC]">
                  Controls pulse rings on waveforms and transition effects.
                </span>
              </div>

              <div className="flex items-center gap-1 bg-[#12192F] p-1 rounded-lg border border-[#263359]">
                {(['system', 'on', 'off'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleReducedMotionChange(mode)}
                    className={`px-3 py-1 text-xs font-semibold rounded capitalize ${
                      preferences.reducedMotion === mode
                        ? 'bg-[#171F3A] text-[#F2A65A]'
                        : 'text-[#9AA6BC]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme control note (per prompt rule: no half-baked light theme) */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B1020] border border-[#263359] opacity-70">
              <div>
                <span className="font-bold text-[#F6F3EC] block">Color Theme</span>
                <span className="text-[#9AA6BC]">High-contrast cyber dark mode active</span>
              </div>
              <span className="text-xs text-[#9AA6BC] italic">
                Light theme not yet available
              </span>
            </div>
          </div>
        </Card>

        {/* Audio Playback Settings */}
        <Card variant="base" className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#263359] text-[#F2A65A]">
            <Volume2 className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#F6F3EC]">Audio Playback Behavior</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B1020] border border-[#263359]">
              <div>
                <span className="font-bold text-[#F6F3EC] block">Skip Step Interval</span>
                <span className="text-[#9AA6BC]">
                  Seconds to jump forward/backward on keyboard and button press.
                </span>
              </div>
              <div className="flex items-center gap-1 bg-[#12192F] p-1 rounded-lg border border-[#263359]">
                {[3, 5, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => handleSkipIntervalChange(sec)}
                    className={`px-3 py-1 text-xs font-mono font-semibold rounded ${
                      preferences.skipIntervalSec === sec
                        ? 'bg-[#171F3A] text-[#F2A65A]'
                        : 'text-[#9AA6BC]'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B1020] border border-[#263359]">
              <div>
                <span className="font-bold text-[#F6F3EC] block">Autoplay on Load</span>
                <span className="text-[#9AA6BC]">
                  Automatically begin audio playback when a scenario is selected.
                </span>
              </div>
              <button
                onClick={() =>
                  updatePreferences({ autoplay: !preferences.autoplay })
                }
                className={`w-12 h-6 rounded-full transition-colors p-1 ${
                  preferences.autoplay ? 'bg-[#56D6C2]' : 'bg-[#263359]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.autoplay ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Warning Presentation */}
        <Card variant="base" className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#263359] text-[#FF5B64]">
            <Bell className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#F6F3EC]">Warning Presentation</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B1020] border border-[#263359]">
              <div>
                <span className="font-bold text-[#F6F3EC] block">Auto-dismiss High Risk Alerts</span>
                <span className="text-[#9AA6BC]">
                  High risk alerts require explicit user acknowledgment for safety.
                </span>
              </div>
              <span className="text-[#9AA6BC] italic">Locked (Off by default for safety)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B1020] border border-[#263359]">
              <div>
                <span className="font-bold text-[#F6F3EC] block">Banner Placement</span>
                <span className="text-[#9AA6BC]">Position of warning alert in analysis workspace</span>
              </div>
              <div className="flex items-center gap-1 bg-[#12192F] p-1 rounded-lg border border-[#263359]">
                {(['top', 'floating'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => handleWarningPosition(pos)}
                    className={`px-3 py-1 text-xs font-semibold capitalize rounded ${
                      preferences.warningPosition === pos
                        ? 'bg-[#171F3A] text-[#F2A65A]'
                        : 'text-[#9AA6BC]'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Demo Reset */}
        <Card variant="base" className="space-y-3 border-[#FF5B64]/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#FF5B64]">Reset Demo State</h3>
              <p className="text-xs text-[#9AA6BC]">
                Clear all session results, activity history, and restore default settings.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={() => setShowClearConfirm(true)}
            >
              Reset Session
            </Button>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Reset Demo Session"
        message="Are you sure you want to reset all preferences and session records back to defaults?"
        confirmLabel="Reset Everything"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          clearDemoSession();
          setShowClearConfirm(false);
          setToastMessage('Session has been reset to default state.');
        }}
        onCancel={() => setShowClearConfirm(false)}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            id="settings-toast"
            type="info"
            title="Settings Updated"
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}
    </div>
  );
};
