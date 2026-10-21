// Sacred Devotional Audio Synthesizer using Web Audio API
// Provides procedural ambient soundscapes for the 4 moods and temple sacred sound effects

let audioCtx = null;
let activeMoodNodes = [];
let masterGainNode = null;
let currentSynthMood = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Play Sacred Temple Brass Bell (Ghanta 🔔)
export function playTempleBell(volume = 0.8) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Multi-frequency brass chime harmonics (Fundamental ~ 1088Hz, 2176Hz, 3264Hz, 4352Hz)
    const partials = [
      { freq: 1088, gain: 0.5, decay: 3.5 },
      { freq: 1632, gain: 0.35, decay: 2.8 },
      { freq: 2176, gain: 0.25, decay: 2.2 },
      { freq: 3264, gain: 0.15, decay: 1.6 },
      { freq: 540,  gain: 0.3,  decay: 4.0 } // Deep resonant gong body
    ];

    const masterBellGain = ctx.createGain();
    masterBellGain.gain.setValueAtTime(volume * 0.6, now);
    masterBellGain.connect(ctx.destination);

    partials.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      // Slight pitch glide on impact
      osc.frequency.exponentialRampToValueAtTime(freq * 0.995, now + decay);

      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(masterBellGain);

      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (err) {
    console.warn('Temple bell audio error:', err);
  }
}

// 2. Play Sacred Conch Shell (Shankhnaad 🐚)
export function playShankhnaad(volume = 0.8) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 4.2;

    const masterShankhGain = ctx.createGain();
    masterShankhGain.gain.setValueAtTime(0.001, now);
    // Swell like breath blowing into the conch shell
    masterShankhGain.gain.linearRampToValueAtTime(volume * 0.7, now + 1.2);
    masterShankhGain.gain.setValueAtTime(volume * 0.7, now + 2.5);
    masterShankhGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterShankhGain.connect(ctx.destination);

    // Conch shell fundamental + breath noise + rich overtones
    const f0 = 220; // A3
    const overtones = [
      { freq: f0, gain: 0.6 },
      { freq: f0 * 2, gain: 0.4 },
      { freq: f0 * 3, gain: 0.25 },
      { freq: f0 * 4, gain: 0.12 }
    ];

    overtones.forEach(({ freq, gain }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      
      // Pitch inflection simulating human breath into conch
      osc.frequency.setValueAtTime(freq * 0.96, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.03, now + 1.0);
      osc.frequency.linearRampToValueAtTime(freq, now + 2.0);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.94, now + duration);

      g.gain.setValueAtTime(gain, now);
      osc.connect(g);
      g.connect(masterShankhGain);

      osc.start(now);
      osc.stop(now + duration);
    });

    // Breath filter noise
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(3.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.08 * volume, now + 1.2);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterShankhGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  } catch (err) {
    console.warn('Shankhnaad audio error:', err);
  }
}

// 3. Ambient Mood Procedural Synthesizer
export function startMoodSynthesis(moodId, volume = 0.8) {
  stopMoodSynthesis();
  const ctx = getAudioContext();
  currentSynthMood = moodId;

  masterGainNode = ctx.createGain();
  masterGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGainNode.gain.linearRampToValueAtTime(volume * 0.65, ctx.currentTime + 1.5);
  masterGainNode.connect(ctx.destination);

  activeMoodNodes = [];

  const now = ctx.currentTime;

  if (moodId === 'original') {
    // 🕉️ Original: 136.1 Hz Cosmic Om Drone + Tanpura Sa-Pa harmonics
    const f0 = 136.1; // Earth Om frequency
    const harmonics = [
      { freq: f0, gain: 0.35, type: 'sine' },
      { freq: f0 * 1.5, gain: 0.22, type: 'sine' }, // Pa (Fifth)
      { freq: f0 * 2.0, gain: 0.18, type: 'triangle' }, // High Sa
      { freq: f0 * 0.5, gain: 0.25, type: 'sine' } // Sub drone
    ];

    harmonics.forEach(({ freq, gain, type }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      // Subtle slow chorus detune
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.2 + Math.random() * 0.15;
      lfoGain.gain.value = 1.2;
      lfo.connect(osc.frequency);
      lfo.start();
      activeMoodNodes.push(lfo);

      g.gain.setValueAtTime(gain, now);
      osc.connect(g);
      g.connect(masterGainNode);
      osc.start();
      activeMoodNodes.push(osc);
    });
  } 
  else if (moodId === 'peaceful') {
    // 🌸 Peaceful: 432 Hz healing vibration + soft acoustic bansuri drone
    const f0 = 216; // 432Hz octave lower
    const notes = [
      { freq: f0, gain: 0.28, type: 'sine' },
      { freq: f0 * 1.25, gain: 0.20, type: 'sine' }, // Major third
      { freq: f0 * 1.5, gain: 0.18, type: 'sine' },  // Fifth
      { freq: 432, gain: 0.15, type: 'triangle' }   // 432 Hz
    ];

    notes.forEach(({ freq, gain, type }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.15;
      lfoGain.gain.value = 0.8;
      lfo.connect(osc.frequency);
      lfo.start();
      activeMoodNodes.push(lfo);

      g.gain.setValueAtTime(gain, now);
      osc.connect(g);
      g.connect(masterGainNode);
      osc.start();
      activeMoodNodes.push(osc);
    });
  } 
  else if (moodId === 'happy') {
    // ☀️ Happy: Joyful warm pad + gentle periodic harp/sitar arpeggio
    const chord = [261.63, 329.63, 392.00, 523.25]; // C Major
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.12, now);
      osc.connect(g);
      g.connect(masterGainNode);
      osc.start();
      activeMoodNodes.push(osc);
    });
  } 
  else if (moodId === 'motivational') {
    // 🔥 Motivational: Driving low bass pulse + bold sacred brass chord
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = 'sawtooth';
    bass.frequency.setValueAtTime(73.42, now); // D2

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    bassGain.gain.setValueAtTime(0.25, now);
    bass.connect(filter);
    filter.connect(bassGain);
    bassGain.connect(masterGainNode);
    bass.start();
    activeMoodNodes.push(bass);

    // Heroic power fifths
    const brassFreqs = [146.83, 220.00, 293.66];
    brassFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.15, now);
      osc.connect(g);
      g.connect(masterGainNode);
      osc.start();
      activeMoodNodes.push(osc);
    });
  } 
  else if (moodId === 'powerful') {
    // ⚡ Powerful: Thunderous sub-bass Rudra resonance + war drum & epic chord
    const subBass = ctx.createOscillator();
    const subGain = ctx.createGain();
    subBass.type = 'sine';
    subBass.frequency.setValueAtTime(55.0, now); // A1

    subGain.gain.setValueAtTime(0.35, now);
    subBass.connect(subGain);
    subGain.connect(masterGainNode);
    subBass.start();
    activeMoodNodes.push(subBass);

    // Deep Rudra harmonics
    const rudraFreqs = [110.00, 164.81, 220.00, 277.18]; // A Major power
    rudraFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      g.gain.setValueAtTime(0.12, now);
      osc.connect(filter);
      filter.connect(g);
      g.connect(masterGainNode);
      osc.start();
      activeMoodNodes.push(osc);
    });
  }
}

export function updateMoodSynthesisVolume(volume) {
  if (masterGainNode && audioCtx) {
    try {
      masterGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGainNode.gain.linearRampToValueAtTime(Math.max(0.0001, volume * 0.65), audioCtx.currentTime + 0.1);
    } catch {
      // Ignore
    }
  }
}

export function stopMoodSynthesis() {
  if (activeMoodNodes.length > 0) {
    activeMoodNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // Ignore
      }
    });
    activeMoodNodes = [];
  }
  if (masterGainNode) {
    try {
      masterGainNode.disconnect();
    } catch {
      // Ignore
    }
    masterGainNode = null;
  }
  currentSynthMood = null;
}
