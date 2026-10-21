import React, { useState, useEffect, useRef } from 'react';
import { MOODS } from '../data/moods';

const CACHE_KEY = Date.now();

function checkImageAvailable(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export default function BackgroundView({ isPlaying, activeMood }) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [currentSrc, setCurrentSrc] = useState(
    () => `${activeMood?.imageSrc || '/images/hanuman-original.jpg'}?v=${CACHE_KEY}`
  );
  const [prevSrc, setPrevSrc] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const crossfadeTimerRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const resolveBg = async () => {
      let resolvedSrc = null;

      if (isMobile) {
        const moodId = activeMood?.id || 'original';
        const mobileCandidates = [
          `/images/mobile/hanuman-${moodId}.jpg`,
          `/images/hanuman-mobile.jpg`,
          `/images/mobile/hanuman-mobile.jpg`,
          activeMood?.imageSrc,
        ];

        for (const candidate of mobileCandidates) {
          if (!candidate) continue;
          const exists = await checkImageAvailable(`${candidate}?v=${CACHE_KEY}`);
          if (exists) {
            resolvedSrc = `${candidate}?v=${CACHE_KEY}`;
            break;
          }
        }
      }

      if (!resolvedSrc) {
        resolvedSrc = `${activeMood?.imageSrc || '/images/hanuman-original.jpg'}?v=${CACHE_KEY}`;
      }

      if (isCancelled || resolvedSrc === currentSrc) return;

      const loader = new Image();
      loader.src = resolvedSrc;
      loader.onload = () => {
        if (isCancelled) return;
        if (crossfadeTimerRef.current) clearTimeout(crossfadeTimerRef.current);
        setPrevSrc(currentSrc);
        setCurrentSrc(resolvedSrc);
        setIsFading(true);
        crossfadeTimerRef.current = setTimeout(() => {
          setIsFading(false);
          setPrevSrc(null);
        }, 700);
      };
    };

    resolveBg();

    return () => {
      isCancelled = true;
      if (crossfadeTimerRef.current) clearTimeout(crossfadeTimerRef.current);
    };
  }, [activeMood?.id, activeMood?.imageSrc, isMobile]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#070605]">
      {/* 1. Tablet & Laptop (>= md): Full-bleed Immersive Sacred Background Artwork */}
      <div className="hidden md:block absolute inset-0 w-full h-full">
        {prevSrc && (
          <img
            src={prevSrc}
            alt="Hanuman Ji"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-out ${
              isFading ? 'opacity-0' : 'opacity-100'
            } ${isPlaying ? 'scale-105 brightness-100' : 'scale-100 brightness-95'}`}
          />
        )}
        <img
          src={currentSrc}
          alt={activeMood?.title || 'Hanuman Ji'}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isFading ? 'opacity-100 animate-fade-in' : 'opacity-100'
          } ${isPlaying ? 'scale-105 brightness-100' : 'scale-100 brightness-95'}`}
        />
        {/* Balanced Vignette for Desktop Wallpaper */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/85 pointer-events-none" />
      </div>

      {/* 2. Mobile (< md): Soft Ambient Blurred Reflection (Square card is rendered in Center-Top) */}
      <div className="block md:hidden absolute inset-0 w-full h-full">
        <img
          src={currentSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center filter blur-3xl opacity-20 scale-125 pointer-events-none transition-all duration-1000"
        />
        {/* Deep Twilight Vignette for Mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/90 via-[#0a0908]/75 to-[#0a0908]/95 pointer-events-none" />
      </div>

      {/* Shared: Radial Warm Golden Divine Aura centered on Hanuman Ji */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 opacity-25 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 38%, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.15) 35%, transparent 70%)'
        }}
      />

      {/* Shared: Cool Cosmic Subtle Rim/Underglow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(56, 189, 248, 0.2) 0%, transparent 60%)'
        }}
      />
    </div>
  );
}
