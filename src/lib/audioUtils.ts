/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Extracts normalized peak values from an AudioBuffer.
 * Returns an array of normalized values between 0.05 and 1.0.
 */
export const extractWaveformPeaks = (
  audioBuffer: AudioBuffer,
  targetBars: number = 220
): number[] => {
  const channelData = audioBuffer.getChannelData(0); // primary channel
  const totalSamples = channelData.length;
  const blockSize = Math.floor(totalSamples / targetBars);
  const peaks: number[] = [];

  let maxVal = 0;
  for (let i = 0; i < targetBars; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, totalSamples);
    let sumSquares = 0;
    let count = 0;

    for (let j = start; j < end; j += 4) { // downsample for speed
      const val = channelData[j];
      sumSquares += val * val;
      count++;
    }

    const rms = count > 0 ? Math.sqrt(sumSquares / count) : 0;
    if (rms > maxVal) {
      maxVal = rms;
    }
    peaks.push(rms);
  }

  // Normalize so highest peak is 1.0, and floor is at least 0.06
  const scale = maxVal > 0 ? 1 / maxVal : 1;
  return peaks.map((p) => Math.max(0.06, Math.min(1.0, p * scale)));
};

/**
 * Generates a standard WAV file binary buffer in memory.
 * Used to create synthetic consented audio files for testing and offline demos.
 */
export const generateSyntheticWavBuffer = (
  durationSeconds: number,
  pattern: 'digital_arrest' | 'kyc' | 'courier' | 'genuine' = 'digital_arrest',
  sampleRate: number = 22050
): Uint8Array => {
  const numSamples = Math.floor(durationSeconds * sampleRate);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true); // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Generate synthetic telephonic tone modulated voice-like pattern
  // Simulates phone call voice cadence: formant tones (180Hz, 340Hz, 800Hz, 1400Hz) with speech cadences
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Speech syllables cadence envelope (approx 3.5 syllables per sec)
    const cadence = 0.5 + 0.5 * Math.sin(2 * Math.PI * 3.5 * t);
    // Pause intervals every 4 seconds simulating speaker turns
    const pauseEnvelope = Math.sin(2 * Math.PI * 0.25 * t) > -0.2 ? 1 : 0.08;

    let sample = 0;
    if (pattern === 'digital_arrest') {
      // Deeper authoritative, urgent frequency modulation
      const f1 = 160 + 20 * Math.sin(2 * Math.PI * 1.5 * t);
      const f2 = 420 + 40 * Math.sin(2 * Math.PI * 2 * t);
      sample = (Math.sin(2 * Math.PI * f1 * t) * 0.5 + Math.sin(2 * Math.PI * f2 * t) * 0.3) * cadence * pauseEnvelope;
    } else if (pattern === 'kyc') {
      // Faster, repetitive customer care mimicry
      const f1 = 220 + 30 * Math.sin(2 * Math.PI * 4 * t);
      const f2 = 650;
      sample = (Math.sin(2 * Math.PI * f1 * t) * 0.4 + Math.sin(2 * Math.PI * f2 * t) * 0.3) * cadence * pauseEnvelope;
    } else if (pattern === 'courier') {
      // Automated IVR notification followed by scammer transfer
      const f1 = t < 6 ? 440 : 200 + 40 * Math.sin(2 * Math.PI * 2 * t);
      sample = (Math.sin(2 * Math.PI * f1 * t) * 0.4) * cadence * pauseEnvelope;
    } else {
      // Genuine calm conversational pattern
      const f1 = 180 + 15 * Math.sin(2 * Math.PI * 1.2 * t);
      const f2 = 500;
      sample = (Math.sin(2 * Math.PI * f1 * t) * 0.35 + Math.sin(2 * Math.PI * f2 * t) * 0.25) * cadence * pauseEnvelope;
    }

    // Add mild telephone line noise/crackle
    const noise = (Math.random() * 2 - 1) * 0.03;
    const finalVal = Math.max(-1, Math.min(1, (sample + noise) * 0.7));
    view.setInt16(offset, finalVal < 0 ? finalVal * 0x8000 : finalVal * 0x7fff, true);
    offset += 2;
  }

  return new Uint8Array(buffer);
};
