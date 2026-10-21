import React, { useState, useEffect, useRef } from 'react';

export default function AartiDiya({ isActive, onClose, initialPos }) {
  const [position, setPosition] = useState(() => {
    return initialPos || {
      x: typeof window !== 'undefined' ? window.innerWidth / 2 : 200,
      y: typeof window !== 'undefined' ? window.innerHeight * 0.72 : 400
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (initialPos) {
      setPosition(initialPos);
    }
  }, [initialPos]);

  if (!isActive) return null;

  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragOffsetRef.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragOffsetRef.current.x,
      y: clientY - dragOffsetRef.current.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 select-none overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {/* Draggable Sacred Diya Lamp (Pure visual with zero surrounding text) */}
      <div
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
        onPointerDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onDoubleClick={onClose}
        title="Draggable Aarti Diya • Click header button or double-tap to close"
        className="absolute pointer-events-auto cursor-grab active:cursor-grabbing flex flex-col items-center group touch-none"
      >
        {/* Divine Ambient Flame Aura Halo */}
        <div 
          className="absolute -top-16 w-48 h-48 rounded-full pointer-events-none animate-flame-glow"
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 70%)',
            filter: 'blur(10px)'
          }}
        />

        {/* Floating Sparks / Embers */}
        <div className="absolute -top-12 flex space-x-2 pointer-events-none opacity-80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-200 animate-ping" />
          <span className="w-1 h-1 rounded-full bg-yellow-300 animate-pulse [animation-delay:200ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-ping [animation-delay:400ms]" />
        </div>

        {/* Multi-layered Sacred Diya Flame */}
        <div className="relative w-8 h-12 flex items-end justify-center animate-flame">
          {/* Outer Orange Fire */}
          <div className="absolute w-7 h-11 rounded-[50%_50%_35%_35%] bg-gradient-to-t from-orange-600 via-amber-500 to-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.9)] opacity-90" />
          
          {/* Inner Golden Fire */}
          <div className="absolute w-4 h-8 rounded-[50%_50%_30%_30%] bg-gradient-to-t from-amber-400 via-yellow-300 to-yellow-100 shadow-[0_0_12px_rgba(254,240,138,1)]" />

          {/* White-Hot Flame Core */}
          <div className="absolute w-2 h-4 rounded-[50%_50%_25%_25%] bg-white shadow-[0_0_8px_#ffffff]" />
        </div>

        {/* Golden Brass Diya Lamp Base */}
        <div className="relative -mt-1 flex flex-col items-center">
          {/* Wick holder */}
          <div className="w-3 h-1 bg-amber-950 rounded-full" />
          {/* Brass Diya Bowl */}
          <div 
            className="w-16 h-5 rounded-b-full shadow-[0_8px_16px_rgba(0,0,0,0.6)] flex items-center justify-center border-t border-amber-300/40"
            style={{
              background: 'linear-gradient(180deg, #d97706 0%, #78350f 70%, #451a03 100%)'
            }}
          >
            {/* Traditional carved ring */}
            <div className="w-12 h-1 rounded-full bg-amber-400/40" />
          </div>
          {/* Diya Foot */}
          <div className="w-7 h-1.5 bg-amber-900 rounded-b-lg border-t border-amber-600/30" />
        </div>
      </div>
    </div>
  );
}
