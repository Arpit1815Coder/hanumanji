import React from 'react';
import { X, Keyboard, Sparkles } from 'lucide-react';

const SHORTCUTS = [
  { key: 'Space', desc: 'Play / Pause Chanting', category: 'Playback' },
  { key: '← / →', desc: 'Seek 10s Backward / Forward', category: 'Playback' },
  { key: '↑ / ↓', desc: 'Adjust Volume Up / Down', category: 'Audio' },
  { key: 'M', desc: 'Toggle Mute / Unmute', category: 'Audio' },
  { key: 'L', desc: 'Toggle Continuous Chanting Loop', category: 'Playback' },
  { key: '1, 2, 3, 4, 5', desc: 'Instant Switch between 5 Moods', category: 'Moods' },
  { key: 'F', desc: 'Toggle Fullscreen Mode', category: 'Display' },
  { key: 'Esc', desc: 'Close dialogs & drawers', category: 'Display' },
];

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl glass-panel border border-white/20 p-5 sm:p-6 shadow-2xl bg-black/40 text-amber-50">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <h3 className="font-['Cinzel',serif] text-lg font-bold text-amber-200">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-amber-200/80 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {SHORTCUTS.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10"
            >
              <span className="text-xs sm:text-sm text-amber-100 font-medium">
                {item.desc}
              </span>
              <kbd className="px-2 py-1 rounded-md bg-black/60 border border-white/20 text-amber-300 font-mono text-xs font-bold shadow-inner">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300/80">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Devotion made simple</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-500/90 text-black font-bold hover:bg-amber-400 transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
