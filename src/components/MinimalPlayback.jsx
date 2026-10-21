import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function MinimalPlayback({
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext
}) {
  return (
    <div className="relative z-20 select-none flex items-center justify-center mt-2">
      {/* Retrofy-Style Single Capsule Dock */}
      <div className="flex items-center justify-center gap-2 sm:gap-3.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/35 hover:bg-black/45 backdrop-blur-md border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.85)] shrink-0 select-none transition-all">
        {/* Previous Mood */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onPrev) onPrev();
          }}
          className="p-2 text-white/90 hover:text-white active:scale-90 transition-transform rounded-full hover:bg-white/10 cursor-pointer"
          title="Previous Mood (Key: P or Left Arrow)"
        >
          <SkipBack className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-white text-white" />
        </button>

        {/* Play / Pause */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onTogglePlay) onTogglePlay();
          }}
          className="p-2 sm:p-2.5 text-white active:scale-95 transition-transform rounded-full hover:bg-white/10 cursor-pointer"
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 sm:w-6.5 sm:h-6.5 fill-white text-white" />
          ) : (
            <Play className="w-6 h-6 sm:w-6.5 sm:h-6.5 fill-white text-white translate-x-0.5" />
          )}
        </button>

        {/* Next Mood */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onNext) onNext();
          }}
          className="p-2 text-white/90 hover:text-white active:scale-90 transition-transform rounded-full hover:bg-white/10 cursor-pointer"
          title="Next Mood (Key: N or Right Arrow)"
        >
          <SkipForward className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-white text-white" />
        </button>
      </div>
    </div>
  );
}
