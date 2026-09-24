# Apex Hypertrophy & Functional Fitness Training System

A progressive fitness web application engineered based on modern sports science research (Schoenfeld, Helms, Israetel, Zourdos, Contreras).

### Athlete Profile
- **Age:** 31 years old male
- **Height:** 6 ft (72 in)
- **Weight:** 180 lbs (81.6 kg)
- **Frequency:** 4 Days Per Week

---

## Periodization Roadmap

### Phase 1: Hypertrophy Focus (Now through February)
- **Target Muscle Priorities:** Back (Lats, Rhomboids, Mid/Lower Traps), Shoulders (Lateral Deltoids, Posterior Deltoids), and Legs (Quadriceps, Hamstrings, Glutes, Calves).
- **Weekly Volume:** 14–20 direct sets per week for high-priority muscle groups; 8–10 maintenance sets for synergists.
- **Scientific Principles Applied:**
  - Stretch-mediated mechanical tension (lengthened muscle loading).
  - Controlled eccentric tempo (3-1-1-0).
  - Rep ranges undulating from 6–8 (heavy tension) to 8–12 and 12–15 (metabolite accumulation & cell swelling).
  - Built-in exercise variety to maximize regional fiber recruitment and avoid mental and joint fatigue.

### Phase 2: Functional Fitness Transition (March through May)
- **Athletic Performance Priorities:** Multi-planar power, work capacity, joint durability, core anti-rotation, unilateral balance, and cardiovascular conditioning.
- **Key Movements:** Trap Bar Deadlifts, Push Presses, Kettlebell Swings, Front Squats, Loaded Farmer's & Suitcase Carries, Turkish Get-Ups, Medicine Ball Slams.
- **Integrated Conditioning Finishers:** EMOM (Every Minute on the Minute), Tabata (20s work / 10s rest), and AMRAP MetCons.

---

## Key Features

1. **Baseline Calibration Week & Dynamic RPE Autoregulation:**
   - Week 1 measures your baseline weights, completed reps, and perceived exertion (RPE).
   - Computes an estimated 1RM (E1RM) using the combined Brzycki and Wathan formulas adjusted for Reps In Reserve (RIR = 10 - RPE).
   - Dynamically calculates the optimal working weight for every exercise in subsequent workouts based on your target reps and RPE.

2. **Dual-View Anatomical Vector System (Front & Back):**
   - Renders interactive anterior and posterior human anatomy.
   - Highlights **Primary target muscles** in neon emerald (`#10b981`) and **Secondary/synergist muscles** in electric cyan (`#38bdf8`).
   - Displays clear biomechanical execution diagrams for Squats, Hinges, Pulls, Presses, Rows, Abductions, Kettlebells, and Carries.

3. **Frequent Interval Audio Timers:**
   - Synthesizes beeps and chimes via the browser's native Web Audio API (zero audio file dependencies).
   - Beeps at 30-second milestones, 15-second warnings, and 3-2-1 countdowns so you don't need to stare at your phone/screen while resting.
   - Floating dock allows you to browse other workouts while your rest timer ticks down.
   - Dedicated EMOM, Tabata, and AMRAP interval engines.

4. **Progress Metrics & Analytics Dashboard:**
   - Volume Load tracking (total lbs moved per workout and cumulative).
   - Estimated 1RM strength progression curves rendered on native high-DPI Canvas charts.
   - Weekly Muscle Group Volume distribution vs. research targets (10–20 sets/week).
   - Calibrated movement baselines table.

5. **Lifting Utilities & Smart Tools:**
   - **Olympic Barbell Plate Calculator:** Visual diagram of barbell sleeve with color-coded Olympic plates (45, 35, 25, 10, 5, 2.5 lbs).
   - **Ramp-Up Warm-Up Generator:** Dynamically creates evidence-based warmup sets (empty bar -> 50% -> 70% -> 85%) to potentiate the nervous system without premature fatigue.
   - **1RM & RPE Matrix:** Instant calculations across 5–15 reps and RPE 7.0–10.0.
   - **Biomechanically Equivalent Exercise Swapper:** Instantly swap exercises if gym equipment is occupied.
   - **Offline Persistence & JSON Backup:** All data is saved locally in your browser's localStorage and can be exported or restored anytime.

---

## iPhone / Mobile Setup Guide

The app is fully optimized for **Apple iPhone** (iOS Safari & Standalone PWA):
1. Open the app in **Safari** on your iPhone (e.g., host over local Wi-Fi or transfer folder / view via browser).
2. Tap the **Share** button (the square with an arrow pointing upward at the bottom of Safari).
3. Scroll down and tap **"Add to Home Screen"** (`+`).
4. Tap **Add** in the top right corner.
5. The **ApexFit** app icon will appear on your iPhone home screen!
6. Launching from your home screen runs the app in **Full-Screen Standalone Mode** with zero browser address bars, native iOS bottom navigation, tactile haptic vibrations, safe-area Dynamic Island / Notch integration, and Web Audio synthesized gym timers.

---

## How to Launch the App on Desktop

- Double-click `launch.bat` or open `index.html` in any browser (Chrome, Edge, Firefox, Safari).
- Runs 100% locally and offline without requiring Node.js, Python, or external servers.
