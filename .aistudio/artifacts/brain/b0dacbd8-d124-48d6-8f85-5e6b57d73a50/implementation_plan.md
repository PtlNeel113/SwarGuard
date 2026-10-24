# SwarGuard: Implementation Plan & Architectural Task List

## Product Identity & Core Mission
**SwarGuard** ("Hear the Threat. Trust the Evidence.") is a human-centred cybersecurity and multilingual call-safety platform designed to help everyday smartphone users, senior citizens, students, and Gujarati/Hindi/English-speaking families recognise and defend against malicious voice communications (digital-arrest scams, fake KYC/OTP fraud, courier parcel imposter calls, and coercive payment demands).

---

## 1. Non-Negotiable Truthfulness & Engineering Guardrails
1. **Source Labeling**: Every analysis result carries `source: 'demo-fixture' | 'gemini' | 'manual'`. All fixture data is visibly tagged with "Sample data" or "Demo fixture".
2. **No Hallucinated Results**: Uploaded user audio without a configured live Gemini proxy yields an honest status: *"Analysis unavailable: connect an analysis service"*, while still enabling native Web Audio playback and waveform visualization.
3. **No False Guarantees**: A low-risk result explicitly displays: *"No significant warning signs found does not guarantee that a call is legitimate."*
4. **Authentic Telephony Labeling**: Clear language stating "recorded audio analysis / simulated call" rather than claiming real-time phone call tapping or carrier interception.
5. **Real Acoustic Waveform**: Decoded via native Web Audio `AudioContext.decodeAudioData` into accurate normalized amplitude bars (200-300 bars), with playhead tracking `audio.currentTime` via `requestAnimationFrame`.
6. **Synchronised Timeline**: Pre-authored fixture indicators unlock dynamically as playback reaches the exact timestamp, or can be inspected in full once complete.

---

## 2. Design System: "Swar Intelligence"
- **Palette**:
  - `ink`: `#0B1020` (Deep background)
  - `indigo`: `#171F3A` (Navigation & elevated structural surfaces)
  - `ivory`: `#F6F3EC` (Primary text on dark, high readability)
  - `saffron`: `#F2A65A` (Signature brand accent, active playback)
  - `teal`: `#56D6C2` (Neutral verified / safe state)
  - `coral`: `#FF5B64` (High-risk warning state only)
  - `slate`: `#9AA6BC` (Secondary labels & unplayed waveform)
- **Typography**: Manrope for UI, Noto Sans / Gujarati / Devanagari for regional text with `tabular-nums` for timestamps and latency figures.
- **Anti-Slop Compliance**: Clean single-elevation surfaces, 1px subtle hairline borders, zero decorative pulsing green dots, zero fake compiler/latency tickers, strict 3-zone top bar, no pill badge sandwiches.

---

## 3. Route Map
- `/login`: Asymmetric two-panel with custom sound wave signature, interactive demo entry, and honest auth validation.
- `/dashboard`: Live Protection Console, metrics derived strictly from active session store, latest evidence preview, scenario launcher, and recent activity log.
- `/analysis`: 2-column live call analysis workspace with drag-and-drop, real audio player, Web Audio waveform with interactive evidence markers, expandable transcript, and sticky risk assessment.
- `/evidence`: Filterable evidence inventory categorized by threat types (authority impersonation, isolation, credential requests, etc.) with slide-over inspection drawer.
- `/scenarios`: Library of 6 real-world voice scams with manipulation breakdown, warning signs, fictional dialogue, and 1-click test launcher.
- `/safe-check`: Genuine call benchmark analysis explaining why certain calls do not trigger warnings, plus session comparative view and safety disclaimer.
- `/language`: Multilingual Guardian center (EN/GU/HI) demonstrating full UI translations, static vs model-derived translation labels, and line-height safety.
- `/insights`: Empirical session analytics powered by Recharts (scam vs genuine distribution, warning latency, risk categories, sample size disclosures).
- `/test-lab`: Automated 4-case verification suite with runtime-computed pass/fail comparisons against ground truth, latency measurements, and known limitations.
- `/privacy`: Transparent architecture statement (local in-browser processing, Gemini proxy configuration status, zero audio retention), plus functional "Clear Demo Session" dialog.
- `/settings`: Persistent preferences (language, reduced motion, playback speed, skip intervals, warning banner position, session reset).
- `*`: 404 Not Found fallback page.

---

## 4. File Tree
```
src/
  types/
    index.ts
  lib/
    storage.ts
    validation.ts
    formatters.ts
    audioUtils.ts
  data/
    fixtures/
      scenarios.ts
      evidence.ts
      scamLibrary.ts
      sampleHistory.ts
  i18n/
    en.json
    gu.json
    hi.json
    i18nContext.tsx
  services/
    analysis/
      AnalysisProvider.ts
      DemoFixtureProvider.ts
      GeminiProvider.ts
  audio/
    useAudioPlayer.ts
  store/
    useAppStore.ts
  components/
    ui/
      Button.tsx
      Badge.tsx
      Card.tsx
      Dialog.tsx
      Toast.tsx
      LoadingSkeleton.tsx
    layout/
      AppShell.tsx
      Sidebar.tsx
      Topbar.tsx
      PageHeader.tsx
      CommandPalette.tsx
    audio/
      SwarSignalWaveform.tsx
      AudioPlayerControls.tsx
    analysis/
      RiskIndicator.tsx
      WarningBanner.tsx
      EvidenceCard.tsx
      EvidenceTable.tsx
      EvidenceDrawer.tsx
      AnalysisTimeline.tsx
    feedback/
      EmptyState.tsx
      ErrorState.tsx
      ConfirmDialog.tsx
  pages/
    LoginPage.tsx
    DashboardPage.tsx
    AnalysisPage.tsx
    EvidencePage.tsx
    ScenariosPage.tsx
    SafeCheckPage.tsx
    LanguagePage.tsx
    InsightsPage.tsx
    TestLabPage.tsx
    PrivacyPage.tsx
    SettingsPage.tsx
    NotFoundPage.tsx
  App.tsx
  main.tsx
  index.css
public/
  demo-audio/
    digital_arrest_scam.wav
    fake_kyc_otp.wav
    courier_fraud.wav
    routine_enquiry_genuine.wav
  DEMO_AUDIO.md
```

---

## 5. Implementation Phases & Milestones
- **P1: Scaffolding, Design Tokens & Core Engine** (Tokens in index.css / tailwind, types, storage, i18n JSONs, routing, AppShell).
- **P2: Shared UI & Acoustic Waveform** (`SwarSignalWaveform` with Web Audio decoder, `AudioPlayer`, `RiskIndicator`, `WarningBanner`, `CommandPalette`).
- **P3: Analysis Provider Architecture** (`DemoFixtureProvider` with playback-synchronized emitter, `GeminiProvider` stub, Zustand store).
- **P4: High Priority Pages** (Login with honest validation, Dashboard, 2-column Analysis with live waveform markers and warning alerts).
- **P5: Deep Safety & Library Pages** (Threat Evidence table & drawer, Scam Library modals, Safe Call Check with comparison, Language Guardian).
- **P6: Rigorous Evaluation & Privacy** (Recharts Insights, Test Lab automated suite with dynamic pass/fail checks, Privacy Centre with working session wipe, Settings).
- **P7: Audio Assets & Verification** (Synthetic WAV placeholders with real audio buffers, responsive check, `tsc --noEmit` and build verification).
