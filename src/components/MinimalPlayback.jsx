import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function MinimalPlayback({
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext
}) {
  return (
    <div className="relative z-20 select-none flex items-center justify-center mt-2 px-3">
      {/* Spotify Mobile & Desktop Single Capsule Dock */}
      <div className="flex items-center justify-center gap-5 min-[380px]:gap-7 sm:gap-9 px-5 min-[380px]:px-7 sm:px-9 py-2 sm:py-2.5 rounded-full bg-black/40 hover:bg-black/50 backdrop-blur-xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.9)] shrink-0 select-none transition-all">
        {/* Previous Mood */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onPrev) onPrev();
          }}
          className="p-2 sm:p-2.5 text-white/90 hover:text-white active:scale-85 transition-all rounded-full hover:bg-white/10 cursor-pointer"
          title="Previous Mood (Key: P or Left Arrow)"
          aria-label="Previous Mood"
        >
          <SkipBack className="w-5 h-5 min-[380px]:w-6 min-[380px]:h-6 sm:w-6.5 sm:h-6.5 fill-white text-white" />
        </button>

        {/* Central Play / Pause Button - Spotify-Style High Contrast Circle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onTogglePlay) onTogglePlay();
          }}
          className="w-13 h-13 min-[380px]:w-14 min-[380px]:h-14 sm:w-16 sm:h-16 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.65)] hover:shadow-[0_6px_28px_rgba(255,255,255,0.35)] active:scale-90 transition-all cursor-pointer border border-white/90 shrink-0"
          title={isPlaying ? "Pause Chanting (Space)" : "Resume Chanting (Space)"}
          aria-label={isPlaying ? "Pause Chanting" : "Resume Chanting"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-black text-black" />
          ) : (
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-black text-black translate-x-0.5" />
          )}
        </button>

        {/* Next Mood */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onNext) onNext();
          }}
          className="p-2 sm:p-2.5 text-white/90 hover:text-white active:scale-85 transition-all rounded-full hover:bg-white/10 cursor-pointer"
          title="Next Mood (Key: N or Right Arrow)"
          aria-label="Next Mood"
        >
          <SkipForward className="w-5 h-5 min-[380px]:w-6 min-[380px]:h-6 sm:w-6.5 sm:h-6.5 fill-white text-white" />
        </button>
      </div>
    </div>
  );
}
