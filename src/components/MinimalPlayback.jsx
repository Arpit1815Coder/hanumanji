import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function MinimalPlayback({
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext
}) {
  return (
    <div className="relative select-none flex items-center justify-center shrink-0">
      {/* Spotify Single Capsule Dock */}
      <div className="flex items-center justify-center gap-3.5 min-[380px]:gap-5 sm:gap-6 px-4 min-[380px]:px-5 sm:px-6 py-1.5 sm:py-2 rounded-full bg-black/40 hover:bg-black/50 backdrop-blur-xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.9)] shrink-0 select-none transition-all">
        {/* Previous Mood */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onPrev) onPrev();
          }}
          className="p-1.5 sm:p-2 text-white/90 hover:text-white active:scale-85 transition-all rounded-full hover:bg-white/10 cursor-pointer"
          title="Previous Mood (Key: P or Left Arrow)"
          aria-label="Previous Mood"
        >
          <SkipBack className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-white text-white" />
        </button>

        {/* Central Play / Pause Button - Spotify-Style High Contrast Circle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onTogglePlay) onTogglePlay();
          }}
          className="w-12 h-12 min-[380px]:w-13 min-[380px]:h-13 sm:w-14 sm:h-14 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.65)] hover:shadow-[0_6px_28px_rgba(255,255,255,0.35)] active:scale-90 transition-all cursor-pointer border border-white/90 shrink-0"
          title={isPlaying ? "Pause Chanting (Space)" : "Resume Chanting (Space)"}
          aria-label={isPlaying ? "Pause Chanting" : "Resume Chanting"}
        >
          {isPlaying ? (
            <Pause className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 fill-black text-black" />
          ) : (
            <Play className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 fill-black text-black translate-x-0.5" />
          )}
        </button>

        {/* Next Mood */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onNext) onNext();
          }}
          className="p-1.5 sm:p-2 text-white/90 hover:text-white active:scale-85 transition-all rounded-full hover:bg-white/10 cursor-pointer"
          title="Next Mood (Key: N or Right Arrow)"
          aria-label="Next Mood"
        >
          <SkipForward className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-white text-white" />
        </button>
      </div>
    </div>
  );
}
