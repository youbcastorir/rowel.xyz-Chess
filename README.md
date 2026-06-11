# ♛ Rowel Chess OS

**"Where you don't just play chess… you learn to think like champions."**

🌐 [rowel.xyz](https://rowel.xyz) · 📧 [salatrir@gmail.com](mailto:salatrir@gmail.com)

---

## Overview

**Rowel Chess OS** is a next-generation chess learning platform that fuses:

- ♟️ **Chess.com-style gameplay** — a full interactive chess board with legal move validation, check/checkmate detection, castling, en passant, and promotion.
- 🦉 **Duolingo-style learning system** — daily missions, XP, streaks, levels, and progressive difficulty.
- 📱 **TikTok-style short content feed** — vertical-scroll, 60-second chess lessons, tactical highlights, and legendary game moments.
- 🧠 **AI personal coaching system** — a conversational AI coach (powered by Claude) that analyzes your games, detects blunders, explains *why* you lost, and builds weekly improvement plans.
- 🌍 **Social competition network** — leaderboards, nations rankings, clubs, and tournaments.

Built as a **single static site** with vanilla HTML, CSS, and JavaScript — no build tools, no frameworks, ready to deploy on **GitHub Pages** in minutes.

---

## ✨ Key Features

### 1. AI Chess Coach (Core Feature)
- Personal AI coach per player, powered by the Claude API
- Post-game analysis with material balance and move history
- Mistake detection (blunders, hanging pieces, missed tactics)
- Conversational chat — ask the coach anything about a position
- Weekly improvement plan generation
- Persistent memory of player weaknesses (stored locally)

### 2. Learning-Based Chess Play
- Every move is automatically classified: **fork, pin, skewer, capture, check, checkmate, castling, en passant, promotion, development**
- Each classification triggers an instant, localized mini-lesson in the coach panel
- Rewards thinking quality — every move teaches something

### 3. Daily Missions (Duolingo-style)
- 5–10 minute daily challenges
- XP and leveling system with animated progress bar
- Streak tracking with fire counter
- Badge collection (locked/unlocked)

### 4. Smart Matchmaking
- Behavioral similarity matching via a 5-axis style vector (attack, defense, tactical, endgame, opening)
- `findBestMatch()` in `matchmaking.js` demonstrates the algorithm

### 5. Mind Map Chess Profile
- Canvas-based radar chart visualizing attack tendency, defense patterns, tactical vision, endgame skill, and opening knowledge
- Adapts to light/dark theme

### 6. Social Chess Network
- Tabbed interface: Leaderboard, Nations, Clubs, Tournaments
- Mock data structure ready to be wired to a real backend/API

### 7. TikTok-Style Chess Feed
- Vertical scroll-snap mobile frame
- 60-second lessons, tactical highlights, and famous games
- Trending topics sidebar

### 8. Chess Analytics Dashboard
- Rating, win rate, accuracy, blunder rate cards
- Mini bar chart of rating history
- Weakness breakdown bars

---

## 🌍 Internationalization

Fully translated into **4 languages**:
- 🇬🇧 English
- 🇸🇦 Arabic (with full RTL layout support)
- 🇫🇷 French
- 🇪🇸 Spanish

All UI strings live in `translations.js`. The AI coach also responds in the player's selected language.

---

## 🏗️ Architecture Breakdown

```
rowel-chess-os/
├── index.html          # Main HTML structure, SEO meta, schema.org
├── style.css           # Full design system (dark/light themes, responsive)
├── app.js              # App init, board rendering, event wiring, theme/lang
├── chess-engine.js      # Chess rules engine: move generation, check/mate detection
├── ai-coach.js          # Claude API integration: chat, analysis, blunder detection
├── lessons.js           # Concept library (forks, pins, skewers, etc.) in 4 languages
├── missions.js          # Daily missions, XP, levels, streaks
├── matchmaking.js       # Smart matchmaking algorithm + social network tabs
├── analytics.js         # Analytics dashboard + Mind Map radar chart
├── feed.js              # TikTok-style vertical chess feed
├── translations.js      # i18n dictionary (en, ar, fr, es) + helper functions
├── manifest.json        # PWA manifest
├── sitemap.xml          # SEO sitemap
├── robots.txt           # Search engine crawling rules
└── .gitignore
```

### How the AI Coach works

`ai-coach.js` calls the Anthropic API (`claude-sonnet-4-20250514`) via `https://api.anthropic.com/v1/messages`. It:

1. Builds a system prompt describing the coach persona and the player's accumulated weaknesses (stored in `localStorage`)
2. Sends the conversation history + new message
3. Returns the model's text response
4. Falls back to offline canned responses if the network is unavailable

`detectBlunder()` compares board state before/after a move to flag pieces left hanging, and `analyzeGame()` summarizes the full move list with a coaching tone.

### How move classification works

`chess-engine.js`'s `classifyMove()` inspects the board after a move to detect forks (piece attacks 2+ enemy pieces), pins (aligned with enemy king through one piece), checks/checkmates, captures, castling, en passant, and promotions. `lessons.js` maps each tag to a localized explanation shown in the coach panel.

---

## 🚀 Deployment (GitHub Pages)

```bash
git init
git add .
git commit -m "Launch Rowel Chess OS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rowel.git
git push -u origin main
```

Then enable **GitHub Pages** in your repo settings:
1. Go to **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. Save — your site will be live at `https://YOUR_USERNAME.github.io/rowel/`

To use the custom domain **rowel.xyz**, add a `CNAME` file containing `rowel.xyz` to the repo root and configure your DNS provider with the appropriate `A`/`CNAME` records pointing to GitHub Pages.

---

## 💰 Plans

| Plan | Price | Highlights |
|---|---|---|
| **Free** | $0/mo | Basic lessons, 5 daily missions, Chess Shorts feed, community access |
| **Premium** | $9.99/mo | Full AI Coach, unlimited missions, smart matchmaking, deep post-game analysis |
| **Pro** | $19.99/mo | Mind Map profile, full analytics dashboard, tournament participation |
| **Academy** | Custom | Multi-seat management, teacher dashboard, school competitions, bulk analytics |

---

## 🗺️ Future Roadmap

- 📱 **Native mobile apps** (iOS / Android) with offline puzzle packs
- 🤖 **Multiplayer AI** — play against AI opponents tuned to specific historical styles (e.g., "play like Capablanca")
- 🏆 **Live tournaments** with real-time brackets, spectator mode, and commentary
- 🔊 **Voice-narrated coaching** during live games
- 🧬 **Deeper Mind Map** — opponent-specific preparation based on your style profile
- 🏫 **Academy LMS integration** — assign missions, track classroom progress, generate reports

---

## 📬 Support & Contact

For questions, partnerships, bug reports, or Academy plan inquiries:

📧 **salatrir@gmail.com**

---

© 2025 Rowel Chess OS · [rowel.xyz](https://rowel.xyz) · All rights reserved.
