import React, { useState, useEffect, useRef } from 'react';
import { MOODS } from '../data/moods';

// Session cache-busting timestamp so newly updated images on disk always load fresh
const CACHE_KEY = Date.now();

export default function BackgroundView({ isPlaying, activeMood }) {
  // Preload all mood images into browser cache immediately for instant, flicker-free switching
  useEffect(() => {
    MOODS.forEach((mood) => {
      if (mood.imageSrc) {
        const img = new Image();
        img.src = `${mood.imageSrc}?v=${CACHE_KEY}`;
      }
    });
  }, []);

  const [currentSrc, setCurrentSrc] = useState(
    () => `${activeMood?.imageSrc || '/images/hanuman-original.jpg'}?v=${CACHE_KEY}`
  );
  const [prevSrc, setPrevSrc] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const crossfadeTimerRef = useRef(null);

  // Smooth crossfade on activeMood change
  useEffect(() => {
    const nextSrc = `${activeMood?.imageSrc || '/images/hanuman-original.jpg'}?v=${CACHE_KEY}`;
    if (nextSrc === currentSrc) return;

    // Load next image off-screen first to ensure instant decode
    const imgLoader = new Image();
    imgLoader.src = nextSrc;

    const applyNextImage = (srcToUse) => {
      if (crossfadeTimerRef.current) clearTimeout(crossfadeTimerRef.current);
      setPrevSrc(currentSrc);
      setCurrentSrc(srcToUse);
      setIsFading(true);

      crossfadeTimerRef.current = setTimeout(() => {
        setIsFading(false);
        setPrevSrc(null);
      }, 700);
    };

    imgLoader.onload = () => {
      applyNextImage(nextSrc);
    };

    imgLoader.onerror = () => {
      // Fallback: try alternate extension (.png vs .jpg)
      const altSrc = nextSrc.includes('.jpg')
        ? nextSrc.replace('.jpg', '.png')
        : nextSrc.replace('.png', '.jpg');
      
      const altLoader = new Image();
      altLoader.src = altSrc;
      altLoader.onload = () => {
        applyNextImage(altSrc);
      };
      altLoader.onerror = () => {
        // Fallback to original image
        applyNextImage(`/images/hanuman-original.jpg?v=${CACHE_KEY}`);
      };
    };

    return () => {
      if (crossfadeTimerRef.current) clearTimeout(crossfadeTimerRef.current);
    };
  }, [activeMood?.id, activeMood?.imageSrc]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-black">
      {/* Previous Image Layer (kept visible during crossfade transition to prevent flashes) */}
      {prevSrc && (
        <img
          src={prevSrc}
          alt="Hanuman Ji"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-out ${
            isFading ? 'opacity-0' : 'opacity-100'
          } ${isPlaying ? 'scale-105 brightness-100' : 'scale-100 brightness-95'}`}
        />
      )}

      {/* Active Mood Background Image Layer */}
      <img
        src={currentSrc}
        alt={activeMood?.title || 'Hanuman Ji'}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
          isFading ? 'opacity-100 animate-fade-in' : 'opacity-100'
        } ${isPlaying ? 'scale-105 brightness-100' : 'scale-100 brightness-95'}`}
      />

      {/* Balanced Warm & Cool Vignette Overlay */}
      {/* Top & Bottom: Cool Midnight Twilight Slate Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-transparent to-slate-950/80 pointer-events-none" />

      {/* Radial Warm Golden Divine Aura centered on Hanuman Ji */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 opacity-25 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 38%, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.15) 35%, transparent 70%)'
        }}
      />

      {/* Cool Cosmic Subtle Rim/Underglow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(56, 189, 248, 0.2) 0%, transparent 60%)'
        }}
      />
    </div>
  );
}
