# SwarGuard: Multilingual AI Voice-Scam Detection & Call-Safety Platform

> **"Hear the Threat. Trust the Evidence."**

SwarGuard is an evidence-backed call-safety platform engineered to protect citizens, families, and senior citizens against coercive telephonic fraud across India—including **Digital Arrest scams**, **fake bank KYC/OTP theft**, **customs courier extortion**, and **urgent family emergency fraud**.

---

## 1. Quick Start & Execution

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Run
```bash
# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev

# Run TypeScript type check
npm run lint

# Build for production
npm run build
```

The app will be live at `http://localhost:3000`.

---

## 2. Environment Variables (`.env.example`)

```bash
# GEMINI_API_KEY: Optional. Used if server-side Gemini generation is enabled.
GEMINI_API_KEY=""

# VITE_GEMINI_PROXY_URL: Optional remote proxy endpoint for streaming audio evaluation.
# If unset, SwarGuard defaults to local offline fixture benchmarks and marks AI status "Unavailable".
VITE_GEMINI_PROXY_URL=""

# APP_URL: Base URL for hosted deployments.
APP_URL="http://localhost:3000"
```

---

## 3. Non-Negotiable Truthfulness Guardrails

In compliance with strict engineering ethics:
1. **Clear Fixture Labeling**: All pre-calibrated scenarios and speech samples are prominently labeled **"Sample data"** or **"Demo fixture"**.
2. **Source Disclosure**: Every result carries an explicit `source: 'demo-fixture' | 'gemini' | 'manual'`.
3. **No Fabricated Telemetry**: Without a connected AI proxy, uploaded custom audio files honestly display *"Analysis unavailable: connect an analysis service"*, while still enabling native Web Audio playback and waveform visualization.
4. **Mandatory Safety Disclaimer**: A low-risk result explicitly displays:  
   *"No significant warning signs found does not guarantee that a call is legitimate."*
5. **No Carrier Wiretapping Claims**: Copy explicitly states **"recorded audio analysis / simulated call"** rather than claiming real-time cellular phone tapping.
6. **Honest Authentication**: Production auth is not connected in the prototype; "Enter SwarGuard" informs the user to use demo access rather than faking success.

---

## 4. Key Architectural Features

- **Decoded Acoustic Waveforms (`SwarSignalWaveform`)**: Decoded via native Web Audio `AudioContext.decodeAudioData` into normalized amplitude bars (200+ bars). Playhead follows audio playback via `requestAnimationFrame` with zero animation jitter.
- **Synchronised Threat Timeline**: Evidence indicators unlock dynamically as playback reaches the exact timestamp, or can be inspected in full.
- **Multilingual Support (EN / GU / HI)**:
  - English (Institutional lexicon)
  - Gujarati / ગુજરાતી (Regional idioms & family safety warnings)
  - Hindi / हिन्दी (Devanagari dialect & formal impersonation markers)
  *Translation note*: Regional translations are maintained in JSON dictionaries and require native-speaker review.
- **Verification Test Lab (`/test-lab`)**: Automated 4-case test suite. Pass/fail results are dynamically derived at runtime by comparing actual results with expected ground truth.
- **Client-Side Privacy**: All audio decoding occurs entirely in the user's browser memory. Audio binary buffers are never persisted or stored in `localStorage`.

---

## 5. Adding New Audio Scenarios

1. Generate or place synthetic/consented `.wav` or `.mp3` files in `/public/demo-audio/`.
2. Document the duration and evidence timeline in `/public/DEMO_AUDIO.md`.
3. Register the scenario in `src/data/fixtures/scenarios.ts` with start/end timestamps and multilingual explanations.

---

## 6. Known Limitations

- **Simulated Calls**: Analyzes pre-recorded or uploaded audio; does not interface with cellular baseband hardware or telco switches.
- **Acoustic Fidelity**: Compressed telephone audio (8 kHz AMR) and loud street noise can impact phrase detection accuracy.
- **Regional Dialects**: Heavy code-mixing (Hinglish/Gujlish) requires expanded acoustic model fine-tuning.
