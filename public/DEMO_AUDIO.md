# SwarGuard Synthetic Demo Audio Specifications

This directory contains synthetic, consented telephonic audio simulations designed strictly for safety benchmarking, model evaluation, and offline UI demonstration.

## Ethical Standards & Privacy Compliance
- **No Real Voices**: No real individuals' voiceprints, names, or copyrighted recordings are used.
- **Synthesized Voice Cadence**: Formant harmonic modulation and telephonic filter curves synthesize conversational speech cadence without mimicking specific private persons.
- **Strict Labeling**: All associated evidence indicators and transcripts are labeled as **"Sample data / Demo fixture"** throughout the platform.

---

## Registered Demo Audio Scenarios & Timelines

### 1. `digital_arrest_scam.wav`
- **Duration**: 28.0 seconds
- **Format**: WAV (PCM Mono, 22.05 kHz, 16-bit)
- **Classification**: High Risk (Digital Arrest Scam)
- **Timeline & Evidence Indicators**:
  - `00:03 - 00:07`: "CBI Crime Branch Headquarters New Delhi" — Category: `authority_impersonation` (Risk: High)
  - `00:10 - 00:15`: "Do not disconnect this line. You are under immediate digital custody" — Category: `isolation` (Risk: High)
  - `00:18 - 00:23`: "Transfer statutory clearance deposit to court escrow account" — Category: `coercive_money_demands` (Risk: High)

### 2. `fake_kyc_otp.wav`
- **Duration**: 24.0 seconds
- **Format**: WAV (PCM Mono, 22.05 kHz, 16-bit)
- **Classification**: High Risk (Fake KYC & OTP Theft)
- **Timeline & Evidence Indicators**:
  - `00:02 - 00:06`: "Your bank account and debit card are suspended for pending KYC" — Category: `suspicious_kyc_claims` (Risk: High)
  - `00:09 - 00:14`: "Update within 15 minutes or your account will be frozen permanently" — Category: `artificial_urgency` (Risk: Medium)
  - `00:16 - 00:21`: "Read out the six-digit verification code received on your mobile" — Category: `credential_requests` (Risk: High)

### 3. `courier_fraud.wav`
- **Duration**: 26.0 seconds
- **Format**: WAV (PCM Mono, 22.05 kHz, 16-bit)
- **Classification**: High Risk (Courier Impersonation & Narcotic Parcel Scam)
- **Timeline & Evidence Indicators**:
  - `00:03 - 00:08`: "Your parcel containing prohibited contraband has been intercepted by customs" — Category: `suspicious_parcel_claims` (Risk: High)
  - `00:11 - 00:16`: "Case registered under Customs Act. Connecting your call to Cyber Cell" — Category: `authority_impersonation` (Risk: High)
  - `00:19 - 00:24`: "Pay verification security fee immediately to cancel the arrest warrant" — Category: `threats` (Risk: High)

### 4. `routine_enquiry_genuine.wav`
- **Duration**: 22.0 seconds
- **Format**: WAV (PCM Mono, 22.05 kHz, 16-bit)
- **Classification**: Low Risk (Genuine Routine Service Enquiry)
- **Timeline & Evidence Indicators**:
  - `00:02 - 00:06`: "Calling from customer support regarding your scheduled technician visit" — Category: `suspicious_kyc_claims` (Risk: Low - Routine query)
  - `00:10 - 00:15`: "Please confirm if tomorrow 3 PM is convenient for the broadband check" — Category: `artificial_urgency` (Risk: Low - Flexible scheduling)
- **Notice**: *"No significant warning signs found does not guarantee that a call is legitimate."*
