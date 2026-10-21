import React, { useState, useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import BackgroundView from './components/BackgroundView';
import DarshanFrame from './components/DarshanFrame';
import Header from './components/Header';
import MoodSelectorBar from './components/MoodSelectorBar';
import MinimalPlayback from './components/MinimalPlayback';
import AartiDiya from './components/AartiDiya';
import LyricsModal from './components/LyricsModal';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import { useDevotionalAudio } from './hooks/useDevotionalAudio';
import { useZenMode } from './hooks/useZenMode';

export default function App() {
  const {
    audioRef1,
    audioRef2,
    activeMood,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    selectMood,
    togglePlay,
    nextMood,
    prevMood,
    skipForward,
    skipBackward,
    seekTo,
    toggleMute,
    setVolume
  } = useDevotionalAudio();

  // Auto-hiding Zen Mode (4-second inactivity fade)
  const { isZenActive, wakeUp } = useZenMode(isPlaying, 4000);

  // Aarti Diya Flame State
  const [aartiActive, setAartiActive] = useState(false);
  const [aartiPos, setAartiPos] = useState(null);
  const longPressTimerRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Modals State
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    } else {
      setInstallModalOpen(true);
    }
  };

  // If clicking active mood -> toggle play/pause; if clicking new mood -> smooth crossfade & auto-play
  const handleMoodSelect = (moodId) => {
    if (moodId === activeMood.id) {
      togglePlay();
    } else {
      selectMood(moodId);
    }
  };

  // Screen Long-Press detection to light Aarti Diya flame
  const handlePointerDown = (e) => {
    wakeUp();
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    if (!x || !y) return;

    startPosRef.current = { x, y };

    longPressTimerRef.current = setTimeout(() => {
      setAartiPos({ x, y });
      setAartiActive(true);
    }, 450);
  };

  const handlePointerMove = (e) => {
    wakeUp();
    if (longPressTimerRef.current) {
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      const dx = Math.abs(x - startPosRef.current.x);
      const dy = Math.abs(y - startPosRef.current.y);
      if (dx > 12 || dy > 12) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden flex flex-col justify-between font-['Outfit',sans-serif] select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {/* Dual HTML5 Audio Elements for Smooth Crossfading */}
      <audio
        ref={audioRef1}
        preload="auto"
        playsInline
        className="hidden"
      />
      <audio
        ref={audioRef2}
        preload="auto"
        playsInline
        className="hidden"
      />

      {/* 1. Fullscreen Hanuman Ji Artwork (Pure Darshan) */}
      <BackgroundView
        isPlaying={isPlaying}
        activeMood={activeMood}
      />

      {/* 2. Top Header with Zen-Mode Fade */}
      <div className={`transition-opacity duration-1000 ${isZenActive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        <Header
          onInstallPwa={handleInstallClick}
        />
      </div>

      {/* 3. Center Screen: Sacred Square Picture Card (Center Top Darshan) */}
      <DarshanFrame
        activeMood={activeMood}
        isPlaying={isPlaying}
      />

      {/* 4. Bottom Controls: Centered Mood Buttons + Centered Playback Dock Flanked by Diya & Chalisa Paath */}
      <div className={`relative z-20 w-full px-3 sm:px-6 pb-2.5 sm:pb-4 safe-pb flex flex-col items-center justify-center transition-opacity duration-1000 ${isZenActive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        {/* All Moods Aligned in One Line Centered */}
        <MoodSelectorBar
          activeMoodId={activeMood.id}
          onSelectMood={handleMoodSelect}
          isPlaying={isPlaying}
        />

        {/* Flanked Playback Console: [ 🪔 Aarti Diya ] [ ⏮ ▶/⏸ ⏭ ] [ 📖 चालीसा पाठ ] */}
        <div className="flex items-center justify-center gap-2.5 min-[380px]:gap-3.5 sm:gap-5 mt-2 sm:mt-2.5">
          {/* Left: Aarti Diya Flame Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAartiActive((prev) => !prev);
            }}
            title={aartiActive ? "Extinguish Aarti Flame" : "Light Aarti Diya Flame (🪔)"}
            aria-label={aartiActive ? "Extinguish Aarti Flame" : "Light Aarti Diya Flame"}
            className={`h-11 sm:h-12 min-w-[44px] px-3 sm:px-4 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 backdrop-blur-xl cursor-pointer active:scale-90 select-none shadow-[0_8px_24px_rgba(0,0,0,0.7)] ${
              aartiActive
                ? 'bg-amber-400 text-slate-950 font-bold border border-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.85)] scale-105'
                : 'bg-black/40 hover:bg-black/60 border border-white/15 text-amber-200 hover:text-amber-100'
            }`}
          >
            <span className="text-lg sm:text-xl filter drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">🪔</span>
            <span className="hidden sm:inline text-xs font-semibold tracking-wide">आरती</span>
          </button>

          {/* Center: Retrofy-Style Single Capsule Playback Dock */}
          <MinimalPlayback
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onPrev={prevMood}
            onNext={nextMood}
          />

          {/* Right: Chalisa Paath (सम्पूर्ण चालीसा पाठ एवं भावार्थ) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLyricsOpen(true);
            }}
            title="सम्पूर्ण हनुमान चालीसा पाठ एवं भावार्थ (Full Lyrics & Meaning)"
            aria-label="हनुमान चालीसा पाठ"
            className="h-11 sm:h-12 min-w-[44px] px-3 sm:px-4 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-amber-400/35 hover:border-amber-400/70 text-amber-200 hover:text-white flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer active:scale-90 select-none shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            <span className="hidden sm:inline text-xs font-semibold tracking-wide">पाठ</span>
          </button>
        </div>
      </div>

      {/* Pure Interactive Aarti Diya Flame (Parikrama & Drag Mode) */}
      <AartiDiya
        isActive={aartiActive}
        initialPos={aartiPos}
        onClose={() => setAartiActive(false)}
      />

      {/* Full Hanuman Chalisa Lyrics Modal with Line-by-Line Meaning */}
      <LyricsModal
        isOpen={lyricsOpen}
        onClose={() => setLyricsOpen(false)}
        currentTime={currentTime}
        duration={duration}
      />

      {/* PWA Install Modal */}
      <PwaInstallPrompt
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstalledSuccess={() => setDeferredPrompt(null)}
      />
    </div>
  );
}
