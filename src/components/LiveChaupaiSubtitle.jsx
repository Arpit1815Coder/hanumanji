import React, { useState } from 'react';
import { ALL_VERSES } from '../data/chalisaData';
import { Eye, EyeOff, BookOpen } from 'lucide-react';

export default function LiveChaupaiSubtitle({ currentTime, duration, onOpenLyrics }) {
  const [isVisible, setIsVisible] = useState(true);

  // Compute active verse index
  const progress = duration > 0 ? currentTime / duration : 0;
  const verseIndex = Math.min(
    ALL_VERSES.length - 1,
    Math.max(0, Math.floor(progress * ALL_VERSES.length))
  );

  const activeVerse = ALL_VERSES[verseIndex] || ALL_VERSES[0];

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        title="Show Live Chanting Lyrics"
        className="fixed bottom-4 left-4 z-20 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-950/45 backdrop-blur-xl border border-amber-500/20 text-amber-200 text-xs font-semibold shadow-lg hover:bg-slate-900/60 transition-all cursor-pointer active:scale-95"
      >
        <BookOpen className="w-3.5 h-3.5 text-amber-300" />
        <span>भावार्थ बोल</span>
      </button>
    );
  }

  return (
    <div className="relative z-20 w-full max-w-sm sm:max-w-md select-none animate-fade-in">
      <div 
        onClick={onOpenLyrics}
        className="group relative rounded-2xl bg-slate-950/40 backdrop-blur-2xl p-3 sm:p-4 border border-amber-500/20 shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.06)] hover:border-amber-400/40 transition-all cursor-pointer"
        title="Click to open complete Chalisa text"
      >
        {/* Header Row: Verse Label & Hide Button */}
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              {activeVerse.label}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-amber-300/60 hidden sm:inline group-hover:text-amber-200 transition-colors">
              सम्पूर्ण पाठ ↗
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              title="Hide Subtitles"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Hindi / Awadhi Text */}
        <p className="text-xs sm:text-sm md:text-base font-semibold text-amber-100 tracking-wide leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] whitespace-pre-line">
          {activeVerse.hindi}
        </p>

        {/* Line-by-Line English Meaning */}
        <p className="text-[10px] sm:text-xs text-amber-200/80 font-sans leading-relaxed mt-1.5 line-clamp-2 drop-shadow">
          {activeVerse.meaning}
        </p>
      </div>
    </div>
  );
}
