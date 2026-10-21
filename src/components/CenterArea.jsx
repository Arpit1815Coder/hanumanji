import React from 'react';
import { CHALISA_DATA } from '../data/chalisaData';

export default function CenterArea({
  activeMood,
  isPlaying,
  currentTime,
  duration,
  onOpenLyrics
}) {
  // Determine an active Chaupai preview verse dynamically based on playback progress
  const progressPercent = duration > 0 ? (currentTime / duration) : 0;
  const verseIndex = Math.min(
    CHALISA_DATA.chaupais.length - 1,
    Math.floor(progressPercent * CHALISA_DATA.chaupais.length)
  );
  const currentChaupai = CHALISA_DATA.chaupais[verseIndex] || CHALISA_DATA.chaupais[0];

  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-6 max-w-4xl mx-auto text-center select-none">
      {/* Sacred Halo / Divine Prabhamandala Aura */}
      <div className="relative flex items-center justify-center mb-3 sm:mb-5">
        {/* Pulsing Sacred Energy Ring */}
        <div
          className={`absolute w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full transition-all duration-1000 ${
            isPlaying ? 'scale-115 opacity-70 animate-pulse' : 'scale-95 opacity-20'
          }`}
          style={{
            background: `radial-gradient(circle, ${activeMood.themeColor}33 0%, ${activeMood.themeColor}08 50%, transparent 70%)`,
            filter: 'blur(24px)'
          }}
        />

        {/* Transparent Circular Aura Ring */}
        <div
          className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-700 bg-black/20 ${
            isPlaying ? 'rotate-180 border-amber-400/50 shadow-[0_0_35px_rgba(245,158,11,0.35)]' : 'shadow-lg'
          }`}
        >
          {/* Active Mood Divine Emoji Avatar */}
          <div className="relative flex items-center justify-center">
            <span
              className={`text-4xl sm:text-5xl transition-transform duration-500 filter drop-shadow-[0_0_18px_rgba(245,158,11,0.85)] ${
                isPlaying ? 'scale-110 animate-bounce' : 'scale-100'
              }`}
            >
              {activeMood.emoji}
            </span>

            {/* Glowing Flame indicator when playing */}
            {isPlaying && (
              <span className="absolute -top-2.5 -right-2.5 text-xs animate-pulse">🔥</span>
            )}
          </div>
        </div>
      </div>

      {/* Clean Mood Name (No taglines, no subtitles) */}
      <div className="mb-4 sm:mb-6">
        <h2 className="font-['Cinzel',serif] text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
          {activeMood.title}
        </h2>
      </div>

      {/* Transparent Chaupai Verse Card (Pure sacred text, no tagline) */}
      <div
        onClick={onOpenLyrics}
        className="group cursor-pointer w-full max-w-xl px-4 py-3 sm:py-4 rounded-2xl glass-pill hover:bg-white/10 transition-all duration-300 shadow-lg border border-white/15"
      >
        <div className="flex items-center justify-center mb-1 text-[11px] text-amber-300 font-semibold tracking-wider uppercase">
          <span>चौपाई {currentChaupai.number} / 40</span>
        </div>
        <p className="font-['Tiro_Devanagari_Hindi',serif] text-base sm:text-lg md:text-xl text-amber-50 font-semibold tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] leading-relaxed">
          {currentChaupai.hindi}
        </p>
        <p className="text-xs sm:text-sm text-amber-200/70 italic mt-1 line-clamp-1">
          {currentChaupai.transliteration}
        </p>
      </div>
    </div>
  );
}
