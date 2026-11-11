# ATUW Planner

A modern, intelligent time-blocking and routine management platform. ATUW Planner is designed to help users visualize their week, build consistent habits, enforce discipline, and eventually leverage AI to automatically optimize their daily schedules.

Currently running in a blazing-fast offline mode, with a hybrid Cloud + AI architecture on the roadmap.

## ✨ Core Features

### 📅 Advanced Time Blocking
* **Dynamic Weekly Grid:** Intuitive visual scheduling for both one-time tasks and recurring routines.
* **Live Daily Agenda:** A real-time dashboard that tracks "Happening Now" and "Up Next" blocks based on the current minute.
* **Conflict Resolution:** Smart scheduling logic that prevents overlapping time blocks.

### 🧠 Focus & Discipline
* **Anti-Procrastination (Strict Mode):** A ruthless global rule that locks expired tasks, preventing users from checking off missed time blocks and forcing honest accountability.
* **Contextual Audio UI:** Premium, lightweight synthetic auditory feedback (Success, Create, Danger) built entirely with the browser's native Web Audio API.

### 📈 Consistency Tracking
* **Contribution Grid:** A GitHub-style heatmap that tracks daily productivity streaks and task completion history.
* **Neural Capture:** A dedicated space for quick brain-dumps and daily notes without leaving the schedule view.

### 🎨 Deep Personalization
* **Adaptive Workflow:** Global toggles for 12h/24h time formats and Sunday/Monday week starts.
* **Theming Engine:** Full Dark/Light mode support with customizable accent colors (Cyan, Magenta, Emerald, Amber).

## 🛠️ Tech Stack

* **Frontend:** React + Vite
* **Styling:** Tailwind CSS (Glassmorphism & Modern UI)
* **State Management:** React Context API 
* **Icons:** Lucide-React
* **Audio:** Native Web Audio API Synthesizer

## 🚀 The Roadmap (Path to v2.0)

ATUW Planner is evolving from a standalone offline tool into a connected, AI-powered productivity ecosystem.

- [ ] **Phase 1: Hybrid Cloud (Supabase):** Integrating PostgreSQL and optional Google Auth for cross-device syncing and remote backup, while preserving immediate offline capabilities.
- [ ] **Phase 2: Live Deployment:** Hosting via Vercel/Netlify connected to a custom domain.
- [ ] **Phase 3: The AI Engine:** Integrating a Large Language Model (LLM) to auto-generate and pack schedules based on user-defined scheduling logic (Balanced, Aggressive, Relaxed).
- [ ] **Phase 4: Progressive Web App (PWA):** Generating service workers for native installation on iOS and Android.

## 💻 Getting Started

To run the current build of ATUW Planner locally:

1. Clone the repository:
   ```bash
   git clone [https://github.com/AryanChauhanA/ATUW-PLANNER.git](https://github.com/AryanChauhanA/ATUW-PLANNER.git)