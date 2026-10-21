import React, { useState, useEffect, useRef } from 'react';
import { Download, Maximize2, Minimize2, MoreVertical, BookOpen, RefreshCw, Sparkles } from 'lucide-react';

function HanumanLogoEmblem({ isMobile = false }) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden flex items-center justify-center shrink-0 transition-transform ${
        isMobile
          ? 'w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 p-1 border border-amber-300/80 shadow-sm'
          : 'w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-800 p-1 border border-amber-300/70 shadow-[0_0_14px_rgba(245,158,11,0.6)]'
      }`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gadaGoldMini" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <radialGradient id="sunAuraMini" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Radiant Solar Background Disc */}
        <circle cx="50" cy="50" r="44" fill="url(#sunAuraMini)" />
        <circle cx="50" cy="50" r="45" stroke="#fef08a" strokeWidth="1.5" strokeOpacity="0.8" strokeDasharray="3 2" />

        {/* Sacred Bajrangbali Gada (Mace) Iconography */}
        <line x1="30" y1="70" x2="62" y2="38" stroke="url(#gadaGoldMini)" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="28" cy="72" r="4" fill="url(#gadaGoldMini)" stroke="#78350f" strokeWidth="1" />
        <path
          d="M 64 26 C 58 32 55 42 66 53 C 77 64 87 61 93 55 C 96 42 77 23 64 26 Z"
          transform="translate(-16, -2)"
          fill="url(#gadaGoldMini)"
          stroke="#78350f"
          strokeWidth="1.2"
        />
        <polygon points="56,17 61,24 51,24" fill="#ffffff" />

        {/* Sacred Urdhva Pundra Tilak (Chandan + Sindoor) */}
        <g transform="translate(42, 42)">
          {/* White Sandalwood V-shape */}
          <path d="M 0 0 L 5 24 C 7 27 11 27 13 24 L 18 0 L 14 0 L 9 18 L 4 0 Z" fill="#ffffff" />
          {/* Red Vermilion/Sindoor Streak */}
          <path d="M 8 2 L 8 21 C 8 22 10 22 10 21 L 10 2 Z" fill="#ef4444" />
          {/* Bottom Tilak Lotus Dot */}
          <circle cx="9" cy="25" r="1.5" fill="#ef4444" />
        </g>
      </svg>
    </div>
  );
}

export default function Header({ onOpenLyrics, onOpenSuvichar, onInstallPwa, onToggleAarti, isAartiActive, isMobileView }) {
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

  const handleForceRefresh = async () => {
    setMenuOpen(false);
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((r) => r.unregister()));
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  return (
    <header className="relative z-30 w-full px-3.5 sm:px-6 md:px-8 py-2 sm:py-3.5 flex items-center justify-between safe-pt select-none">
      {/* Left: Clicking on Hanuman Chalisa logo refreshes the app */}
      <div
        onClick={() => window.location.reload()}
        title="Tap to refresh Shri Hanuman Chalisa"
        className="flex items-center space-x-2 sm:space-x-3 bg-transparent p-0 border-0 outline-none select-none shrink-0 cursor-pointer active:scale-95 transition-transform"
      >
        {/* Custom Sacred Hanuman Ji Logo Insignia */}
        <HanumanLogoEmblem isMobile={isMobileView} />

        <div className="flex flex-col text-left">
          <h1 className={`font-['Rozha_One',serif] text-base min-[390px]:text-lg sm:text-xl md:text-2xl font-semibold tracking-wide leading-none ${
            isMobileView
              ? 'text-slate-900'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]'
          }`}>
            श्री हनुमान चालीसा
          </h1>
          <span className={`text-[9.5px] sm:text-[11px] font-sans tracking-widest uppercase mt-0.5 ${
            isMobileView ? 'text-amber-800 font-semibold' : 'text-amber-300/80 font-medium'
          }`}>
            Mood Chants
          </span>
        </div>
      </div>

      {/* Right on Tablet & Laptop: Direct Action Buttons */}
      {!isMobileView && (
        <div className="flex items-center space-x-2 shrink-0">
          {/* Aarti Flame Toggle */}
          <button
            onClick={onToggleAarti}
            title={isAartiActive ? "Extinguish Aarti Flame" : "Light Aarti Diya Flame"}
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

          {/* दैनिक सुविचार एवं WhatsApp स्टेटस कार्ड */}
          {onOpenSuvichar && (
            <button
              onClick={onOpenSuvichar}
              title="दैनिक सुविचार एवं WhatsApp स्टेटस कार्ड बनाएँ"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500/25 to-yellow-500/20 hover:from-amber-500/40 hover:to-yellow-500/35 border border-amber-400/50 text-amber-100 hover:text-white transition-all duration-200 shadow-md backdrop-blur-xl text-xs font-semibold cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>सुविचार स्टेटस</span>
            </button>
          )}

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
      )}

      {/* Right on Mobile: 3-Dots Menu with Download & Fullscreen */}
      {isMobileView && (
        <div className="relative shrink-0" ref={menuRef}>
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
              className="absolute right-0 top-full mt-2 w-56 bg-white/95 text-slate-800 rounded-2xl shadow-2xl border border-slate-200/90 p-1.5 z-50 flex flex-col text-xs select-none backdrop-blur-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {onOpenSuvichar && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenSuvichar();
                  }}
                  className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-left text-amber-900 font-semibold transition-colors cursor-pointer w-full border border-amber-200/70 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>दैनिक सुविचार (WhatsApp Status)</span>
                </button>
              )}

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
                onClick={handleForceRefresh}
                className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-left text-slate-800 transition-colors cursor-pointer w-full"
              >
                <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">Clear Cache & Refresh</span>
              </button>

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
      )}
    </header>
  );
}
