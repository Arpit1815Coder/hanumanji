import { useState, useEffect, useRef, useCallback } from 'react';
import { MOODS } from '../data/moods';
import { stopMoodSynthesis } from '../utils/audioSynthesis';

const STORAGE_KEYS = {
  MOOD: 'hanuman_chalisa_mood',
  VOLUME: 'hanuman_chalisa_volume',
  MUTED: 'hanuman_chalisa_muted',
  LOOP: 'hanuman_chalisa_loop',
};

export function useDevotionalAudio() {
  const [activeMoodId, setActiveMoodId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.MOOD) || 'original';
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOLUME);
    return saved !== null ? parseFloat(saved) : 0.85;
  });
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
  });
  const [isLooping, setIsLooping] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOOP);
    return saved !== null ? saved === 'true' : true;
  });

  // Dual audio elements for smooth studio crossfading
  const audioRef1 = useRef(null);
  const audioRef2 = useRef(null);
  const activeSlotRef = useRef(0); // 0 -> audioRef1, 1 -> audioRef2
  const crossfadeTimerRef = useRef(null);
  const isSeekingRef = useRef(false);

  const activeMood = MOODS.find((m) => m.id === activeMoodId) || MOODS[0];

  const getActiveAudio = useCallback(() => {
    return activeSlotRef.current === 0 ? audioRef1.current : audioRef2.current;
  }, []);

  const getIdleAudio = useCallback(() => {
    return activeSlotRef.current === 0 ? audioRef2.current : audioRef1.current;
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOOD, activeMoodId);
  }, [activeMoodId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MUTED, isMuted.toString());
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOOP, isLooping.toString());
  }, [isLooping]);

  // Initial Audio Setup for both slots
  useEffect(() => {
    const audio1 = audioRef1.current;
    const audio2 = audioRef2.current;
    if (!audio1 || !audio2) return;

    if (!audio1.getAttribute('src') && !audio2.getAttribute('src')) {
      audio1.src = activeMood.audioSrc;
      audio1.volume = isMuted ? 0 : volume;
    }

    const onTimeUpdate = (e) => {
      if (e.target === getActiveAudio() && !isSeekingRef.current) {
        setCurrentTime(e.target.currentTime || 0);
      }
    };

    const onLoadedMetadata = (e) => {
      if (e.target === getActiveAudio()) {
        setDuration(e.target.duration || 0);
      }
    };

    const onEnded = (e) => {
      if (e.target === getActiveAudio()) {
        if (isLooping) {
          e.target.currentTime = 0;
          e.target.play().catch(console.warn);
        } else {
          setIsPlaying(false);
        }
      }
    };

    [audio1, audio2].forEach((audio) => {
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('ended', onEnded);
    });

    return () => {
      [audio1, audio2].forEach((audio) => {
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('ended', onEnded);
      });
    };
  }, [getActiveAudio, isLooping, isMuted, volume]);

  // Handle master volume changes
  useEffect(() => {
    const targetVol = isMuted ? 0 : volume;
    const active = getActiveAudio();
    if (active && !crossfadeTimerRef.current) {
      active.volume = targetVol;
    }
  }, [volume, isMuted, getActiveAudio]);

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    const activeAudio = getActiveAudio();
    if (!activeAudio) return;

    stopMoodSynthesis();

    if (isPlaying) {
      activeAudio.pause();
      setIsPlaying(false);
    } else {
      activeAudio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback failed:', err);
        setIsPlaying(false);
      });
    }
  }, [isPlaying, getActiveAudio]);

  // Switch Mood with Smooth 1.4-second Crossfading
  const selectMood = useCallback((moodId) => {
    stopMoodSynthesis();
    setActiveMoodId(moodId);

    const targetMood = MOODS.find((m) => m.id === moodId) || MOODS[0];
    const currentAudio = getActiveAudio();
    const idleAudio = getIdleAudio();
    const targetVol = isMuted ? 0 : volume;

    if (!currentAudio || !idleAudio) return;

    // Clear any previous crossfade
    if (crossfadeTimerRef.current) {
      clearInterval(crossfadeTimerRef.current);
      crossfadeTimerRef.current = null;
    }

    // Set new audio source on idle slot
    idleAudio.src = targetMood.audioSrc;
    idleAudio.currentTime = 0;
    setCurrentTime(0);

    if (isPlaying) {
      // Crossfade logic: smoothly ramp down currentAudio while ramping up idleAudio over 1200ms
      idleAudio.volume = 0;
      const playPromise = idleAudio.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          const durationMs = 1200;
          const intervalMs = 30;
          const totalSteps = durationMs / intervalMs;
          let step = 0;

          crossfadeTimerRef.current = setInterval(() => {
            step++;
            const t = Math.min(1, step / totalSteps);

            currentAudio.volume = Math.max(0, targetVol * (1 - t));
            idleAudio.volume = Math.min(targetVol, targetVol * t);

            if (step >= totalSteps) {
              clearInterval(crossfadeTimerRef.current);
              crossfadeTimerRef.current = null;
              currentAudio.pause();
              currentAudio.currentTime = 0;
              currentAudio.volume = targetVol;
              idleAudio.volume = targetVol;
              // Swap active slot
              activeSlotRef.current = activeSlotRef.current === 0 ? 1 : 0;
              setDuration(idleAudio.duration || 0);
            }
          }, intervalMs);
        }).catch((err) => {
          console.warn('Crossfade playback notice:', err);
        });
      }
    } else {
      // If paused, just load target audio into active slot and begin playing
      currentAudio.src = targetMood.audioSrc;
      currentAudio.currentTime = 0;
      currentAudio.volume = targetVol;
      setIsPlaying(true);
      currentAudio.play().then(() => {
        setIsPlaying(true);
      }).catch(console.warn);
    }
  }, [getActiveAudio, getIdleAudio, isMuted, volume, isPlaying]);

  // Navigate Previous / Next Mood
  const nextMood = useCallback(() => {
    const currentIndex = MOODS.findIndex((m) => m.id === activeMoodId);
    const nextIndex = (currentIndex + 1) % MOODS.length;
    selectMood(MOODS[nextIndex].id);
  }, [activeMoodId, selectMood]);

  const prevMood = useCallback(() => {
    const currentIndex = MOODS.findIndex((m) => m.id === activeMoodId);
    const prevIndex = (currentIndex - 1 + MOODS.length) % MOODS.length;
    selectMood(MOODS[prevIndex].id);
  }, [activeMoodId, selectMood]);

  // Seek / Scrubber Controls
  const seekTo = useCallback((seconds) => {
    const safeTime = Math.max(0, Math.min(seconds, duration || 0));
    setCurrentTime(safeTime);
    const active = getActiveAudio();
    if (active) {
      active.currentTime = safeTime;
    }
  }, [duration, getActiveAudio]);

  const skipForward = useCallback((seconds = 10) => {
    seekTo(currentTime + seconds);
  }, [currentTime, seekTo]);

  const skipBackward = useCallback((seconds = 10) => {
    seekTo(currentTime - seconds);
  }, [currentTime, seekTo]);

  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const adjustVolume = useCallback((delta) => {
    setVolume((prev) => {
      const next = Math.max(0, Math.min(1, prev + delta));
      if (next > 0 && isMuted) {
        setIsMuted(false);
      }
      return parseFloat(next.toFixed(2));
    });
  }, [isMuted]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward(10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(0.05);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-0.05);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyP':
          e.preventDefault();
          prevMood();
          break;
        case 'KeyN':
          e.preventDefault();
          nextMood();
          break;
        case 'KeyL':
          e.preventDefault();
          toggleLoop();
          break;
        case 'Digit1':
          e.preventDefault();
          selectMood('original');
          break;
        case 'Digit2':
          e.preventDefault();
          selectMood('peaceful');
          break;
        case 'Digit3':
          e.preventDefault();
          selectMood('happy');
          break;
        case 'Digit4':
          e.preventDefault();
          selectMood('motivational');
          break;
        case 'Digit5':
          e.preventDefault();
          selectMood('powerful');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skipBackward, skipForward, adjustVolume, toggleMute, toggleLoop, selectMood, prevMood, nextMood]);

  return {
    audioRef1,
    audioRef2,
    audioRef: audioRef1, // Backwards compatibility alias
    activeMood,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    isLooping,
    togglePlay,
    selectMood,
    nextMood,
    prevMood,
    seekTo,
    skipForward,
    skipBackward,
    setVolume,
    toggleLoop,
    toggleMute,
    isSeekingRef
  };
}
