import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Volume2, 
  VolumeX, 
  Volume1
} from 'lucide-react';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function PlaybackDock({
  activeMood,
  isPlaying,
  duration,
  currentTime,
  volume,
  isMuted,
  isLooping,
  onTogglePlay,
  onPrevMood,
  onNextMood,
  onSkipBackward,
  onSkipForward,
  onSeekTo,
  onToggleLoop,
  onToggleMute,
  onVolumeChange,
  isSeekingRef
}) {
  const [hoverTime, setHoverTime] = useState(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressBarRef = useRef(null);

  // Click & Drag Timeline Scrubber
  const handleProgressScrub = (e) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const targetTime = (clickX / rect.width) * duration;
    onSeekTo(targetTime);
  };

  const handlePointerDown = (e) => {
    setIsScrubbing(true);
    if (isSeekingRef) isSeekingRef.current = true;
    handleProgressScrub(e);
  };

  const handlePointerMove = (e) => {
    if (isScrubbing) {
      handleProgressScrub(e);
    }
    if (progressBarRef.current && duration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const hoverX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setHoverTime((hoverX / rect.width) * duration);
    }
  };

  const handlePointerUp = () => {
    if (isScrubbing) {
      setIsScrubbing(false);
      if (isSeekingRef) isSeekingRef.current = false;
    }
  };

  return (
    <div className="relative z-20 w-full max-w-2xl mx-auto px-2 sm:px-4 safe-pb select-none">
      <div 
        className="w-full rounded-2xl sm:rounded-3xl bg-slate-950/45 backdrop-blur-2xl p-2.5 sm:p-3.5 sm:px-5 border border-amber-500/20 shadow-[0_16px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(245,158,11,0.08)] transition-all"
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          handlePointerUp();
          setHoverTime(null);
        }}
        onPointerMove={handlePointerMove}
      >
        {/* 1. Playback Scrubber Track */}
        <div className="w-full flex items-center space-x-2 sm:space-x-3 mb-2">
          <span className="text-[10px] sm:text-xs font-mono text-slate-300 w-8 text-right drop-shadow">
            {formatTime(currentTime)}
          </span>

          <div
            ref={progressBarRef}
            onPointerDown={handlePointerDown}
            className="group relative flex-1 h-3 flex items-center cursor-pointer py-1"
          >
            {/* Background Track (Cool translucent slate) */}
            <div className="w-full h-1 sm:h-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 overflow-hidden relative">
              {/* Progress Glow Fill (Warm divine gold) */}
              <div
                className="h-full rounded-full transition-all duration-100 relative"
                style={{
                  width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                  background: 'linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #fef08a 100%)',
                  boxShadow: '0 0 14px rgba(245, 158, 11, 0.75)'
                }}
              />
            </div>

            {/* Draggable Scrubber Thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-amber-100 border-2 border-amber-500 shadow-[0_0_10px_#f59e0b] pointer-events-none transition-transform ${
                isScrubbing ? 'scale-125' : 'group-hover:scale-110'
              }`}
              style={{
                left: `calc(${Math.min(100, Math.max(0, progressPercent))}% - 6px)`
              }}
            />

            {/* Hover Tooltip Timestamp */}
            {hoverTime !== null && (
              <div
                className="absolute -top-6 -translate-x-1/2 px-1 py-0.5 rounded bg-slate-950/90 backdrop-blur-md border border-amber-400/25 text-[9px] font-mono text-amber-200 pointer-events-none shadow"
                style={{
                  left: `${(hoverTime / duration) * 100}%`
                }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          <span className="text-[10px] sm:text-xs font-mono text-slate-300 w-8 text-left drop-shadow">
            {formatTime(duration)}
          </span>
        </div>

        {/* 2. Controls: Core Playback Buttons, Volume & Loop */}
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {/* Left: Active Mood Indicator */}
          <div className="flex items-center space-x-1.5 min-w-[70px]">
            <span className="text-sm">{activeMood.emoji}</span>
            <span className="text-xs font-semibold text-amber-100/90 tracking-wide drop-shadow">
              {activeMood.title}
            </span>
          </div>

          {/* Center: Core Playback Controls */}
          <div className="flex items-center justify-center space-x-1.5 sm:space-x-3">
            {/* Previous Mood */}
            <button
              onClick={onPrevMood}
              title="Previous Mood"
              className="p-1.5 sm:p-2 rounded-full text-amber-200/90 hover:text-amber-100 hover:bg-slate-800/60 transition-all active:scale-90"
            >
              <SkipBack className="w-4 h-4 text-amber-200" />
            </button>

            {/* 10s Rewind (-10s) */}
            <button
              onClick={() => onSkipBackward(10)}
              title="Rewind 10s (Left Arrow)"
              className="relative p-1.5 sm:p-2 rounded-full text-amber-200/90 hover:text-amber-100 hover:bg-slate-800/60 transition-all active:scale-90 flex items-center justify-center group"
            >
              <RotateCcw className="w-4 h-4 text-amber-200" />
              <span className="absolute text-[8px] font-bold text-amber-100 group-hover:text-white mt-0.5">
                10
              </span>
            </button>

            {/* Large Central Play/Pause Button */}
            <button
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              className="relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full text-slate-950 font-black transition-all duration-300 transform active:scale-95 shadow-[0_0_28px_rgba(245,158,11,0.7)] hover:shadow-[0_0_38px_rgba(245,158,11,0.9)] hover:scale-105 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 55%, #d97706 100%)',
                border: '1.5px solid rgba(254, 240, 138, 0.9)'
              }}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-slate-950" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-slate-950 ml-0.5" />
              )}
            </button>

            {/* 10s Fast-Forward (+10s) */}
            <button
              onClick={() => onSkipForward(10)}
              title="Fast Forward 10s (Right Arrow)"
              className="relative p-1.5 sm:p-2 rounded-full text-amber-200/90 hover:text-amber-100 hover:bg-slate-800/60 transition-all active:scale-90 flex items-center justify-center group"
            >
              <RotateCw className="w-4 h-4 text-amber-200" />
              <span className="absolute text-[8px] font-bold text-amber-100 group-hover:text-white mt-0.5">
                10
              </span>
            </button>

            {/* Next Mood */}
            <button
              onClick={onNextMood}
              title="Next Mood"
              className="p-1.5 sm:p-2 rounded-full text-amber-200/90 hover:text-amber-100 hover:bg-slate-800/60 transition-all active:scale-90"
            >
              <SkipForward className="w-4 h-4 text-amber-200" />
            </button>
          </div>

          {/* Right: Loop Toggle & Volume Slider */}
          <div className="flex items-center justify-end space-x-1 sm:space-x-2 min-w-[70px]">
            {/* Loop / Repeat Toggle */}
            <button
              onClick={onToggleLoop}
              title={isLooping ? 'Repeat: On (Key: L)' : 'Repeat: Off (Key: L)'}
              className={`p-1.5 sm:p-2 rounded-full transition-all active:scale-90 flex items-center justify-center ${
                isLooping
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                  : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/60'
              }`}
            >
              <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Speaker Mute/Unmute */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute (Key: M)' : 'Mute (Key: M)'}
              className="p-1.5 sm:p-2 rounded-full text-slate-300 hover:text-amber-200 hover:bg-slate-800/60 transition-all active:scale-90"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
              ) : volume < 0.4 ? (
                <Volume1 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
              )}
            </button>

            {/* Volume Slider (Visible on tablets/desktops) */}
            <div className="hidden sm:flex items-center w-14 md:w-20">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                aria-label="Volume Slider"
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
