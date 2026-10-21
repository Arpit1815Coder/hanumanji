import { useState, useEffect, useRef, useCallback } from 'react';

export function useZenMode(isPlaying, timeoutMs = 4000) {
  const [isZenActive, setIsZenActive] = useState(false);
  const timerRef = useRef(null);

  const wakeUp = useCallback(() => {
    setIsZenActive(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setIsZenActive(true);
      }, timeoutMs);
    }
  }, [isPlaying, timeoutMs]);

  useEffect(() => {
    if (!isPlaying) {
      setIsZenActive(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Start idle timer when playing
    timerRef.current = setTimeout(() => {
      setIsZenActive(true);
    }, timeoutMs);

    const handleActivity = () => {
      wakeUp();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('touchmove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('wheel', handleActivity);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('touchmove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('wheel', handleActivity);
    };
  }, [isPlaying, timeoutMs, wakeUp]);

  return { isZenActive, wakeUp };
}
