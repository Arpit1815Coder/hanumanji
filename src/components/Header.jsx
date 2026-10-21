import React, { useState, useEffect } from 'react';
import { Download, Maximize2, Minimize2, BookOpen } from 'lucide-react';

export default function Header({ onOpenLyrics, onInstallPwa, onToggleAarti, isAartiActive }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="relative z-20 w-full px-3 sm:px-8 py-3.5 flex items-center justify-between safe-pt select-none">
      {/* Left: 100% Transparent Sacred Title with Divine Calligraphic Typography */}
      <div className="flex items-center space-x-2 sm:space-x-2.5 bg-transparent p-0 border-0 outline-none select-none filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
        <span className="text-xl sm:text-2xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]">🕉️</span>
        <h1 className="font-['Rozha_One',serif] text-lg sm:text-2xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 leading-tight">
          श्री हनुमान चालीसा
        </h1>
      </div>

      {/* Right: Aarti Diya, चालीसा पाठ, PWA Install & Fullscreen */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Aarti Flame Toggle */}
        <button
          onClick={onToggleAarti}
          title={isAartiActive ? "Extinguish Aarti Flame" : "Light Aarti Diya Flame (or long-press anywhere)"}
          className={`flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full transition-all duration-200 shadow-md backdrop-blur-xl text-xs font-semibold cursor-pointer active:scale-95 ${
            isAartiActive
              ? 'bg-amber-400 text-slate-950 font-bold border border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.7)]'
              : 'bg-slate-950/40 hover:bg-slate-900/60 border border-slate-700/50 hover:border-amber-400/40 text-amber-200 hover:text-white'
          }`}
        >
          <span className="text-xs sm:text-sm">🪔</span>
          <span className="hidden sm:inline">आरती</span>
        </button>

        {/* चालीसा पाठ (Full Lyrics + Meaning Line by Line) */}
        <button
          onClick={onOpenLyrics}
          title="सम्पूर्ण हनुमान चालीसा पाठ एवं भावार्थ (Full Lyrics & Meaning)"
          className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 text-amber-100 hover:text-white transition-all duration-200 shadow-md backdrop-blur-xl text-xs font-semibold cursor-pointer active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
          <span>चालीसा पाठ</span>
        </button>

        {/* PWA Install Button */}
        <button
          onClick={onInstallPwa}
          title="Install App"
          className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-slate-950/40 hover:bg-slate-900/60 border border-slate-700/50 hover:border-amber-400/30 text-amber-200 hover:text-white transition-all duration-200 shadow-md backdrop-blur-xl text-xs font-semibold cursor-pointer active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Install</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          className="p-1.5 sm:p-2 rounded-full bg-slate-950/40 hover:bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-amber-200 transition-all duration-200 backdrop-blur-xl cursor-pointer active:scale-95"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
          )}
        </button>
      </div>
    </header>
  );
}
