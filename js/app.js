// Core Application Controller, State Management & Event Handling
// Persists all data in localStorage with full offline capability

const STORAGE_KEY = "hypertrophy_functional_fitness_app_v1";

class FitnessApp {
  constructor() {
    this.state = this.loadState();
    this.currentTab = "workout";
    this.selectedExerciseForModal = null;
    this.selectedToolsTab = "plates";
    this.init();
  }

  getDefaultState() {
    return {
      profile: {
        age: 31,
        gender: "male",
        height: "6ft (72 in)",
        weight: 180,
        daysPerWeek: 4,
        startDate: new Date().toISOString().split("T")[0]
      },
      currentPhaseId: "baseline", // "baseline", "hypertrophy_meso1", "hypertrophy_meso2", "functional_phase"
      currentWeek: 1,
      currentDay: 1,
      baselines: {
        // Pre-populated default realistic baseline calibrations for 180lb athletic male (can be edited/tested anytime)
        "lat-pulldown": { weight: 160, reps: 8, rpe: 7.5, e1rm: 212, date: "2026-09-20" },
        "barbell-row": { weight: 175, reps: 8, rpe: 7.5, e1rm: 232, date: "2026-09-20" },
        "overhead-barbell-press": { weight: 125, reps: 7, rpe: 7.5, e1rm: 162, date: "2026-09-20" },
        "cable-lateral-raise": { weight: 25, reps: 12, rpe: 8.0, e1rm: 38, date: "2026-09-20" },
        "incline-dumbbell-bench": { weight: 70, reps: 8, rpe: 7.5, e1rm: 93, date: "2026-09-20" },
        "barbell-back-squat": { weight: 245, reps: 7, rpe: 7.5, e1rm: 318, date: "2026-09-21" },
        "romanian-deadlift": { weight: 225, reps: 8, rpe: 7.5, e1rm: 298, date: "2026-09-21" },
        "bulgarian-split-squat": { weight: 50, reps: 8, rpe: 7.5, e1rm: 66, date: "2026-09-21" },
        "leg-extension": { weight: 150, reps: 12, rpe: 8.0, e1rm: 230, date: "2026-09-21" },
        "standing-calf-raise": { weight: 180, reps: 15, rpe: 8.0, e1rm: 300, date: "2026-09-21" },
        "seated-dumbbell-press": { weight: 65, reps: 8, rpe: 7.5, e1rm: 86, date: "2026-09-22" },
        "chest-supported-tbar-row": { weight: 135, reps: 8, rpe: 7.5, e1rm: 179, date: "2026-09-22" },
        "pull-ups": { weight: 180, reps: 8, rpe: 7.5, e1rm: 238, date: "2026-09-22" },
        "leg-press": { weight: 450, reps: 10, rpe: 7.5, e1rm: 610, date: "2026-09-23" },
        "lying-leg-curl": { weight: 110, reps: 10, rpe: 8.0, e1rm: 155, date: "2026-09-23" },
        "trap-bar-deadlift": { weight: 295, reps: 5, rpe: 7.5, e1rm: 365, date: "2026-09-23" }
      },
      // Track custom exercise swaps
      substitutions: {},
      // Session logs
      workoutHistory: [
        {
          id: "log_sample_1",
          date: "2026-09-20",
          phaseId: "baseline",
          week: 1,
          day: 1,
          name: "Baseline Upper (Back & Shoulder Calibration)",
          durationMins: 52,
          exercises: [
            {
              exerciseId: "lat-pulldown",
              sets: [
                { setNum: 1, weight: 150, reps: 10, rpe: 7.0, completed: true },
                { setNum: 2, weight: 160, reps: 8, rpe: 7.5, completed: true },
                { setNum: 3, weight: 160, reps: 8, rpe: 7.5, completed: true }
              ]
            },
            {
              exerciseId: "overhead-barbell-press",
              sets: [
                { setNum: 1, weight: 115, reps: 8, rpe: 7.0, completed: true },
                { setNum: 2, weight: 125, reps: 7, rpe: 7.5, completed: true },
                { setNum: 3, weight: 125, reps: 6, rpe: 8.0, completed: true }
              ]
            },
            {
              exerciseId: "cable-lateral-raise",
              sets: [
                { setNum: 1, weight: 20, reps: 15, rpe: 7.5, completed: true },
                { setNum: 2, weight: 25, reps: 12, rpe: 8.0, completed: true },
                { setNum: 3, weight: 25, reps: 12, rpe: 8.0, completed: true }
              ]
            }
          ]
        },
        {
          id: "log_sample_2",
          date: "2026-09-21",
          phaseId: "baseline",
          week: 1,
          day: 2,
          name: "Baseline Lower (Quad & Leg Calibration)",
          durationMins: 58,
          exercises: [
            {
              exerciseId: "barbell-back-squat",
              sets: [
                { setNum: 1, weight: 225, reps: 8, rpe: 7.0, completed: true },
                { setNum: 2, weight: 245, reps: 7, rpe: 7.5, completed: true },
                { setNum: 3, weight: 245, reps: 6, rpe: 8.0, completed: true }
              ]
            },
            {
              exerciseId: "romanian-deadlift",
              sets: [
                { setNum: 1, weight: 205, reps: 10, rpe: 7.0, completed: true },
                { setNum: 2, weight: 225, reps: 8, rpe: 7.5, completed: true },
                { setNum: 3, weight: 225, reps: 8, rpe: 7.5, completed: true }
              ]
            }
          ]
        }
      ],
      // Current in-progress workout session input data
      currentSession: {
        inProgress: true,
        startTime: Date.now(),
        setsData: {} // keyed by "exerciseId_setIndex" -> { weight, reps, rpe, completed }
      }
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults in case of new schema keys
        return Object.assign({}, this.getDefaultState(), parsed);
      }
    } catch (e) {
      console.warn("Could not load state, using defaults:", e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }

  init() {
    this.renderApp();
    this.bindGlobalEvents();
    this.setupTimerListeners();
  }

  setupTimerListeners() {
    timerManager.onTick(timer => {
      this.updateTimerDock(timer);
    });

    timerManager.onComplete(() => {
      this.showToast("Rest Period Complete! Begin Next Set.", "success");
      this.updateTimerDock(null);
    });
  }

  showToast(msg, type = "info") {
    const toast = document.createElement("div");
    toast.className = `app-toast toast-${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("toast-fade");
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  bindGlobalEvents() {
    // iOS Safari Audio & Haptic unlock on first touch
    const unlockAudio = () => {
      timerManager.initAudio();
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("pointerdown", unlockAudio);
    };
    window.addEventListener("touchstart", unlockAudio, { passive: true });
    window.addEventListener("pointerdown", unlockAudio, { passive: true });

    // Navigation Tabs
    document.addEventListener("click", e => {
      const tabBtn = e.target.closest("[data-tab]");
      if (tabBtn) {
        timerManager.triggerHaptic(20);
        const targetTab = tabBtn.getAttribute("data-tab");
        this.switchTab(targetTab);
      }

      // Close modal
      if (e.target.closest(".modal-close-btn") || e.target.classList.contains("modal-overlay")) {
        this.closeModal();
      }

      // Quick rest timer buttons
      const restBtn = e.target.closest("[data-quick-rest]");
      if (restBtn) {
        timerManager.triggerHaptic(40);
        const sec = parseInt(restBtn.getAttribute("data-quick-rest")) || 90;
        const exName = restBtn.getAttribute("data-exercise-name") || "Rest Timer";
        timerManager.startRestTimer(sec, exName);
        this.showToast(`Rest Timer started: ${sec}s`);
      }
    });

    // Handle ESC key to close modal
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") this.closeModal();
    });

    // Orientation change & resize listener for responsive iPhone retina charts
    window.addEventListener("resize", () => {
      if (this.currentTab === "metrics") {
        const volCanvas = document.getElementById("muscleVolumeCanvas");
        if (volCanvas) {
          const summary = MetricsEngine.calculateSummary(this.state.workoutHistory);
          MetricsEngine.drawMuscleVolumeChart(volCanvas, summary.muscleSets);
        }
        this.updateStrengthChart();
      }
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
    });
    this.renderCurrentTabContent();
  }

  renderApp() {
    const root = document.getElementById("app-root");
    if (!root) return;

    root.innerHTML = `
      <header class="app-header">
        <div class="header-main-row">
          <div class="header-left">
            <div class="app-logo">
              <span class="logo-icon">⚡</span>
              <div class="logo-text">
                <span class="logo-title">APEX HYPERTROPHY</span>
                <span class="logo-sub">Science Progression Engine</span>
              </div>
            </div>
          </div>

          <div class="header-center">
            <div class="athlete-badge">
              <span class="badge-dot"></span>
              <strong>31y Male</strong> • 6ft • 180 lbs
            </div>
          </div>

          <div class="header-right">
            <button id="soundToggleBtn" class="header-btn" title="Toggle Beep Audio">
              ${timerManager.soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
            </button>
            <div class="phase-selector-wrapper">
              <select id="phaseDropdown" class="phase-dropdown">
                <option value="baseline" ${this.state.currentPhaseId === "baseline" ? "selected" : ""}>Week 1: Baseline Calibration</option>
                <option value="hypertrophy_meso1" ${this.state.currentPhaseId === "hypertrophy_meso1" ? "selected" : ""}>Hypertrophy Meso 1 (Volume Accumulation)</option>
                <option value="hypertrophy_meso2" ${this.state.currentPhaseId === "hypertrophy_meso2" ? "selected" : ""}>Hypertrophy Meso 2 (Lengthened Stretch Bias)</option>
                <option value="functional_phase" ${this.state.currentPhaseId === "functional_phase" ? "selected" : ""}>Phase 2: Functional Fitness (March - May)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Navigation Tabs -->
      <nav class="app-nav-tabs">
        <button class="nav-tab-btn ${this.currentTab === "workout" ? "active" : ""}" data-tab="workout">
          <span class="tab-icon">🏋️‍♂️</span> Today's Workout
        </button>
        <button class="nav-tab-btn ${this.currentTab === "periodization" ? "active" : ""}" data-tab="periodization">
          <span class="tab-icon">📅</span> Periodization Schedule
        </button>
        <button class="nav-tab-btn ${this.currentTab === "metrics" ? "active" : ""}" data-tab="metrics">
          <span class="tab-icon">📊</span> Metrics &amp; Progress
        </button>
        <button class="nav-tab-btn ${this.currentTab === "timers" ? "active" : ""}" data-tab="timers">
          <span class="tab-icon">⏱️</span> Interval Timers
        </button>
        <button class="nav-tab-btn ${this.currentTab === "tools" ? "active" : ""}" data-tab="tools">
          <span class="tab-icon">🛠️</span> Smart Tools
        </button>
      </nav>

      <!-- Tab Content Area -->
      <main id="tabContent" class="main-content-container">
        <!-- Injected via renderCurrentTabContent() -->
      </main>

      <!-- Persistent Floating Rest Timer Dock -->
      <div id="timerDock" class="timer-dock hidden">
        <!-- Rendered dynamically -->
      </div>

      <!-- Exercise Detail & Anatomy Modal -->
      <div id="exerciseModal" class="modal-overlay hidden">
        <div class="modal-window">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    // Bind header events
    const soundBtn = document.getElementById("soundToggleBtn");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        timerManager.soundEnabled = !timerManager.soundEnabled;
        soundBtn.innerHTML = timerManager.soundEnabled ? "🔊 Sound On" : "🔇 Sound Off";
        timerManager.playBeep("tick");
      });
    }

    const phaseDropdown = document.getElementById("phaseDropdown");
    if (phaseDropdown) {
      phaseDropdown.addEventListener("change", (e) => {
        this.state.currentPhaseId = e.target.value;
        this.saveState();
        this.renderCurrentTabContent();
        this.showToast(`Switched to: ${PERIODIZATION_SCHEDULE[e.target.value].name}`);
      });
    }

    this.renderCurrentTabContent();
  }

  renderCurrentTabContent() {
    const container = document.getElementById("tabContent");
    if (!container) return;

    if (this.currentTab === "workout") {
      this.renderWorkoutTab(container);
    } else if (this.currentTab === "periodization") {
      this.renderPeriodizationTab(container);
    } else if (this.currentTab === "metrics") {
      this.renderMetricsTab(container);
    } else if (this.currentTab === "timers") {
      this.renderTimersTab(container);
    } else if (this.currentTab === "tools") {
      this.renderToolsTab(container);
    }
  }

  // ==========================================
  // TAB 1: TODAY'S WORKOUT VIEW
  // ==========================================
  renderWorkoutTab(container) {
    const currentPhase = PERIODIZATION_SCHEDULE[this.state.currentPhaseId] || PERIODIZATION_SCHEDULE.baseline;
    const dayIndex = Math.min(this.state.currentDay, currentPhase.workouts.length) - 1;
    const currentWorkout = currentPhase.workouts[dayIndex];

    const isBaselinePhase = this.state.currentPhaseId === "baseline";

    let daysHtml = "";
    currentPhase.workouts.forEach((w, idx) => {
      const activeClass = (idx + 1) === this.state.currentDay ? "active" : "";
      daysHtml += `
        <button class="day-selector-btn ${activeClass}" onclick="app.setDay(${idx + 1})">
          <span class="day-num">Day ${idx + 1}</span>
          <span class="day-title">${w.name.split(":")[0]}</span>
        </button>
      `;
    });

    let exercisesHtml = "";
    currentWorkout.exercises.forEach((exItem, exIdx) => {
      const exDef = EXERCISE_DATABASE[exItem.exerciseId];
      if (!exDef) return;

      const baselineData = this.state.baselines[exItem.exerciseId];
      let targetWeight = 0;
      let e1rmDisplay = "";

      if (baselineData && baselineData.e1rm > 0) {
        const targetRepsNum = parseInt(exItem.reps) || 8;
        targetWeight = getOptimalWeight(baselineData.e1rm, targetRepsNum, exItem.targetRPE);
        e1rmDisplay = `
          <div class="calc-target-badge">
            <span class="badge-icon">🎯</span>
            <span>Optimal Target: <strong>${targetWeight} lbs</strong> (${exItem.reps} reps @ RPE ${exItem.targetRPE})</span>
            <small class="e1rm-ref">E1RM: ${baselineData.e1rm} lbs</small>
          </div>
        `;
      } else {
        e1rmDisplay = `
          <div class="calc-target-badge baseline-alert">
            <span>⚙️ Baseline Test: Log working weight &amp; RPE to calibrate future loads</span>
          </div>
        `;
      }

      // Sets table
      let setsRows = "";
      for (let s = 1; s <= exItem.sets; s++) {
        const setKey = `${exItem.exerciseId}_${s}`;
        const savedSet = this.state.currentSession.setsData[setKey] || {
          weight: targetWeight || (baselineData ? baselineData.weight : ""),
          reps: parseInt(exItem.reps) || 8,
          rpe: exItem.targetRPE,
          completed: false
        };

        setsRows += `
          <tr class="set-row ${savedSet.completed ? "set-completed" : ""}" id="row_${setKey}">
            <td class="col-setnum">
              <span class="set-label-desktop">Set ${s}</span>
              <span class="set-label-mobile">S${s}</span>
            </td>
            <td class="col-target">${exItem.reps} reps @ RPE ${exItem.targetRPE}</td>
            <td class="col-input col-weight">
              <input type="number" step="2.5" class="set-input set-weight-input" id="weight_${setKey}" 
                value="${savedSet.weight || ""}" placeholder="lbs"
                onchange="app.updateSet('${setKey}', 'weight', this.value)">
            </td>
            <td class="col-input col-reps">
              <input type="number" class="set-input set-reps-input" id="reps_${setKey}" 
                value="${savedSet.reps || ""}" placeholder="reps"
                onchange="app.updateSet('${setKey}', 'reps', this.value)">
            </td>
            <td class="col-input col-rpe">
              <select class="set-input set-rpe-select" id="rpe_${setKey}"
                onchange="app.updateSet('${setKey}', 'rpe', this.value)">
                ${[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(r => `
                  <option value="${r}" ${parseFloat(savedSet.rpe) === r ? "selected" : ""}>${r}</option>
                `).join("")}
              </select>
            </td>
            <td class="col-action">
              <button class="set-check-btn ${savedSet.completed ? "btn-checked" : ""}" 
                onclick="app.toggleSetComplete('${setKey}', '${exItem.exerciseId}', ${exItem.rest || 90})">
                <span class="btn-text-desktop">${savedSet.completed ? "✓ Done" : "Log &amp; Rest"}</span>
                <span class="btn-text-mobile">${savedSet.completed ? "✓" : "Log"}</span>
              </button>
            </td>
          </tr>
        `;
      }

      exercisesHtml += `
        <div class="exercise-card" id="excard_${exItem.exerciseId}">
          <div class="exercise-card-header">
            <div class="ex-header-info">
              <div class="ex-pattern-tag">${exDef.pattern} • Focus: ${exDef.focus.toUpperCase()}</div>
              <h3 class="ex-name" onclick="app.openExerciseModal('${exItem.exerciseId}')">${exDef.name}</h3>
              <div class="ex-tempo-rest">
                <span class="tempo-tag">Tempo: ${exDef.tempo}</span>
                <span class="rest-tag">Rest: ${exItem.rest || exDef.defaultRest}s</span>
                <span class="science-tag">${exDef.category === "hypertrophy" ? "High Tension Hypertrophy" : "Functional Power"}</span>
              </div>
            </div>
            <div class="ex-header-actions">
              <button class="btn-guide" onclick="app.openExerciseModal('${exItem.exerciseId}')">
                🔍 Form Guide &amp; Muscles
              </button>
              <button class="btn-quick-rest" data-quick-rest="${exItem.rest || exDef.defaultRest}" data-exercise-name="${exDef.name}">
                ⏱️ ${exItem.rest || exDef.defaultRest}s Rest
              </button>
            </div>
          </div>

          ${e1rmDisplay}

          <div class="sets-table-wrapper">
            <table class="sets-table">
              <thead>
                <tr>
                  <th class="col-setnum">Set</th>
                  <th class="col-target">Prescription</th>
                  <th class="col-weight">Weight (lbs)</th>
                  <th class="col-reps">Reps</th>
                  <th class="col-rpe">RPE</th>
                  <th class="col-action">Action</th>
                </tr>
              </thead>
              <tbody>
                ${setsRows}
              </tbody>
            </table>
          </div>

          <div class="exercise-coaching-tip">
            <strong>Key Cue:</strong> ${exDef.cues[0]}
          </div>
        </div>
      `;
    });

    // Optional MetCon for functional fitness
    let metconHtml = "";
    if (currentWorkout.intervalMetcon) {
      const mc = currentWorkout.intervalMetcon;
      metconHtml = `
        <div class="functional-metcon-card">
          <div class="metcon-badge">Functional Conditioning MetCon (${mc.type})</div>
          <h3>${mc.durationMins}-Minute ${mc.type} Finisher</h3>
          <p>${mc.description}</p>
          <button class="btn-launch-metcon" onclick="app.launchMetcon('${mc.type}', ${mc.durationMins})">
            🚀 Launch ${mc.type} Interval Timer
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="workout-view-header">
        <div class="view-title-block">
          <div class="phase-breadcrumb">
            <span class="phase-tag">${currentPhase.name}</span>
            <span class="week-tag">Week ${this.state.currentWeek}</span>
          </div>
          <h2 class="workout-heading">${currentWorkout.name}</h2>
          <p class="workout-desc">${currentPhase.description}</p>
        </div>

        <div class="workout-controls-top">
          <button class="btn-finish-workout" onclick="app.completeWorkoutSession()">
            🏁 Finish &amp; Log Workout
          </button>
        </div>
      </div>

      <!-- 4 Days Selector Bar -->
      <div class="days-selector-bar">
        ${daysHtml}
      </div>

      ${metconHtml}

      <!-- Exercise Cards List -->
      <div class="exercise-cards-list">
        ${exercisesHtml}
      </div>

      <div class="workout-footer-actions">
        <button class="btn-finish-workout-large" onclick="app.completeWorkoutSession()">
          ✓ Complete Workout &amp; Update Progressive Overload Baselines
        </button>
      </div>
    `;
  }

  setDay(dayNum) {
    this.state.currentDay = dayNum;
    this.saveState();
    this.renderCurrentTabContent();
  }

  updateSet(setKey, field, value) {
    if (!this.state.currentSession.setsData[setKey]) {
      this.state.currentSession.setsData[setKey] = {};
    }
    this.state.currentSession.setsData[setKey][field] = value;
    this.saveState();
  }

  toggleSetComplete(setKey, exerciseId, restSeconds) {
    if (!this.state.currentSession.setsData[setKey]) {
      this.state.currentSession.setsData[setKey] = {};
    }
    const current = !!this.state.currentSession.setsData[setKey].completed;
    const nextState = !current;
    this.state.currentSession.setsData[setKey].completed = nextState;

    // Pull input values from DOM
    const wEl = document.getElementById(`weight_${setKey}`);
    const rEl = document.getElementById(`reps_${setKey}`);
    const rpeEl = document.getElementById(`rpe_${setKey}`);

    const w = parseFloat(wEl ? wEl.value : 0) || 0;
    const r = parseInt(rEl ? rEl.value : 0) || 0;
    const rpe = parseFloat(rpeEl ? rpeEl.value : 8) || 8;

    this.state.currentSession.setsData[setKey].weight = w;
    this.state.currentSession.setsData[setKey].reps = r;
    this.state.currentSession.setsData[setKey].rpe = rpe;

    // If completed, trigger rest timer automatically and update baseline if improved
    if (nextState) {
      timerManager.triggerHaptic([60, 40, 60]);
      if (w > 0 && r > 0) {
        const newE1rm = calculateE1RM(w, r, rpe);
        const existingBaseline = this.state.baselines[exerciseId];
        if (!existingBaseline || newE1rm > existingBaseline.e1rm) {
          this.state.baselines[exerciseId] = {
            weight: w,
            reps: r,
            rpe: rpe,
            e1rm: newE1rm,
            date: new Date().toISOString().split("T")[0]
          };
        }
      }

      const exDef = EXERCISE_DATABASE[exerciseId];
      const exName = exDef ? exDef.name : "Exercise";
      timerManager.startRestTimer(restSeconds || 90, exName);
      this.showToast(`Set logged! ${restSeconds || 90}s rest started.`, "success");
    } else {
      timerManager.triggerHaptic(30);
    }

    this.saveState();
    this.renderCurrentTabContent();
  }

  completeWorkoutSession() {
    const currentPhase = PERIODIZATION_SCHEDULE[this.state.currentPhaseId] || PERIODIZATION_SCHEDULE.baseline;
    const dayIndex = Math.min(this.state.currentDay, currentPhase.workouts.length) - 1;
    const currentWorkout = currentPhase.workouts[dayIndex];

    const loggedExercises = [];
    let completedSetsCount = 0;

    currentWorkout.exercises.forEach(exItem => {
      const setsArr = [];
      for (let s = 1; s <= exItem.sets; s++) {
        const setKey = `${exItem.exerciseId}_${s}`;
        const sData = this.state.currentSession.setsData[setKey];
        if (sData && sData.completed) {
          completedSetsCount++;
          setsArr.push({
            setNum: s,
            weight: parseFloat(sData.weight) || 0,
            reps: parseInt(sData.reps) || 0,
            rpe: parseFloat(sData.rpe) || 8,
            completed: true
          });
        }
      }
      if (setsArr.length > 0) {
        loggedExercises.push({
          exerciseId: exItem.exerciseId,
          sets: setsArr
        });
      }
    });

    if (completedSetsCount === 0) {
      alert("Please log and complete at least one set before saving this workout.");
      return;
    }

    const logEntry = {
      id: "log_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      phaseId: this.state.currentPhaseId,
      week: this.state.currentWeek,
      day: this.state.currentDay,
      name: currentWorkout.name,
      durationMins: Math.max(25, Math.round((Date.now() - (this.state.currentSession.startTime || Date.now())) / 60000)),
      exercises: loggedExercises
    };

    this.state.workoutHistory.push(logEntry);
    this.state.currentSession = {
      inProgress: false,
      startTime: Date.now(),
      setsData: {}
    };

    // Advance day
    if (this.state.currentDay < 4) {
      this.state.currentDay++;
    } else {
      this.state.currentDay = 1;
      this.state.currentWeek++;
    }

    this.saveState();
    this.showToast("Workout saved successfully! Progressive overload baselines updated.", "success");
    this.switchTab("metrics");
  }

  // ==========================================
  // TAB 2: PERIODIZATION ROADMAP VIEW
  // ==========================================
  renderPeriodizationTab(container) {
    const phases = [
      {
        key: "baseline",
        title: "Baseline Calibration Week (Week 1)",
        tag: "Calibration & Neuromuscular Baseline",
        duration: "1 Week (Current)",
        desc: "Establishes starting strength baselines, joint integrity, and RPE profile without fatigue masking. Crucial benchmark for all subsequent algorithm targets."
      },
      {
        key: "hypertrophy_meso1",
        title: "Hypertrophy Mesocycle 1 (Now - Nov/Dec)",
        tag: "Volume Accumulation & Mechanical Tension",
        duration: "5 Weeks (Weeks 2 - 6)",
        desc: "14-18 sets per week prioritized specifically for Back, Shoulders, and Legs. Progressive overload with RPE ramping from 7.5 to 8.5."
      },
      {
        key: "hypertrophy_meso2",
        title: "Hypertrophy Mesocycle 2 (Dec - Feb)",
        tag: "Stretch-Mediated Tension & Lengthened Partials",
        duration: "7 Weeks (Weeks 8 - 14)",
        desc: "Based on 2024-2026 sports science research: prioritizes lengthened-position loading, high volume, and controlled metabolic fatigue. RPE 8.5 - 9.5."
      },
      {
        key: "functional_phase",
        title: "Functional Fitness Phase (March - May)",
        tag: "Multi-Planar Athleticism, Power & Engine",
        duration: "12 Weeks (March 1 - May 31)",
        desc: "Converts muscle mass into explosive athletic power and tri-planar resilience. Features Trap Bar Deadlifts, Push Presses, Kettlebell Swings, Farmer's Carries, EMOMs, and Tabata conditioning."
      }
    ];

    let cardsHtml = "";
    phases.forEach(p => {
      const isCurrent = this.state.currentPhaseId === p.key;
      const phaseData = PERIODIZATION_SCHEDULE[p.key];

      cardsHtml += `
        <div class="periodization-card ${isCurrent ? "active-phase-card" : ""}">
          <div class="phase-card-top">
            <span class="phase-pill ${isCurrent ? "pill-active" : ""}">${p.tag}</span>
            <span class="phase-duration-badge">${p.duration}</span>
          </div>
          <h3 class="phase-card-title">${p.title}</h3>
          <p class="phase-card-desc">${p.desc}</p>

          <div class="phase-workouts-preview">
            <h4>4-Day Weekly Split:</h4>
            <ul>
              ${phaseData.workouts.map((w, idx) => `
                <li><strong>Day ${idx + 1}:</strong> ${w.name} (${w.focus})</li>
              `).join("")}
            </ul>
          </div>

          <div class="phase-card-actions">
            ${isCurrent ? `
              <span class="current-phase-status">✓ Currently Active Program</span>
            ` : `
              <button class="btn-activate-phase" onclick="app.activatePhase('${p.key}')">
                Switch to this Phase
              </button>
            `}
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="periodization-overview-header">
        <h2>Scientific Periodization Roadmap</h2>
        <p>
          Customized for a <strong>31-year-old male (6ft, 180 lbs)</strong> training <strong>4 days per week</strong>. 
          Structured with progressive volume accumulation, deliberate resensitization deloads, and a seamless spring transition to functional conditioning.
        </p>
      </div>

      <div class="periodization-grid">
        ${cardsHtml}
      </div>
    `;
  }

  activatePhase(phaseKey) {
    this.state.currentPhaseId = phaseKey;
    this.saveState();
    this.showToast(`Switched active phase to ${PERIODIZATION_SCHEDULE[phaseKey].name}`, "success");
    this.switchTab("workout");
  }

  // ==========================================
  // TAB 3: METRICS & ANALYTICS VIEW
  // ==========================================
  renderMetricsTab(container) {
    const summary = MetricsEngine.calculateSummary(this.state.workoutHistory);

    container.innerHTML = `
      <div class="metrics-header">
        <h2>Progress &amp; Performance Metrics</h2>
        <p>Autoregulated progress, volume load accumulation, and weekly muscle group volume vs scientific recommendations.</p>
      </div>

      <!-- KPI Summary Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-val">${summary.totalWorkouts}</div>
          <div class="kpi-label">Workouts Completed</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-val">${summary.totalTonnage.toLocaleString()} <small>lbs</small></div>
          <div class="kpi-label">Total Volume Load</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-val">${summary.totalSets}</div>
          <div class="kpi-label">Total Work Sets</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-val">${this.state.profile.weight} <small>lbs</small></div>
          <div class="kpi-label">Bodyweight (6ft, 31y)</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-row">
        <div class="chart-box">
          <div class="chart-header">
            <h3>Weekly Muscle Volume vs Science Target (10-20 Sets)</h3>
            <span class="chart-sub">Back, Shoulders &amp; Legs prioritized</span>
          </div>
          <div class="canvas-wrapper">
            <canvas id="muscleVolumeCanvas" style="width: 100%; height: 260px;"></canvas>
          </div>
        </div>

        <div class="chart-box">
          <div class="chart-header">
            <h3>Estimated 1RM Strength Progression</h3>
            <select id="liftSelect" class="chart-dropdown" onchange="app.updateStrengthChart()">
              <option value="barbell-back-squat">Barbell Back Squat</option>
              <option value="lat-pulldown">Lat Pulldown</option>
              <option value="overhead-barbell-press">Overhead Press</option>
              <option value="romanian-deadlift">Romanian Deadlift</option>
            </select>
          </div>
          <div class="canvas-wrapper">
            <canvas id="strengthTrendCanvas" style="width: 100%; height: 260px;"></canvas>
          </div>
        </div>
      </div>

      <!-- Calibrated Baselines Table -->
      <div class="baselines-section">
        <h3>Current Calibrated Movement Baselines &amp; E1RMs</h3>
        <div class="baselines-table-wrapper">
          <table class="baselines-table">
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Focus</th>
                <th>Calibrated Weight</th>
                <th>Reps</th>
                <th>RPE</th>
                <th>Calculated E1RM</th>
                <th>Last Tested</th>
              </tr>
            </thead>
            <tbody>
              ${Object.keys(this.state.baselines).map(exId => {
                const b = this.state.baselines[exId];
                const def = EXERCISE_DATABASE[exId];
                if (!def) return "";
                return `
                  <tr>
                    <td><strong>${def.name}</strong></td>
                    <td><span class="focus-pill">${def.focus.toUpperCase()}</span></td>
                    <td>${b.weight} lbs</td>
                    <td>${b.reps}</td>
                    <td>RPE ${b.rpe}</td>
                    <td><strong class="text-emerald">${b.e1rm} lbs</strong></td>
                    <td>${b.date || "Week 1"}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Render charts
    setTimeout(() => {
      const volCanvas = document.getElementById("muscleVolumeCanvas");
      if (volCanvas) {
        MetricsEngine.drawMuscleVolumeChart(volCanvas, summary.muscleSets);
      }
      this.updateStrengthChart();
    }, 50);
  }

  updateStrengthChart() {
    const select = document.getElementById("liftSelect");
    const liftId = select ? select.value : "barbell-back-squat";
    const canvas = document.getElementById("strengthTrendCanvas");
    if (!canvas) return;

    const summary = MetricsEngine.calculateSummary(this.state.workoutHistory);
    let history = summary.lift1RMHistory[liftId] || [];

    // Ensure baseline is included as first point if present
    const base = this.state.baselines[liftId];
    if (base && (!history.length || history[0].date !== base.date)) {
      history = [{ date: base.date || "2026-09-20", e1rm: base.e1rm }, ...history];
    }

    const exDef = EXERCISE_DATABASE[liftId];
    MetricsEngine.drawStrengthChart(canvas, history, exDef ? exDef.name : liftId);
  }

  // ==========================================
  // TAB 4: FREQUENT INTERVAL TIMERS
  // ==========================================
  renderTimersTab(container) {
    container.innerHTML = `
      <div class="timers-view-header">
        <h2>Interactive Interval &amp; Rest Timers</h2>
        <p>Acoustic alerts at frequent milestones (30s, 15s, and 3-2-1 countdown) with Web Audio synthesis.</p>
      </div>

      <div class="timers-grid">
        <!-- Quick Rest Timer Card -->
        <div class="timer-card">
          <div class="timer-card-icon">⏱️</div>
          <h3>Smart Rest Period Timer</h3>
          <p>Preset or custom countdown for hypertrophy work sets.</p>
          <div class="quick-timer-buttons">
            <button class="btn-timer-preset" onclick="timerManager.startRestTimer(45, 'Quick Rest')">45s</button>
            <button class="btn-timer-preset" onclick="timerManager.startRestTimer(60, 'Isolation Rest')">60s</button>
            <button class="btn-timer-preset" onclick="timerManager.startRestTimer(90, 'Hypertrophy Rest')">90s</button>
            <button class="btn-timer-preset" onclick="timerManager.startRestTimer(120, 'Compound Rest')">120s</button>
            <button class="btn-timer-preset" onclick="timerManager.startRestTimer(180, 'Heavy Squat Rest')">180s</button>
          </div>
          <div class="custom-timer-row">
            <input type="number" id="customRestInput" class="custom-timer-input" value="90" min="10" max="600" step="5">
            <button class="btn-custom-start" onclick="app.startCustomRest()">Start Custom Rest</button>
          </div>
        </div>

        <!-- EMOM Timer Card -->
        <div class="timer-card">
          <div class="timer-card-icon">⚡</div>
          <h3>EMOM Interval Timer</h3>
          <p>Every Minute on the Minute countdown with acoustic beeps before each round.</p>
          <div class="timer-config-row">
            <label>Total Minutes:</label>
            <input type="number" id="emomMinutesInput" class="custom-timer-input" value="10" min="1" max="60">
          </div>
          <button class="btn-launch-protocol" onclick="app.launchEMOM()">
            Start EMOM Protocol
          </button>
        </div>

        <!-- Tabata / HIIT Timer Card -->
        <div class="timer-card">
          <div class="timer-card-icon">🔥</div>
          <h3>Tabata / HIIT Interval Engine</h3>
          <p>20s explosive work / 10s recovery intervals across 8 rounds.</p>
          <div class="timer-config-row">
            <label>Work Sec:</label>
            <input type="number" id="tabataWorkInput" class="custom-timer-input" value="20" min="5" max="120">
            <label>Rest Sec:</label>
            <input type="number" id="tabataRestInput" class="custom-timer-input" value="10" min="5" max="60">
            <label>Rounds:</label>
            <input type="number" id="tabataRoundsInput" class="custom-timer-input" value="8" min="1" max="30">
          </div>
          <button class="btn-launch-protocol" onclick="app.launchTabata()">
            Start Tabata Protocol
          </button>
        </div>

        <!-- AMRAP Timer Card -->
        <div class="timer-card">
          <div class="timer-card-icon">🔄</div>
          <h3>AMRAP Countdown Clock</h3>
          <p>As Many Rounds As Possible with interactive round counter.</p>
          <div class="timer-config-row">
            <label>Duration (Mins):</label>
            <input type="number" id="amrapMinsInput" class="custom-timer-input" value="12" min="1" max="60">
          </div>
          <button class="btn-launch-protocol" onclick="app.launchAMRAP()">
            Start AMRAP Clock
          </button>
        </div>
      </div>
    `;
  }

  startCustomRest() {
    const input = document.getElementById("customRestInput");
    const sec = parseInt(input ? input.value : 90) || 90;
    timerManager.startRestTimer(sec, "Custom Rest Period");
    this.showToast(`Rest timer started: ${sec}s`);
  }

  launchEMOM() {
    const input = document.getElementById("emomMinutesInput");
    const mins = parseInt(input ? input.value : 10) || 10;
    timerManager.startEMOM(mins, `${mins}-Minute EMOM`);
    this.showToast(`EMOM Started: ${mins} minutes`);
  }

  launchTabata() {
    const w = parseInt(document.getElementById("tabataWorkInput").value) || 20;
    const r = parseInt(document.getElementById("tabataRestInput").value) || 10;
    const rounds = parseInt(document.getElementById("tabataRoundsInput").value) || 8;
    timerManager.startTabata(w, r, rounds, "Tabata Interval Protocol");
    this.showToast(`Tabata Started: ${rounds} rounds (${w}s / ${r}s)`);
  }

  launchAMRAP() {
    const mins = parseInt(document.getElementById("amrapMinsInput").value) || 12;
    timerManager.startAMRAP(mins, `${mins}-Minute AMRAP`);
    this.showToast(`AMRAP Started: ${mins} minutes`);
  }

  launchMetcon(type, durationMins) {
    if (type === "EMOM") {
      timerManager.startEMOM(durationMins, `Conditioning EMOM`);
    } else if (type === "Tabata") {
      timerManager.startTabata(20, 10, 8, "Conditioning Tabata");
    } else if (type === "AMRAP") {
      timerManager.startAMRAP(durationMins, "Conditioning AMRAP");
    } else {
      timerManager.startRestTimer(durationMins * 60, "Conditioning Circuit");
    }
    this.showToast(`Launched ${type} Interval!`);
  }

  // ==========================================
  // TAB 5: SMART TOOLS (PLATE CALC, WARMUP, ETC.)
  // ==========================================
  renderToolsTab(container) {
    container.innerHTML = `
      <div class="tools-view-header">
        <h2>Smart Lifting &amp; Programming Tools</h2>
        <div class="tools-subtabs">
          <button class="tool-subtab-btn ${this.selectedToolsTab === "plates" ? "active" : ""}" onclick="app.setToolsSubtab('plates')">
            🏋️ Olympic Plate Calculator
          </button>
          <button class="tool-subtab-btn ${this.selectedToolsTab === "warmup" ? "active" : ""}" onclick="app.setToolsSubtab('warmup')">
            🔥 Ramp-Up Warm-Up Generator
          </button>
          <button class="tool-subtab-btn ${this.selectedToolsTab === "rpe" ? "active" : ""}" onclick="app.setToolsSubtab('rpe')">
            📐 1RM &amp; RPE Matrix
          </button>
          <button class="tool-subtab-btn ${this.selectedToolsTab === "export" ? "active" : ""}" onclick="app.setToolsSubtab('export')">
            💾 Export / Import Data
          </button>
        </div>
      </div>

      <div id="toolSubtabContent" class="tool-subtab-content">
        <!-- Rendered based on selectedToolsTab -->
      </div>
    `;

    this.renderSelectedToolSubtab();
  }

  setToolsSubtab(tab) {
    this.selectedToolsTab = tab;
    this.renderToolsTab(document.getElementById("tabContent"));
  }

  renderSelectedToolSubtab() {
    const container = document.getElementById("toolSubtabContent");
    if (!container) return;

    if (this.selectedToolsTab === "plates") {
      const defaultWeight = 225;
      const res = FitnessTools.calculatePlates(defaultWeight, 45);
      container.innerHTML = `
        <div class="tool-panel">
          <h3>Olympic Barbell Plate Calculator</h3>
          <p>Calculates exact plates per side for standard Olympic bar (45 lbs).</p>
          <div class="plate-input-row">
            <label>Target Total Weight (lbs):</label>
            <input type="number" id="plateTargetInput" value="${defaultWeight}" step="2.5" min="45" max="1000"
              oninput="app.updatePlateCalcVisual()">
            <label>Bar Weight:</label>
            <select id="plateBarWeight" onchange="app.updatePlateCalcVisual()">
              <option value="45" selected>45 lbs (Standard Olympic)</option>
              <option value="35">35 lbs (Technique Bar)</option>
            </select>
          </div>
          <div id="plateVisualContainer">
            ${FitnessTools.renderBarbellVisual(res)}
          </div>
        </div>
      `;
    } else if (this.selectedToolsTab === "warmup") {
      const defaultWorking = 225;
      const warmupSets = FitnessTools.generateWarmUpSets(defaultWorking);
      container.innerHTML = `
        <div class="tool-panel">
          <h3>Evidence-Based Ramp-Up Warm-Up Generator</h3>
          <p>Scientific ramp-up sets potentiate the nervous system and warm up joint synovial fluid without accumulating premature metabolic fatigue.</p>
          <div class="plate-input-row">
            <label>Working Set Weight (lbs):</label>
            <input type="number" id="warmupTargetInput" value="${defaultWorking}" step="5" min="45" max="800"
              oninput="app.updateWarmupVisual()">
          </div>
          <div id="warmupSetsContainer">
            ${this.renderWarmupTable(warmupSets)}
          </div>
        </div>
      `;
    } else if (this.selectedToolsTab === "rpe") {
      container.innerHTML = `
        <div class="tool-panel">
          <h3>1RM &amp; RPE Autoregulation Reference Matrix</h3>
          <p>Estimates 1RM from any logged weight &amp; reps, and projects loads across RPE targets.</p>
          <div class="plate-input-row">
            <label>Test Weight (lbs):</label>
            <input type="number" id="rpeTestWeight" value="200" step="5" min="20" oninput="app.updateRpeMatrix()">
            <label>Reps Completed:</label>
            <input type="number" id="rpeTestReps" value="8" min="1" max="20" oninput="app.updateRpeMatrix()">
            <label>Perceived RPE:</label>
            <select id="rpeTestVal" onchange="app.updateRpeMatrix()">
              <option value="7">7 (3 reps in reserve)</option>
              <option value="7.5">7.5 (2-3 reps in reserve)</option>
              <option value="8" selected>8 (2 solid reps in reserve)</option>
              <option value="8.5">8.5 (1-2 reps in reserve)</option>
              <option value="9">9 (1 rep in reserve)</option>
              <option value="9.5">9.5 (Maybe 1 rep)</option>
              <option value="10">10 (Absolute max effort)</option>
            </select>
          </div>
          <div id="rpeMatrixContainer">
            ${this.renderRpeMatrixTable(200, 8, 8)}
          </div>
        </div>
      `;
    } else if (this.selectedToolsTab === "export") {
      container.innerHTML = `
        <div class="tool-panel">
          <h3>Data Export &amp; Backup</h3>
          <p>Your workout history and baselines are saved in local browser storage. You can export or import your data anytime.</p>
          <div class="export-actions">
            <button class="btn-custom-start" onclick="app.exportData()">📥 Export Data (JSON Download)</button>
            <div class="import-block">
              <label>Import Data (Select JSON file):</label>
              <input type="file" id="importFileInput" accept=".json" onchange="app.importData(event)">
            </div>
            <button class="btn-danger-reset" onclick="app.resetAllData()">⚠️ Reset to Default Research Program</button>
          </div>
        </div>
      `;
    }
  }

  updatePlateCalcVisual() {
    const target = parseFloat(document.getElementById("plateTargetInput").value) || 45;
    const bar = parseFloat(document.getElementById("plateBarWeight").value) || 45;
    const res = FitnessTools.calculatePlates(target, bar);
    const container = document.getElementById("plateVisualContainer");
    if (container) container.innerHTML = FitnessTools.renderBarbellVisual(res);
  }

  updateWarmupVisual() {
    const target = parseFloat(document.getElementById("warmupTargetInput").value) || 45;
    const sets = FitnessTools.generateWarmUpSets(target);
    const container = document.getElementById("warmupSetsContainer");
    if (container) container.innerHTML = this.renderWarmupTable(sets);
  }

  renderWarmupTable(sets) {
    return `
      <div class="warmup-table-wrapper">
        <table class="sets-table">
          <thead>
            <tr>
              <th>Ramp Set</th>
              <th>Weight</th>
              <th>Reps</th>
              <th>Rest</th>
              <th>Objective</th>
            </tr>
          </thead>
          <tbody>
            ${sets.map(s => `
              <tr>
                <td><strong>Set ${s.set}</strong></td>
                <td><strong class="text-emerald">${s.weight} lbs</strong></td>
                <td>${s.reps} reps</td>
                <td>${s.restSec}s</td>
                <td>${s.note}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  updateRpeMatrix() {
    const w = parseFloat(document.getElementById("rpeTestWeight").value) || 0;
    const r = parseInt(document.getElementById("rpeTestReps").value) || 0;
    const rpe = parseFloat(document.getElementById("rpeTestVal").value) || 8;
    const container = document.getElementById("rpeMatrixContainer");
    if (container) container.innerHTML = this.renderRpeMatrixTable(w, r, rpe);
  }

  renderRpeMatrixTable(w, r, rpe) {
    const e1rm = calculateE1RM(w, r, rpe);
    if (!e1rm) return "<p>Enter valid weight and reps.</p>";

    return `
      <div class="rpe-results-box">
        <h4>Estimated 1RM: <strong class="text-emerald">${e1rm} lbs</strong></h4>
        <p>Recommended working loads across different rep and RPE targets:</p>
        <table class="sets-table">
          <thead>
            <tr>
              <th>Target Reps</th>
              <th>RPE 7.0 (3 RIR)</th>
              <th>RPE 8.0 (2 RIR)</th>
              <th>RPE 8.5 (1-2 RIR)</th>
              <th>RPE 9.0 (1 RIR)</th>
            </tr>
          </thead>
          <tbody>
            ${[5, 6, 8, 10, 12, 15].map(rep => `
              <tr>
                <td><strong>${rep} Reps</strong></td>
                <td>${getOptimalWeight(e1rm, rep, 7.0)} lbs</td>
                <td><strong>${getOptimalWeight(e1rm, rep, 8.0)} lbs</strong></td>
                <td>${getOptimalWeight(e1rm, rep, 8.5)} lbs</td>
                <td>${getOptimalWeight(e1rm, rep, 9.0)} lbs</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fitness_program_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.showToast("Data exported successfully!");
  }

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        this.state = parsed;
        this.saveState();
        this.renderApp();
        this.showToast("Data imported successfully!", "success");
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }

  resetAllData() {
    if (confirm("Reset all logs and baselines to the default science program?")) {
      this.state = this.getDefaultState();
      this.saveState();
      this.renderApp();
      this.showToast("Program reset to default.", "info");
    }
  }

  // ==========================================
  // EXERCISE MODAL (ANATOMY & BIOMECHANICAL FORM)
  // ==========================================
  openExerciseModal(exerciseId) {
    const exDef = EXERCISE_DATABASE[exerciseId];
    if (!exDef) return;

    this.selectedExerciseForModal = exerciseId;
    const modal = document.getElementById("exerciseModal");
    const windowEl = modal.querySelector(".modal-window");

    const anatomySvg = AnatomyVisualizer.renderAnatomyDiagram(exDef.primaryMuscles, exDef.secondaryMuscles);
    const biomechSvg = AnatomyVisualizer.renderExerciseGraphic(exDef.graphicType);
    const subs = FitnessTools.getSubstitutions(exerciseId);

    windowEl.innerHTML = `
      <div class="modal-header">
        <div class="modal-title-group">
          <span class="modal-pattern-tag">${exDef.pattern} • ${exDef.category.toUpperCase()}</span>
          <h2>${exDef.name}</h2>
        </div>
        <button class="modal-close-btn">&times;</button>
      </div>

      <div class="modal-body">
        <div class="modal-visuals-row">
          <!-- Anatomical Muscle Highlight -->
          <div class="visual-col">
            <h4 class="visual-col-heading">Muscles Targeted</h4>
            ${anatomySvg}
          </div>

          <!-- Biomechanical Form Graphic -->
          <div class="visual-col">
            <h4 class="visual-col-heading">Biomechanical Execution</h4>
            ${biomechSvg}
            <div class="tempo-guideline">
              <strong>Recommended Tempo:</strong> ${exDef.tempo} (3s eccentric stretch)
            </div>
          </div>
        </div>

        <!-- Evidence-Based Cues -->
        <div class="modal-cues-section">
          <h4>Research-Backed Coaching Cues</h4>
          <ul class="cues-list">
            ${exDef.cues.map(c => `<li>${c}</li>`).join("")}
          </ul>
        </div>

        <!-- Alternative Substitutions -->
        ${subs.length > 0 ? `
          <div class="modal-subs-section">
            <h4>Biomechanically Equivalent Substitutions</h4>
            <div class="subs-buttons-list">
              ${subs.map(s => `
                <button class="btn-sub-exercise" onclick="app.openExerciseModal('${s.id}')">
                  🔁 Switch to ${s.name}
                </button>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    `;

    modal.classList.remove("hidden");
  }

  closeModal() {
    const modal = document.getElementById("exerciseModal");
    if (modal) modal.classList.add("hidden");
  }

  // ==========================================
  // FLOATING REST TIMER DOCK
  // ==========================================
  updateTimerDock(timer) {
    const dock = document.getElementById("timerDock");
    if (!dock) return;

    if (!timer || timer.status === "stopped") {
      dock.classList.add("hidden");
      return;
    }

    dock.classList.remove("hidden");

    let timerContent = "";
    if (timer.type === "rest") {
      const pct = Math.max(0, Math.min(100, ((timer.totalSeconds - timer.remaining) / timer.totalSeconds) * 100));
      timerContent = `
        <div class="dock-info">
          <span class="dock-icon">⏱️</span>
          <div class="dock-labels">
            <span class="dock-title">Rest Period: ${timer.exerciseName || "Between Sets"}</span>
            <span class="dock-time">${timerManager.formatTime(timer.remaining)}</span>
          </div>
        </div>
        <div class="dock-progress-bar">
          <div class="dock-progress-fill" style="width: ${pct}%"></div>
        </div>
        <div class="dock-controls">
          <button class="btn-dock-action" onclick="timerManager.addTime(30)">+30s</button>
          <button class="btn-dock-action" onclick="timerManager.pauseResumeTimer()">${timer.status === "running" ? "Pause" : "Resume"}</button>
          <button class="btn-dock-dismiss" onclick="timerManager.stopTimer()">✕</button>
        </div>
      `;
    } else if (timer.type === "emom") {
      timerContent = `
        <div class="dock-info">
          <span class="dock-icon">⚡</span>
          <div class="dock-labels">
            <span class="dock-title">${timer.title} (Minute ${timer.currentMinute} / ${timer.totalMinutes})</span>
            <span class="dock-time">${timerManager.formatTime(timer.remainingInMinute)}</span>
          </div>
        </div>
        <div class="dock-controls">
          <button class="btn-dock-dismiss" onclick="timerManager.stopTimer()">✕ Stop</button>
        </div>
      `;
    } else if (timer.type === "tabata") {
      const isWork = timer.phase === "work";
      timerContent = `
        <div class="dock-info ${isWork ? "dock-tabata-work" : "dock-tabata-rest"}">
          <span class="dock-icon">${isWork ? "🔥" : "💤"}</span>
          <div class="dock-labels">
            <span class="dock-title">${isWork ? "WORK" : "REST"} (Round ${timer.currentRound} / ${timer.totalRounds})</span>
            <span class="dock-time">${timer.phaseRemaining}s</span>
          </div>
        </div>
        <div class="dock-controls">
          <button class="btn-dock-dismiss" onclick="timerManager.stopTimer()">✕ Stop</button>
        </div>
      `;
    } else if (timer.type === "amrap") {
      timerContent = `
        <div class="dock-info">
          <span class="dock-icon">🔄</span>
          <div class="dock-labels">
            <span class="dock-title">${timer.title} - Rounds: ${timer.roundsCompleted}</span>
            <span class="dock-time">${timerManager.formatTime(timer.remaining)}</span>
          </div>
        </div>
        <div class="dock-controls">
          <button class="btn-dock-action btn-add-round" onclick="timerManager.incrementAMRAPRound()">+1 Round</button>
          <button class="btn-dock-dismiss" onclick="timerManager.stopTimer()">✕ Stop</button>
        </div>
      `;
    }

    dock.innerHTML = timerContent;
  }
}

// Instantiate global app
let app;
window.addEventListener("DOMContentLoaded", () => {
  app = new FitnessApp();
});
