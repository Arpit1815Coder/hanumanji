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

export default function BackgroundView({ isPlaying, activeMood, isMobileView }) {
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = isMobileView !== undefined ? isMobileView : windowWidth < 768;

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
    <div className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 ${isMobile ? 'bg-[#eceef2]' : 'bg-[#070605]'}`}>
      {/* 1. Tablet & Laptop: Full-bleed Immersive Sacred Background Artwork */}
      {!isMobile && (
        <div className="absolute inset-0 w-full h-full">
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
      )}

      {/* 2. Mobile: Peaceful Divine Light Grey Background Canvas */}
      {isMobile && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#f2f3f7] via-[#ebedf2] to-[#e2e5eb]">
          {/* Soft Ambient Blurred Reflection blended into Light Grey */}
          <img
            src={currentSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center filter blur-3xl opacity-30 scale-125 pointer-events-none transition-all duration-1000 mix-blend-multiply"
          />
          {/* Warm Golden Divine Halo centered on Hanuman Ji */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.16) 0%, rgba(254, 243, 199, 0.35) 30%, transparent 65%)'
            }}
          />
          {/* Soft edge shade */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-slate-500/10 pointer-events-none" />
        </div>
      )}
    </div>
  );
}
