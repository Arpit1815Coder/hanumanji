import React from 'react';

function formatTime(timeInSeconds) {
  if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00';
  const mins = Math.floor(timeInSeconds / 60);
  const secs = Math.floor(timeInSeconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function MinimalProgressBar({ currentTime, duration, onSeek }) {
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    if (clientX == null) return;
    const clickRatio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (duration > 0 && onSeek) {
      onSeek(clickRatio * duration);
    }
  };

  return (
    <div className="w-full max-w-[360px] min-[390px]:max-w-[390px] mx-auto px-4 my-2 flex flex-col items-center select-none">
      {/* Tappable hit area for effortless seeking */}
      <div
        onClick={handleSeek}
        onTouchStart={handleSeek}
        className="w-full h-3 flex items-center cursor-pointer group touch-none"
        title="Tap to seek"
      >
        {/* Simple Minimal Track Line */}
        <div className="w-full h-[3px] bg-slate-300/80 rounded-full overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
          <div
            className="h-full bg-amber-500 rounded-full transition-[width] duration-150 ease-linear shadow-[0_0_6px_rgba(245,158,11,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Subtle Micro Timestamps below the line */}
      <div className="w-full flex items-center justify-between text-[10px] font-medium text-slate-500 -mt-0.5 px-0.5 font-mono">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
