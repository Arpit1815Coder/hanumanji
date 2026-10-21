# 🕉️ Hanuman Chalisa • Mood Chants (श्री हनुमान चालीसा)

An ultra-clean, spiritual, and transparent devotional music player web application built with **React**, **Vite**, and **Tailwind CSS**. Designed as an installable Progressive Web App (PWA) with offline support and dynamic background images across 5 sacred audio moods.

---

## 🖼️ How to Add Your 5 Mood Images

The application supports **individual background images for each mood** with smooth crossfade transitions. Place your images directly in the `public/images/` directory:

```text
public/images/
├── hanuman-original.jpg       # 🕉️ Image displayed during Original mood
├── hanuman-peaceful.jpg       # 🌸 Image displayed during Peaceful mood
├── hanuman-happy.jpg          # ☀️ Image displayed during Happy mood
├── hanuman-motivational.jpg   # 🔥 Image displayed during Motivational mood
├── hanuman-powerful.jpg       # ⚡ Image displayed during Powerful mood
└── hanuman-bg.jpg             # Universal fallback image if any file is missing
```

> **Tip**: You can drop your `.jpg` or `.png` files directly into `public/images/` with these exact file names. The player automatically switches images smoothly whenever you switch moods.

---

## 🎵 Audio File Structure

Drop your custom MP3 files into `public/audio/`:

```text
public/audio/
├── hanuman-original.mp3       # 🕉️ Original traditional rendition
├── hanuman-peaceful.mp3       # 🌸 Meditative peaceful flute rendition
├── hanuman-happy.mp3          # ☀️ Joyful uplifting melodic rendition
├── hanuman-motivational.mp3   # 🔥 Energetic high-power rendition
└── hanuman-powerful.mp3       # ⚡ Thunderous Rudra Shakti powerful rendition
```

---

## ✨ 5 Devotional Moods

1. 🕉️ **Original**: Traditional / Sacred / Classic Chanting (Key `1`)
2. 🌸 **Peaceful**: Calm / Meditative / Bansuri Flute & Dhyan (Key `2`)
3. ☀️ **Happy**: Uplifting / Melodic / Anand & Joy (Key `3`)
4. 🔥 **Motivational**: Energetic / Heroic Veerta & Action (Key `4`)
5. ⚡ **Powerful**: Thunderous / Rudra Avtar, Mahabali & Unstoppable Might (Key `5`)

---

## ⌨️ Keyboard Shortcuts

- `Space`: Play / Pause Chanting
- `←` / `→`: Rewind / Fast-forward 10 seconds
- `↑` / `↓`: Volume Up / Down (5%)
- `M`: Mute / Unmute
- `L`: Continuous Chanting Loop toggle
- `1`, `2`, `3`, `4`, `5`: Instant Mood switch
- `F`: Fullscreen toggle

---

## 🚀 Running the App

```bash
# Start development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```
