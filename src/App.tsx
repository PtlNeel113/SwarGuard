/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n/i18nContext';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { EvidencePage } from './pages/EvidencePage';
import { ScenariosPage } from './pages/ScenariosPage';
import { SafeCheckPage } from './pages/SafeCheckPage';
import { LanguagePage } from './pages/LanguagePage';
import { InsightsPage } from './pages/InsightsPage';
import { TestLabPage } from './pages/TestLabPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SettingsPage } from './pages/SettingsPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { ScienceLabPage } from './pages/ScienceLabPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useAppStore } from './store/useAppStore';

const RootRedirect: React.FC = () => {
  const isDemoSessionActive = useAppStore((state) => state.isDemoSessionActive);
  return isDemoSessionActive ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Authentication & Entry */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected & Demo Application Shell */}
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ai-assistant" element={<AiAssistantPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/scenarios" element={<ScenariosPage />} />
            <Route path="/safe-check" element={<SafeCheckPage />} />
            <Route path="/language" element={<LanguagePage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/test-lab" element={<TestLabPage />} />
            <Route path="/science-lab" element={<ScienceLabPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
