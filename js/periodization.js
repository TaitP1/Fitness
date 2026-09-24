// Scientific Periodization Engine & RPE Autoregulation
// Based on Schoenfeld (2016, 2019), Helms (2018), Israetel (RP Hypertrophy Guidelines), and Zourdos (RPE/RIR)

const USER_PROFILE = {
  age: 31,
  gender: "male",
  heightInches: 72, // 6ft
  weightLbs: 180,
  experience: "intermediate",
  daysPerWeek: 4,
  goals: {
    phase1: "Hypertrophy (Back, Shoulders, Legs) - Current to Feb",
    phase2: "Functional Fitness (Athleticism, Power, Conditioning) - March to May"
  }
};

// Helms/Tuchscherer RPE-to-Percentage conversion matrix (% of 1RM)
const RPE_TABLE = {
  10: { 1: 1.00, 2: 0.955, 3: 0.922, 4: 0.892, 5: 0.863, 6: 0.837, 7: 0.811, 8: 0.786, 9: 0.762, 10: 0.739, 12: 0.694, 15: 0.635 },
  9.5: { 1: 0.978, 2: 0.939, 3: 0.907, 4: 0.878, 5: 0.850, 6: 0.824, 7: 0.799, 8: 0.774, 9: 0.751, 10: 0.728, 12: 0.683, 15: 0.625 },
  9: { 1: 0.955, 2: 0.922, 3: 0.892, 4: 0.863, 5: 0.837, 6: 0.811, 7: 0.786, 8: 0.762, 9: 0.739, 10: 0.717, 12: 0.672, 15: 0.615 },
  8.5: { 1: 0.939, 2: 0.907, 3: 0.878, 4: 0.850, 5: 0.824, 6: 0.799, 7: 0.774, 8: 0.751, 9: 0.728, 10: 0.706, 12: 0.661, 15: 0.605 },
  8: { 1: 0.922, 2: 0.892, 3: 0.863, 4: 0.837, 5: 0.811, 6: 0.786, 7: 0.762, 8: 0.739, 9: 0.717, 10: 0.695, 12: 0.650, 15: 0.595 },
  7.5: { 1: 0.907, 2: 0.878, 3: 0.850, 4: 0.824, 5: 0.799, 6: 0.774, 7: 0.751, 8: 0.728, 9: 0.706, 10: 0.684, 12: 0.639, 15: 0.585 },
  7: { 1: 0.892, 2: 0.863, 3: 0.837, 4: 0.811, 5: 0.786, 6: 0.762, 7: 0.739, 8: 0.717, 9: 0.695, 10: 0.673, 12: 0.628, 15: 0.575 },
  6.5: { 1: 0.878, 2: 0.850, 3: 0.824, 4: 0.799, 5: 0.774, 6: 0.751, 7: 0.728, 8: 0.706, 9: 0.684, 10: 0.662, 12: 0.617, 15: 0.565 },
  6: { 1: 0.863, 2: 0.837, 3: 0.811, 4: 0.786, 5: 0.762, 6: 0.739, 7: 0.717, 8: 0.695, 9: 0.673, 10: 0.651, 12: 0.606, 15: 0.555 }
};

// Calculate Estimated 1RM (E1RM) from logged weight, completed reps, and perceived RPE
function calculateE1RM(weight, reps, rpe) {
  if (!weight || weight <= 0 || !reps || reps <= 0) return 0;
  const safeRpe = Math.min(10, Math.max(6, rpe || 8));
  // Reps in Reserve (RIR) = 10 - RPE
  const rir = Math.max(0, 10 - safeRpe);
  const effectiveReps = reps + rir;
  
  // Brzycki formula combined with Wathan average for high accuracy
  // Brzycki: weight * (36 / (37 - reps))
  if (effectiveReps >= 37) return Math.round(weight * 2.0);
  const brzycki = weight * (36 / (37 - effectiveReps));
  const wathan = (100 * weight) / (48.8 + (53.8 * Math.exp(-0.075 * effectiveReps)));
  const avg1RM = (brzycki + wathan) / 2;
  return Math.round(avg1RM * 10) / 10;
}

// Calculate recommended target weight for a given E1RM, target reps, and target RPE
function getOptimalWeight(e1rm, targetReps, targetRPE) {
  if (!e1rm || e1rm <= 0) return 0;
  const closestRpe = Math.min(10, Math.max(6, Math.round(targetRPE * 2) / 2));
  const rpeRow = RPE_TABLE[closestRpe] || RPE_TABLE[8];
  
  // Find percentage based on target reps
  let pct = 0.70;
  if (rpeRow[targetReps]) {
    pct = rpeRow[targetReps];
  } else {
    // Interpolate
    const keys = Object.keys(rpeRow).map(Number).sort((a,b) => a-b);
    if (targetReps <= keys[0]) pct = rpeRow[keys[0]];
    else if (targetReps >= keys[keys.length - 1]) pct = rpeRow[keys[keys.length - 1]];
    else {
      let lower = keys[0], upper = keys[keys.length - 1];
      for (let i = 0; i < keys.length - 1; i++) {
        if (keys[i] <= targetReps && keys[i+1] >= targetReps) {
          lower = keys[i];
          upper = keys[i+1];
          break;
        }
      }
      const ratio = (targetReps - lower) / (upper - lower);
      pct = rpeRow[lower] + ratio * (rpeRow[upper] - rpeRow[lower]);
    }
  }
  
  // Calculate raw target and round to nearest standard 2.5 or 5 lb increment
  const rawTarget = e1rm * pct;
  const rounded = Math.round(rawTarget / 2.5) * 2.5;
  return Math.max(5, rounded);
}

// Master Periodization Schedule
const PERIODIZATION_SCHEDULE = {
  // BASELINE WEEK (Week 1)
  baseline: {
    id: "baseline",
    phase: "baseline",
    name: "Baseline Calibration Week (Week 1)",
    tagline: "Calibration & Neuromuscular Baseline Establishment",
    description: "Perform moderate 6-10 rep sets at RPE 7-8 to establish accurate starting 1RMs, joint readiness, and movement baselines without accumulating excessive fatigue.",
    weeks: [1],
    targetRPE: 7.5,
    workouts: [
      {
        day: 1,
        name: "Baseline Upper (Back & Shoulder Calibration)",
        focus: "Back & Shoulders",
        exercises: [
          { exerciseId: "lat-pulldown", sets: 3, reps: "8-10", targetRPE: 7.5, rest: 90, note: "Find comfortable 8-10 rep weight with 2 solid reps in reserve." },
          { exerciseId: "barbell-row", sets: 3, reps: "8", targetRPE: 7.5, rest: 120, note: "Strict form, no torso heave." },
          { exerciseId: "overhead-barbell-press", sets: 3, reps: "6-8", targetRPE: 7.5, rest: 120, note: "Record clean standing overhead press." },
          { exerciseId: "cable-lateral-raise", sets: 3, reps: "12-15", targetRPE: 8.0, rest: 75, note: "Control eccentric." },
          { exerciseId: "incline-dumbbell-bench", sets: 3, reps: "8-10", targetRPE: 7.5, rest: 90, note: "Chest maintenance volume." },
          { exerciseId: "face-pulls", sets: 3, reps: "15", targetRPE: 8.0, rest: 60, note: "Rotator cuff and rear delt priming." }
        ]
      },
      {
        day: 2,
        name: "Baseline Lower (Quad & Leg Calibration)",
        focus: "Quads & Glutes",
        exercises: [
          { exerciseId: "barbell-back-squat", sets: 3, reps: "6-8", targetRPE: 7.5, rest: 150, note: "Hit clean parallel depth, leave 2-3 reps in reserve." },
          { exerciseId: "romanian-deadlift", sets: 3, reps: "8-10", targetRPE: 7.5, rest: 120, note: "Deep hamstring stretch hinge." },
          { exerciseId: "bulgarian-split-squat", sets: 3, reps: "8 each", targetRPE: 7.5, rest: 90, note: "Unilateral stability baseline." },
          { exerciseId: "leg-extension", sets: 3, reps: "12-15", targetRPE: 8.0, rest: 75, note: "Isolated quad baseline." },
          { exerciseId: "standing-calf-raise", sets: 3, reps: "12-15", targetRPE: 8.0, rest: 60, note: "Full stretch pause." }
        ]
      },
      {
        day: 3,
        name: "Baseline Upper (Shoulder Width & Lat Density)",
        focus: "Shoulders & Back",
        exercises: [
          { exerciseId: "seated-dumbbell-press", sets: 3, reps: "8-10", targetRPE: 7.5, rest: 90, note: "Clean shoulder volume." },
          { exerciseId: "chest-supported-tbar-row", sets: 3, reps: "8-10", targetRPE: 7.5, rest: 90, note: "Mid-back thickness." },
          { exerciseId: "pull-ups", sets: 3, reps: "6-10", targetRPE: 7.5, rest: 120, note: "Bodyweight or slight assisted/weighted." },
          { exerciseId: "dumbbell-lateral-raise", sets: 3, reps: "12-15", targetRPE: 8.0, rest: 60, note: "Strict lateral delts." },
          { exerciseId: "reverse-pec-deck", sets: 3, reps: "12-15", targetRPE: 8.0, rest: 60, note: "Rear delt isolation." },
          { exerciseId: "incline-bicep-curl", sets: 3, reps: "10-12", targetRPE: 8.0, rest: 60, note: "Arm balance." }
        ]
      },
      {
        day: 4,
        name: "Baseline Lower (Posterior Chain & Leg Volume)",
        focus: "Hamstrings, Glutes & Legs",
        exercises: [
          { exerciseId: "leg-press", sets: 3, reps: "10-12", targetRPE: 7.5, rest: 120, note: "Smooth controlled knee flexion." },
          { exerciseId: "lying-leg-curl", sets: 3, reps: "10-12", targetRPE: 8.0, rest: 75, note: "Hamstring knee-flexion baseline." },
          { exerciseId: "barbell-row", sets: 3, reps: "10", targetRPE: 7.5, rest: 90, note: "Bonus back frequency set." },
          { exerciseId: "overhead-cable-tricep", sets: 3, reps: "12-15", targetRPE: 8.0, rest: 60, note: "Triceps overhead stretch." },
          { exerciseId: "standing-calf-raise", sets: 3, reps: "15", targetRPE: 8.0, rest: 60, note: "Calf density." }
        ]
      }
    ]
  },

  // PHASE 1: HYPERTROPHY (NOW - FEBRUARY)
  // MESOCYCLE 1: ACCUMULATION (WEEKS 2 - 6)
  hypertrophy_meso1: {
    id: "hypertrophy_meso1",
    phase: "hypertrophy",
    name: "Hypertrophy Mesocycle 1: Volume Accumulation",
    tagline: "Phase 1 (Now - Feb): Mechanical Tension & Muscle Growth",
    description: "High mechanical tension in the 8-12 rep range with Back, Shoulder, and Leg volume scaling progressively from RPE 7.5 to RPE 8.5. 16-18 direct sets/week for target muscles.",
    weeks: [2, 3, 4, 5, 6],
    targetRPE: 8.0,
    workouts: [
      {
        day: 1,
        name: "Upper A: Back Width & Deltoid Cap",
        focus: "Lats, Lateral Delts & Upper Back",
        exercises: [
          { exerciseId: "lat-pulldown", sets: 4, reps: "8-10", targetRPE: 8.0, rest: 90, note: "Lengthened pause: 1s stretch at top." },
          { exerciseId: "overhead-barbell-press", sets: 4, reps: "6-8", targetRPE: 8.0, rest: 120, note: "Explosive concentric, 2s negative." },
          { exerciseId: "chest-supported-tbar-row", sets: 3, reps: "10-12", targetRPE: 8.5, rest: 90, note: "Upper back retraction squeeze." },
          { exerciseId: "cable-lateral-raise", sets: 4, reps: "12-15", targetRPE: 8.5, rest: 60, note: "Constant tension, lead with elbows." },
          { exerciseId: "incline-dumbbell-bench", sets: 3, reps: "8-10", targetRPE: 8.0, rest: 90, note: "Pectoral maintenance volume." },
          { exerciseId: "face-pulls", sets: 3, reps: "15-20", targetRPE: 8.5, rest: 60, note: "Posterior cuff health." }
        ]
      },
      {
        day: 2,
        name: "Lower A: Quad Dominance & Hip Hypertrophy",
        focus: "Quads, Glutes & Calves",
        exercises: [
          { exerciseId: "barbell-back-squat", sets: 4, reps: "6-8", targetRPE: 8.0, rest: 150, note: "Drive mid-foot through floor." },
          { exerciseId: "romanian-deadlift", sets: 3, reps: "8-10", targetRPE: 8.0, rest: 120, note: "Hips back, full hamstring loaded stretch." },
          { exerciseId: "bulgarian-split-squat", sets: 3, reps: "10 each", targetRPE: 8.5, rest: 90, note: "Deep quad stretch on descent." },
          { exerciseId: "leg-extension", sets: 3, reps: "12-15", targetRPE: 9.0, rest: 60, note: "Last set: lengthened partials (bottom half 5 reps)." },
          { exerciseId: "standing-calf-raise", sets: 4, reps: "12-15", targetRPE: 8.5, rest: 60, note: "2s pause at bottom stretch." }
        ]
      },
      {
        day: 3,
        name: "Upper B: Back Thickness & 3D Shoulders",
        focus: "Rhomboids, Delts & Back Thickness",
        exercises: [
          { exerciseId: "barbell-row", sets: 4, reps: "8-10", targetRPE: 8.0, rest: 120, note: "Squeeze shoulder blades together." },
          { exerciseId: "seated-dumbbell-press", sets: 4, reps: "8-10", targetRPE: 8.5, rest: 90, note: "Full ROM down to clavicles." },
          { exerciseId: "pull-ups", sets: 3, reps: "8-10", targetRPE: 8.5, rest: 90, note: "Controlled eccentric." },
          { exerciseId: "dumbbell-lateral-raise", sets: 4, reps: "12-15", targetRPE: 9.0, rest: 60, note: "Superset with next exercise if desired." },
          { exerciseId: "reverse-pec-deck", sets: 4, reps: "15", targetRPE: 9.0, rest: 60, note: "Rear delt capped look." },
          { exerciseId: "incline-bicep-curl", sets: 3, reps: "10-12", targetRPE: 8.5, rest: 60, note: "Peak bicep stretch." }
        ]
      },
      {
        day: 4,
        name: "Lower B: Posterior Chain & Leg Density",
        focus: "Hamstrings, Glutes & Leg Hypertrophy",
        exercises: [
          { exerciseId: "leg-press", sets: 4, reps: "10-12", targetRPE: 8.5, rest: 120, note: "Full depth without pelvic roll." },
          { exerciseId: "lying-leg-curl", sets: 4, reps: "10-12", targetRPE: 9.0, rest: 75, note: "3s eccentric, slow negative." },
          { exerciseId: "straight-arm-pulldown", sets: 3, reps: "12-15", targetRPE: 8.5, rest: 60, note: "Lat isolation & metabolic stress." },
          { exerciseId: "overhead-cable-tricep", sets: 3, reps: "12-15", targetRPE: 8.5, rest: 60, note: "Triceps long head." },
          { exerciseId: "standing-calf-raise", sets: 4, reps: "15-20", targetRPE: 9.0, rest: 60, note: "Burnout calf dropset on final set." }
        ]
      }
    ]
  },

  // MESOCYCLE 2: METABOLIC STRESS & LENGTHENED PARTIALS (WEEKS 8 - 14)
  hypertrophy_meso2: {
    id: "hypertrophy_meso2",
    phase: "hypertrophy",
    name: "Hypertrophy Mesocycle 2: Lengthened Tension & Muscle Damage",
    tagline: "Phase 1 (Now - Feb): Peak Hypertrophy Stimulus",
    description: "Leverages cutting-edge 2024-2026 sports science on stretch-mediated hypertrophy and lengthened muscle tension. RPE pushes to 8.5 - 9.5 with high volume and drop-sets.",
    weeks: [8, 9, 10, 11, 12, 13, 14],
    targetRPE: 9.0,
    workouts: [
      {
        day: 1,
        name: "Upper A (Lengthened Stretch Bias - Back & Delts)",
        focus: "Lats & Lateral Delts",
        exercises: [
          { exerciseId: "lat-pulldown", sets: 4, reps: "10-12", targetRPE: 9.0, rest: 90, note: "Include 3 lengthened partials at end of final 2 sets." },
          { exerciseId: "cable-lateral-raise", sets: 5, reps: "12-15", targetRPE: 9.0, rest: 60, note: "Set pulley at wrist height for max stretch torque." },
          { exerciseId: "chest-supported-tbar-row", sets: 4, reps: "8-10", targetRPE: 8.5, rest: 90, note: "Full shoulder protraction stretch." },
          { exerciseId: "overhead-barbell-press", sets: 3, reps: "6-8", targetRPE: 8.5, rest: 120, note: "Strict deltoid power." },
          { exerciseId: "face-pulls", sets: 4, reps: "15-20", targetRPE: 9.0, rest: 60, note: "2-second rear delt peak hold." },
          { exerciseId: "incline-dumbbell-bench", sets: 3, reps: "8-10", targetRPE: 8.5, rest: 90, note: "Deep pec stretch." }
        ]
      },
      {
        day: 2,
        name: "Lower A (Deep Squat & Quad Overload)",
        focus: "Quads & Glutes",
        exercises: [
          { exerciseId: "hack-squat", sets: 4, reps: "8-10", targetRPE: 9.0, rest: 120, note: "Deep knee flexion to touch calves." },
          { exerciseId: "romanian-deadlift", sets: 4, reps: "8-10", targetRPE: 8.5, rest: 120, note: "Pause 1s at maximum hamstring stretch." },
          { exerciseId: "bulgarian-split-squat", sets: 3, reps: "10-12 each", targetRPE: 9.0, rest: 90, note: "Glute and quad burn." },
          { exerciseId: "leg-extension", sets: 4, reps: "12-15", targetRPE: 9.5, rest: 60, note: "Dropset on final set: drop weight 30% and rep to failure." },
          { exerciseId: "standing-calf-raise", sets: 4, reps: "12-15", targetRPE: 9.0, rest: 60, note: "Deep loaded stretch." }
        ]
      },
      {
        day: 3,
        name: "Upper B (Back Width, Traps & 3D Delts)",
        focus: "Upper Back & Shoulders",
        exercises: [
          { exerciseId: "pull-ups", sets: 4, reps: "8-10", targetRPE: 9.0, rest: 90, note: "Weighted if bodyweight exceeds 10 reps." },
          { exerciseId: "seated-dumbbell-press", sets: 4, reps: "8-10", targetRPE: 9.0, rest: 90, note: "Elbows slightly tucked in scapular plane." },
          { exerciseId: "cable-seated-row", sets: 4, reps: "10-12", targetRPE: 8.5, rest: 90, note: "Neutral grip drive to hips." },
          { exerciseId: "dumbbell-lateral-raise", sets: 4, reps: "15", targetRPE: 9.5, rest: 60, note: "Myo-rep style: 15 reps + 4 breath rest + 4 reps + 4 reps." },
          { exerciseId: "reverse-pec-deck", sets: 4, reps: "12-15", targetRPE: 9.0, rest: 60, note: "Posterior deltoid isolator." },
          { exerciseId: "incline-bicep-curl", sets: 3, reps: "10-12", targetRPE: 8.5, rest: 60, note: "Supinated curl." }
        ]
      },
      {
        day: 4,
        name: "Lower B (Hamstring & Posterior Chain Focus)",
        focus: "Hamstrings & Leg Mass",
        exercises: [
          { exerciseId: "barbell-back-squat", sets: 4, reps: "6-8", targetRPE: 8.5, rest: 150, note: "Solid brace, full depth." },
          { exerciseId: "lying-leg-curl", sets: 4, reps: "10-12", targetRPE: 9.5, rest: 75, note: "Slow 3s eccentric on each rep." },
          { exerciseId: "leg-press", sets: 3, reps: "12-15", targetRPE: 8.5, rest: 90, note: "Quad pump." },
          { exerciseId: "straight-arm-pulldown", sets: 4, reps: "12-15", targetRPE: 9.0, rest: 60, note: "Lat stretch and pump." },
          { exerciseId: "standing-calf-raise", sets: 4, reps: "15-20", targetRPE: 9.0, rest: 60, note: "Full ankle dorsiflexion stretch." }
        ]
      }
    ]
  },

  // PHASE 2: FUNCTIONAL FITNESS (MARCH - MAY)
  functional_phase: {
    id: "functional_phase",
    phase: "functional",
    name: "Functional Fitness: Power, Athleticism & Conditioning",
    tagline: "Phase 2 (March - May): Multi-Planar Performance & Work Capacity",
    description: "Dynamic transition from pure hypertrophy to functional athletic capacity. Integrates tri-planar power, loaded carries, rotational strength, and high-intensity interval conditioning (EMOM & Tabata).",
    weeks: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    targetRPE: 8.5,
    workouts: [
      {
        day: 1,
        name: "Functional Day 1: Explosive Power & Posterior Hinge",
        focus: "Triple Extension, Traps & Posterior Chain",
        exercises: [
          { exerciseId: "trap-bar-deadlift", sets: 4, reps: "5-6", targetRPE: 8.0, rest: 120, note: "Max velocity concentric push off the floor." },
          { exerciseId: "push-press", sets: 4, reps: "5-6", targetRPE: 8.0, rest: 90, note: "Explosive hip drive into overhead lockout." },
          { exerciseId: "kettlebell-swings", sets: 4, reps: "15-20", targetRPE: 8.5, rest: 60, note: "Violent hip snap, glute contraction." },
          { exerciseId: "pull-ups", sets: 3, reps: "8-10", targetRPE: 8.5, rest: 90, note: "Strict athletic vertical pull." },
          { exerciseId: "farmers-carry", sets: 4, reps: "40 yards", targetRPE: 8.5, rest: 90, note: "Heavy load, proud posture, rapid footsteps." }
        ],
        intervalMetcon: {
          type: "EMOM",
          durationMins: 10,
          description: "Minute 1: 15 Kettlebell Swings | Minute 2: 10 Push-ups / Slams"
        }
      },
      {
        day: 2,
        name: "Functional Day 2: Multi-Planar Strength & Core Rotation",
        focus: "Anterior Core, Quads & Transverse Power",
        exercises: [
          { exerciseId: "front-squat", sets: 4, reps: "6", targetRPE: 8.0, rest: 120, note: "Upright thoracic spine, rock-solid core brace." },
          { exerciseId: "medicine-ball-slam", sets: 4, reps: "10 each side", targetRPE: 8.5, rest: 60, note: "Rotational acceleration and floor slam." },
          { exerciseId: "bulgarian-split-squat", sets: 3, reps: "8 each", targetRPE: 8.0, rest: 90, note: "Unilateral stability and hip balance." },
          { exerciseId: "overhead-barbell-press", sets: 3, reps: "6-8", targetRPE: 8.0, rest: 90, note: "Standing vertical pressing strength." },
          { exerciseId: "suitcase-carry", sets: 3, reps: "30 yards/side", targetRPE: 8.5, rest: 60, note: "Anti-lateral flexion; zero pelvic tilt." }
        ],
        intervalMetcon: {
          type: "Tabata",
          durationMins: 4,
          description: "8 Rounds: 20s Rotational Med Ball Slams / 10s Rest"
        }
      },
      {
        day: 3,
        name: "Functional Day 3: Unilateral Power & Rotational Durability",
        focus: "Rotational Core, Hip Stability & Shoulders",
        exercises: [
          { exerciseId: "turkish-get-up", sets: 3, reps: "3 each side", targetRPE: 8.0, rest: 90, note: "Continuous shoulder packing and eye on kettlebell." },
          { exerciseId: "box-jumps", sets: 4, reps: "5 jumps", targetRPE: 7.5, rest: 75, note: "Soft landing, step down deliberately." },
          { exerciseId: "barbell-row", sets: 4, reps: "8", targetRPE: 8.0, rest: 90, note: "Athletic hinge and row." },
          { exerciseId: "pallof-press", sets: 3, reps: "10 (2s hold)", targetRPE: 8.0, rest: 45, note: "Resist cable rotation without twisting." },
          { exerciseId: "cable-lateral-raise", sets: 3, reps: "15", targetRPE: 8.5, rest: 60, note: "Maintain deltoid capped volume." }
        ],
        intervalMetcon: {
          type: "AMRAP",
          durationMins: 12,
          description: "12-Min AMRAP: 8 Box Jumps + 12 DB Thrusters + 40m Farmer's Walk"
        }
      },
      {
        day: 4,
        name: "Functional Day 4: High Work Capacity & Engine Building",
        focus: "Conditioning, Full-Body Synergy & Mobility",
        exercises: [
          { exerciseId: "thrusters", sets: 4, reps: "8-10", targetRPE: 8.5, rest: 90, note: "Deep squat into explosive push press." },
          { exerciseId: "trap-bar-deadlift", sets: 3, reps: "8", targetRPE: 8.0, rest: 90, note: "Moderate weight, fast crisp reps." },
          { exerciseId: "lat-pulldown", sets: 4, reps: "10-12", targetRPE: 8.5, rest: 75, note: "Vertical pulling endurance." },
          { exerciseId: "farmers-carry", sets: 4, reps: "50 yards", targetRPE: 9.0, rest: 90, note: "Heavy challenge carry." },
          { exerciseId: "face-pulls", sets: 3, reps: "20", targetRPE: 8.0, rest: 60, note: "Postural reset and shoulder durability." }
        ],
        intervalMetcon: {
          type: "Intervals",
          durationMins: 15,
          description: "3 Rounds: 1 min Thrusters, 1 min Kettlebell Swings, 1 min Rest"
        }
      }
    ]
  }
};
