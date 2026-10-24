/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Lock,
  Shield,
  HardDrive,
  Cpu,
  Trash2,
  CheckCircle2,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { Toast } from '../components/ui/Toast';
import { useAppStore } from '../store/useAppStore';
import { useI18n } from '../i18n/i18nContext';

export const PrivacyPage: React.FC = () => {
  const { t } = useI18n();
  const clearDemoSession = useAppStore((state) => state.clearDemoSession);
  const sessionResults = useAppStore((state) => state.sessionResults);

  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const proxyConfigured = Boolean(
    import.meta.env.VITE_GEMINI_PROXY_URL &&
      import.meta.env.VITE_GEMINI_PROXY_URL.trim().length > 0
  );

  const handleClearConfirmed = () => {
    clearDemoSession();
    setShowConfirmClear(false);
    setToastMessage('Demo session data and storage records cleared successfully.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      <PageHeader
        title={t('privacyPage.title')}
        subtitle={t('privacyPage.subtitle')}
        kicker="Security Architecture"
        actions={
          <Button
            variant="danger"
            size="md"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => setShowConfirmClear(true)}
          >
            {t('privacyPage.clearSessionButton')}
          </Button>
        }
      />

      {/* Honest Privacy Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card variant="base" className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#56D6C2]">
            <HardDrive className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#F6F3EC]">Local Browser Decoding</h3>
          </div>
          <p className="text-xs text-[#9AA6BC] leading-relaxed">
            Audio dropped or selected is decoded via your browser’s local Web Audio API. Audio binary buffers are never persisted to disk or sent to unknown servers.
          </p>
        </Card>

        <Card variant="base" className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#F2A65A]">
            <Cpu className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#F6F3EC]">AI Proxy Configuration</h3>
          </div>
          <p className="text-xs text-[#9AA6BC] leading-relaxed">
            Current Status:{' '}
            <span className="font-semibold text-[#F6F3EC]">
              {proxyConfigured ? 'Remote Proxy Active' : 'No Remote AI Proxy Configured'}
            </span>
            . All analysis uses local synthetic benchmark fixtures without transmitting voice data.
          </p>
        </Card>

        <Card variant="base" className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#FF5B64]">
            <Lock className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#F6F3EC]">Non-Sensitive Storage</h3>
          </div>
          <p className="text-xs text-[#9AA6BC] leading-relaxed">
            Only non-sensitive UI preferences (language, speeds) and current session evaluation results are stored under namespaced localStorage keys. Never passwords or audio files.
          </p>
        </Card>
      </div>

      {/* Detailed Technical Specifications */}
      <Card variant="elevated" className="space-y-5">
        <h3 className="text-base font-bold text-[#F6F3EC] pb-3 border-b border-[#263359]">
          Data Handling & Ethical Sourcing Statement
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-[#F2A65A] mb-1">1. Synthetic & Consented Demo Audio</h4>
            <p className="text-[#9AA6BC] leading-relaxed">
              No real people’s voices, private wiretaps, or stolen call audio are used. All demo files are synthetically generated tone-modulated audio files calibrated to represent speech cadence without compromising private individuals.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#F2A65A] mb-1">2. Limits of Prototype Architecture</h4>
            <p className="text-[#9AA6BC] leading-relaxed">
              This prototype is designed for pre-recorded call inspection and education. We make no claims of zero retention guarantees or end-to-end telecom carrier encryption.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#F2A65A] mb-1">3. Storage Footprint</h4>
            <p className="text-[#9AA6BC] leading-relaxed">
              Currently holding{' '}
              <span className="font-mono text-[#F6F3EC] font-bold">
                {sessionResults.length}
              </span>{' '}
              session records in local browser memory. Click "Clear Demo Session Data" anytime to purge all records.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#263359] flex items-center justify-between">
          <span className="text-xs text-[#9AA6BC]">
            Data rights: All session state belongs entirely to your local browser.
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirmClear(true)}
          >
            Clear Stored Data Now
          </Button>
        </div>
      </Card>

      {/* Confirm Session Clear Dialog */}
      <ConfirmDialog
        isOpen={showConfirmClear}
        title="Clear Demo Session Data"
        message={t('privacyPage.confirmClear')}
        confirmLabel="Yes, Clear All Data"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleClearConfirmed}
        onCancel={() => setShowConfirmClear(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            id="clear-toast"
            type="success"
            title="Session Cleared"
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}
    </div>
  );
};
