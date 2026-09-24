// Metrics, Analytics & Progress Visualization Engine
// Uses native high-DPI HTML5 Canvas rendering for 100% offline reliability

const MetricsEngine = {
  // Aggregate stats from workout logs
  calculateSummary(logs = []) {
    let totalWorkouts = logs.length;
    let totalTonnage = 0;
    let totalSets = 0;
    let totalReps = 0;
    const muscleSets = {};
    const lift1RMHistory = {}; // e.g. { 'barbell-back-squat': [ { date, e1rm, weight, reps } ] }

    logs.forEach(log => {
      const dateStr = log.date || new Date().toISOString().split("T")[0];
      if (log.exercises) {
        log.exercises.forEach(exLog => {
          const exDef = EXERCISE_DATABASE[exLog.exerciseId];
          const primaryList = exDef ? exDef.primaryMuscles : ["other"];

          if (exLog.sets && Array.isArray(exLog.sets)) {
            let maxE1rmInSession = 0;

            exLog.sets.forEach(set => {
              if (set.completed) {
                totalSets++;
                const w = parseFloat(set.weight) || 0;
                const r = parseInt(set.reps) || 0;
                const rpe = parseFloat(set.rpe) || 8;
                totalTonnage += (w * r);
                totalReps += r;

                // E1RM
                const e1rm = calculateE1RM(w, r, rpe);
                if (e1rm > maxE1rmInSession) {
                  maxE1rmInSession = e1rm;
                }

                // Muscle volume tracking (1 set counts toward direct primary muscles)
                primaryList.forEach(m => {
                  muscleSets[m] = (muscleSets[m] || 0) + 1;
                });
              }
            });

            if (maxE1rmInSession > 0) {
              if (!lift1RMHistory[exLog.exerciseId]) {
                lift1RMHistory[exLog.exerciseId] = [];
              }
              lift1RMHistory[exLog.exerciseId].push({
                date: dateStr,
                e1rm: maxE1rmInSession
              });
            }
          }
        });
      }
    });

    return {
      totalWorkouts,
      totalTonnage: Math.round(totalTonnage),
      totalSets,
      totalReps,
      muscleSets,
      lift1RMHistory
    };
  },

  // Draw 1RM Strength Line Chart on Canvas
  drawStrengthChart(canvas, historyData = [], liftName = "Exercise Strength (E1RM)") {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 480;
    const height = rect.height || 220;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, width, height);

    if (!historyData || historyData.length < 2) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto";
      ctx.textAlign = "center";
      ctx.fillText(`Log at least 2 sessions of ${liftName} to view trend`, width / 2, height / 2);
      return;
    }

    const padding = { top: 30, right: 30, bottom: 40, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const values = historyData.map(d => d.e1rm);
    const minVal = Math.floor(Math.min(...values) * 0.95);
    const maxVal = Math.ceil(Math.max(...values) * 1.05);

    // Grid lines & labels
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#64748b";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";

    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const y = padding.top + (chartH / gridSteps) * i;
      const val = Math.round(maxVal - ((maxVal - minVal) / gridSteps) * i);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(`${val} lbs`, padding.left - 8, y + 3);
    }

    // Line & Gradient Fill
    const points = historyData.map((d, idx) => {
      const x = padding.left + (chartW / (historyData.length - 1)) * idx;
      const y = padding.top + chartH - ((d.e1rm - minVal) / (maxVal - minVal)) * chartH;
      return { x, y, val: d.e1rm, date: d.date };
    });

    // Area gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.35)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.lineTo(points[0].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Data dots & text
    points.forEach((p, idx) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Show date at bottom
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      const shortDate = p.date.substring(5);
      ctx.fillText(shortDate, p.x, height - 15);
    });

    // Title
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${liftName} - Estimated 1RM Progression`, padding.left, 20);
  },

  // Draw Muscle Volume vs Scientific Target (10-20 Sets/Week)
  drawMuscleVolumeChart(canvas, muscleSets = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 480;
    const height = rect.height || 260;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, width, height);

    // Muscle targets to display (Priorities first: Back, Delts, Quads, Hamstrings/Glutes)
    const targetGroups = [
      { key: "lats", label: "Back (Lats/Rows)", targetMin: 14, targetMax: 20 },
      { key: "lateral_delts", label: "Shoulders (Delts)", targetMin: 14, targetMax: 20 },
      { key: "quads", label: "Legs (Quads)", targetMin: 12, targetMax: 18 },
      { key: "hamstrings", label: "Legs (Hamstrings)", targetMin: 10, targetMax: 16 },
      { key: "glutes", label: "Glutes & Hips", targetMin: 10, targetMax: 16 },
      { key: "chest", label: "Chest (Maint)", targetMin: 8, targetMax: 12 },
      { key: "biceps", label: "Arms (Biceps)", targetMin: 8, targetMax: 12 },
      { key: "calves", label: "Calves", targetMin: 10, targetMax: 16 }
    ];

    const leftPad = width < 400 ? 105 : 130;
    const padding = { top: 35, right: 25, bottom: 25, left: leftPad };
    const chartW = width - padding.left - padding.right;
    const barHeight = 16;
    const barGap = 10;
    const maxSetsScale = 25;

    // Header
    ctx.fillStyle = "#f8fafc";
    ctx.font = width < 400 ? "bold 11px sans-serif" : "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Weekly Volume vs Target (10-20 Sets)", 14, 20);

    targetGroups.forEach((g, i) => {
      const y = padding.top + i * (barHeight + barGap);
      const currentSets = muscleSets[g.key] || 0;

      // Label
      ctx.fillStyle = (g.key === "lats" || g.key === "lateral_delts" || g.key === "quads") ? "#38bdf8" : "#94a3b8";
      ctx.font = (g.key === "lats" || g.key === "lateral_delts" || g.key === "quads") 
        ? (width < 400 ? "bold 10px sans-serif" : "bold 11px sans-serif") 
        : (width < 400 ? "9px sans-serif" : "11px sans-serif");
      ctx.textAlign = "right";
      ctx.fillText(g.label, padding.left - 8, y + 12);

      // Background track
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(padding.left, y, chartW, barHeight, 4);
      ctx.fill();

      // Optimal zone highlight (targetMin to targetMax)
      const optX = padding.left + (g.targetMin / maxSetsScale) * chartW;
      const optW = ((g.targetMax - g.targetMin) / maxSetsScale) * chartW;
      ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
      ctx.fillRect(optX, y, optW, barHeight);

      // Current sets fill bar
      const fillW = Math.min(chartW, (currentSets / maxSetsScale) * chartW);
      if (fillW > 0) {
        ctx.fillStyle = currentSets >= g.targetMin ? "#10b981" : "#f59e0b";
        ctx.beginPath();
        ctx.roundRect(padding.left, y, fillW, barHeight, 4);
        ctx.fill();
      }

      // Value text
      ctx.fillStyle = "#f8fafc";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${currentSets} sets`, padding.left + fillW + 6, y + 12);
    });
  }
};
