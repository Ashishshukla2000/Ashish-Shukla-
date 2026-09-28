# Ashish Transformation Coach

A free personal trainer app for a 90-day body transformation journey. It runs as one HTML file with no AI or API costs and needs no signup. All data stays in your own browser.

Open `coach/index.html` in a phone or laptop browser.

## What it does

- **Home**: rings for calories, protein and water, today's workout, the daily progress photo, quick log, checklist and coach tips.
- **Workout**: warm-up, set-by-set tracking, calendar reminder and the next 7 days.
- **Coach** (center button): one chat agent that manages everything. It is rule-based, so there is no AI cost. It understands Hinglish, English and Hindi:
  - food: `2 roti dal aur 100g paneer khaya`, `3 ande aur 1 glass doodh`
  - water, weight, steps, sleep: `1 litre paani piya`, `weight 77.4`, `8500 steps`, `7 ghante soya`
  - workout: `workout ho gaya`, `aaj kya workout hai`
  - schedule: `aaj gym nahi ja paunga`, `kal shaam 7 baje`, `Monday ka workout Tuesday ko`, `har din subah 6 baje`
  - `status`, `aaj kya khau`, `photo add karo`, `undo`
- **Food**: calorie and protein bars, an Indian food list, custom food and a sample day.
- **Progress**: a photo gallery (one photo per day, Day 1 vs latest before/after), weight chart, YouTube kit (title, description, Shorts script) and data backup.

Photos are compressed and stored in the browser (IndexedDB). Logs are stored in localStorage. Keep the original photos in your phone gallery too.

Targets use the Mifflin-St Jeor formula: fat loss is about −450 kcal, muscle gain +250 kcal, protein 1.8–2 g per kg.

## Install on your phone (free)

1. On GitHub, open this repo → **Settings** → **Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**, pick the branch that has this code (`main` after merging, or `claude/personal-trainer-lifestyle-agent-mzmr2s`) and folder **/ (root)**, then **Save**.
3. After 1–2 minutes the app is live at https://ashishshukla2000.github.io/Ashish-Shukla-/
4. Open that link in **Chrome** (Android) and tap **⋮ → Add to Home screen → Install**. On iPhone use **Safari → Share → Add to Home Screen**.

It then opens full screen like a normal app, works offline, and the mic button works for voice commands.
