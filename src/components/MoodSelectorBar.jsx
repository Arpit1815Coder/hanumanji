import React from 'react';
import { MOODS } from '../data/moods';

export default function MoodSelectorBar({ activeMoodId, onSelectMood, isPlaying }) {
  return (
    <div className="relative z-20 w-full select-none flex items-center justify-center pb-1">
      {/* 100% Transparent Mood Buttons with Micro Equalizer Chanting Waves */}
      <div className="flex items-center justify-center flex-nowrap gap-1 sm:gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 max-w-full">
        {MOODS.map((mood) => {
          const isActive = mood.id === activeMoodId;
          const isGlowing = isActive && isPlaying;
          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood.id)}
              title={isActive ? (isPlaying ? 'Chanting active • Click to pause' : 'Paused • Click to chant') : `Switch to ${mood.title}`}
              className="shrink-0 w-[84px] sm:w-[102px] md:w-[110px] h-[40px] sm:h-[44px] flex flex-col items-center justify-center bg-transparent hover:bg-white/[0.05] rounded-full border-0 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 transition-all duration-300 cursor-pointer group px-1"
            >
              {/* Top Row: Emoji & Mood Title */}
              <div className="flex items-center space-x-1.5 leading-none">
                <span className={`text-xs sm:text-sm leading-none transition-transform duration-300 ${
                  isGlowing 
                    ? 'scale-110 opacity-100' 
                    : isActive 
                    ? 'opacity-90' 
                    : 'opacity-60 group-hover:opacity-90'
                }`}>
                  {mood.emoji}
                </span>

                <span className={`text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 ${
                  isGlowing
                    ? 'glow-text-active'
                    : isActive
                    ? 'text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'text-white/60 group-hover:text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                }`}>
                  {mood.title}
                </span>
              </div>

              {/* Bottom Row: Micro Equalizer Waves or Spiritual Accent Pill */}
              <div className="h-3 w-full flex items-center justify-center mt-0.5 pointer-events-none">
                {isGlowing ? (
                  <div className="flex items-center justify-center space-x-0.5 h-3">
                    <span className="w-[2px] bg-amber-400 rounded-full mini-wave-bar-1 shadow-[0_0_4px_#f59e0b]" />
                    <span className="w-[2px] bg-amber-300 rounded-full mini-wave-bar-2 shadow-[0_0_4px_#f59e0b]" />
                    <span className="w-[2px] bg-amber-400 rounded-full mini-wave-bar-3 shadow-[0_0_4px_#f59e0b]" />
                  </div>
                ) : isActive ? (
                  <span className="w-2.5 h-[2px] rounded-full bg-amber-400/90 shadow-[0_0_6px_#f59e0b]" />
                ) : (
                  <span className="w-1.5 h-[2px] rounded-full bg-transparent group-hover:bg-white/20 transition-all" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
