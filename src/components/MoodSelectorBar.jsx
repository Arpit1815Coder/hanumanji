import React from 'react';
import { MOODS } from '../data/moods';

export default function MoodSelectorBar({ activeMoodId, onSelectMood, isPlaying }) {
  // Mobile Button Renderer
  const renderMobileMoodBtn = (mood) => {
    const isActive = mood.id === activeMoodId;
    const isGlowing = isActive && isPlaying;
    return (
      <button
        key={mood.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelectMood(mood.id);
        }}
        title={isActive ? (isPlaying ? 'Chanting active • Tap to pause' : 'Paused • Tap to chant') : `Switch to ${mood.title}`}
        className={`w-full h-8 min-[380px]:h-9 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer select-none active:scale-95 border ${
          isGlowing
            ? 'bg-amber-400/25 border-amber-300/80 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
            : isActive
            ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
            : 'bg-black/40 hover:bg-white/10 border-white/10 text-white/75 hover:text-white'
        }`}
      >
        <span className="text-xs min-[380px]:text-sm shrink-0">{mood.emoji}</span>
        <span className="text-[11px] min-[380px]:text-xs font-semibold tracking-wide whitespace-nowrap">
          {mood.title}
        </span>
        {isGlowing ? (
          <div className="flex items-center space-x-0.5 ml-1">
            <span className="w-[1.5px] h-2 bg-amber-400 rounded-full mini-wave-bar-1" />
            <span className="w-[1.5px] h-2 bg-amber-300 rounded-full mini-wave-bar-2" />
            <span className="w-[1.5px] h-2 bg-amber-400 rounded-full mini-wave-bar-3" />
          </div>
        ) : isActive ? (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] ml-0.5" />
        ) : null}
      </button>
    );
  };

  return (
    <div className="relative z-20 w-full select-none flex items-center justify-center pb-1 px-1 sm:px-4">
      {/* 1. Mobile Only (< md): 2 - 2 - 1 Grid Layout */}
      <div className="md:hidden w-full max-w-[320px] min-[380px]:max-w-[350px] mx-auto">
        {/* Row 1: 2 buttons */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {MOODS.slice(0, 2).map(renderMobileMoodBtn)}
        </div>
        {/* Row 2: 2 buttons */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {MOODS.slice(2, 4).map(renderMobileMoodBtn)}
        </div>
        {/* Row 3: 1 button (centered) */}
        <div className="flex justify-center">
          <div className="w-[calc(50%-4px)]">
            {renderMobileMoodBtn(MOODS[4])}
          </div>
        </div>
      </div>

      {/* 2. Tablet & Laptop (>= md): Single Line Clean Responsive Row */}
      <div className="hidden md:flex items-center justify-center flex-nowrap gap-2.5 overflow-x-auto py-1 max-w-full">
        {MOODS.map((mood) => {
          const isActive = mood.id === activeMoodId;
          const isGlowing = isActive && isPlaying;
          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood.id)}
              title={isActive ? (isPlaying ? 'Chanting active • Tap to pause' : 'Paused • Tap to chant') : `Switch to ${mood.title}`}
              className="shrink-0 w-[94px] lg:w-[108px] h-[40px] flex flex-col items-center justify-center bg-transparent hover:bg-white/[0.06] active:bg-white/[0.1] rounded-full border-0 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 transition-all duration-300 cursor-pointer group px-1"
            >
              {/* Top Row: Emoji & Mood Title */}
              <div className="flex items-center space-x-1.5 leading-none">
                <span className={`text-xs md:text-sm leading-none transition-transform duration-300 ${
                  isGlowing 
                    ? 'scale-110 opacity-100' 
                    : isActive 
                    ? 'opacity-95' 
                    : 'opacity-65 group-hover:opacity-90'
                }`}>
                  {mood.emoji}
                </span>

                <span className={`text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 ${
                  isGlowing
                    ? 'glow-text-active'
                    : isActive
                    ? 'text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.65)]'
                    : 'text-white/65 group-hover:text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
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
