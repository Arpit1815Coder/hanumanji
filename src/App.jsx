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

  // Screen Long-Press detection to light Aarti Diya flame (only on empty screen, not on buttons or controls)
  const clearLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  useEffect(() => {
    const handleGlobalEnd = () => clearLongPress();
    window.addEventListener('pointerup', handleGlobalEnd);
    window.addEventListener('pointercancel', handleGlobalEnd);
    window.addEventListener('touchend', handleGlobalEnd);
    window.addEventListener('touchcancel', handleGlobalEnd);
    return () => {
      window.removeEventListener('pointerup', handleGlobalEnd);
      window.removeEventListener('pointercancel', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
      window.removeEventListener('touchcancel', handleGlobalEnd);
      clearLongPress();
    };
  }, []);

  const handlePointerDown = (e) => {
    wakeUp();
    clearLongPress();

    // Do NOT trigger long-press if touching any button, modal, or interactive control
    if (e.target && e.target.closest && e.target.closest('button, a, input, select, textarea, [role="button"], [data-no-longpress="true"]')) {
      return;
    }

    const x = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const y = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    if (x == null || y == null) return;

    startPosRef.current = { x, y };

    // Deliberate 750ms intentional long-press required
    longPressTimerRef.current = setTimeout(() => {
      setAartiPos({ x, y });
      setAartiActive(true);
      longPressTimerRef.current = null;
    }, 750);
  };

  const handlePointerMove = (e) => {
    wakeUp();
    if (longPressTimerRef.current) {
      const x = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const y = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (x != null && y != null) {
        const dx = Math.abs(x - startPosRef.current.x);
        const dy = Math.abs(y - startPosRef.current.y);
        // If moved even slightly (> 8px), cancel long-press
        if (dx > 8 || dy > 8) {
          clearLongPress();
        }
      }
    }
  };

  const handlePointerUp = () => {
    clearLongPress();
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden flex flex-col justify-between font-['Outfit',sans-serif] select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
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
          onOpenLyrics={() => setLyricsOpen(true)}
          onInstallPwa={handleInstallClick}
          onToggleAarti={() => setAartiActive((prev) => !prev)}
          isAartiActive={aartiActive}
        />
      </div>

      {/* 3. Center Screen: Mobile Square Picture Card (Center Top) OR Desktop/Tablet Pure Darshan */}
      <DarshanFrame
        activeMood={activeMood}
        isPlaying={isPlaying}
      />
      <div className="hidden md:flex flex-1 pointer-events-none" />

      {/* 4. Bottom Controls: Centered Mood Buttons + Centered Playback Dock */}
      <div className={`relative z-20 w-full px-3 sm:px-6 pb-2.5 sm:pb-4 safe-pb flex flex-col items-center justify-center transition-opacity duration-1000 ${isZenActive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        {/* All Moods Aligned in One Line Centered */}
        <MoodSelectorBar
          activeMoodId={activeMood.id}
          onSelectMood={handleMoodSelect}
          isPlaying={isPlaying}
        />

        {/* Mobile View (< md): Flanked Playback Console [ 🪔 Aarti Diya ] [ ⏮ ▶/⏸ ⏭ ] [ 📖 चालीसा पाठ ] */}
        <div className="flex md:hidden items-center justify-center gap-2.5 min-[380px]:gap-3.5 mt-2">
          {/* Left: Aarti Diya Flame Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAartiActive((prev) => !prev);
            }}
            title={aartiActive ? "Extinguish Aarti Flame" : "Light Aarti Diya Flame (🪔)"}
            aria-label={aartiActive ? "Extinguish Aarti Flame" : "Light Aarti Diya Flame"}
            className={`h-11 min-w-[44px] px-3 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 backdrop-blur-xl cursor-pointer active:scale-90 select-none shadow-[0_8px_24px_rgba(0,0,0,0.7)] ${
              aartiActive
                ? 'bg-amber-400 text-slate-950 font-bold border border-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.85)] scale-105'
                : 'bg-black/40 hover:bg-black/60 border border-white/15 text-amber-200 hover:text-amber-100'
            }`}
          >
            <span className="text-lg filter drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">🪔</span>
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
            className="h-11 min-w-[44px] px-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-amber-400/35 hover:border-amber-400/70 text-amber-200 hover:text-white flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer active:scale-90 select-none shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
          </button>
        </div>

        {/* Tablet & Laptop View (>= md): Clean Centered Playback Dock (Original Layout) */}
        <div className="hidden md:flex items-center justify-center mt-2.5">
          <MinimalPlayback
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onPrev={prevMood}
            onNext={nextMood}
          />
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
