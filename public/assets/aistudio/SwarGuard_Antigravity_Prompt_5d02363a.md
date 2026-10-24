# ROLE

You are a senior product designer and staff frontend engineer shipping **SwarGuard**, an AI voice-scam detection and multilingual call-safety platform for a hackathon demo. Work autonomously end to end: plan, build, run, verify in the browser, fix, and report. Do not stop at a plan or a homepage.

# PRODUCT

- Tagline: "Hear the Threat. Trust the Evidence."
- Mission: help people recognise digital-arrest scams, fake KYC calls, courier fraud, OTP theft, coercive payment demands and impersonation by analysing suspicious voice recordings and giving clear, evidence-backed warnings.
- Users: everyday smartphone users, senior citizens, students, families, Gujarati/Hindi speakers.
- Tone: serious cybersecurity product, human-centred Indian identity. It must look designed by an experienced product team, not like an AI template.

# AGENT WORKFLOW (follow in order)

1. **Inspect** the repository first. Reuse working code; never overwrite working functionality without reason.
2. **Produce a Task List and Implementation Plan artifact** before writing code. Include the file tree, component list, route map, type definitions, and risks. Proceed without waiting unless blocked.
3. **Build in phases**, running the app after each:
   - P1: scaffold, tooling, design tokens, i18n, types, app shell, routing, 404
   - P2: shared components (see Required Components)
   - P3: audio engine, analysis provider layer, demo fixtures, global store
   - P4: Login, Dashboard, Live Call Analysis
   - P5: Evidence, Scam Library, Safe Call Check, Language Guardian
   - P6: Insights, Test Lab, Privacy Centre, Settings
   - P7: responsive and accessibility pass, motion pass, README
4. **Verify with the browser agent.** Visit every route at 1440px, 768px and 390px. Exercise: login validation, demo entry, file selection, playback, waveform sync, language switching, warning banner, test suite run, clear-session. Capture screenshots and one recording as artifacts. Read the console and terminal; fix every error and warning.
5. **Run** `tsc --noEmit`, lint, and `vite build`. All must pass.
6. **Finish with a Walkthrough artifact**: what was built, what uses demo data, known limitations, how to run.

If something is ambiguous, choose the most conservative, truthful option and note it in the walkthrough. Don't ask questions unless truly blocked.

# TECH STACK

React 18 + TypeScript (strict) · Vite · Tailwind CSS (use the version the scaffold installs cleanly; do not mix v3 and v4 config styles) · React Router v6 · Lucide React · Framer Motion · Recharts · React Hook Form + Zod · Zustand (or Context + reducer) for state.

Fonts: Manrope (UI) and Noto Sans / Noto Sans Gujarati / Noto Sans Devanagari (regional text), self-hosted or via fontsource.

# NON-NEGOTIABLE TRUTHFULNESS RULES

These override any design ambition.

1. The app works with no backend. All sample data lives in `src/data/fixtures/` and is visibly labelled **"Sample data"** or **"Demo fixture"** wherever shown.
2. Never present fixture output as a real AI/Gemini result. Every `AnalysisResult` carries `source: 'demo-fixture' | 'gemini' | 'manual'`, and the UI shows that source.
3. No invented metrics, accuracy percentages, testimonials, trust badges, or savings figures. With no data, show an empty state.
4. Never imply real phone-call monitoring. Copy must say "recorded audio analysis" / "simulated call".
5. A low-risk or "no significant warning signs" result is never described as proof of safety. Show this note wherever it applies: *"No significant warning signs found does not guarantee that a call is legitimate."*
6. No fake biometric login. No Google sign-in button unless real auth is implemented. Never store plaintext passwords. Invalid credentials never produce a success state. Demo entry is labelled "Demo access", not authentication.
7. No claims of end-to-end encryption, zero retention, or complete privacy.
8. Confidence values appear only if the response supplies them; label as uncertainty, not truth.
9. Top-bar status uses real states only: `Demo Mode | Connecting | Analysis Available | Unavailable`.
10. Do not fabricate transcript quotes. Fixture quotes are fictional and labelled so.

# DESIGN SYSTEM: "SWAR INTELLIGENCE"

Define tokens once in `tailwind.config` and CSS variables; no hard-coded hex in components.

| Token | Hex | Use |
|---|---|---|
| ink | #0B1020 | app background |
| indigo | #171F3A | nav, secondary surfaces |
| ivory | #F6F3EC | light surfaces, primary text on dark |
| saffron | #F2A65A | brand accent, active state |
| teal | #56D6C2 | verified / neutral activity |
| coral | #FF5B64 | high-risk only |
| slate | #9AA6BC | secondary text |

Rules:

- Semantic colour only. Red is never decorative; green/teal never implies "guaranteed safe". Risk is always communicated by **icon + text label + colour**, never colour alone.
- Check contrast (WCAG AA) for every text/surface pair. Add a light theme only if fully implemented; otherwise hide the theme control and state "Light theme not yet available".
- Solid surfaces, 1px subtle borders, minimal shadow, 8px spacing scale, strong grid, large editorial headings, concise copy.
- Avoid glassmorphism, rainbow gradients, glow borders, floating blobs, giant radii, brain graphics, stock photos, excess emoji, and dashboards with every chart at once.

**Signature element, `SwarSignalWaveform`:** an acoustic waveform with a subtle concentric sound-ring motif behind it.

- Waveform peaks come from real decoded audio (Web Audio `decodeAudioData`, downsampled to ~200 to 400 bars).
- Played portion is saffron, remaining portion slate; the playhead follows `audio.currentTime` via `requestAnimationFrame` while playing and freezes on pause.
- Evidence markers sit at their real timestamps; clicking one seeks the audio.
- Rings pulse only in response to real state (playing, input focus on login). Respect `prefers-reduced-motion` and the in-app setting (static fallback).
- No random animation pretending to be detected speech.

# ARCHITECTURE

```
src/
  app/            router, providers, store
  components/     ui/ (primitives) · layout/ · audio/ · analysis/ · feedback/
  pages/          one file per route
  features/       analysis/, tests/, i18n/, settings/
  services/
    analysis/     AnalysisProvider.ts (interface)
                  DemoFixtureProvider.ts
                  GeminiProvider.ts   (stub: reads VITE_GEMINI_PROXY_URL; if unset returns status 'unavailable')
  data/fixtures/  scenarios, evidence, library, sample history (all labelled)
  audio/          useAudioPlayer, peaks extraction
  i18n/           en.json, gu.json, hi.json
  lib/            validation (zod), storage helpers, formatters
  types/          domain types
```

- **Provider pattern:** pages depend only on `AnalysisProvider`. `DemoFixtureProvider` replays a pre-authored evidence timeline **synchronised to actual playback time** (evidence appears when `currentTime` reaches its timestamp), emitting incremental results. `GeminiProvider` is a typed stub that never fabricates output.
- **Incremental results:** reducer merges evidence by stable `evidenceId`; never replaces earlier valid evidence; de-duplicates.
- **Storage:** persist only non-sensitive preferences and session results in `localStorage` under a namespaced key; never persist audio blobs or passwords. Wrap all access in try/catch.

# TYPES (src/types)

- `RiskLevel`: `'low' | 'medium' | 'high' | 'insufficient'`
- `AnalysisStatus`: `'waiting' | 'analysing' | 'complete' | 'unavailable' | 'error'`
- `SupportedLanguage`: `'en' | 'gu' | 'hi'`
- `EvidenceIndicator`: `{ id, category, phrase?, originalLanguage, startSec, endSec, explanation, riskLevel, reviewStatus, uncertainty?, source }`
- `AnalysisResult`: `{ id, scenarioId?, status, overallRisk, evidence[], recommendedAction, createdAt, durationSec, warningLatencySec?, source }`
- `AudioScenario`: `{ id, name, kind: 'scam' | 'genuine', expected: RiskLevel, audioUrl?, recordingStatus: 'available' | 'missing', synthetic: true }`
- `TestResult`: `{ scenarioId, expected, actual?, status: 'not-run' | 'running' | 'pass' | 'fail' | 'error', latencySec?, notes, ranAt, groundTruthVerified: boolean }`

# ROUTES

React Router, direct-URL safe, `*` renders NotFound.

`/login` · `/dashboard` · `/analysis` · `/evidence` · `/scenarios` · `/safe-check` · `/language` · `/insights` · `/test-lab` · `/privacy` · `/settings`

Redirect `/` to `/dashboard` if a demo session is active, else `/login`. Each page has its own `PageHeader`, a `document.title`, and unique content.

# PAGE SPECIFICATIONS

## /login

Asymmetric two-panel layout.

- **Left:** wordmark + custom wave symbol; headline "Every voice deserves a second listen."; supporting copy; animated waveform; labels "Multilingual Intelligence", "Evidence-Based Alerts", "Privacy-Conscious Design"; footer "Built for safer conversations."
- **Right:** "Welcome back." Email, password (show/hide), remember-me, forgot-password link (opens an honest "not connected in demo" dialog), primary "Enter SwarGuard", secondary "Try Interactive Demo".
- Zod + RHF validation with inline errors, loading, error, and success states.
- With no auth backend, "Enter SwarGuard" must return a clear "Authentication isn't connected in this prototype. Use demo access." message rather than faking success.
- Sound rings respond to field focus. Short transition into the dashboard.
- Excellent on mobile: stack the panels; the waveform panel becomes a compact header.

## Application shell

- Persistent sidebar (10 items, icons, 2px saffron active indicator).
- Top bar: breadcrumb, quick-nav command palette (Ctrl/Cmd+K), language selector EN/ગુજરાતી/हिन्दी, help, notification centre fed by real app events, profile menu with Settings and "Exit demo".
- Mobile: bottom nav plus a drawer for the full list. Skip-to-content link.
- Sidebar items: Overview, Live Call Analysis, Threat Evidence, Scam Library, Safe Call Check, Language Guardian, Protection Insights, Test Lab, Privacy Centre, Settings.

## /dashboard

- Heading "Your voice safety, at a glance." Supporting copy: "Analyse suspicious conversations. Understand the evidence. Choose a safer next step."
- Primary "Analyse a Call"; secondary "Explore Demo Scenarios".
- **Live Protection Console:** waveform, file select, player, timestamp/duration, progress, risk state, start/pause/resume/reset.
- **Metrics** (calls analysed this session, high-risk scenarios detected, genuine tests completed, last analysis status) computed from the store only; empty states when zero.
- **Evidence preview** of the latest real result: classification, supporting phrase, reason, recommended action, timestamp.
- **Scenario launcher:** Digital Arrest, Fake KYC/OTP, Courier Impersonation, plus Genuine.
- **Recent activity** timeline distinguishing "Sample history" from "This session".

## /analysis (highest priority)

Two columns.

- **Main:** dropzone + browse, file details (name, size, type, duration), audio player, waveform timeline with evidence markers, transcript/evidence panel (only fixture or supplied text, labelled), analysis activity timeline.
- **Side:** `RiskIndicator`, status, evidence count, recommended action, language-specific warning, privacy notice.
- **States:** waiting, analysing, low indicators, caution, high indicators, insufficient evidence, unavailable.
- **`WarningBanner`** appears only when high-risk evidence exists: title, reason, supporting evidence, one safe action, acknowledge/dismiss, in-banner language switch, `role="alert"`, not full-screen.
- **Uploaded user files get no fabricated analysis.** With no provider available, show "Analysis unavailable: connect an analysis service" and still allow playback.

## /evidence

- Filterable table (scenario, risk, category) with columns: category, phrase, timestamp, explanation, risk, review status.
- Row opens a detail drawer: phrase, available context, why concerning, legitimate alternative interpretations, recommended action, "Jump to audio".
- Categories: authority impersonation, threats, artificial urgency, isolation, credential requests, coercive money demands, suspicious account/KYC claims, suspicious parcel claims.
- Label fixture evidence "Sample evidence".

## /scenarios

- Searchable, category-filtered library of 6 scams: digital arrest, fake KYC, courier, OTP theft, urgent payment, family emergency.
- Detail modal: how it begins, manipulation techniques, warning signs, fictional example dialogue (labelled fictional; never claim a phrase proves fraud), safe response, "Try this scenario" (loads its recording if present, else shows "Recording not available").

## /safe-check

- Genuine demo recordings; play + run analysis; inspect any evidence; "why this did/didn't warn" explanation.
- Prominent disclaimer: "No significant warning signs found does not guarantee that a call is legitimate."
- Comparison view of scam vs genuine showing only results actually produced this session (otherwise empty state).

## /language

- EN/GU/HI selector changes the whole UI: nav, actions, risk labels, warnings, safe-action text, page headers.
- Show original-language evidence separately from translated explanations, labelled "Static translation" vs "Analysis-supplied translation".
- Handle longer Gujarati/Hindi strings without overflow; adjust line-height.
- Static strings live in JSON; the README flags them as "needs native-speaker review". Do not claim professional review.

## /insights

- Recharts on real session/test data only: scam vs genuine outcomes, risk-category distribution, completion/failure counts, warning latency, false positives/negatives only where `groundTruthVerified` is true.
- Each chart: title, units/definition, accessible label (aria + data-table fallback), one-line auto-generated interpretation, empty state, sample-size note ("n = X, preliminary"), and a clear distinction between model/fixture output and verified ground truth.
- Session filter if the data supports it.

## /test-lab

- Four cases: digital arrest, fake KYC/OTP, courier, genuine routine enquiry. Each shows expected result, recording status, run action, actual result, status, evidence summary, duration, latency.
- Run one or run the full suite; reset; rerun.
- Results table: scenario, expected, actual, pass/fail, latency, notes.
- **Pass is computed** by comparing actual against the defined expectation; never hard-coded.
- Each row displays "Source: demo fixture replay" so no one mistakes it for model performance.
- "Known Limitations" section: false alarms, missed detections, audio quality, language/dialect variation, simulated call vs real telephony integration, small sample size.

## /privacy

- What audio is processed (user-selected local files, played in-browser).
- Whether any remote AI is used (currently none unless a Gemini proxy is configured; state the actual current config).
- What is stored where (preferences + results in localStorage; audio not persisted).
- Demo recording sourcing (synthetic/consented only), retention, limits of the prototype.
- Working "Clear Demo Session" with `ConfirmDialog`: clears namespaced storage and store state, then confirms with a toast.

## /settings

- Language, reduced motion (system/on/off), playback (default speed, autoplay off, skip interval), warning presentation (banner position, auto-dismiss off by default, show translated warning), demo session reset, About.
- Every control must change real behaviour or be disabled with "Not yet available". Persist non-sensitive prefs.

# REQUIRED COMPONENTS

`SwarGuardLogo`, `SwarSignalWaveform`, `RiskIndicator`, `EvidenceCard`, `EvidenceTable`, `AnalysisTimeline`, `AudioPlayer`, `LanguageSelector`, `WarningBanner`, `StatusBadge`, `EmptyState`, `ErrorState`, `PageHeader`, `Sidebar`, `Topbar`, `ConfirmDialog`, `Toast`, `LoadingSkeleton`.

All accessible, keyboard operable, with typed props.

# AUDIO ASSETS

- Do not use real people's voices or copyrighted recordings.
- Create `public/demo-audio/` placeholders and a `DEMO_AUDIO.md` listing the 4 required synthetic/consented files and their expected fixture timelines.
- If a file is missing, set `recordingStatus: 'missing'` and show a clear "Add recording" state. Do not fake a waveform for a missing file.
- Tests for missing recordings show status "Recording unavailable".

# MOTION & ACCESSIBILITY

- Framer Motion for: waveform playback, state transitions, warning entrance, nav indicator, login-to-dashboard transition. Nothing continuous or decorative. Honour reduced motion globally.
- Visible focus rings, semantic landmarks, `aria-live="polite"` for status updates, `role="alert"` for high-risk warnings, labelled form fields, touch targets of at least 44px, correct `lang` attribute per selected language.
- Reorganise (don't just shrink) for mobile: stacked analysis panels, bottom nav, tables become cards on small screens.

# DEFINITION OF DONE

All must be true, with evidence in the walkthrough.

- [ ] `npm run dev` runs clean; `tsc --noEmit`, lint, and `vite build` pass
- [ ] All 11 routes load by direct URL and refresh; unknown route shows NotFound
- [ ] Browser-agent screenshots for each route at 3 viewports, no horizontal overflow
- [ ] Waveform playhead matches `audio.currentTime`; seeking works; evidence markers seek audio
- [ ] Language switch changes nav, actions, warnings, and safe-action text in EN/GU/HI with correct fonts
- [ ] Login invalid-credentials path never succeeds; demo access labelled as demo
- [ ] Test Lab pass/fail derived from comparison; reset and rerun work
- [ ] Clear Demo Session removes stored data after confirmation
- [ ] Zero console errors/warnings; no dead links or non-functional controls
- [ ] Grep confirms no hard-coded accuracy %, fake testimonials, or real-time-call claims
- [ ] README covers: run instructions, env vars, which features use demo data, how to plug in a Gemini proxy, how to add audio, known limitations, translation-review note

# FINAL PRINCIPLE

Prioritise credibility, clear evidence, usability, and a flawless live demo over visual gimmicks. SwarGuard should feel like a real Indian voice-safety product with a strong identity, not a collection of trendy UI components.
