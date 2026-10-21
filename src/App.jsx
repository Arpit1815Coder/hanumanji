import React, { useState, useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import BackgroundView from './components/BackgroundView';
import DarshanFrame from './components/DarshanFrame';
import Header from './components/Header';
import MoodSelectorBar from './components/MoodSelectorBar';
import MinimalPlayback from './components/MinimalPlayback';
import MinimalProgressBar from './components/MinimalProgressBar';
import AartiDiya from './components/AartiDiya';
import LyricsModal from './components/LyricsModal';
import SuvicharModal from './components/SuvicharModal';
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
  const [suvicharOpen, setSuvicharOpen] = useState(false);
  const [suvicharIndex, setSuvicharIndex] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  // Responsive Device Layout State (Supports explicit live testing on Laptop, Tablet, & Mobile)
  const [deviceMode, setDeviceMode] = useState(() => {
    if (typeof window === 'undefined') return 'laptop';
    const isMobileUA = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (window.innerWidth < 768 || (isMobileUA && window.innerWidth < 1024)) return 'mobile';
    if (window.innerWidth < 1024) return 'tablet';
    return 'laptop';
  });

  const isMobileView = deviceMode === 'mobile';

  // Auto-adapt to window resize if user has not manually pinned
  useEffect(() => {
    const handleResize = () => {
      const isMobileUA = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (window.innerWidth < 768 || (isMobileUA && window.innerWidth < 1024)) {
        setDeviceMode('mobile');
      } else if (window.innerWidth < 1024) {
        setDeviceMode('tablet');
      } else {
        setDeviceMode('laptop');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenSuvichar = (verseIdx = -1) => {
    if (verseIdx >= 0) {
      setSuvicharIndex(verseIdx);
    }
    setSuvicharOpen(true);
  };

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
      className="relative w-screen h-screen overflow-hidden flex flex-col justify-between font-['Outfit',sans-serif] select-none bg-[#eceef2] md:bg-black"
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
        isMobileView={isMobileView}
      />

      {/* Main Content Flow - Mobile View: Exact 50% / 50% Screen Split */}
      {isMobileView ? (
        <div className="flex-1 flex flex-col justify-between items-center w-full z-20 h-full max-w-[440px] mx-auto">
          {/* Top 50% Zone: Header + Sacred Darshan Picture (Image bottom touches exact 50% midpoint) */}
          <div className="w-full flex flex-col items-center justify-between h-1/2 shrink-0 pb-0">
            <div className={`w-full transition-opacity duration-1000 shrink-0 ${isZenActive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
              <Header
                onOpenLyrics={() => setLyricsOpen(true)}
                onOpenSuvichar={() => handleOpenSuvichar(-1)}
                onInstallPwa={handleInstallClick}
                onToggleAarti={() => setAartiActive((prev) => !prev)}
                isAartiActive={aartiActive}
                isMobileView={true}
              />
            </div>

            {/* 10% Increased Size Hanuman Ji Image Card - Bottom sits on 50% line */}
            <DarshanFrame
              activeMood={activeMood}
              isPlaying={isPlaying}
              isMobileView={true}
            />
          </div>

          {/* Lower 50% Zone: 2-2-1 Mood Grid, Progress Bar Line, Flanked Playback Console */}
          <div className={`relative z-20 w-full px-3 sm:px-4 flex flex-col justify-between items-center h-1/2 pb-2 safe-pb transition-opacity duration-1000 ${isZenActive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
            {/* 2 - 2 - 1 Mood Grid Dashboard */}
            <div className="w-full pt-1.5 min-[380px]:pt-2">
              <MoodSelectorBar
                activeMoodId={activeMood.id}
                onSelectMood={handleMoodSelect}
                isPlaying={isPlaying}
                isMobileView={true}
              />
            </div>

            {/* Simple Minimal Line Progress Bar */}
            <div className="w-full my-auto py-0.5">
              <MinimalProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={seekTo}
              />
            </div>

            {/* Flanked Playback Console [ 🪔 Aarti Diya ] [ ⏮ ▶/⏸ ⏭ ] [ 📖 चालीसा पाठ ] */}
            <div className="flex items-center justify-center gap-3 min-[380px]:gap-4 mt-0.5 mb-1 shrink-0">
              {/* Left: Aarti Diya Flame Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAartiActive((prev) => !prev);
                }}
                title={aartiActive ? "Extinguish Aarti Flame" : "Light Aarti Diya Flame (🪔)"}
                aria-label={aartiActive ? "Extinguish Aarti Flame" : "Light Aarti Diya Flame"}
                className={`h-12 w-12 min-w-[48px] rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 backdrop-blur-xl cursor-pointer active:scale-90 select-none shadow-[0_4px_16px_rgba(0,0,0,0.08)] ${
                  aartiActive
                    ? 'bg-amber-400 text-slate-950 font-bold border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.85)] scale-105'
                    : 'bg-white/90 hover:bg-white border border-slate-200/90 text-slate-800'
                }`}
              >
                <span className="text-xl filter drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">🪔</span>
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
                className="h-12 w-12 min-w-[48px] rounded-full bg-white/90 hover:bg-white backdrop-blur-xl border border-slate-200/90 text-amber-700 flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer active:scale-90 select-none shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
              >
                <BookOpen className="w-5 h-5 text-amber-600" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Main Content Flow - Tablet & Laptop View: Original Full-Bleed Grand Darshan */
        <div className="flex-1 flex flex-col justify-between items-center w-full z-20 h-full">
          <div className={`w-full transition-opacity duration-1000 shrink-0 ${isZenActive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
            <Header
              onOpenLyrics={() => setLyricsOpen(true)}
              onOpenSuvichar={() => handleOpenSuvichar(-1)}
              onInstallPwa={handleInstallClick}
              onToggleAarti={() => setAartiActive((prev) => !prev)}
              isAartiActive={aartiActive}
              isMobileView={false}
            />
          </div>

          {/* Desktop/Tablet Pure Darshan Spacer */}
          <div className="flex-1 pointer-events-none" />

          {/* Bottom Zone: Single Horizontal Mood Row + Centered Playback Dock */}
          <div className={`relative z-20 w-full px-4 sm:px-6 flex flex-col items-center justify-center pb-3 sm:pb-4 safe-pb transition-opacity duration-1000 ${isZenActive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
            <div className="w-full">
              <MoodSelectorBar
                activeMoodId={activeMood.id}
                onSelectMood={handleMoodSelect}
                isPlaying={isPlaying}
                isMobileView={false}
              />
            </div>

            <div className="flex items-center justify-center mt-2.5">
              <MinimalPlayback
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onPrev={prevMood}
                onNext={nextMood}
              />
            </div>
          </div>
        </div>
      )}

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
        onOpenSuvichar={(idx) => {
          setLyricsOpen(false);
          handleOpenSuvichar(idx);
        }}
        currentTime={currentTime}
        duration={duration}
      />

      {/* Daily Suvichar & WhatsApp Status Generator Modal */}
      <SuvicharModal
        isOpen={suvicharOpen}
        onClose={() => setSuvicharOpen(false)}
        initialVerseIndex={suvicharIndex}
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
