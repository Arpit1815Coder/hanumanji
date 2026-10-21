const fs = require('fs');
const path = require('path');

// Helper to write a 16-bit PCM WAV file
function generateWavBuffer(sampleRate, durationSeconds, generateSample) {
  const numChannels = 2;
  const bytesPerSample = 2;
  const totalSamples = Math.floor(sampleRate * durationSeconds);
  const dataByteLength = totalSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataByteLength);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataByteLength, 4);
  buffer.write('WAVE', 8);

  // "fmt " sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28);
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34);

  // "data" sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataByteLength, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const [left, right] = generateSample(t, durationSeconds);

    const clampL = Math.max(-1, Math.min(1, left));
    const clampR = Math.max(-1, Math.min(1, right));

    const sample16L = Math.floor(clampL < 0 ? clampL * 32768 : clampL * 32767);
    const sample16R = Math.floor(clampR < 0 ? clampR * 32768 : clampR * 32767);

    buffer.writeInt16LE(sample16L, offset);
    buffer.writeInt16LE(sample16R, offset + 2);
    offset += 4;
  }

  return buffer;
}

const sampleRate = 44100;
const duration = 24.0; // 24 seconds seamless loopable snippet

// 1. Original (Cosmic Om 136.1 Hz + Tanpura drone + Temple Bell)
function originalAudio(t, dur) {
  const fadeInOut = Math.sin((t / dur) * Math.PI);
  const f0 = 136.1;
  const tanpura1 = Math.sin(2 * Math.PI * f0 * t) * 0.28;
  const tanpura2 = Math.sin(2 * Math.PI * (f0 * 1.5) * t) * 0.18;
  const tanpura3 = Math.sin(2 * Math.PI * (f0 * 2.0) * t) * 0.14;
  const subBass = Math.sin(2 * Math.PI * (f0 * 0.5) * t) * 0.2;

  const bellPeriod = t % 6.0;
  const bellEnv = Math.exp(-bellPeriod * 2.5);
  const bellStrike = (
    Math.sin(2 * Math.PI * 1088 * bellPeriod) * 0.15 +
    Math.sin(2 * Math.PI * 2176 * bellPeriod) * 0.08 +
    Math.sin(2 * Math.PI * 3264 * bellPeriod) * 0.04
  ) * bellEnv;

  const total = (tanpura1 + tanpura2 + tanpura3 + subBass + bellStrike) * fadeInOut * 0.75;
  return [total, total];
}

// 2. Peaceful (432 Hz healing frequency, bansuri breath & soft chimes)
function peacefulAudio(t, dur) {
  const fadeInOut = Math.sin((t / dur) * Math.PI);
  const d1 = Math.sin(2 * Math.PI * 216 * t) * 0.25;
  const d2 = Math.sin(2 * Math.PI * 270 * t + 0.3) * 0.18;
  const d3 = Math.sin(2 * Math.PI * 324 * t + 0.6) * 0.15;
  const fluteLFO = (1 + 0.15 * Math.sin(2 * Math.PI * 4.5 * t));
  const flute = Math.sin(2 * Math.PI * 432 * t) * 0.2 * fluteLFO;

  const bowlPeriod = t % 8.0;
  const bowlEnv = Math.exp(-bowlPeriod * 0.9);
  const bowl = (Math.sin(2 * Math.PI * 576 * bowlPeriod) * 0.12 + Math.sin(2 * Math.PI * 864 * bowlPeriod) * 0.06) * bowlEnv;

  const left = (d1 + d2 + flute + bowl) * fadeInOut * 0.65;
  const right = (d1 + d3 + flute + bowl) * fadeInOut * 0.65;
  return [left, right];
}

// 3. Happy (Joyful pentatonic arpeggio sequence + warm temple manjira)
function happyAudio(t, dur) {
  const fadeInOut = Math.sin((t / dur) * Math.PI);
  const beat = 0.6;
  const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00];
  const step = Math.floor((t / (beat * 0.5)) % notes.length);
  const noteFreq = notes[step];
  const notePhase = (t % (beat * 0.5)) / (beat * 0.5);
  const noteEnv = Math.exp(-notePhase * 4.0);
  const harp = Math.sin(2 * Math.PI * noteFreq * t) * 0.25 * noteEnv;

  const pad = (Math.sin(2 * Math.PI * 130.81 * t) * 0.15 + Math.sin(2 * Math.PI * 196.00 * t) * 0.12);
  const manjiraPeriod = t % beat;
  const manjiraEnv = Math.exp(-manjiraPeriod * 9.0);
  const manjira = (Math.sin(2 * Math.PI * 2400 * manjiraPeriod) * 0.08) * manjiraEnv;

  const left = (harp * 0.8 + pad + manjira) * fadeInOut * 0.7;
  const right = (harp * 1.0 + pad + manjira) * fadeInOut * 0.7;
  return [left, right];
}

// 4. Motivational (High energy, powerful rhythmic damru pulses & sacred horns)
function motivationalAudio(t, dur) {
  const fadeInOut = Math.sin((t / dur) * Math.PI);
  const tempoBeat = 0.45; // ~133 BPM
  const drumPhase = (t % tempoBeat) / tempoBeat;
  const drumEnv = Math.exp(-drumPhase * 8.0);
  const drumPitch = 85 * Math.exp(-drumPhase * 5.0) + 45;
  const drum = Math.sin(2 * Math.PI * drumPitch * t) * 0.45 * drumEnv;

  const clapPhase = ((t + tempoBeat * 0.5) % tempoBeat) / tempoBeat;
  const clapEnv = Math.exp(-clapPhase * 14.0);
  const clap = (Math.sin(2 * Math.PI * 650 * t) * 0.15) * clapEnv;

  const horn = (
    Math.sin(2 * Math.PI * 146.83 * t) * 0.2 +
    Math.sin(2 * Math.PI * 220.00 * t) * 0.18 +
    Math.sin(2 * Math.PI * 293.66 * t) * 0.12
  );

  const total = (drum + clap + horn) * fadeInOut * 0.75;
  return [total, total];
}

// 5. Powerful (Thunderous Rudra Shakti, heavy nagada drums & intense resonance)
function powerfulAudio(t, dur) {
  const fadeInOut = Math.sin((t / dur) * Math.PI);
  const tempoBeat = 0.4; // 150 BPM intense warrior cadence
  const drumPhase = (t % tempoBeat) / tempoBeat;
  
  // Massive sub-bass boom (55 Hz base)
  const drumEnv = Math.exp(-drumPhase * 6.5);
  const boomPitch = 120 * Math.exp(-drumPhase * 7.0) + 40;
  const boom = Math.sin(2 * Math.PI * boomPitch * t) * 0.55 * drumEnv;

  // Snappy nagada accent on 16th notes
  const nagadaPhase = (t % (tempoBeat * 0.25)) / (tempoBeat * 0.25);
  const nagadaEnv = Math.exp(-nagadaPhase * 16.0);
  const nagada = (Math.sin(2 * Math.PI * 340 * t) * 0.18 + Math.sin(2 * Math.PI * 680 * t) * 0.12) * nagadaEnv;

  // Rudra power chord (A1 55Hz, E2 82.4Hz, A2 110Hz, C#3 138.6Hz)
  const powerChord = (
    Math.sin(2 * Math.PI * 55.0 * t) * 0.22 +
    Math.sin(2 * Math.PI * 82.4 * t) * 0.20 +
    Math.sin(2 * Math.PI * 110.0 * t) * 0.16 +
    Math.sin(2 * Math.PI * 164.8 * t) * 0.12
  );

  const total = (boom + nagada + powerChord) * fadeInOut * 0.8;
  return [total, total];
}

const outDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating audio files in:', outDir);

const files = [
  { name: 'hanuman-original.mp3', fn: originalAudio },
  { name: 'hanuman-peaceful.mp3', fn: peacefulAudio },
  { name: 'hanuman-happy.mp3', fn: happyAudio },
  { name: 'hanuman-motivational.mp3', fn: motivationalAudio },
  { name: 'hanuman-powerful.mp3', fn: powerfulAudio }
];

for (const f of files) {
  console.log(`Synthesizing ${f.name}...`);
  const buf = generateWavBuffer(sampleRate, duration, f.fn);
  fs.writeFileSync(path.join(outDir, f.name), buf);
  console.log(`Saved ${f.name} (${(buf.length / 1024).toFixed(1)} KB)`);
}

console.log('All 5 audio previews generated successfully!');
