import React, { useState, useEffect, useRef } from 'react';
import BackgroundView from './components/BackgroundView';
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
          onOpenLyrics={() => setLyricsOpen(true)}
          onInstallPwa={handleInstallClick}
          onToggleAarti={() => setAartiActive(prev => !prev)}
          isAartiActive={aartiActive}
        />
      </div>

      {/* 3. Center Screen: Pure Darshan (Clean screen in Zen Mode) */}
      <div className="flex-1 pointer-events-none" />

      {/* 4. Bottom Controls: Centered Mood Buttons + Centered Playback Dock */}
      <div className={`relative z-20 w-full px-3 sm:px-6 pb-2 sm:pb-4 safe-pb flex flex-col items-center justify-center transition-opacity duration-1000 ${isZenActive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        {/* All Moods Aligned in One Line Centered */}
        <MoodSelectorBar
          activeMoodId={activeMood.id}
          onSelectMood={handleMoodSelect}
          isPlaying={isPlaying}
        />

        {/* Retrofy-Style Single Capsule Playback Dock */}
        <MinimalPlayback
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onPrev={prevMood}
          onNext={nextMood}
        />
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
