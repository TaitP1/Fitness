// Interactive Anatomical Muscle Highlighter & Exercise Biomechanical Action Graphics
// Renders vector human anatomy (anterior & posterior) and dynamic exercise graphics

const AnatomyVisualizer = {
  // Muscle display definitions
  muscleLabels: {
    lats: "Latissimus Dorsi (Lats)",
    rhomboids: "Rhomboids & Mid Traps",
    mid_traps: "Middle Trapezius",
    upper_traps: "Upper Trapezius",
    lower_traps: "Lower Trapezius",
    rear_delts: "Posterior Deltoids (Rear Delts)",
    lateral_delts: "Lateral Deltoids (Side Delts)",
    front_delts: "Anterior Deltoids (Front Delts)",
    chest: "Pectoralis Major & Minor",
    biceps: "Biceps Brachii",
    triceps: "Triceps Brachii",
    forearms: "Wrist Flexors & Extensors",
    erectors: "Erector Spinae (Lower Back)",
    abs: "Rectus Abdominis",
    obliques: "External & Internal Obliques",
    core: "Core Complex (Transverse & Rectus)",
    quads: "Quadriceps (Vastus & Rectus Femoris)",
    rectus_femoris: "Rectus Femoris (Quad Hip Flexor)",
    hamstrings: "Hamstrings (Biceps Femoris)",
    glutes: "Gluteus Maximus & Medius",
    adductors: "Hip Adductors",
    calves: "Gastrocnemius & Soleus",
    gastrocnemius: "Gastrocnemius (Upper Calf)",
    soleus: "Soleus (Deep Calf)",
    external_rotators: "Infraspinatus & Teres Minor",
    rotator_cuff: "Rotator Cuff Complex",
    hips: "Hip Flexors & Abductors"
  },

  // Generates complete dual-view SVG body diagram
  renderAnatomyDiagram(primaryMuscles = [], secondaryMuscles = []) {
    const isPri = (m) => primaryMuscles.includes(m);
    const isSec = (m) => secondaryMuscles.includes(m);

    const getColor = (m) => {
      if (isPri(m)) return "#10b981"; // Vibrant Emerald for Primary
      if (isSec(m)) return "#38bdf8"; // Electric Sky Blue for Secondary
      return "#334155"; // Inactive Sleek Slate
    };

    const getGlow = (m) => {
      if (isPri(m)) return "filter: drop-shadow(0px 0px 5px rgba(16, 185, 129, 0.7));";
      if (isSec(m)) return "filter: drop-shadow(0px 0px 4px rgba(56, 189, 248, 0.5));";
      return "";
    };

    return `
      <div class="anatomy-container">
        <div class="anatomy-views-wrapper">
          <!-- Anterior (Front) View -->
          <div class="anatomy-card">
            <div class="anatomy-view-title">Anterior (Front)</div>
            <svg viewBox="0 0 160 300" class="anatomy-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glowPri" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              <!-- Head & Neck -->
              <circle cx="80" cy="22" r="14" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
              <path d="M74,36 L86,36 L88,48 L72,48 Z" fill="#1e293b" stroke="#475569" stroke-width="1" />

              <!-- Upper Traps (Front) -->
              <path id="ant_traps_l" d="M68,48 Q74,42 78,48 L65,58 Z" fill="${getColor('upper_traps')}" style="${getGlow('upper_traps')}" />
              <path id="ant_traps_r" d="M92,48 Q86,42 82,48 L95,58 Z" fill="${getColor('upper_traps')}" style="${getGlow('upper_traps')}" />

              <!-- Front Deltoids -->
              <path id="ant_front_delt_l" d="M50,56 Q62,50 64,62 Q58,74 48,68 Z" fill="${getColor('front_delts')}" style="${getGlow('front_delts')}" />
              <path id="ant_front_delt_r" d="M110,56 Q98,50 96,62 Q102,74 112,68 Z" fill="${getColor('front_delts')}" style="${getGlow('front_delts')}" />

              <!-- Lateral Deltoids (Front view edge) -->
              <path id="ant_lat_delt_l" d="M46,62 Q52,56 50,72 Q44,70 46,62 Z" fill="${getColor('lateral_delts')}" style="${getGlow('lateral_delts')}" />
              <path id="ant_lat_delt_r" d="M114,62 Q108,56 110,72 Q116,70 114,62 Z" fill="${getColor('lateral_delts')}" style="${getGlow('lateral_delts')}" />

              <!-- Chest (Pectorals) -->
              <path id="ant_chest_l" d="M64,54 L78,54 L78,82 Q62,84 60,68 Z" fill="${getColor('chest')}" style="${getGlow('chest')}" />
              <path id="ant_chest_r" d="M96,54 L82,54 L82,82 Q98,84 100,68 Z" fill="${getColor('chest')}" style="${getGlow('chest')}" />

              <!-- Biceps -->
              <rect id="ant_bicep_l" x="42" y="74" width="11" height="26" rx="5" fill="${getColor('biceps')}" style="${getGlow('biceps')}" />
              <rect id="ant_bicep_r" x="107" y="74" width="11" height="26" rx="5" fill="${getColor('biceps')}" style="${getGlow('biceps')}" />

              <!-- Forearms (Front) -->
              <rect id="ant_forearm_l" x="38" y="105" width="11" height="34" rx="4" fill="${getColor('forearms')}" style="${getGlow('forearms')}" />
              <rect id="ant_forearm_r" x="111" y="105" width="11" height="34" rx="4" fill="${getColor('forearms')}" style="${getGlow('forearms')}" />

              <!-- Abs (Rectus Abdominis) -->
              <rect id="ant_abs_1" x="72" y="86" width="7" height="9" rx="2" fill="${getColor('abs') || getColor('core')}" style="${getGlow('abs') || getGlow('core')}" />
              <rect id="ant_abs_2" x="81" y="86" width="7" height="9" rx="2" fill="${getColor('abs') || getColor('core')}" style="${getGlow('abs') || getGlow('core')}" />
              <rect id="ant_abs_3" x="72" y="98" width="7" height="10" rx="2" fill="${getColor('abs') || getColor('core')}" style="${getGlow('abs') || getGlow('core')}" />
              <rect id="ant_abs_4" x="81" y="98" width="7" height="10" rx="2" fill="${getColor('abs') || getColor('core')}" style="${getGlow('abs') || getGlow('core')}" />
              <rect id="ant_abs_5" x="73" y="111" width="6" height="11" rx="2" fill="${getColor('abs') || getColor('core')}" style="${getGlow('abs') || getGlow('core')}" />
              <rect id="ant_abs_6" x="81" y="111" width="6" height="11" rx="2" fill="${getColor('abs') || getColor('core')}" style="${getGlow('abs') || getGlow('core')}" />

              <!-- Obliques -->
              <path id="ant_obliques_l" d="M59,86 Q68,96 70,120 L62,120 Q57,100 59,86 Z" fill="${getColor('obliques') || getColor('core')}" style="${getGlow('obliques') || getGlow('core')}" />
              <path id="ant_obliques_r" d="M101,86 Q92,96 90,120 L98,120 Q103,100 101,86 Z" fill="${getColor('obliques') || getColor('core')}" style="${getGlow('obliques') || getGlow('core')}" />

              <!-- Quads (Quadriceps) -->
              <path id="ant_quad_l" d="M60,128 Q56,155 61,192 L76,190 Q78,155 78,128 Z" fill="${getColor('quads') || getColor('rectus_femoris')}" style="${getGlow('quads') || getGlow('rectus_femoris')}" />
              <path id="ant_quad_r" d="M100,128 Q104,155 99,192 L84,190 Q82,155 82,128 Z" fill="${getColor('quads') || getColor('rectus_femoris')}" style="${getGlow('quads') || getGlow('rectus_femoris')}" />

              <!-- Knees -->
              <ellipse cx="69" cy="198" rx="5" ry="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
              <ellipse cx="91" cy="198" rx="5" ry="4" fill="#1e293b" stroke="#475569" stroke-width="1" />

              <!-- Calves & Shins (Front) -->
              <path id="ant_calf_l" d="M62,206 Q58,225 64,265 L73,265 Q76,230 75,206 Z" fill="${getColor('calves')}" style="${getGlow('calves')}" />
              <path id="ant_calf_r" d="M98,206 Q102,225 96,265 L87,265 Q84,230 85,206 Z" fill="${getColor('calves')}" style="${getGlow('calves')}" />

              <!-- Feet -->
              <ellipse cx="66" cy="275" rx="6" ry="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
              <ellipse cx="94" cy="275" rx="6" ry="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
            </svg>
          </div>

          <!-- Posterior (Back) View -->
          <div class="anatomy-card">
            <div class="anatomy-view-title">Posterior (Back)</div>
            <svg viewBox="0 0 160 300" class="anatomy-svg" xmlns="http://www.w3.org/2000/svg">
              <!-- Head & Neck -->
              <circle cx="80" cy="22" r="14" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
              
              <!-- Upper Traps (Back) -->
              <path id="post_traps_up" d="M72,36 L88,36 L98,54 L80,68 L62,54 Z" fill="${getColor('upper_traps')}" style="${getGlow('upper_traps')}" />

              <!-- Mid & Lower Traps / Rhomboids -->
              <path id="post_rhomboids" d="M80,68 L96,56 L90,92 L80,105 L70,92 L64,56 Z" fill="${getColor('rhomboids') || getColor('mid_traps') || getColor('lower_traps')}" style="${getGlow('rhomboids') || getGlow('mid_traps') || getGlow('lower_traps')}" />

              <!-- Rear Deltoids -->
              <path id="post_rear_delt_l" d="M50,56 Q62,52 64,66 Q56,74 48,68 Z" fill="${getColor('rear_delts')}" style="${getGlow('rear_delts')}" />
              <path id="post_rear_delt_r" d="M110,56 Q98,52 96,66 Q104,74 112,68 Z" fill="${getColor('rear_delts')}" style="${getGlow('rear_delts')}" />

              <!-- Lateral Deltoids (Back view edge) -->
              <path id="post_lat_delt_l" d="M46,60 Q52,55 50,70 Q44,68 46,60 Z" fill="${getColor('lateral_delts')}" style="${getGlow('lateral_delts')}" />
              <path id="post_lat_delt_r" d="M114,60 Q108,55 110,70 Q116,68 114,60 Z" fill="${getColor('lateral_delts')}" style="${getGlow('lateral_delts')}" />

              <!-- Latissimus Dorsi (Lats) -->
              <path id="post_lat_l" d="M62,68 Q54,85 58,110 L74,106 Q68,85 64,68 Z" fill="${getColor('lats') || getColor('teres_major')}" style="${getGlow('lats') || getGlow('teres_major')}" />
              <path id="post_lat_r" d="M98,68 Q106,85 102,110 L86,106 Q92,85 96,68 Z" fill="${getColor('lats') || getColor('teres_major')}" style="${getGlow('lats') || getGlow('teres_major')}" />

              <!-- Triceps -->
              <rect id="post_tricep_l" x="42" y="74" width="11" height="27" rx="5" fill="${getColor('triceps')}" style="${getGlow('triceps')}" />
              <rect id="post_tricep_r" x="107" y="74" width="11" height="27" rx="5" fill="${getColor('triceps')}" style="${getGlow('triceps')}" />

              <!-- Forearms (Back) -->
              <rect id="post_forearm_l" x="38" y="105" width="11" height="34" rx="4" fill="${getColor('forearms')}" style="${getGlow('forearms')}" />
              <rect id="post_forearm_r" x="111" y="105" width="11" height="34" rx="4" fill="${getColor('forearms')}" style="${getGlow('forearms')}" />

              <!-- Erector Spinae (Lower Back) -->
              <path id="post_erectors" d="M74,106 L86,106 L86,124 L74,124 Z" fill="${getColor('erectors')}" style="${getGlow('erectors')}" />

              <!-- Glutes (Gluteus Maximus) -->
              <path id="post_glute_l" d="M58,126 Q56,155 77,155 L78,126 Z" fill="${getColor('glutes')}" style="${getGlow('glutes')}" />
              <path id="post_glute_r" d="M102,126 Q104,155 83,155 L82,126 Z" fill="${getColor('glutes')}" style="${getGlow('glutes')}" />

              <!-- Hamstrings -->
              <path id="post_hamstring_l" d="M60,158 Q57,175 62,192 L76,192 Q78,175 78,158 Z" fill="${getColor('hamstrings')}" style="${getGlow('hamstrings')}" />
              <path id="post_hamstring_r" d="M100,158 Q103,175 98,192 L84,192 Q82,175 82,158 Z" fill="${getColor('hamstrings')}" style="${getGlow('hamstrings')}" />

              <!-- Calves (Gastrocnemius & Soleus) -->
              <path id="post_calf_l" d="M60,204 Q55,225 64,265 L74,265 Q79,228 77,204 Z" fill="${getColor('calves') || getColor('gastrocnemius')}" style="${getGlow('calves') || getGlow('gastrocnemius')}" />
              <path id="post_calf_r" d="M100,204 Q105,225 96,265 L86,265 Q81,228 83,204 Z" fill="${getColor('calves') || getColor('gastrocnemius')}" style="${getGlow('calves') || getGlow('gastrocnemius')}" />

              <!-- Feet -->
              <ellipse cx="67" cy="275" rx="6" ry="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
              <ellipse cx="93" cy="275" rx="6" ry="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
            </svg>
          </div>
        </div>

        <!-- Muscle Legend & Science Notes -->
        <div class="anatomy-legend">
          <div class="legend-row">
            <span class="legend-badge badge-primary">Primary Target</span>
            <span class="legend-muscles">${primaryMuscles.map(m => AnatomyVisualizer.muscleLabels[m] || m).join(", ") || "General Full Body"}</span>
          </div>
          ${secondaryMuscles.length > 0 ? `
            <div class="legend-row">
              <span class="legend-badge badge-secondary">Secondary / Synergist</span>
              <span class="legend-muscles">${secondaryMuscles.map(m => AnatomyVisualizer.muscleLabels[m] || m).join(", ")}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  // Generates Biomechanical Form Illustration SVG based on exercise type
  renderExerciseGraphic(graphicType) {
    switch (graphicType) {
      case "squat":
        return `
          <div class="biomech-graphic">
            <svg viewBox="0 0 200 160" class="graphic-svg" xmlns="http://www.w3.org/2000/svg">
              <line x1="20" y1="145" x2="180" y2="145" stroke="#475569" stroke-width="3" stroke-linecap="round" />
              <text x="100" y="20" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="600">SQUAT PATTERN: DEEP KNEE & HIP FLEXION</text>
              <!-- Barbell Path -->
              <line x1="100" y1="35" x2="100" y2="95" stroke="#06b6d4" stroke-width="2" stroke-dasharray="3,3" />
              <!-- Lifter in Squat -->
              <circle cx="95" cy="50" r="10" fill="#38bdf8" />
              <!-- Torso -->
              <line x1="95" y1="58" x2="115" y2="92" stroke="#10b981" stroke-width="7" stroke-linecap="round" />
              <!-- Femur (Thigh) parallel or below -->
              <line x1="115" y1="92" x2="80" y2="98" stroke="#10b981" stroke-width="7" stroke-linecap="round" />
              <!-- Tibia (Shin) -->
              <line x1="80" y1="98" x2="92" y2="142" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
              <!-- Foot -->
              <line x1="85" y1="144" x2="108" y2="144" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" />
              <!-- Barbell on Traps -->
              <circle cx="102" cy="62" r="7" fill="#f59e0b" />
              <line x1="75" y1="62" x2="129" y2="62" stroke="#e2e8f0" stroke-width="3" />
              <!-- Cues Overlay -->
              <rect x="135" y="45" width="55" height="40" rx="4" fill="#1e293b" stroke="#334155" />
              <text x="162" y="60" fill="#10b981" font-size="9" text-anchor="middle" font-weight="bold">Parallel Depth</text>
              <text x="162" y="75" fill="#94a3b8" font-size="8" text-anchor="middle">Mid-Foot Drive</text>
            </svg>
          </div>
        `;
      case "deadlift":
        return `
          <div class="biomech-graphic">
            <svg viewBox="0 0 200 160" class="graphic-svg" xmlns="http://www.w3.org/2000/svg">
              <line x1="20" y1="145" x2="180" y2="145" stroke="#475569" stroke-width="3" stroke-linecap="round" />
              <text x="100" y="20" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="600">HINGE PATTERN: HIP RETRACTION & HAMSTRING STRETCH</text>
              <!-- Lifter in Hinge -->
              <circle cx="75" cy="65" r="10" fill="#38bdf8" />
              <!-- Flat Spine Torso -->
              <line x1="75" y1="72" x2="125" y2="88" stroke="#10b981" stroke-width="7" stroke-linecap="round" />
              <!-- Hamstrings / Hips pushed back -->
              <line x1="125" y1="88" x2="115" y2="120" stroke="#10b981" stroke-width="7" stroke-linecap="round" />
              <!-- Shin vertical -->
              <line x1="115" y1="120" x2="118" y2="144" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
              <!-- Arms hanging vertical with bar -->
              <line x1="85" y1="75" x2="95" y2="128" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
              <circle cx="95" cy="128" r="8" fill="#ef4444" />
              <!-- Cue box -->
              <rect x="135" y="45" width="58" height="40" rx="4" fill="#1e293b" stroke="#334155" />
              <text x="164" y="60" fill="#10b981" font-size="9" text-anchor="middle" font-weight="bold">Flat Spine</text>
              <text x="164" y="75" fill="#94a3b8" font-size="8" text-anchor="middle">Hips Pushed Back</text>
            </svg>
          </div>
        `;
      case "lat_pulldown":
      case "pullup":
        return `
          <div class="biomech-graphic">
            <svg viewBox="0 0 200 160" class="graphic-svg" xmlns="http://www.w3.org/2000/svg">
              <text x="100" y="20" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="600">VERTICAL PULL: ELBOW DEPRESSION & FULL LAT STRETCH</text>
              <!-- Overhead Bar -->
              <line x1="45" y1="40" x2="155" y2="40" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
              <!-- Lifter Head -->
              <circle cx="100" cy="70" r="10" fill="#38bdf8" />
              <!-- Torso upright -->
              <line x1="100" y1="78" x2="100" y2="125" stroke="#10b981" stroke-width="7" stroke-linecap="round" />
              <!-- Arms driving elbows down -->
              <path d="M55,42 Q75,75 88,80" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round" />
              <path d="M145,42 Q125,75 112,80" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round" />
              <!-- Arrows pointing down -->
              <polygon points="85,86 91,80 82,80" fill="#06b6d4" />
              <polygon points="115,86 121,80 109,80" fill="#06b6d4" />
              <!-- Cues box -->
              <rect x="135" y="100" width="58" height="42" rx="4" fill="#1e293b" stroke="#334155" />
              <text x="164" y="116" fill="#10b981" font-size="9" text-anchor="middle" font-weight="bold">Drive Elbows</text>
              <text x="164" y="131" fill="#94a3b8" font-size="8" text-anchor="middle">Stretch at Top</text>
            </svg>
          </div>
        `;
      case "overhead_press":
        return `
          <div class="biomech-graphic">
            <svg viewBox="0 0 200 160" class="graphic-svg" xmlns="http://www.w3.org/2000/svg">
              <line x1="20" y1="145" x2="180" y2="145" stroke="#475569" stroke-width="3" stroke-linecap="round" />
              <text x="100" y="20" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="600">VERTICAL PRESS: SOLID CORE & LOCKOUT OVERHEAD</text>
              <!-- Standing Lifter -->
              <circle cx="100" cy="62" r="9" fill="#38bdf8" />
              <!-- Torso straight -->
              <line x1="100" y1="70" x2="100" y2="110" stroke="#10b981" stroke-width="7" stroke-linecap="round" />
              <!-- Legs straight -->
              <line x1="97" y1="110" x2="94" y2="144" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
              <line x1="103" y1="110" x2="106" y2="144" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
              <!-- Arms locked high overhead with Barbell -->
              <line x1="100" y1="70" x2="88" y2="38" stroke="#10b981" stroke-width="4" stroke-linecap="round" />
              <line x1="100" y1="70" x2="112" y2="38" stroke="#10b981" stroke-width="4" stroke-linecap="round" />
              <circle cx="70" cy="36" r="6" fill="#ef4444" />
              <circle cx="130" cy="36" r="6" fill="#ef4444" />
              <line x1="68" y1="36" x2="132" y2="36" stroke="#e2e8f0" stroke-width="3" />
              <!-- Cues box -->
              <rect x="15" y="45" width="58" height="42" rx="4" fill="#1e293b" stroke="#334155" />
              <text x="44" y="61" fill="#10b981" font-size="9" text-anchor="middle" font-weight="bold">Glutes Braced</text>
              <text x="44" y="76" fill="#94a3b8" font-size="8" text-anchor="middle">Head in Window</text>
            </svg>
          </div>
        `;
      case "row":
        return `
          <div class="biomech-graphic">
            <svg viewBox="0 0 200 160" class="graphic-svg" xmlns="http://www.w3.org/2000/svg">
              <text x="100" y="20" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="600">HORIZONTAL PULL: SCAPULAR RETRACTION & LAT DRIVE</text>
              <!-- Lifter torso hinged at 45 deg -->
              <circle cx="80" cy="60" r="10" fill="#38bdf8" />
              <line x1="80" y1="68" x2="120" y2="100" stroke="#10b981" stroke-width="7" stroke-linecap="round" />
              <!-- Bent Knees -->
              <line x1="120" y1="100" x2="115" y2="125" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
              <line x1="115" y1="125" x2="122" y2="145" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
              <!-- Pulling Bar to Abdomen -->
              <line x1="88" y1="68" x2="108" y2="86" stroke="#10b981" stroke-width="5" stroke-linecap="round" />
              <circle cx="108" cy="86" r="7" fill="#f59e0b" />
              <!-- Cues box -->
              <rect x="135" y="45" width="58" height="42" rx="4" fill="#1e293b" stroke="#334155" />
              <text x="164" y="61" fill="#10b981" font-size="9" text-anchor="middle" font-weight="bold">Retract Blades</text>
              <text x="164" y="76" fill="#94a3b8" font-size="8" text-anchor="middle">Pull to Hips</text>
            </svg>
          </div>
        `;
      case "lateral_raise":
        return `
          <div class="biomech-graphic">
            <svg viewBox="0 0 200 160" class="graphic-svg" xmlns="http://www.w3.org/2000/svg">
              <text x="100" y="20" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="600">ABDUCTION: SCAPULAR PLANE & LATERAL DELT ISOLATION</text>
              <!-- Standing Lifter -->
              <circle cx="100" cy="50" r="9" fill="#38bdf8" />
              <line x1="100" y1="58" x2="100" y2="110" stroke="#38bdf8" stroke-width="7" stroke-linecap="round" />
              <!-- Arms abducted out 80-90 degrees -->
              <line x1="100" y1="62" x2="55" y2="68" stroke="#10b981" stroke-width="5" stroke-linecap="round" />
              <line x1="100" y1="62" x2="145" y2="68" stroke="#10b981" stroke-width="5" stroke-linecap="round" />
              <!-- Dumbbells in hand -->
              <circle cx="50" cy="70" r="5" fill="#f59e0b" />
              <circle cx="150" cy="70" r="5" fill="#f59e0b" />
              <!-- Cues box -->
              <rect x="135" y="95" width="58" height="42" rx="4" fill="#1e293b" stroke="#334155" />
              <text x="164" y="111" fill="#10b981" font-size="9" text-anchor="middle" font-weight="bold">Lead w/ Elbows</text>
              <text x="164" y="126" fill="#94a3b8" font-size="8" text-anchor="middle">Slight Fwd Lean</text>
            </svg>
          </div>
        `;
      case "kettlebell":
        return `
          <div class="biomech-graphic">
            <svg viewBox="0 0 200 160" class="graphic-svg" xmlns="http://www.w3.org/2000/svg">
              <text x="100" y="20" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="600">EXPLOSIVE HINGE: GLUTE SNAP & FUNCTIONAL POWER</text>
              <!-- Lifter standing tall at top of swing -->
              <circle cx="85" cy="55" r="9" fill="#38bdf8" />
              <line x1="85" y1="62" x2="88" y2="110" stroke="#10b981" stroke-width="7" stroke-linecap="round" />
              <!-- Straight legs -->
              <line x1="88" y1="110" x2="88" y2="145" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
              <!-- Arms holding kettlebell floating at chest height -->
              <line x1="85" y1="68" x2="135" y2="68" stroke="#10b981" stroke-width="4" stroke-linecap="round" />
              <!-- Kettlebell -->
              <circle cx="142" cy="70" r="8" fill="#10b981" />
              <!-- Trajectory arc -->
              <path d="M100,115 Q140,110 142,75" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="3,3" />
              <!-- Cues box -->
              <rect x="15" y="45" width="58" height="42" rx="4" fill="#1e293b" stroke="#334155" />
              <text x="44" y="61" fill="#10b981" font-size="9" text-anchor="middle" font-weight="bold">Violent Snap</text>
              <text x="44" y="76" fill="#94a3b8" font-size="8" text-anchor="middle">Float at Apex</text>
            </svg>
          </div>
        `;
      case "carry":
        return `
          <div class="biomech-graphic">
            <svg viewBox="0 0 200 160" class="graphic-svg" xmlns="http://www.w3.org/2000/svg">
              <text x="100" y="20" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="600">LOADED CARRY: ANTI-ROTATION, CORE INTEGRITY & GRIP</text>
              <circle cx="100" cy="45" r="9" fill="#38bdf8" />
              <line x1="100" y1="53" x2="100" y2="105" stroke="#10b981" stroke-width="7" stroke-linecap="round" />
              <!-- Striding legs -->
              <line x1="100" y1="105" x2="90" y2="142" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
              <line x1="100" y1="105" x2="112" y2="140" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
              <!-- Arms holding heavy handles down -->
              <line x1="100" y1="58" x2="85" y2="95" stroke="#10b981" stroke-width="4" stroke-linecap="round" />
              <line x1="100" y1="58" x2="115" y2="95" stroke="#10b981" stroke-width="4" stroke-linecap="round" />
              <rect x="78" y="93" width="14" height="18" rx="3" fill="#f59e0b" />
              <rect x="108" y="93" width="14" height="18" rx="3" fill="#f59e0b" />
              <!-- Cues box -->
              <rect x="135" y="45" width="58" height="42" rx="4" fill="#1e293b" stroke="#334155" />
              <text x="164" y="61" fill="#10b981" font-size="9" text-anchor="middle" font-weight="bold">Tall Ribcage</text>
              <text x="164" y="76" fill="#94a3b8" font-size="8" text-anchor="middle">Short Strides</text>
            </svg>
          </div>
        `;
      default:
        // Generic strength graphic
        return `
          <div class="biomech-graphic">
            <svg viewBox="0 0 200 160" class="graphic-svg" xmlns="http://www.w3.org/2000/svg">
              <text x="100" y="25" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="600">STRICT REPETITION FORM & FULL ROM</text>
              <circle cx="100" cy="55" r="12" fill="#38bdf8" />
              <line x1="100" y1="67" x2="100" y2="115" stroke="#10b981" stroke-width="7" stroke-linecap="round" />
              <circle cx="100" cy="90" r="16" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,4" />
              <text x="100" y="145" fill="#10b981" font-size="10" text-anchor="middle" font-weight="bold">Controlled Eccentric (3s) + Explosive Drive</text>
            </svg>
          </div>
        `;
    }
  }
};
