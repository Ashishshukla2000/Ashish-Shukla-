# Ashish Transformation Coach

A free personal trainer app for a 90-day body transformation journey. It runs as one HTML file with no AI or API costs and needs no signup. All data stays in your own browser.

Open `coach/index.html` in a phone or laptop browser.

## What it does

- **Today**: day number (Day N / 90), a motivation line of the day, calorie, protein and water targets, a daily log (weight, steps, sleep, water), a 7-point checklist and a rule-based coach that gives tips based on what you logged.
- **Workout**: a Push / Pull / Legs split with Sunday as active rest, a 10-minute warm-up, and set-by-set tracking.
- **Food**: an Indian food list (roti, dal, paneer, eggs, chicken, soya, whey and more) with calories and protein, custom food entries, and a sample day for veg, egg or non-veg diets.
- **Progress**: a weight trend chart with a goal line, a 3-week history and a copy/paste backup.
- **Journey**: a daily diary plus an auto-filled YouTube kit (title, description with hashtags, and a Shorts script) built from your logs.

Targets use the Mifflin-St Jeor formula: fat loss is about −450 kcal, muscle gain +250 kcal, protein 1.8–2 g per kg.

## Schedule agent (Workout tab)

Type or speak a command to move workout days or change the time. It is rule-based, so there is no AI cost. Examples:

- `aaj gym nahi ja paunga`: today becomes rest and every workout moves one day ahead until the next rest day
- `kal shaam 7 baje`: tomorrow at 7 PM (one time only)
- `har din subah 6 baje`: 6 AM every day
- `Monday ka workout Tuesday ko shift karo`: swaps the two days
- `Sunday ko legs` / `har Friday legs`: sets that day's workout, once or every week
- `undo`, `schedule reset`

The mic button uses the browser's speech recognition where it is allowed. Where it is blocked, use the phone keyboard's mic key to speak into the box.
