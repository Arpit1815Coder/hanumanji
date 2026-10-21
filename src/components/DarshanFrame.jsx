import React, { useState, useEffect, useRef } from 'react';

const CACHE_KEY = Date.now();

// Helper to check if an image path exists without console broken image flash
function checkImageAvailable(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export default function DarshanFrame({ activeMood, isPlaying }) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [imgSrc, setImgSrc] = useState(
    () => `${activeMood?.imageSrc || '/images/hanuman-original.jpg'}?v=${CACHE_KEY}`
  );
  const [prevSrc, setPrevSrc] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const crossfadeTimerRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const resolveSquareImage = async () => {
      let resolved = null;
      const moodId = activeMood?.id || 'original';

      // If mobile, prioritize square mobile images
      if (isMobile) {
        const candidates = [
          `/images/mobile/hanuman-${moodId}.jpg`,
          `/images/hanuman-mobile.jpg`,
          `/images/mobile/hanuman-mobile.jpg`,
          `/images/hanuman-mobile.png`,
          `/images/hanuman-mobile.webp`,
          activeMood?.imageSrc,
        ];

        for (const c of candidates) {
          if (!c) continue;
          const ok = await checkImageAvailable(`${c}?v=${CACHE_KEY}`);
          if (ok) {
            resolved = `${c}?v=${CACHE_KEY}`;
            break;
          }
        }
      }

      // Default desktop mood image
      if (!resolved) {
        resolved = `${activeMood?.imageSrc || '/images/hanuman-original.jpg'}?v=${CACHE_KEY}`;
      }

      if (isCancelled || resolved === imgSrc) return;

      const loader = new Image();
      loader.src = resolved;
      loader.onload = () => {
        if (isCancelled) return;
        if (crossfadeTimerRef.current) clearTimeout(crossfadeTimerRef.current);
        setPrevSrc(imgSrc);
        setImgSrc(resolved);
        setIsFading(true);
        crossfadeTimerRef.current = setTimeout(() => {
          setIsFading(false);
          setPrevSrc(null);
        }, 600);
      };
    };

    resolveSquareImage();

    return () => {
      isCancelled = true;
      if (crossfadeTimerRef.current) clearTimeout(crossfadeTimerRef.current);
    };
  }, [activeMood?.id, activeMood?.imageSrc, isMobile]);

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start pt-2 sm:pt-5 pb-1 px-4 z-10 pointer-events-none select-none">
      <div className="relative group pointer-events-auto">
        {/* Divine Ambient Radial Halo Behind the Square Card */}
        <div
          className={`absolute -inset-3 sm:-inset-6 rounded-full transition-all duration-1000 pointer-events-none blur-2xl ${
            isPlaying ? 'opacity-55 scale-105' : 'opacity-25 scale-95'
          }`}
          style={{
            background: `radial-gradient(circle, ${activeMood?.themeColor || '#f59e0b'} 0%, rgba(245, 158, 11, 0.25) 45%, transparent 75%)`
          }}
        />

        {/* Square Sacred Darshan Picture Frame (Preserves native 1:1 square ratio in centre top) */}
        <div
          className={`relative w-[210px] h-[210px] min-[360px]:w-[230px] min-[360px]:h-[230px] min-[400px]:w-[260px] min-[400px]:h-[260px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px] max-w-[42vh] max-h-[42vh] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(245,158,11,0.3)] border border-amber-300/40 transition-transform duration-700 ease-out ${
            isPlaying ? 'scale-[1.02]' : 'scale-100'
          }`}
        >
          {/* Previous image during crossfade */}
          {prevSrc && (
            <img
              src={prevSrc}
              alt="Shri Hanuman Ji"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-600 ease-out ${
                isFading ? 'opacity-0' : 'opacity-100'
              }`}
            />
          )}

          {/* Current image */}
          <img
            src={imgSrc}
            alt={activeMood?.title || 'Shri Hanuman Ji'}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-600 ease-out ${
              isFading ? 'opacity-100 animate-fade-in' : 'opacity-100'
            }`}
          />

          {/* Glass Inner Border Rim */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/20 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
