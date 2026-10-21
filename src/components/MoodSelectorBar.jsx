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
        className={`w-full h-11 min-[380px]:h-12 px-3.5 min-[380px]:px-4.5 rounded-full flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer select-none active:scale-95 border-2 ${
          isGlowing
            ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-[0_4px_16px_rgba(245,158,11,0.45)] scale-[1.02]'
            : isActive
            ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-[0_3px_12px_rgba(245,158,11,0.35)]'
            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
        }`}
      >
        <span className="text-base min-[380px]:text-lg shrink-0">{mood.emoji}</span>
        <span className={`text-xs min-[380px]:text-[13px] tracking-wide whitespace-nowrap ${isActive ? 'font-bold text-slate-950' : 'font-semibold text-slate-800'}`}>
          {mood.title}
        </span>
        {isGlowing ? (
          <div className="flex items-center space-x-0.5 ml-1">
            <span className="w-[2px] h-2.5 bg-slate-950 rounded-full mini-wave-bar-1" />
            <span className="w-[2px] h-2.5 bg-slate-950 rounded-full mini-wave-bar-2" />
            <span className="w-[2px] h-2.5 bg-slate-950 rounded-full mini-wave-bar-3" />
          </div>
        ) : isActive ? (
          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 ml-0.5" />
        ) : null}
      </button>
    );
  };

  return (
    <div className="relative z-20 w-full select-none flex items-center justify-center pb-0 px-2 sm:px-4">
      {/* 1. Mobile Only (< md): Fuller 2 - 2 - 1 Grid Dashboard */}
      <div className="md:hidden w-full max-w-[380px] min-[390px]:max-w-[410px] mx-auto px-1">
        {/* Row 1: 2 buttons */}
        <div className="grid grid-cols-2 gap-2 min-[380px]:gap-2.5 mb-2 min-[380px]:mb-2.5">
          {MOODS.slice(0, 2).map(renderMobileMoodBtn)}
        </div>
        {/* Row 2: 2 buttons */}
        <div className="grid grid-cols-2 gap-2 min-[380px]:gap-2.5 mb-2 min-[380px]:mb-2.5">
          {MOODS.slice(2, 4).map(renderMobileMoodBtn)}
        </div>
        {/* Row 3: 1 button (centered, matching exact width of items above) */}
        <div className="flex justify-center">
          <div className="w-[calc(50%-4px)] min-[380px]:w-[calc(50%-5px)]">
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
