import React, { useState, useEffect, useRef } from 'react';
import { Download, Maximize2, Minimize2, MoreVertical, BookOpen, RefreshCw, Sparkles } from 'lucide-react';

export default function Header({ onOpenLyrics, onOpenSuvichar, onInstallPwa, onToggleAarti, isAartiActive, deviceMode, setDeviceMode, isMobileView }) {
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
        className="flex items-center space-x-1.5 sm:space-x-2.5 bg-transparent p-0 border-0 outline-none select-none shrink-0 cursor-pointer active:scale-95 transition-transform"
      >
        <span className={`text-xl sm:text-2xl ${isMobileView ? 'filter-none' : 'filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]'}`}>🕉️</span>
        <h1 className={`font-['Rozha_One',serif] text-base min-[390px]:text-lg sm:text-xl md:text-2xl font-semibold tracking-wide leading-tight ${
          isMobileView
            ? 'text-slate-900'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]'
        }`}>
          श्री हनुमान चालीसा
        </h1>
      </div>

      {/* Center on wide screens: Quick Device View Switcher for Instant Live Testing */}
      {setDeviceMode && (
        <div className="hidden lg:flex items-center space-x-1 bg-black/40 border border-white/10 p-0.5 rounded-full text-xs backdrop-blur-md">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
              deviceMode === 'mobile'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Switch to Mobile View (See 50% midpoint image & 2-2-1 grid)"
          >
            📱 Mobile
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
              deviceMode === 'tablet'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Switch to Tablet View"
          >
            📟 Tablet
          </button>
          <button
            onClick={() => setDeviceMode('laptop')}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
              deviceMode === 'laptop'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Switch to Laptop View"
          >
            💻 Laptop
          </button>
        </div>
      )}

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

              {setDeviceMode && (
                <div className="px-3 py-2 border-y border-slate-200/60 my-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Layout Mode</span>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => {
                        setDeviceMode('mobile');
                        setMenuOpen(false);
                      }}
                      className="px-2 py-1 bg-amber-100 text-slate-900 font-bold rounded-lg text-center"
                    >
                      📱 Mobile
                    </button>
                    <button
                      onClick={() => {
                        setDeviceMode('laptop');
                        setMenuOpen(false);
                      }}
                      className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium rounded-lg text-center"
                    >
                      💻 Laptop
                    </button>
                  </div>
                </div>
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
