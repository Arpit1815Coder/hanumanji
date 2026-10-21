import React from 'react';
import { X } from 'lucide-react';
import { CHALISA_DATA } from '../data/chalisaData';

export default function LyricsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/50 backdrop-blur-sm animate-fade-in select-text"
      onClick={onClose}
    >
      {/* 90% Transparent Cool Slate Glass Card with Center-Aligned Sacred Text */}
      <div 
        className="relative w-full max-w-xl sm:max-w-2xl md:max-w-3xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-2xl sm:rounded-3xl bg-slate-950/25 backdrop-blur-2xl border border-sky-400/20 shadow-[0_20px_60px_rgba(2,6,23,0.92),0_0_40px_rgba(56,189,248,0.08)] text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cool Minimal Header with Centered Title */}
        <div className="relative px-3 sm:px-6 py-3 sm:py-4 border-b border-sky-400/15 flex items-center justify-between bg-transparent shrink-0">
          <div className="w-8" /> {/* Balance spacer for close button */}

          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <span className="text-lg sm:text-xl filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">📜</span>
            <h2 className="font-['Rozha_One',serif] text-base sm:text-xl md:text-2xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-100 via-cyan-100 to-sky-300 drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)]">
              श्री हनुमान चालीसा
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full text-sky-200/70 hover:text-white hover:bg-sky-500/20 transition-all cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Center-Aligned Verses with Cool Cyan Scrollbar */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-5 space-y-4 sm:space-y-6 cool-scrollbar text-center">
          {/* Opening Dohas */}
          <div className="space-y-3 sm:space-y-4 pb-2">
            <div className="text-center font-['Rozha_One',serif] text-[11px] sm:text-xs md:text-sm text-sky-300 font-medium tracking-[0.2em] uppercase drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)]">
              ॥ प्रारम्भिक दोहा ॥
            </div>
            {CHALISA_DATA.openingDoha.map((doha, i) => (
              <div key={i} className="py-2.5 sm:py-3.5 border-b border-sky-500/10 space-y-1.5 sm:space-y-2 hover:bg-sky-950/15 transition-colors rounded-xl px-2 sm:px-3 text-center">
                <p className="font-['Tiro_Devanagari_Hindi',serif] text-sm sm:text-base md:text-lg font-medium text-slate-50 whitespace-pre-line leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  {doha.hindi}
                </p>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 font-normal leading-relaxed max-w-xl mx-auto drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  <span className="text-cyan-300 font-medium">भावार्थ: </span>
                  {doha.meaning}
                </p>
              </div>
            ))}
          </div>

          {/* 40 Chaupais */}
          <div className="space-y-3 sm:space-y-4 pt-2">
            <div className="text-center font-['Rozha_One',serif] text-[11px] sm:text-xs md:text-sm text-sky-300 font-medium tracking-[0.2em] uppercase drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)]">
              ॥ चौपाई ॥
            </div>

            {CHALISA_DATA.chaupais.map((c) => (
              <div key={c.number} className="py-2.5 sm:py-3.5 border-b border-sky-500/10 space-y-1.5 sm:space-y-2 hover:bg-sky-950/15 transition-colors rounded-xl px-2 sm:px-3 text-center">
                <p className="font-['Tiro_Devanagari_Hindi',serif] text-sm sm:text-base md:text-lg font-medium text-slate-50 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  <span className="text-cyan-400 font-bold mr-1.5 sm:mr-2 text-xs sm:text-base">{c.number}.</span>
                  {c.hindi}
                </p>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 font-normal leading-relaxed max-w-xl mx-auto drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  <span className="text-cyan-300 font-medium">भावार्थ: </span>
                  {c.meaning}
                </p>
              </div>
            ))}
          </div>

          {/* Closing Doha */}
          <div className="space-y-3 sm:space-y-4 pt-2 pb-4">
            <div className="text-center font-['Rozha_One',serif] text-[11px] sm:text-xs md:text-sm text-sky-300 font-medium tracking-[0.2em] uppercase drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)]">
              ॥ समापन दोहा ॥
            </div>
            <div className="py-2.5 sm:py-3.5 space-y-1.5 sm:space-y-2 hover:bg-sky-950/15 transition-colors rounded-xl px-2 sm:px-3 text-center">
              <p className="font-['Tiro_Devanagari_Hindi',serif] text-sm sm:text-base md:text-lg font-medium text-slate-50 whitespace-pre-line leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {CHALISA_DATA.closingDoha.hindi}
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 font-normal leading-relaxed max-w-xl mx-auto drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                <span className="text-cyan-300 font-medium">भावार्थ: </span>
                {CHALISA_DATA.closingDoha.meaning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
