import React, { useState, useEffect, useRef } from 'react';
import { Download, Maximize2, Minimize2, MoreVertical } from 'lucide-react';

export default function Header({ onInstallPwa }) {
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
    <header className="relative z-30 w-full px-3.5 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between safe-pt select-none">
      {/* Left: Clicking on Hanuman Chalisa logo refreshes the app */}
      <div
        onClick={() => window.location.reload()}
        title="Tap to refresh Shri Hanuman Chalisa"
        className="flex items-center space-x-1.5 sm:space-x-2.5 bg-transparent p-0 border-0 outline-none select-none filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] shrink-0 cursor-pointer active:scale-95 transition-transform"
      >
        <span className="text-xl sm:text-2xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]">🕉️</span>
        <h1 className="font-['Rozha_One',serif] text-base min-[390px]:text-lg sm:text-xl md:text-2xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 leading-tight">
          श्री हनुमान चालीसा
        </h1>
      </div>

      {/* Right: 3-Dots Menu with Download / Install App & Fullscreen */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer border border-white/10 bg-black/30 backdrop-blur-md"
          title="Options"
          aria-label="Options Menu"
        >
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-48 bg-slate-950/90 text-white rounded-2xl shadow-2xl border border-white/15 p-1.5 z-50 flex flex-col text-xs select-none backdrop-blur-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {onInstallPwa && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onInstallPwa();
                }}
                className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 text-left text-amber-300 transition-colors cursor-pointer w-full"
              >
                <Download className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="font-medium">Install App</span>
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                toggleFullscreen();
              }}
              className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 text-left text-white/90 hover:text-white transition-colors cursor-pointer w-full"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="font-medium">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-amber-300 shrink-0" />
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
