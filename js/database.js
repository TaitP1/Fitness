// Exercise Database with Sports Science & Anatomical Classifications
const EXERCISE_DATABASE = {
  // BACK FOCUS
  "lat-pulldown": {
    id: "lat-pulldown",
    name: "Wide-Grip Lat Pulldown",
    pattern: "Vertical Pull",
    focus: "back",
    category: "hypertrophy",
    primaryMuscles: ["lats", "teres_major"],
    secondaryMuscles: ["biceps", "rhomboids", "rear_delts", "forearms"],
    tempo: "3-1-1-0",
    defaultRest: 90,
    graphicType: "lat_pulldown",
    cues: [
      "Set thigh pads snug. Grip bar slightly wider than shoulder width.",
      "Initiate pull by depressing clavicles and driving elbows straight down to hip pockets.",
      "Pause for 1s at deep clavicle contraction; resist the eccentric for 3 seconds into a full overhead stretch.",
      "Research Cue: Emphasize the stretch at the top where the latissimus dorsi is in its lengthened position."
    ],
    substitutes: ["pull-ups", "neutral-lat-pulldown", "single-arm-cable-pulldown"]
  },
  "pull-ups": {
    id: "pull-ups",
    name: "Bodyweight / Weighted Pull-Ups",
    pattern: "Vertical Pull",
    focus: "back",
    category: "hybrid",
    primaryMuscles: ["lats", "rhomboids", "lower_traps"],
    secondaryMuscles: ["biceps", "forearms", "abs"],
    tempo: "2-1-1-0",
    defaultRest: 120,
    graphicType: "pullup",
    cues: [
      "Overhand grip outside shoulders. Pack shoulders down before pulling.",
      "Pull until chin comfortably clears the bar, driving sternum toward bar.",
      "Lower under control to a dead hang to exploit lengthened-state tension."
    ],
    substitutes: ["lat-pulldown", "neutral-lat-pulldown"]
  },
  "barbell-row": {
    id: "barbell-row",
    name: "Bent-Over Barbell Row",
    pattern: "Horizontal Pull",
    focus: "back",
    category: "hypertrophy",
    primaryMuscles: ["lats", "rhomboids", "mid_traps"],
    secondaryMuscles: ["erectors", "rear_delts", "biceps", "hamstrings"],
    tempo: "3-0-1-0",
    defaultRest: 120,
    graphicType: "row",
    cues: [
      "Hinge at hips to approximately 45 degrees, maintaining neutral spinal alignment.",
      "Pull bar to upper abdomen/sternum, retracting scapulae simultaneously.",
      "Avoid using momentum or excessive torso bobbing; feel upper back squeeze."
    ],
    substitutes: ["chest-supported-tbar-row", "cable-seated-row", "dumbbell-row"]
  },
  "chest-supported-tbar-row": {
    id: "chest-supported-tbar-row",
    name: "Chest-Supported T-Bar / Machine Row",
    pattern: "Horizontal Pull",
    focus: "back",
    category: "hypertrophy",
    primaryMuscles: ["rhomboids", "mid_traps", "lats"],
    secondaryMuscles: ["rear_delts", "biceps"],
    tempo: "3-1-1-0",
    defaultRest: 90,
    graphicType: "row",
    cues: [
      "Chest flat on pad, eliminating spinal axial fatigue from erectors.",
      "Flared elbows (~45-60 deg) for rhomboids and mid-traps, or tucked for lat bias.",
      "Full protraction in eccentric stretch, forceful retraction at contraction."
    ],
    substitutes: ["cable-seated-row", "barbell-row"]
  },
  "cable-seated-row": {
    id: "cable-seated-row",
    name: "Neutral-Grip Cable Seated Row",
    pattern: "Horizontal Pull",
    focus: "back",
    category: "hypertrophy",
    primaryMuscles: ["lats", "rhomboids"],
    secondaryMuscles: ["biceps", "rear_delts"],
    tempo: "3-1-1-0",
    defaultRest: 90,
    graphicType: "row",
    cues: [
      "Keep torso upright with slight forward lean at max reach.",
      "Drive elbows back along ribcage, squeezing shoulder blades together.",
      "Continuous tension provided by cable enhances metabolic accumulation."
    ],
    substitutes: ["chest-supported-tbar-row", "barbell-row"]
  },
  "straight-arm-pulldown": {
    id: "straight-arm-pulldown",
    name: "Cable Straight-Arm Lat Pulldown",
    pattern: "Isolation Pull",
    focus: "back",
    category: "hypertrophy",
    primaryMuscles: ["lats", "teres_major"],
    secondaryMuscles: ["triceps", "abs"],
    tempo: "3-1-1-0",
    defaultRest: 75,
    graphicType: "lat_pulldown",
    cues: [
      "Slight torso hinge, arms nearly straight with soft elbow bend.",
      "Sweep hands in an arc down to thighs using purely shoulder extension.",
      "Feel intense lat contraction at thighs, stretch to ear level at top."
    ],
    substitutes: ["lat-pulldown", "pull-ups"]
  },

  // SHOULDERS FOCUS
  "overhead-barbell-press": {
    id: "overhead-barbell-press",
    name: "Standing Barbell Overhead Press (OHP)",
    pattern: "Vertical Push",
    focus: "shoulders",
    category: "hybrid",
    primaryMuscles: ["front_delts", "lateral_delts"],
    secondaryMuscles: ["triceps", "upper_traps", "core"],
    tempo: "2-1-1-0",
    defaultRest: 150,
    graphicType: "overhead_press",
    cues: [
      "Grip just outside shoulders, elbows tucked forward under bar.",
      "Squeeze glutes and brace abs tightly to prevent lumbar hyperextension.",
      "Press vertically, moving head back then forward into 'window' at lockout."
    ],
    substitutes: ["seated-dumbbell-press", "push-press"]
  },
  "seated-dumbbell-press": {
    id: "seated-dumbbell-press",
    name: "Seated Dumbbell Shoulder Press",
    pattern: "Vertical Push",
    focus: "shoulders",
    category: "hypertrophy",
    primaryMuscles: ["front_delts", "lateral_delts"],
    secondaryMuscles: ["triceps", "upper_traps"],
    tempo: "3-1-1-0",
    defaultRest: 120,
    graphicType: "overhead_press",
    cues: [
      "Bench at ~75-80 degree high incline (reduces impingement risk).",
      "Elbows angled slightly forward in scapular plane (~30 deg).",
      "Lower dumbbells down to clavicle level for full muscle stretch."
    ],
    substitutes: ["overhead-barbell-press", "arnold-press"]
  },
  "cable-lateral-raise": {
    id: "cable-lateral-raise",
    name: "Cable Lateral Raise (Behind/Front)",
    pattern: "Isolation Push",
    focus: "shoulders",
    category: "hypertrophy",
    primaryMuscles: ["lateral_delts"],
    secondaryMuscles: ["upper_traps"],
    tempo: "3-1-1-1",
    defaultRest: 75,
    graphicType: "lateral_raise",
    cues: [
      "Set cable at wrist or knee height for optimal resistance profile at lengthened range.",
      "Lead slightly with elbows; raise in scapular plane until arm is parallel to floor.",
      "Control the eccentric descent; avoid swinging or shrugging upper traps."
    ],
    substitutes: ["dumbbell-lateral-raise"]
  },
  "dumbbell-lateral-raise": {
    id: "dumbbell-lateral-raise",
    name: "Dumbbell Lateral Raise",
    pattern: "Isolation Push",
    focus: "shoulders",
    category: "hypertrophy",
    primaryMuscles: ["lateral_delts"],
    secondaryMuscles: ["upper_traps"],
    tempo: "3-0-1-1",
    defaultRest: 60,
    graphicType: "lateral_raise",
    cues: [
      "Slight forward lean of torso (10-15 degrees) aligns lateral delt with gravity.",
      "Raise arms outward as if pouring water from a pitcher (pinkies slightly up/neutral).",
      "Great for high-rep metabolic fatigue or myo-rep match sets."
    ],
    substitutes: ["cable-lateral-raise"]
  },
  "face-pulls": {
    id: "face-pulls",
    name: "Cable Face Pull with External Rotation",
    pattern: "Horizontal Pull",
    focus: "shoulders",
    category: "hybrid",
    primaryMuscles: ["rear_delts", "external_rotators", "mid_traps"],
    secondaryMuscles: ["biceps"],
    tempo: "2-1-1-1",
    defaultRest: 60,
    graphicType: "row",
    cues: [
      "Attach rope to high pulley. Grip with thumbs backward.",
      "Pull rope to forehead while rotating knuckles backward so biceps flex at 90 deg.",
      "Vital for shoulder health, posture, and rear delt cap development."
    ],
    substitutes: ["reverse-pec-deck"]
  },
  "reverse-pec-deck": {
    id: "reverse-pec-deck",
    name: "Reverse Pec Deck (Rear Delt Fly)",
    pattern: "Isolation Pull",
    focus: "shoulders",
    category: "hypertrophy",
    primaryMuscles: ["rear_delts"],
    secondaryMuscles: ["rhomboids", "traps"],
    tempo: "3-1-1-0",
    defaultRest: 75,
    graphicType: "lateral_raise",
    cues: [
      "Adjust seat so handles align with mid-chest/shoulders.",
      "Keep slight bend in elbows; drive back using rear delts without pinching shoulder blades together early.",
      "Control 3-second negative to maintain tension on posterior deltoid."
    ],
    substitutes: ["face-pulls"]
  },

  // LEGS FOCUS
  "barbell-back-squat": {
    id: "barbell-back-squat",
    name: "Barbell Back Squat",
    pattern: "Squat",
    focus: "legs",
    category: "hypertrophy",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["adductors", "erectors", "core", "calves"],
    tempo: "3-1-1-0",
    defaultRest: 180,
    graphicType: "squat",
    cues: [
      "Bar resting across upper traps (high bar) or rear delts (low bar).",
      "Inhale into diaphragm, brace 360 degrees, break simultaneously at knees and hips.",
      "Descend to at least parallel depth while keeping knee track aligned over toes.",
      "Drive mid-foot through the floor to return up."
    ],
    substitutes: ["hack-squat", "leg-press", "front-squat"]
  },
  "hack-squat": {
    id: "hack-squat",
    name: "Machine Hack Squat / Pendulum Squat",
    pattern: "Squat",
    focus: "legs",
    category: "hypertrophy",
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves"],
    tempo: "3-1-1-0",
    defaultRest: 120,
    graphicType: "squat",
    cues: [
      "Position feet low on platform for maximal knee flexion and quad bias.",
      "Back firmly anchored against pad; descend until hamstrings touch calves.",
      "Deep knee flexion under mechanical load triggers superior quad hypertrophy."
    ],
    substitutes: ["barbell-back-squat", "leg-press"]
  },
  "romanian-deadlift": {
    id: "romanian-deadlift",
    name: "Barbell / Dumbbell Romanian Deadlift (RDL)",
    pattern: "Hinge",
    focus: "legs",
    category: "hypertrophy",
    primaryMuscles: ["hamstrings", "glutes"],
    secondaryMuscles: ["erectors", "lats", "forearms"],
    tempo: "3-1-1-0",
    defaultRest: 150,
    graphicType: "deadlift",
    cues: [
      "Soft unlock at knees; initiate movement by pushing hips straight back toward the wall.",
      "Keep bar shaving down thighs and shins, maintaining a neutral flat spine.",
      "Stop when hips cannot travel further back (deep hamstring stretch), then drive hips forward."
    ],
    substitutes: ["trap-bar-deadlift", "seated-leg-curl"]
  },
  "bulgarian-split-squat": {
    id: "bulgarian-split-squat",
    name: "Dumbbell Bulgarian Split Squat",
    pattern: "Lunge/Unilateral",
    focus: "legs",
    category: "hybrid",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["adductors", "calves", "core"],
    tempo: "3-1-1-0",
    defaultRest: 90,
    graphicType: "lunge",
    cues: [
      "Rear foot elevated on bench or roller; hop front foot out comfortably.",
      "Torso slight forward lean (~15 deg) to target glutes, or upright for quad bias.",
      "Lower until front thigh is parallel, driving through whole front foot."
    ],
    substitutes: ["walking-lunges", "leg-press"]
  },
  "leg-press": {
    id: "leg-press",
    name: "45-Degree Leg Press",
    pattern: "Squat",
    focus: "legs",
    category: "hypertrophy",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["calves"],
    tempo: "3-1-1-0",
    defaultRest: 120,
    graphicType: "squat",
    cues: [
      "Hold handles tight to anchor pelvis firmly into seat.",
      "Lower sled slowly to maximum comfortable depth without lower back rounding (butt wink).",
      "Drive back up without violently locking knees out at top."
    ],
    substitutes: ["hack-squat", "barbell-back-squat"]
  },
  "lying-leg-curl": {
    id: "lying-leg-curl",
    name: "Lying or Seated Leg Curl",
    pattern: "Isolation Leg",
    focus: "legs",
    category: "hypertrophy",
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves"],
    tempo: "3-1-1-0",
    defaultRest: 75,
    graphicType: "squat",
    cues: [
      "Keep hips glued to pad; avoid lifting butt when flexing knees.",
      "Curl pad forcefully toward glutes, pausing 1 second at full knee flexion.",
      "Control the 3-second negative for maximum hamstring muscle damage and hypertrophy."
    ],
    substitutes: ["romanian-deadlift"]
  },
  "leg-extension": {
    id: "leg-extension",
    name: "Seated Leg Extension",
    pattern: "Isolation Leg",
    focus: "legs",
    category: "hypertrophy",
    primaryMuscles: ["quads", "rectus_femoris"],
    secondaryMuscles: [],
    tempo: "3-1-1-1",
    defaultRest: 75,
    graphicType: "squat",
    cues: [
      "Knee joint aligned with machine pivot axis.",
      "Extend legs fully to activate rectus femoris at shortened peak.",
      "Resist the stack down smoothly; keep tension continuous."
    ],
    substitutes: ["hack-squat", "bulgarian-split-squat"]
  },
  "standing-calf-raise": {
    id: "standing-calf-raise",
    name: "Standing / Donkey Calf Raise",
    pattern: "Isolation Leg",
    focus: "legs",
    category: "hypertrophy",
    primaryMuscles: ["gastrocnemius", "soleus"],
    secondaryMuscles: ["tibialis"],
    tempo: "3-2-1-1",
    defaultRest: 60,
    graphicType: "squat",
    cues: [
      "Balls of feet on platform, knees kept straight to recruit gastrocnemius.",
      "Lower heels into a deep 2-second stretch at bottom (essential for calf growth).",
      "Drive up high onto big toes, squeezing hard for 1 second."
    ],
    substitutes: ["seated-calf-raise"]
  },

  // MAINTENANCE UPPER (CHEST & ARMS)
  "incline-dumbbell-bench": {
    id: "incline-dumbbell-bench",
    name: "Incline Dumbbell Bench Press",
    pattern: "Horizontal Push",
    focus: "chest",
    category: "hypertrophy",
    primaryMuscles: ["chest", "front_delts"],
    secondaryMuscles: ["triceps"],
    tempo: "3-1-1-0",
    defaultRest: 120,
    graphicType: "bench",
    cues: [
      "Set bench to 30-degree incline.",
      "Retract shoulder blades, lower dumbbells wide with deep stretch across upper chest.",
      "Press upward and slightly inward along natural arc."
    ],
    substitutes: ["barbell-bench-press", "dips"]
  },
  "barbell-bench-press": {
    id: "barbell-bench-press",
    name: "Flat Barbell Bench Press",
    pattern: "Horizontal Push",
    focus: "chest",
    category: "hypertrophy",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "front_delts"],
    tempo: "3-1-1-0",
    defaultRest: 120,
    graphicType: "bench",
    cues: [
      "5 points of contact: head, shoulders, glutes, and both feet planted.",
      "Tuck elbows ~45-75 degrees; touch lower sternum before driving up."
    ],
    substitutes: ["incline-dumbbell-bench", "dips"]
  },
  "incline-bicep-curl": {
    id: "incline-bicep-curl",
    name: "Incline Dumbbell Bicep Curl",
    pattern: "Isolation Arm",
    focus: "arms",
    category: "hypertrophy",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    tempo: "3-1-1-0",
    defaultRest: 75,
    graphicType: "curl",
    cues: [
      "Set bench at 45-60 degrees to stretch long head of bicep at shoulder.",
      "Keep elbows back; supinate wrists as you curl up toward shoulders."
    ],
    substitutes: ["cable-curl", "hammer-curl"]
  },
  "overhead-cable-tricep": {
    id: "overhead-cable-tricep",
    name: "Overhead Cable Triceps Extension",
    pattern: "Isolation Arm",
    focus: "arms",
    category: "hypertrophy",
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    tempo: "3-1-1-0",
    defaultRest: 75,
    graphicType: "curl",
    cues: [
      "Overhead elbow flexion places long head of triceps in maximally stretched position.",
      "Extend arms forward and up without flaring elbows excessively."
    ],
    substitutes: ["tricep-pushdown", "dips"]
  },

  // FUNCTIONAL FITNESS MOVEMENTS (MARCH - MAY)
  "trap-bar-deadlift": {
    id: "trap-bar-deadlift",
    name: "Trap Bar (Hex Bar) Deadlift",
    pattern: "Hinge/Squat Hybrid",
    focus: "functional",
    category: "functional",
    primaryMuscles: ["glutes", "quads", "hamstrings", "erectors"],
    secondaryMuscles: ["traps", "forearms", "core"],
    tempo: "2-0-1-0",
    defaultRest: 120,
    graphicType: "deadlift",
    cues: [
      "Stand centered in trap bar; neutral grip.",
      "Combines hip hinge and knee extension for balanced athletic power.",
      "Push floor away violently with legs while keeping chest proud."
    ],
    substitutes: ["barbell-back-squat", "romanian-deadlift"]
  },
  "kettlebell-swings": {
    id: "kettlebell-swings",
    name: "Russian Kettlebell Swing",
    pattern: "Explosive Hinge",
    focus: "functional",
    category: "functional",
    primaryMuscles: ["glutes", "hamstrings", "erectors"],
    secondaryMuscles: ["core", "shoulders", "forearms"],
    tempo: "1-0-X-0",
    defaultRest: 60,
    graphicType: "kettlebell",
    cues: [
      "Not a squat! It is an explosive hip hinge.",
      "Snap hips forward forcefully at apex, letting bell float to chest level.",
      "Keep core braced like a plank at the top of each rep."
    ],
    substitutes: ["medicine-ball-slam", "dumbbell-snatch"]
  },
  "front-squat": {
    id: "front-squat",
    name: "Barbell Front Squat",
    pattern: "Squat",
    focus: "functional",
    category: "functional",
    primaryMuscles: ["quads", "core", "upper_back"],
    secondaryMuscles: ["glutes", "calves"],
    tempo: "2-1-1-0",
    defaultRest: 120,
    graphicType: "squat",
    cues: [
      "Clean grip or cross-arm grip with elbows driven high.",
      "Forces upright thoracic posture and heavy anterior core bracing.",
      "Drive straight up out of the hole."
    ],
    substitutes: ["barbell-back-squat", "hack-squat"]
  },
  "push-press": {
    id: "push-press",
    name: "Athletic Push Press",
    pattern: "Vertical Push / Power",
    focus: "functional",
    category: "functional",
    primaryMuscles: ["shoulders", "triceps", "quads"],
    secondaryMuscles: ["core", "glutes", "calves"],
    tempo: "2-0-X-0",
    defaultRest: 90,
    graphicType: "overhead_press",
    cues: [
      "Shallow 2-3 inch dip through knees, then explosive triple extension drive.",
      "Transfer power from lower body directly into the overhead press.",
      "Lock out barbell overhead with ears through arms."
    ],
    substitutes: ["overhead-barbell-press", "thrusters"]
  },
  "farmers-carry": {
    id: "farmers-carry",
    name: "Loaded Farmer's Walks / Carry",
    pattern: "Carries/Core",
    focus: "functional",
    category: "functional",
    primaryMuscles: ["traps", "forearms", "core", "glutes"],
    secondaryMuscles: ["quads", "calves"],
    tempo: "Continuous",
    defaultRest: 90,
    graphicType: "carry",
    cues: [
      "Hold heavy dumbbells or trap bar at sides.",
      "Chest tall, shoulders down and back, take short, quick, stable heel-to-toe strides.",
      "Builds unmatched grip durability, core anti-lateral flexion, and work capacity."
    ],
    substitutes: ["suitcase-carry"]
  },
  "suitcase-carry": {
    id: "suitcase-carry",
    name: "Single-Arm Suitcase Carry",
    pattern: "Carries/Core",
    focus: "functional",
    category: "functional",
    primaryMuscles: ["obliques", "core", "traps", "forearms"],
    secondaryMuscles: ["glutes", "quads"],
    tempo: "Continuous",
    defaultRest: 60,
    graphicType: "carry",
    cues: [
      "Heavy weight in one hand only.",
      "Resist side-bending: keep shoulders and hips completely level while walking.",
      "One of the highest-rated exercises for spinal stabilization and lateral core."
    ],
    substitutes: ["farmers-carry", "pallof-press"]
  },
  "medicine-ball-slam": {
    id: "medicine-ball-slam",
    name: "Rotational Medicine Ball Slam",
    pattern: "Explosive/Transverse",
    focus: "functional",
    category: "functional",
    primaryMuscles: ["core", "obliques", "lats"],
    secondaryMuscles: ["shoulders", "quads"],
    tempo: "Explosive",
    defaultRest: 60,
    graphicType: "kettlebell",
    cues: [
      "Reach ball high overhead with full triple extension.",
      "Throw body weight and ball downward into floor with maximum intent.",
      "Catch on bounce or reload immediately; trains high velocity power transfer."
    ],
    substitutes: ["kettlebell-swings"]
  },
  "turkish-get-up": {
    id: "turkish-get-up",
    name: "Turkish Get-Up (TGU)",
    pattern: "Multi-Planar Mobility/Stability",
    focus: "functional",
    category: "functional",
    primaryMuscles: ["shoulders", "core", "hips"],
    secondaryMuscles: ["rotator_cuff", "glutes", "quads"],
    tempo: "Controlled",
    defaultRest: 90,
    graphicType: "overhead_press",
    cues: [
      "Maintain eyes on the kettlebell locked overhead throughout.",
      "Roll to elbow, press to hand, bridge hips high, sweep leg back into lunge, stand tall.",
      "Mastery of multi-planar joint stability, scapular rhythm, and hip mobility."
    ],
    substitutes: ["farmers-carry", "pallof-press"]
  },
  "thrusters": {
    id: "thrusters",
    name: "Dumbbell / Barbell Thruster",
    pattern: "Full Body Hybrid",
    focus: "functional",
    category: "functional",
    primaryMuscles: ["quads", "shoulders", "glutes"],
    secondaryMuscles: ["triceps", "core"],
    tempo: "Fluid",
    defaultRest: 90,
    graphicType: "squat",
    cues: [
      "Front squat to full depth, then use the ascent speed to seamlessly launch bar overhead.",
      "Gold standard for functional conditioning and cardiovascular power."
    ],
    substitutes: ["push-press", "front-squat"]
  },
  "pallof-press": {
    id: "pallof-press",
    name: "Cable / Band Pallof Press",
    pattern: "Anti-Rotation Core",
    focus: "functional",
    category: "functional",
    primaryMuscles: ["core", "obliques"],
    secondaryMuscles: ["glutes", "shoulders"],
    tempo: "2-2-2-0",
    defaultRest: 45,
    graphicType: "carry",
    cues: [
      "Stand perpendicular to cable tower with feet shoulder-width.",
      "Press cable straight out from chest; hold 2 seconds resisting the rotational torque.",
      "Return to sternum with absolute control."
    ],
    substitutes: ["suitcase-carry"]
  },
  "box-jumps": {
    id: "box-jumps",
    name: "Plyometric Box Jump / Broad Jump",
    pattern: "Explosive/Power",
    focus: "functional",
    category: "functional",
    primaryMuscles: ["quads", "glutes", "calves"],
    secondaryMuscles: ["hamstrings", "core"],
    tempo: "Explosive",
    defaultRest: 60,
    graphicType: "squat",
    cues: [
      "Load hips into quick countermovement hinge.",
      "Swing arms forward and explode upward, landing softly with quiet feet on box.",
      "Step down carefully between reps; do not rebound backward."
    ],
    substitutes: ["kettlebell-swings"]
  }
};
