import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Laptop, CheckCircle, Share2, PlusSquare } from 'lucide-react';

export default function PwaInstallPrompt({ isOpen, onClose, deferredPrompt, onInstalledSuccess }) {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIosDevice);

    // Detect if already installed / running in standalone mode
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(!!isRunningStandalone);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onInstalledSuccess();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl glass-panel border border-white/20 p-5 sm:p-6 shadow-2xl bg-black/50 text-amber-50">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
              🕉️
            </div>
            <div>
              <h3 className="font-['Cinzel',serif] text-base sm:text-lg font-bold text-amber-200">
                Install Hanuman Chalisa
              </h3>
              <p className="text-xs text-amber-300/70">
                Mood Chants PWA Application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-amber-300/80 hover:text-white hover:bg-amber-500/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3.5">
          {isStandalone ? (
            <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-sm font-semibold text-amber-100">
                App Already Installed!
              </p>
              <p className="text-xs text-amber-200/80">
                You are enjoying the standalone full-screen experience with offline chanting support.
              </p>
            </div>
          ) : isIOS ? (
            /* iOS Safari Instructions */
            <div className="space-y-3 text-xs sm:text-sm text-amber-100">
              <p className="font-medium text-amber-300">
                To install on your iPhone or iPad:
              </p>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/20">
                <Share2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>1. Tap the <strong className="text-amber-200">Share button</strong> at the bottom of Safari.</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/20">
                <PlusSquare className="w-5 h-5 text-amber-400 shrink-0" />
                <span>2. Scroll down and tap <strong className="text-amber-200">"Add to Home Screen"</strong>.</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/20">
                <CheckCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>3. Tap <strong className="text-amber-200">"Add"</strong> in the top right.</span>
              </div>
            </div>
          ) : deferredPrompt ? (
            /* Direct 1-Click Install */
            <div className="space-y-3 text-center">
              <p className="text-xs sm:text-sm text-amber-200/90">
                Install as a standalone native app on Android, Windows, Mac, or ChromeOS for instant one-tap access and offline chanting.
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:from-amber-400 hover:to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Add to Home Screen / Desktop</span>
              </button>
            </div>
          ) : (
            /* Fallback Instructions */
            <div className="space-y-2 text-xs sm:text-sm text-amber-200/90">
              <p>
                To install in Chrome, Edge, or Brave:
              </p>
              <p className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/20">
                Click the <strong>Install Icon (⊕ / 📥)</strong> in your browser address bar, or open the browser menu (⋮) and select <strong>"Install Hanuman Chalisa"</strong>.
              </p>
            </div>
          )}

          {/* Benefits list */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-500/15 text-[11px] text-amber-300/80">
            <div className="flex items-center space-x-1.5">
              <span>⚡</span>
              <span>Ultra-fast startup</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>📶</span>
              <span>Works offline</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>📱</span>
              <span>No browser bar</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>🔋</span>
              <span>Lightweight & clean</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs text-amber-300/80 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
