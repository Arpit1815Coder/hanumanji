import React, { useState, useEffect, useRef } from 'react';
import { MOODS } from '../data/moods';

// Session cache-busting timestamp so newly updated images on disk always load fresh
const CACHE_KEY = Date.now();

// Helper to check if an image path exists without broken UI flashes
function checkImageAvailable(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export default function BackgroundView({ isPlaying, activeMood }) {
  // Mobile screen detection (phone / small viewport)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload desktop & potential mobile images
  useEffect(() => {
    MOODS.forEach((mood) => {
      if (mood.imageSrc) {
        const img = new Image();
        img.src = `${mood.imageSrc}?v=${CACHE_KEY}`;
      }
    });

    // Check preloading for universal mobile background if provided
    const mobCheck = new Image();
    mobCheck.src = `/images/hanuman-mobile.jpg?v=${CACHE_KEY}`;
  }, []);

  const [currentSrc, setCurrentSrc] = useState(
    () => `${activeMood?.imageSrc || '/images/hanuman-original.jpg'}?v=${CACHE_KEY}`
  );
  const [prevSrc, setPrevSrc] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const crossfadeTimerRef = useRef(null);

  // Smooth crossfade on activeMood or viewport mobile/desktop change
  useEffect(() => {
    let isCancelled = false;

    const resolveAndApplyImage = async () => {
      let resolvedSrc = null;

      // If mobile, test for user-provided mobile backgrounds first
      if (isMobile) {
        const moodId = activeMood?.id || 'original';
        const mobileCandidates = [
          // 1. Mood-specific mobile in public/images/mobile/
          `/images/mobile/hanuman-${moodId}.jpg`,
          `/images/mobile/hanuman-${moodId}.png`,
          `/images/mobile/hanuman-${moodId}.webp`,
          // 2. Universal mobile in public/images/
          `/images/hanuman-mobile.jpg`,
          `/images/hanuman-mobile.png`,
          `/images/hanuman-mobile.webp`,
          // 3. Universal mobile in public/images/mobile/
          `/images/mobile/hanuman-mobile.jpg`,
          `/images/mobile/hanuman-mobile.png`,
        ];

        for (const candidate of mobileCandidates) {
          const exists = await checkImageAvailable(`${candidate}?v=${CACHE_KEY}`);
          if (exists) {
            resolvedSrc = `${candidate}?v=${CACHE_KEY}`;
            break;
          }
        }
      }

      // Fallback to desktop mood image if not mobile or no mobile image uploaded yet
      if (!resolvedSrc) {
        resolvedSrc = `${activeMood?.imageSrc || '/images/hanuman-original.jpg'}?v=${CACHE_KEY}`;
      }

      if (isCancelled || resolvedSrc === currentSrc) return;

      // Load image off-screen first to ensure instant decode before fading
      const imgLoader = new Image();
      imgLoader.src = resolvedSrc;

      const applyImage = (srcToUse) => {
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
        if (!isCancelled) applyImage(resolvedSrc);
      };

      imgLoader.onerror = () => {
        // Fallback: try alternate extension (.png vs .jpg)
        const altSrc = resolvedSrc.includes('.jpg')
          ? resolvedSrc.replace('.jpg', '.png')
          : resolvedSrc.replace('.png', '.jpg');

        const altLoader = new Image();
        altLoader.src = altSrc;
        altLoader.onload = () => {
          if (!isCancelled) applyImage(altSrc);
        };
        altLoader.onerror = () => {
          if (!isCancelled) applyImage(`/images/hanuman-original.jpg?v=${CACHE_KEY}`);
        };
      };
    };

    resolveAndApplyImage();

    return () => {
      isCancelled = true;
      if (crossfadeTimerRef.current) clearTimeout(crossfadeTimerRef.current);
    };
  }, [activeMood?.id, activeMood?.imageSrc, isMobile]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-black">
      {/* Previous Image Layer (kept visible during crossfade to eliminate flashes) */}
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

      {/* Balanced Warm & Cool Vignette Overlay for Crisp Readability */}
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
  );
}
