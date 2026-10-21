import React, { useState, useEffect, useRef } from 'react';
import { Download, Maximize2, Minimize2, MoreVertical, BookOpen } from 'lucide-react';

export default function Header({ onOpenLyrics, onInstallPwa, onToggleAarti, isAartiActive }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="relative z-30 w-full px-3.5 sm:px-6 md:px-8 py-2 sm:py-3.5 flex items-center justify-between safe-pt select-none">
      {/* Left: Clicking on Hanuman Chalisa logo refreshes the app (Clean, no glow on mobile) */}
      <div
        onClick={() => window.location.reload()}
        title="Tap to refresh Shri Hanuman Chalisa"
        className="flex items-center space-x-1.5 sm:space-x-2.5 bg-transparent p-0 border-0 outline-none select-none filter-none md:filter md:drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] shrink-0 cursor-pointer active:scale-95 transition-transform"
      >
        <span className="text-xl sm:text-2xl filter-none md:filter md:drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]">🕉️</span>
        <h1 className="font-['Rozha_One',serif] text-base min-[390px]:text-lg sm:text-xl md:text-2xl font-semibold tracking-wide text-slate-900 md:text-transparent md:bg-clip-text md:bg-gradient-to-r md:from-amber-100 md:via-amber-200 md:to-amber-400 leading-tight">
          श्री हनुमान चालीसा
        </h1>
      </div>

      {/* Right on Tablet & Laptop (>= md): Direct Action Buttons (Original Desktop/Tablet Layout) */}
      <div className="hidden md:flex items-center space-x-2 shrink-0">
        {/* Aarti Flame Toggle */}
        <button
          onClick={onToggleAarti}
          title={isAartiActive ? "Extinguish Aarti Flame" : "Light Aarti Diya Flame (or long-press anywhere)"}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-full transition-all duration-200 shadow-md backdrop-blur-xl text-xs font-semibold cursor-pointer active:scale-95 ${
            isAartiActive
              ? 'bg-amber-400 text-slate-950 font-bold border border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.7)]'
              : 'bg-slate-950/40 hover:bg-slate-900/60 border border-slate-700/50 hover:border-amber-400/40 text-amber-200 hover:text-white'
          }`}
        >
          <span className="text-sm">🪔</span>
          <span>आरती</span>
        </button>

        {/* चालीसा पाठ (Full Lyrics + Meaning) */}
        <button
          onClick={onOpenLyrics}
          title="सम्पूर्ण हनुमान चालीसा पाठ एवं भावार्थ (Full Lyrics & Meaning)"
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 text-amber-100 hover:text-white transition-all duration-200 shadow-md backdrop-blur-xl text-xs font-semibold cursor-pointer active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
          <span>पाठ भावार्थ</span>
        </button>

        {/* PWA Install Button */}
        {onInstallPwa && (
          <button
            onClick={onInstallPwa}
            title="Install App"
            className="px-3 py-2 rounded-full bg-slate-950/40 hover:bg-slate-900/60 border border-slate-700/50 hover:border-amber-400/30 text-amber-200 hover:text-white transition-all duration-200 shadow-md backdrop-blur-xl text-xs font-semibold cursor-pointer active:scale-95 flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Install</span>
          </button>
        )}

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          className="p-2 rounded-full bg-slate-950/40 hover:bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-amber-200 transition-all duration-200 backdrop-blur-xl cursor-pointer active:scale-95"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-amber-300" />
          ) : (
            <Maximize2 className="w-4 h-4 text-amber-300" />
          )}
        </button>
      </div>

      {/* Right on Mobile (< md): 3-Dots Menu with Download & Fullscreen */}
      <div className="md:hidden relative shrink-0" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="p-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 active:scale-90 transition-all cursor-pointer border border-slate-300/80 bg-white/80 backdrop-blur-md shadow-sm"
          title="Options"
          aria-label="Options Menu"
        >
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-48 bg-white/95 text-slate-800 rounded-2xl shadow-2xl border border-slate-200/90 p-1.5 z-50 flex flex-col text-xs select-none backdrop-blur-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {onInstallPwa && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onInstallPwa();
                }}
                className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-amber-50 text-left text-amber-800 transition-colors cursor-pointer w-full"
              >
                <Download className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">Install App</span>
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                toggleFullscreen();
              }}
              className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-left text-slate-800 transition-colors cursor-pointer w-full"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium">Full Screen</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
