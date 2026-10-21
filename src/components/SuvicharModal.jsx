import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Share2, Shuffle, Calendar, Copy, Check, Sparkles, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { ALL_VERSES } from '../data/chalisaData';
import { MOODS } from '../data/moods';

function getHindiDate() {
  const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const months = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const now = new Date();
  const dayName = days[now.getDay()];
  const dateNum = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();
  return `${dayName}, ${dateNum} ${monthName} ${year}`;
}

function getTodayVerseIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % ALL_VERSES.length;
}

// Helper to word-wrap text on HTML5 Canvas
function wrapText(ctx, text, x, y, maxWidth, lineHeight, align = 'center') {
  ctx.textAlign = align;
  const words = text.split(/\s+/);
  let line = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  let currentY = y;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

export default function SuvicharModal({ isOpen, onClose, initialVerseIndex = 0 }) {
  const [verseIndex, setVerseIndex] = useState(initialVerseIndex);
  const [aspectRatio, setAspectRatio] = useState('story'); // 'story' (9:16) or 'square' (1:1)
  const [selectedMoodId, setSelectedMoodId] = useState('original');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState(null);

  const canvasRef = useRef(null);

  // Sync initial verse when modal opens
  useEffect(() => {
    if (isOpen) {
      setVerseIndex(initialVerseIndex >= 0 ? initialVerseIndex : getTodayVerseIndex());
    }
  }, [isOpen, initialVerseIndex]);

  const currentVerse = ALL_VERSES[verseIndex] || ALL_VERSES[0];
  const selectedMood = MOODS.find((m) => m.id === selectedMoodId) || MOODS[0];

  // Render the high-resolution Status Card onto HTML5 Canvas
  useEffect(() => {
    if (!isOpen) return;
    setIsGenerating(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = 1080;
    const height = aspectRatio === 'story' ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedMood.imageSrc || '/images/hanuman-original.jpg';

    img.onload = () => {
      // 1. Draw Background Image with Cover Cropping
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      let renderW, renderH, offsetX, offsetY;

      if (imgAspect > canvasAspect) {
        renderH = height;
        renderW = height * imgAspect;
        offsetX = (width - renderW) / 2;
        offsetY = 0;
      } else {
        renderW = width;
        renderH = width / imgAspect;
        offsetX = 0;
        offsetY = (height - renderH) / 2;
      }

      ctx.save();
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

      // 2. High-Contrast Gradient Overlays for Supreme Legibility & Divine Aura
      // Top vignette
      const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.35);
      topGrad.addColorStop(0, 'rgba(8, 7, 6, 0.92)');
      topGrad.addColorStop(0.5, 'rgba(12, 10, 9, 0.75)');
      topGrad.addColorStop(1, 'rgba(12, 10, 9, 0.2)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, height * 0.35);

      // Bottom reading zone overlay
      const bottomGrad = ctx.createLinearGradient(0, height * 0.45, 0, height);
      bottomGrad.addColorStop(0, 'rgba(10, 8, 7, 0.1)');
      bottomGrad.addColorStop(0.35, 'rgba(10, 8, 7, 0.88)');
      bottomGrad.addColorStop(0.65, 'rgba(7, 6, 5, 0.96)');
      bottomGrad.addColorStop(1, 'rgba(5, 4, 3, 0.99)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, height * 0.45, width, height * 0.55);

      // Warm radial golden aura at center
      const radialGrad = ctx.createRadialGradient(width / 2, height * 0.35, 50, width / 2, height * 0.35, width * 0.55);
      radialGrad.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
      radialGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.08)');
      radialGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Double Golden Border Frame
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      ctx.strokeStyle = 'rgba(254, 243, 199, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(48, 48, width - 96, height - 96);

      // Corner Ornamental Corner Accents
      const drawCorner = (cx, cy) => {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.stroke();
      };
      drawCorner(48, 48);
      drawCorner(width - 48, 48);
      drawCorner(48, height - 48);
      drawCorner(width - 48, height - 48);

      // 4. Sacred Header Section
      ctx.textAlign = 'center';

      // Top Om & Title
      ctx.font = 'bold 34px "Rozha One", serif';
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
      ctx.shadowBlur = 14;
      ctx.fillText('🕉️ श्री हनुमान चालीसा', width / 2, aspectRatio === 'story' ? 120 : 100);
      ctx.shadowBlur = 0;

      // Subtitle: Daily Suvichar
      ctx.font = '500 24px "Outfit", sans-serif';
      ctx.fillStyle = '#fef3c7';
      ctx.fillText('॥ दैनिक सुविचार एवं कृपा संदेश ॥', width / 2, aspectRatio === 'story' ? 165 : 140);

      // Date in Hindi
      ctx.font = '400 20px "Outfit", sans-serif';
      ctx.fillStyle = 'rgba(254, 243, 199, 0.7)';
      ctx.fillText(getHindiDate(), width / 2, aspectRatio === 'story' ? 205 : 175);

      // Decorative divider
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const divY = aspectRatio === 'story' ? 230 : 195;
      ctx.moveTo(width / 2 - 160, divY);
      ctx.lineTo(width / 2 + 160, divY);
      ctx.stroke();

      // 5. Verse Pill / Badge
      const pillY = aspectRatio === 'story' ? height * 0.56 : height * 0.50;
      const pillText = `॥ ${currentVerse.label || 'पावन चौपाई'} ॥`;
      ctx.font = 'bold 24px "Rozha One", serif';
      const pillWidth = ctx.measureText(pillText).width + 60;
      const pillHeight = 44;

      ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(width / 2 - pillWidth / 2, pillY - 30, pillWidth, pillHeight, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef3c7';
      ctx.fillText(pillText, width / 2, pillY);

      // 6. Sacred Chaupai Text in Bold Sanskrit / Devanagari
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 18;
      ctx.font = aspectRatio === 'story' ? 'bold 42px "Tiro Devanagari Hindi", serif' : 'bold 36px "Tiro Devanagari Hindi", serif';
      ctx.fillStyle = '#ffffff';

      const chaupaiY = aspectRatio === 'story' ? height * 0.64 : height * 0.59;
      const chaupaiMaxW = width - 180;
      const nextY = wrapText(ctx, currentVerse.hindi, width / 2, chaupaiY, chaupaiMaxW, aspectRatio === 'story' ? 62 : 52, 'center');

      // 7. Transliteration (Romanized English)
      if (currentVerse.transliteration) {
        ctx.shadowBlur = 8;
        ctx.font = 'italic 22px "Cinzel", Georgia, serif';
        ctx.fillStyle = 'rgba(251, 191, 36, 0.88)';
        wrapText(ctx, currentVerse.transliteration, width / 2, nextY + 16, chaupaiMaxW, 32, 'center');
      }

      // 8. Meaning (भावार्थ)
      const meaningY = aspectRatio === 'story' ? height * 0.78 : height * 0.77;
      ctx.shadowBlur = 6;
      ctx.font = '400 24px "Outfit", sans-serif';
      ctx.fillStyle = '#fef3c7';

      // Small "भावार्थ:" label
      ctx.font = '600 21px "Outfit", sans-serif';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('भावार्थ (Meaning)', width / 2, meaningY);

      ctx.font = '400 22px "Outfit", sans-serif';
      ctx.fillStyle = '#e2e8f0';
      wrapText(ctx, `"${currentVerse.meaning}"`, width / 2, meaningY + 36, chaupaiMaxW, 32, 'center');

      // 9. Sacred Footer Section
      const footerY = height - 100;
      ctx.shadowBlur = 0;

      // Golden line
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 200, footerY - 30);
      ctx.lineTo(width / 2 + 200, footerY - 30);
      ctx.stroke();

      ctx.font = 'bold 26px "Rozha One", serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('॥ जय श्री राम • जय हनुमान जी ॥', width / 2, footerY);

      ctx.font = '400 18px "Outfit", sans-serif';
      ctx.fillStyle = 'rgba(254, 243, 199, 0.6)';
      ctx.fillText('Shri Hanuman Chalisa • Mood Chants', width / 2, footerY + 32);

      ctx.restore();

      // Export preview URL
      try {
        const dataUrl = canvas.toDataURL('image/png');
        setCanvasUrl(dataUrl);
      } catch {
        // Fallback
      }
      setIsGenerating(false);
    };

    img.onerror = () => {
      setIsGenerating(false);
    };
  }, [isOpen, verseIndex, aspectRatio, selectedMoodId, currentVerse, selectedMood]);

  if (!isOpen) return null;

  // Handlers
  const handleNext = () => setVerseIndex((prev) => (prev + 1) % ALL_VERSES.length);
  const handlePrev = () => setVerseIndex((prev) => (prev - 1 + ALL_VERSES.length) % ALL_VERSES.length);
  const handleRandom = () => setVerseIndex(Math.floor(Math.random() * ALL_VERSES.length));
  const handleToday = () => setVerseIndex(getTodayVerseIndex());

  // Download High-Resolution PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Hanuman-Suvichar-${currentVerse.label?.replace(/\s+/g, '-') || 'verse'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Share via WhatsApp / Web Share API
  const handleShare = async () => {
    const canvas = canvasRef.current;
    const shareText = `🕉️ *श्री हनुमान चालीसा - ${currentVerse.label}*\n\n"${currentVerse.hindi}"\n\n📖 *भावार्थ*: ${currentVerse.meaning}\n\n॥ जय श्री राम • जय हनुमान जी ॥\nhttps://arpit1815coder.github.io/hanumanji/`;

    if (canvas && navigator.canShare) {
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], `hanuman-suvichar.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'श्री हनुमान चालीसा सुविचार',
              text: shareText
            });
            return;
          }
          // Fallback if files cannot be shared
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
          handleDownload();
        }, 'image/png');
        return;
      } catch {
        // Fallback to text share
      }
    }

    // Direct WhatsApp text share fallback
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  // Copy Verse Text
  const handleCopy = () => {
    const text = `🕉️ श्री हनुमान चालीसा • ${currentVerse.label}\n\n${currentVerse.hindi}\n\nभावार्थ: ${currentVerse.meaning}\n\n॥ जय श्री राम • जय बजरंगबली ॥`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg sm:max-w-2xl md:max-w-4xl max-h-[96vh] sm:max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-slate-900/90 text-white border border-amber-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.2)] backdrop-blur-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/40 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">✨</span>
            <div>
              <h2 className="font-['Rozha_One',serif] text-base sm:text-xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400">
                दैनिक सुविचार & WhatsApp Status
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-200/70 font-sans">
                {getHindiDate()} • {currentVerse.label}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col md:flex-row gap-4 sm:gap-6 items-center cool-scrollbar">
          {/* Left: Card Preview */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/2 shrink-0">
            <div
              className={`relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/40 bg-black flex items-center justify-center transition-all ${
                aspectRatio === 'story'
                  ? 'w-[200px] h-[355px] min-[380px]:w-[225px] min-[380px]:h-[400px] sm:w-[260px] sm:h-[462px]'
                  : 'w-[240px] h-[240px] sm:w-[300px] sm:h-[300px]'
              }`}
            >
              {isGenerating && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
                  <span className="text-xs text-amber-200 mt-2 font-medium">सुविचार तैयार हो रहा है...</span>
                </div>
              )}

              {/* Hidden Canvas used for generating HD export */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Rendered Live Image Preview */}
              {canvasUrl && (
                <img
                  src={canvasUrl}
                  alt="Hanuman Ji Suvichar Card"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Previous / Next Arrows under Preview */}
            <div className="flex items-center justify-center space-x-3 mt-3 w-full">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-white/10 hover:bg-amber-400/20 text-white hover:text-amber-300 transition-all cursor-pointer active:scale-90"
                title="Previous Chaupai"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-xs sm:text-sm font-semibold text-amber-200 font-mono">
                {verseIndex + 1} / {ALL_VERSES.length}
              </span>

              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-white/10 hover:bg-amber-400/20 text-white hover:text-amber-300 transition-all cursor-pointer active:scale-90"
                title="Next Chaupai"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right: Controls & Actions */}
          <div className="w-full md:w-1/2 flex flex-col space-y-3.5 sm:space-y-4 text-left">
            {/* 1. Format Switcher */}
            <div>
              <label className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-1.5">
                कार्ड का साइज़ (Format):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAspectRatio('story')}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center space-x-1.5 border ${
                    aspectRatio === 'story'
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                  }`}
                >
                  <span>📱 9:16 WhatsApp Story</span>
                </button>

                <button
                  onClick={() => setAspectRatio('square')}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center space-x-1.5 border ${
                    aspectRatio === 'square'
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                  }`}
                >
                  <span>🖼️ 1:1 Square Post / DP</span>
                </button>
              </div>
            </div>

            {/* 2. Choose Mood Wallpaper Image */}
            <div>
              <label className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-1.5">
                हनुमान जी का दिव्य स्वरूप (Theme):
              </label>
              <div className="flex items-center space-x-2 overflow-x-auto py-1">
                {MOODS.map((mood) => {
                  const isSelected = mood.id === selectedMoodId;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMoodId(mood.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                      }`}
                    >
                      <span className="mr-1">{mood.emoji}</span>
                      <span>{mood.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Verse Selector Dropdown & Quick Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  चौपाई का चयन:
                </label>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleToday}
                    className="px-2 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                    title="Today's Chaupai"
                  >
                    <Calendar className="w-3 h-3 text-amber-300" />
                    <span>आज का</span>
                  </button>
                  <button
                    onClick={handleRandom}
                    className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                    title="Random Chaupai"
                  >
                    <Shuffle className="w-3 h-3 text-amber-300" />
                    <span>रैंडम</span>
                  </button>
                </div>
              </div>

              <select
                value={verseIndex}
                onChange={(e) => setVerseIndex(Number(e.target.value))}
                className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm text-amber-100 outline-none focus:border-amber-400 transition-colors cursor-pointer"
              >
                {ALL_VERSES.map((v, i) => (
                  <option key={i} value={i} className="bg-slate-900 text-white">
                    {v.label}: {v.hindi.split('।')[0]}...
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Action Buttons: WhatsApp Share, Download, Copy */}
            <div className="pt-2 space-y-2">
              {/* WhatsApp Share Button */}
              <button
                onClick={handleShare}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(16,185,129,0.35)] active:scale-95"
              >
                <Share2 className="w-5 h-5 text-white" />
                <span>WhatsApp स्टेटस पर शेयर करें</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Download Image Button */}
                <button
                  onClick={handleDownload}
                  className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>इमेज डाउनलोड</span>
                </button>

                {/* Copy Verse Text Button */}
                <button
                  onClick={handleCopy}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-semibold">कॉपी हो गया!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span>चौपाई कॉपी</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
