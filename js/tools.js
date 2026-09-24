// Auxiliary Fitness Tools: Plate Calculator, Warm-Up Generator, 1RM Matrix, Substitution Engine

const FitnessTools = {
  // Plate Calculator
  calculatePlates(targetTotalWeight, barWeight = 45) {
    if (targetTotalWeight <= barWeight) {
      return {
        target: targetTotalWeight,
        bar: barWeight,
        weightPerSide: 0,
        platesPerSide: [],
        remainder: 0
      };
    }

    const availablePlates = [45, 35, 25, 10, 5, 2.5];
    let remainingPerSide = (targetTotalWeight - barWeight) / 2;
    const platesPerSide = [];

    availablePlates.forEach(plate => {
      const count = Math.floor(remainingPerSide / plate);
      for (let i = 0; i < count; i++) {
        platesPerSide.push(plate);
      }
      remainingPerSide -= count * plate;
      remainingPerSide = Math.round(remainingPerSide * 100) / 100;
    });

    return {
      target: targetTotalWeight,
      bar: barWeight,
      weightPerSide: (targetTotalWeight - barWeight) / 2,
      platesPerSide,
      remainder: remainingPerSide * 2
    };
  },

  // Renders visual barbell sleeve with plates
  renderBarbellVisual(platesResult) {
    const plateColors = {
      45: "#3b82f6", // Blue
      35: "#eab308", // Yellow
      25: "#22c55e", // Green
      10: "#f8fafc", // White
      5: "#ef4444",  // Red
      2.5: "#94a3b8" // Silver
    };

    const plateHeights = {
      45: 85,
      35: 75,
      25: 65,
      10: 50,
      5: 40,
      2.5: 32
    };

    let platesSvg = "";
    let currentX = 65;

    platesResult.platesPerSide.forEach(p => {
      const h = plateHeights[p] || 50;
      const col = plateColors[p] || "#94a3b8";
      const y = 50 - h / 2;
      platesSvg += `
        <rect x="${currentX}" y="${y}" width="12" height="${h}" rx="2" fill="${col}" stroke="#0f172a" stroke-width="1.5" />
        <text x="${currentX + 6}" y="53" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">${p}</text>
      `;
      currentX += 14;
    });

    return `
      <div class="plate-calc-visual">
        <svg viewBox="0 0 280 100" class="barbell-svg" xmlns="http://www.w3.org/2000/svg">
          <!-- Barbell Shaft -->
          <rect x="10" y="46" width="50" height="8" rx="2" fill="#64748b" />
          <!-- Collar / Sleeve Stopper -->
          <rect x="56" y="32" width="8" height="36" rx="2" fill="#475569" stroke="#334155" />
          <!-- Sleeve -->
          <rect x="64" y="44" width="160" height="12" rx="2" fill="#94a3b8" />
          <!-- Loaded Plates -->
          ${platesSvg}
          <!-- Spring Collar Clamp -->
          <rect x="${currentX + 2}" y="40" width="6" height="20" rx="2" fill="#cbd5e1" />
        </svg>
        <div class="plate-breakdown-text">
          <strong>Each Side:</strong> ${platesResult.platesPerSide.length > 0 ? platesResult.platesPerSide.join(", ") + " lbs" : "Bar only"}
          ${platesResult.remainder > 0 ? `<br><small class="text-warning">(${platesResult.remainder} lbs remainder unmatchable)</small>` : ""}
        </div>
      </div>
    `;
  },

  // Scientific Ramp-Up Warm-Up Protocol
  generateWarmUpSets(workingWeight, workingReps = 8) {
    if (!workingWeight || workingWeight <= 45) {
      return [
        { set: 1, weight: 45, reps: 10, restSec: 45, note: "Bar only - joint lubrication & movement groove" }
      ];
    }

    const sets = [];
    // Set 1: Bar only
    sets.push({
      set: 1,
      weight: 45,
      reps: 10,
      pct: Math.round((45 / workingWeight) * 100),
      restSec: 45,
      note: "Joint mobility & motor pattern warmup"
    });

    // Set 2: ~50%
    if (workingWeight > 95) {
      const w50 = Math.round((workingWeight * 0.5) / 5) * 5;
      sets.push({
        set: 2,
        weight: w50,
        reps: 6,
        pct: 50,
        restSec: 60,
        note: "Moderate acceleration & groove check"
      });
    }

    // Set 3: ~70%
    if (workingWeight > 135) {
      const w70 = Math.round((workingWeight * 0.7) / 5) * 5;
      sets.push({
        set: 3,
        weight: w70,
        reps: 3,
        pct: 70,
        restSec: 75,
        note: "Fast concentric speed, no metabolic fatigue"
      });
    }

    // Set 4: ~85% (Neural Potentiation)
    if (workingWeight > 185) {
      const w85 = Math.round((workingWeight * 0.85) / 5) * 5;
      sets.push({
        set: sets.length + 1,
        weight: w85,
        reps: 1,
        pct: 85,
        restSec: 90,
        note: "Neural potentiation (PAP single)"
      });
    }

    return sets;
  },

  // Exercise Substitution Engine
  getSubstitutions(exerciseId) {
    const ex = EXERCISE_DATABASE[exerciseId];
    if (!ex || !ex.substitutes) return [];
    return ex.substitutes.map(subId => EXERCISE_DATABASE[subId]).filter(Boolean);
  }
};
