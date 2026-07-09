# 筆畫功夫 · Stroke Kung Fu

A playable Chinese-character stroke-writing kung-fu game, implemented in plain
HTML/CSS/JS (no build step, no dependencies).

## Run it

It's a static site — serve the `app/` folder over HTTP and open `index.html`:

```bash
cd app
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly via `file://` also mostly works, but a local
server is recommended so the browser can load the font stylesheet and image
assets without cross-origin restrictions.)

## What's here

- `index.html` — all screens: Loading, Home, Levels 1–4, Win, Defeat, Pause overlay
- `style.css` — layout, theming, and all animations
- `game.js` — game logic (single `Game` class): canvas stroke tracing with
  forgiving-tube validation, Web-Audio-synthesized SFX/music, browser
  text-to-speech stroke/character names, HP/windup/timer combat, character pose
  sequencing (stand → attack → block), four language modes, and level-gating
  progress saved to `localStorage`
- `assets/` — all artwork (backgrounds, character/boss/monk poses, level cards,
  win/lose art)

## Gameplay

- **Level 1 — 基礎訓練 (Foundation):** trace 8 individual strokes; each stroke is
  guided (dotted path) then free-written.
- **Level 2 — 對戰演武 (Sparring):** write the prompted stroke to strike a monk
  opponent before his windup timer lands a hit. Clean, accurate strokes score
  critical hits.
- **Level 3 — 筆順修煉 (Sequence):** trace whole characters one stroke at a time
  in correct stroke order (筆順). Clear 5 characters.
- **Level 4 — 終極對決 (Character Combat):** a boss fight — write entire characters
  under a windup timer to damage the Grandmaster.

Levels unlock in sequence as you win each one. Progress, language, and mute
state persist across sessions.

## Languages

繁體中文 (粵語) · 繁體中文 (國語) · 简体中文 · English — switchable from the home
screen dropdown or the pause menu. Spoken stroke/character names use the
browser's speech synthesis when a matching voice is available.
