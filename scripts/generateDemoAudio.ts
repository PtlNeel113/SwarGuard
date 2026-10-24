import fs from 'fs';
import path from 'path';
import { generateSyntheticWavBuffer } from '../src/lib/audioUtils.ts';

const outDir = path.resolve(process.cwd(), 'public/demo-audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = [
  { name: 'digital_arrest_scam.wav', duration: 28, pattern: 'digital_arrest' as const },
  { name: 'fake_kyc_otp.wav', duration: 24, pattern: 'kyc' as const },
  { name: 'courier_fraud.wav', duration: 26, pattern: 'courier' as const },
  { name: 'routine_enquiry_genuine.wav', duration: 22, pattern: 'genuine' as const },
];

for (const file of files) {
  const filePath = path.join(outDir, file.name);
  const buffer = generateSyntheticWavBuffer(file.duration, file.pattern);
  fs.writeFileSync(filePath, Buffer.from(buffer));
  console.log(`Generated ${file.name} (${file.duration}s, ${buffer.length} bytes)`);
}
