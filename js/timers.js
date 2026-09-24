// Audio-Synthesized Interactive Rest & Functional Interval Timers
// Supports Rest Countdown, Interval Milestones, EMOM, Tabata, and AMRAP

class WorkoutTimerManager {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.activeTimer = null;
    this.timerInterval = null;
    this.onTickCallbacks = [];
    this.onCompleteCallbacks = [];
  }

  // Lazy-initialize Web Audio API context on first user interaction (critical for iOS Safari)
  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  // Trigger mobile haptic vibration if supported (iOS / Android)
  triggerHaptic(pattern = 40) {
    try {
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(pattern);
      }
    } catch (e) {
      // Haptics not supported or permitted in iframe
    }
  }

  // Synthesize pleasant acoustic beeps/chimes without external audio assets
  playBeep(type = "tick") {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === "tick") {
        this.triggerHaptic(30);
        // Low soft woodblock tick
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === "warning") {
        this.triggerHaptic(60);
        // High alert pip (3, 2, 1)
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === "complete") {
        this.triggerHaptic([120, 80, 180]);
        // Rich celebratory double chime
        osc.type = "triangle";
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === "work") {
        this.triggerHaptic([100, 50, 100]);
        // High energetic start beep for Tabata/EMOM
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(1046.5, now); // C6
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.warn("Audio playback not supported or user did not interact yet:", e);
    }
  }

  // Start standard rest countdown timer
  startRestTimer(seconds, exerciseName = "") {
    this.stopTimer();
    this.initAudio();

    this.activeTimer = {
      type: "rest",
      totalSeconds: seconds,
      remaining: seconds,
      exerciseName: exerciseName,
      status: "running"
    };

    this.timerInterval = setInterval(() => {
      if (!this.activeTimer || this.activeTimer.status !== "running") return;

      this.activeTimer.remaining--;

      // Frequent interval acoustic indicators:
      // Beep at 30s milestone, 15s warning, and 3, 2, 1 countdown
      if (this.activeTimer.remaining === 30 || this.activeTimer.remaining === 15) {
        this.playBeep("warning");
      } else if (this.activeTimer.remaining <= 3 && this.activeTimer.remaining > 0) {
        this.playBeep("tick");
      }

      this.emitTick();

      if (this.activeTimer.remaining <= 0) {
        this.playBeep("complete");
        this.stopTimer();
        this.emitComplete();
      }
    }, 1000);

    this.emitTick();
  }

  // Start EMOM timer (Every Minute on the Minute)
  startEMOM(totalMinutes = 10, title = "EMOM Protocol") {
    this.stopTimer();
    this.initAudio();

    const totalSeconds = totalMinutes * 60;
    this.activeTimer = {
      type: "emom",
      totalMinutes: totalMinutes,
      currentMinute: 1,
      totalSeconds: totalSeconds,
      remainingInMinute: 60,
      totalRemaining: totalSeconds,
      title: title,
      status: "running"
    };

    this.playBeep("work");

    this.timerInterval = setInterval(() => {
      if (!this.activeTimer || this.activeTimer.status !== "running") return;

      this.activeTimer.remainingInMinute--;
      this.activeTimer.totalRemaining--;

      // Interval warnings for each minute
      if (this.activeTimer.remainingInMinute <= 3 && this.activeTimer.remainingInMinute > 0) {
        this.playBeep("warning");
      }

      if (this.activeTimer.remainingInMinute <= 0) {
        if (this.activeTimer.currentMinute < this.activeTimer.totalMinutes) {
          this.activeTimer.currentMinute++;
          this.activeTimer.remainingInMinute = 60;
          this.playBeep("work");
        } else {
          this.playBeep("complete");
          this.stopTimer();
          this.emitComplete();
          return;
        }
      }

      this.emitTick();
    }, 1000);

    this.emitTick();
  }

  // Start Tabata (e.g. 20s work / 10s rest x 8 rounds)
  startTabata(workSec = 20, restSec = 10, totalRounds = 8, title = "Tabata Functional Interval") {
    this.stopTimer();
    this.initAudio();

    this.activeTimer = {
      type: "tabata",
      workSec: workSec,
      restSec: restSec,
      totalRounds: totalRounds,
      currentRound: 1,
      phase: "work", // "work" or "rest"
      phaseRemaining: workSec,
      title: title,
      status: "running"
    };

    this.playBeep("work");

    this.timerInterval = setInterval(() => {
      if (!this.activeTimer || this.activeTimer.status !== "running") return;

      this.activeTimer.phaseRemaining--;

      if (this.activeTimer.phaseRemaining <= 3 && this.activeTimer.phaseRemaining > 0) {
        this.playBeep("warning");
      }

      if (this.activeTimer.phaseRemaining <= 0) {
        if (this.activeTimer.phase === "work") {
          // Switch to rest
          this.activeTimer.phase = "rest";
          this.activeTimer.phaseRemaining = this.activeTimer.restSec;
          this.playBeep("tick");
        } else {
          // Finished rest, check round
          if (this.activeTimer.currentRound < this.activeTimer.totalRounds) {
            this.activeTimer.currentRound++;
            this.activeTimer.phase = "work";
            this.activeTimer.phaseRemaining = this.activeTimer.workSec;
            this.playBeep("work");
          } else {
            this.playBeep("complete");
            this.stopTimer();
            this.emitComplete();
            return;
          }
        }
      }

      this.emitTick();
    }, 1000);

    this.emitTick();
  }

  // Start AMRAP timer (As Many Rounds As Possible)
  startAMRAP(durationMinutes = 12, title = "AMRAP Workout") {
    this.stopTimer();
    this.initAudio();

    const totalSec = durationMinutes * 60;
    this.activeTimer = {
      type: "amrap",
      durationMinutes: durationMinutes,
      totalSeconds: totalSec,
      remaining: totalSec,
      roundsCompleted: 0,
      title: title,
      status: "running"
    };

    this.playBeep("work");

    this.timerInterval = setInterval(() => {
      if (!this.activeTimer || this.activeTimer.status !== "running") return;

      this.activeTimer.remaining--;

      // Halfway notification
      if (this.activeTimer.remaining === Math.floor(totalSec / 2)) {
        this.playBeep("warning");
      } else if (this.activeTimer.remaining <= 5 && this.activeTimer.remaining > 0) {
        this.playBeep("warning");
      }

      if (this.activeTimer.remaining <= 0) {
        this.playBeep("complete");
        this.stopTimer();
        this.emitComplete();
        return;
      }

      this.emitTick();
    }, 1000);

    this.emitTick();
  }

  incrementAMRAPRound() {
    if (this.activeTimer && this.activeTimer.type === "amrap") {
      this.activeTimer.roundsCompleted++;
      this.playBeep("tick");
      this.emitTick();
    }
  }

  pauseResumeTimer() {
    if (!this.activeTimer) return;
    if (this.activeTimer.status === "running") {
      this.activeTimer.status = "paused";
    } else if (this.activeTimer.status === "paused") {
      this.activeTimer.status = "running";
    }
    this.emitTick();
  }

  addTime(seconds = 30) {
    if (!this.activeTimer) return;
    if (this.activeTimer.remaining !== undefined) {
      this.activeTimer.remaining += seconds;
      this.activeTimer.totalSeconds = Math.max(this.activeTimer.totalSeconds, this.activeTimer.remaining);
    } else if (this.activeTimer.remainingInMinute !== undefined) {
      this.activeTimer.remainingInMinute += seconds;
    } else if (this.activeTimer.phaseRemaining !== undefined) {
      this.activeTimer.phaseRemaining += seconds;
    }
    this.emitTick();
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.activeTimer = null;
    this.emitTick();
  }

  onTick(cb) {
    this.onTickCallbacks.push(cb);
  }

  onComplete(cb) {
    this.onCompleteCallbacks.push(cb);
  }

  emitTick() {
    this.onTickCallbacks.forEach(cb => cb(this.activeTimer));
  }

  emitComplete() {
    this.onCompleteCallbacks.forEach(cb => cb());
  }

  formatTime(totalSec) {
    if (totalSec == null || totalSec < 0) return "00:00";
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
}

// Global instance
const timerManager = new WorkoutTimerManager();
