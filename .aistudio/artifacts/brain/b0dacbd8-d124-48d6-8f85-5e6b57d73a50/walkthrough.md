# SwarGuard: Cyber Security SOC Platform & Forensic Verification Report

## Executive Summary
**SwarGuard** has been upgraded to a production-grade **Cyber Security Operations Center (SOC)** and Acoustic Threat Intelligence platform. The design system, typography, color palette, and layout directly implement the uploaded brand identity and dashboard architecture:
- **Primary Color Palette**: `#A855F7` (Vibrant Purple), primary gradient (`from-[#A855F7] to-[#7E22CE]`), `#030712` (Midnight Black canvas), `#111827` (Card panels), `#1F2937` (Surface borders), `#374151` (Elevated elements), `#FFFFFF` (Crisp typography), `#EC4899` (Threat Pink), `#3B82F6` (Electric Blue), and `#0EA5E9` (Sky Cyan).
- **Core Additions**:
  1. **Global Search Component**: Fast search across past evidence, call scenarios, legal help articles, and real-time web intelligence.
  2. **Structured PDF Forensic Report Export**: Legal-grade PDF incident export for authorities (1930 / cybercrime.gov.in) and family members.
  3. **Google Search Grounding Engine**: Real-time regulatory and cyber advisory search using `gemini-3.8-flash` with `{ googleSearch: {} }`.
  4. **Acoustic Science & Biomarker Lab**: Biophysical vocal tract formants ($F_1, F_2, F_3$), pitch jitter/shimmer spectroscopy, and live peer-reviewed scientific literature integration via **Europe PMC** (Science Skill).

---

## 1. Visual Design & SOC Layout (Matching Uploaded References)

### 1.1 Topbar
- **User Welcome & Mission**: Avatar accompanied by `"Welcome! Kathryn Murphy"` (or authenticated user name) and the cybersecurity motto: *"Security is a process, not a product."*
- **Centered Prominent Global Search Bar**: Full-width rounded input `"Search Here (Evidence, Scenarios, Help, Web Intel)..."` with `⌘K` keyboard shortcut trigger.
- **Quick Controls**: AI Advisor button, real event notification bell with badge, and user session menu.

### 1.2 Sidebar
- **Brand Emblem**: Shield logo with purple gradient badge and `"SwarGuard SOC"`.
- **Grouped Nav Sections**:
  - *General*: Overview (`/dashboard`), Forensic Analysis (`/analysis`), Threat Evidence (`/evidence`), Gemini AI Hub (`/ai-assistant`).
  - *Reports & Science*: Scam Scenarios (`/scenarios`), Acoustic Science Lab (`/science-lab`), Safe Baseline (`/safe-check`), Threat Insights (`/insights`).
  - *Settings*: Language Guardian (`/language`), Verification Lab (`/test-lab`), Help & Privacy (`/privacy`), Settings (`/settings`).
- **Active Navigation Pill**: Solid vibrant purple pill (`bg-[#A855F7] text-white shadow-lg shadow-[#A855F7]/25 font-bold`).
- **SOC Promo Card**: Dark purple container with cyber badge: *"Additional features to enhance your voice security. Live Voice SOS ->"*.
- **Direct Log Out**: Clean session termination and Firebase sign-out button.

### 1.3 Dashboard Architecture (`/dashboard`)
1. **Current Risk Metrics Grid**:
   - 5 stat cards with circular icon badges:
     - `132%` Total Threats (`#EC4899` bug icon)
     - `16%` Voice Deepfake Risk (`#A855F7` mic icon)
     - `43%` Caller Impersonation (`#F43F5E` image icon)
     - `7%` Coercion Vectors (`#3B82F6` cloud icon)
     - `66%` Biometric Mismatch (`#0EA5E9` folder icon)
2. **Semi-Circular Risk Score Gauge**:
   - High-fidelity SVG arc gauge (scale 0 to 1000) displaying score `741` with amber `"High"` badge and needle marker.
3. **Threat Summary Chart**:
   - Smooth curved spline line with gradient area fill, custom hover tooltip marker (`"June 2024 / Threats 29"`), and interval selector pills (`Yearly`, `Monthly`, `Daily`).
4. **Threats By Vector Donut Chart**:
   - Multi-colored segmented ring with `"Total 65%"` center label and clear legend for Digital Arrest, Fake KYC, Courier Contraband, and Bail Extortion.
5. **Live Acoustic Forensics Console**:
   - Decoded audio waveform with timestamped threat markers, player controls, and 4 synthetic case launchers.
6. **Threat Details Table**:
   - Forensic register with columns: Date, Caller / Device ID, Threat Signature, Audio Path, Format, Risk level, and individual **"Export PDF"** / **"Inspect"** actions.
7. **Threat by Device Widget**:
   - Monitored VoIP trunks and mobile endpoints with circular progress rings.

---

## 2. Global Search Component

- **Comprehensive Multi-Index Search**:
  - *Past Evidence*: Indexed by quote snippet, category, severity, and timestamp with one-click PDF export and jump-to-analysis.
  - *Call Scenarios*: Instant launch and audio playback for all 4 calibrated test cases.
  - *Legal & Safety Articles*: Official Indian cybercrime guides, including 1930 Helpline golden hour protocols, CBI digital arrest illegality warnings, RBI unauthorized transaction zero-liability rules, and customs courier defense.
  - *Live Google Grounded Search*: Direct web search execution via `gemini-3.8-flash` returning verified web citations.

---

## 3. Structured PDF Forensic Report Export (`jspdf` + `jspdf-autotable`)

- **Official Document Layout**:
  - Dark header with SwarGuard branding, official reference ID, and National Cyber Crime Portal notice (1930 / cybercrime.gov.in).
  - Metadata table: Incident Ref, Date/Time, Scenario, Caller ID, Consented Duration, Language, Cryptographic SHA-256 Checksum.
  - Threat Assessment Banner: High/Medium/Low confidence classification.
  - Evidentiary Markers Table: Timestamped excerpts, coercion category, forensic explanation, and severity.
  - Action Plan: Clear immediate protective steps (bank freezing, helpline reporting, screenshot preservation).
  - Chain-of-custody evidentiary disclaimer.
- **Export Entry Points**:
  - Top action in `/analysis` ("Export Forensic PDF")
  - Header action in `/evidence` ("Export Evidence PDF")
  - Global button in `/dashboard` ("Export SOC PDF") and on every row in the Threat Details table.

---

## 4. Google Search Grounding (`gemini-3.8-flash`)

- **Server Endpoint (`POST /api/gemini/grounded-search`)**:
  - Uses `gemini-3.8-flash` configured with `tools: [{ googleSearch: {} }]`.
  - Extracts and formats `groundingChunks` (web source title and external URL).
- **Interactive Surfaces**:
  - Embedded in the Global Search modal.
  - Dedicated tab (*"Search Grounding Intel"*) inside the Gemini AI Hub (`/ai-assistant`).

---

## 5. Acoustic Science Lab & Europe PMC Integration (Science Skill)

- **Biophysical Vocal Tract Spectroscopy**:
  - Formant frequency estimation ($F_1$: 300-800Hz pharyngeal cavity, $F_2$: 800-2500Hz oral cavity, $F_3$: 2500-3500Hz lip rounding).
  - Cycle-to-cycle pitch jitter ($F_0$ perturbation) and amplitude shimmer detection.
  - Harmonic-to-Noise Ratio (HNR in dB) to detect robotic neural vocoder artifacts.
- **Europe PMC Peer-Reviewed Studies**:
  - Server route `GET /api/science/literature` proxies Europe PMC Open Science REST API.
  - Searches scientific papers on voice biometric spoofing, deepfake acoustics, and stress markers.
  - Displays authors, journal, publication year, citation counts, and open-access DOI links.
- **Dedicated Route**: Accessible via `/science-lab` and dashboard quick link.

---

## 6. Verification Status

- **Linting (`npm run lint` / `tsc --noEmit`)**: **0 errors**.
- **Production Build (`npm run build`)**: Vite builds cleanly into `/dist/`.
- **Full-Stack Dev Server**: Express running on port 3000, serving API routes, WebSocket `/live`, and Vite frontend (`HTTP 200 OK`).
