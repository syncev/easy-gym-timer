'use strict';

// ── Audio ──────────────────────────────────────────────────────────────────
const ctx = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq = 880, dur = 0.08, vol = 0.4, type = 'sine') {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + dur);
}

function beepStart()  { beep(880, 0.07, 0.35); }
function beepPhase()  { beep(660, 0.07, 0.25); }
function beepRest()   { beep(440, 0.15, 0.3, 'triangle'); }
function beepDone()   { beep(1046, 0.2, 0.4); setTimeout(() => beep(1318, 0.3, 0.4), 220); }

// Rising pitch tick: flat low for counts >5, rising 440→880 for last 5
function beepCountdownTick(count) {
  beep(count > 5 ? 440 : 440 + (5 - count) * 110, 0.09, count > 5 ? 0.18 : 0.28);
}
// Ascending chord for "GO"
function beepCountdownGo() {
  beep(1046, 0.12, 0.45);
  setTimeout(() => beep(1318, 0.12, 0.45), 110);
  setTimeout(() => beep(1568, 0.22, 0.45), 220);
}
// Grave tone for each second of the excentric phase
function beepExcen() { beep(310, 0.13, 0.32, 'triangle'); }
// Soft bell at 20s remaining
function beepBell20() { beep(660, 0.7, 0.22, 'sine'); }
// Single warm bell at 15s remaining
function beepBell15() { beep(880, 0.8, 0.28, 'sine'); }
// Two-note bell at 10s remaining (more urgent)
function beepBell10() {
  beep(1046, 0.6, 0.3, 'sine');
  setTimeout(() => beep(1318, 0.6, 0.26, 'sine'), 250);
}
// Halfway reps: two ascending notes
function beepHalfReps() {
  beep(784, 0.12, 0.25, 'sine');
  setTimeout(() => beep(1047, 0.18, 0.3, 'sine'), 160);
}
// Last rep: two quick high pings (short, distinct from beepDone)
function beepLastRep() {
  beep(1760, 0.07, 0.3, 'sine');
  setTimeout(() => beep(1760, 0.07, 0.3, 'sine'), 120);
}

// ── DOM refs ───────────────────────────────────────────────────────────────
const panels = {
  config:  document.getElementById('config-panel'),
  workout: document.getElementById('workout-panel'),
  rest:    document.getElementById('rest-panel'),
  done:    document.getElementById('done-panel'),
};

const el = {
  numSeries:       document.getElementById('num-series'),
  numReps:         document.getElementById('num-reps'),
  restSeries:      document.getElementById('rest-series'),
  superRest:       document.getElementById('super-rest'),
  toggleSuper:     document.getElementById('toggle-super'),
  toggleFallo:     document.getElementById('toggle-fallo'),
  phaseConc:       document.getElementById('phase-conc'),
  phaseIsom:       document.getElementById('phase-isom'),
  phaseExcen:      document.getElementById('phase-excen'),
  phasePausa:      document.getElementById('phase-pausa'),
  phasePausa2:     document.getElementById('phase-pausa-2'),
  falloSeriesBtns: document.getElementById('fallo-series-btns'),
  btnStart:        document.getElementById('btn-start'),
  btnPlayPause:     document.getElementById('btn-play-pause'),
  btnPlayPauseRest: document.getElementById('btn-play-pause-rest'),
  btnSkip:         document.getElementById('btn-skip'),
  btnSkipRest:     document.getElementById('btn-skip-rest'),
  btnRestart:      document.getElementById('btn-restart'),
  btnBackWorkout:  document.getElementById('btn-back-workout'),
  btnBackRest:     document.getElementById('btn-back-rest'),
  statusSerie:     document.getElementById('status-serie'),
  statusRep:       document.getElementById('status-rep'),
  statusPhase:     document.getElementById('status-phase-name'),
  circleTrack:     document.getElementById('circle-track'),
  circleFill:      document.getElementById('circle-fill'),
  circleText:      document.getElementById('circle-timer'),
  restCountdown:   document.getElementById('rest-countdown'),
  restBar:         document.getElementById('rest-bar'),
  restLabel:       document.getElementById('rest-label'),
  falloCounter:         document.getElementById('fallo-counter'),
  falloCount:           document.getElementById('fallo-count'),
  doneFallo:            document.getElementById('done-fallo'),
  doneFalloList:        document.getElementById('done-fallo-list'),
  restToast:            document.getElementById('rest-toast'),
  restToastTime:        document.getElementById('rest-toast-time'),
  restToastBar:         document.getElementById('rest-toast-bar'),
  restToastClose:       document.getElementById('rest-toast-close'),
  doneRestCustomWrap:   document.getElementById('done-rest-custom'),
  doneRestCustomInput:  document.getElementById('done-rest-custom-input'),
  toggleRepsDistintas:  document.getElementById('toggle-reps-distintas'),
  numReps2:             document.getElementById('num-reps-2'),
  repsDistintasGroup:   document.getElementById('reps-distintas-group'),
  repsBGroup:           document.getElementById('reps-b-group'),
  repsALabel:           document.getElementById('reps-a-label'),
  toggleFasesDistintas: document.getElementById('toggle-fases-distintas'),
  fasesDistintasGroup:  document.getElementById('fases-distintas-group'),
  phasesSet2:           document.getElementById('phases-set-2'),
  phasesEj1Label:       document.getElementById('phases-ej1-label'),
  phaseConc2:           document.getElementById('phase-conc-2'),
  phaseIsom2:           document.getElementById('phase-isom-2'),
  phaseExcen2:          document.getElementById('phase-excen-2'),
  toggleInvert1:        document.getElementById('toggle-invert-1'),
  toggleInvert2:        document.getElementById('toggle-invert-2'),
};

// ── Module-level state ─────────────────────────────────────────────────────
let cfg = {};
let state = {};
let ticker = null;
let restTicker = null;
let countdownTimer = null;
let restDoneTimer = null;
let wakeLock = null;

// Keys of series that are "al fallo" — "N" (no super) or "N-1"/"N-2" (super)
let falloSeriesSet = new Set();

let selectedRestSecs = null;
let restAfterTicker  = null;

// ── Circle ─────────────────────────────────────────────────────────────────
const R_MAX = 120;

const PHASE_COLORS = {
  conc:  '#00e676',
  isom:  '#4fc3f7',
  excen: '#ff6d00',
  pausa: '#888899',
};

function setCircle(phase, progress) {
  let r;
  if      (phase === 'conc')  r = R_MAX * progress;
  else if (phase === 'isom')  r = R_MAX;
  else if (phase === 'excen') r = R_MAX * (1 - progress);
  else                        r = 0;

  el.circleFill.setAttribute('r', r.toFixed(1));
  el.circleFill.style.fill = PHASE_COLORS[phase];
  el.circleTrack.style.stroke = PHASE_COLORS[phase];
}

// ── Wake lock ──────────────────────────────────────────────────────────────
async function acquireWakeLock() {
  if ('wakeLock' in navigator) {
    try { wakeLock = await navigator.wakeLock.request('screen'); } catch (_) {}
  }
}
function releaseWakeLock() {
  if (wakeLock) { wakeLock.release(); wakeLock = null; }
}

// ── Panel switch ───────────────────────────────────────────────────────────
function showPanel(name) {
  Object.values(panels).forEach(p => p.classList.add('hidden'));
  panels[name].classList.remove('hidden');
}

// ── Pause helper ───────────────────────────────────────────────────────────
function setPaused(val) {
  state.paused = val;
  const icon = val ? '▶' : '⏸';
  el.btnPlayPause.textContent = icon;
  el.btnPlayPauseRest.textContent = icon;
}

function freezeRestBar() {
  const currentWidth = getComputedStyle(el.restBar).width;
  el.restBar.style.transition = 'none';
  el.restBar.style.width = currentWidth;
}

function resumeRestBar() {
  const rem = parseInt(el.restCountdown.textContent) || 0;
  requestAnimationFrame(() => {
    el.restBar.style.transition = `width ${rem}s linear`;
    el.restBar.style.width = '0%';
  });
}

// ── Countdown before workout ───────────────────────────────────────────────
function startCountdown(onComplete) {
  let count = 10;
  el.statusPhase.textContent = 'Preparate...';
  const updateCircle = (c) => {
    const r = R_MAX * ((10 - c) / 10);
    el.circleFill.setAttribute('r', r.toFixed(1));
    el.circleFill.style.fill = '#888899';
    el.circleTrack.style.stroke = '#888899';
    el.circleText.textContent = c;
  };
  updateCircle(count);
  beepCountdownTick(count);

  countdownTimer = setInterval(() => {
    if (state.paused) return;
    count--;
    if (count > 0) {
      updateCircle(count);
      beepCountdownTick(count);
    } else {
      el.circleFill.setAttribute('r', R_MAX);
      el.circleText.textContent = '¡YA!';
      beepCountdownGo();
      clearInterval(countdownTimer);
      // Store the post-GO delay so goToConfig / skip can cancel it
      countdownTimer = setTimeout(() => { countdownTimer = null; onComplete(); }, 500);
    }
  }, 1000);
}

// ── Go back to config ──────────────────────────────────────────────────────
function goToConfig() {
  // Cancel all pending timers — clearInterval/clearTimeout both work on either ID type
  clearInterval(countdownTimer);
  clearTimeout(countdownTimer);
  countdownTimer = null;
  stopTicker();
  clearInterval(restTicker);
  clearTimeout(restDoneTimer);
  restDoneTimer = null;
  releaseWakeLock();
  setPaused(false);
  showPanel('config');
}

el.btnBackWorkout.addEventListener('click', goToConfig);
el.btnBackRest.addEventListener('click', goToConfig);

// ── Config read ────────────────────────────────────────────────────────────
function readConfig() {
  return {
    totalSeries:   parseInt(el.numSeries.value)   || 4,
    totalReps:     parseInt(el.numReps.value)     || 10,
    falloSeries:   new Set(falloSeriesSet),
    restSeries:    parseInt(el.restSeries.value)  || 90,
    superEnabled:  el.toggleSuper.checked,
    superRest:     parseInt(el.superRest.value)   || 20,
    phaseConc:     Math.max(0.5, parseFloat(el.phaseConc.value)  || 1),
    phaseIsom:     Math.max(0,   parseFloat(el.phaseIsom.value)  || 0),
    phaseExcen:    Math.max(0.5, parseFloat(el.phaseExcen.value) || 3),
    phasePausa:     Math.max(0,   parseFloat(el.phasePausa.value)  || 0),
    phasePausa2:    Math.max(0,   parseFloat(el.phasePausa2.value) || 0),
    repsDistintas:  el.toggleRepsDistintas.checked,
    totalReps2:     parseInt(el.numReps2.value) || 10,
    fasesDistintas: el.toggleFasesDistintas.checked,
    phaseConc2:     Math.max(0.5, parseFloat(el.phaseConc2.value)  || 1),
    phaseIsom2:     Math.max(0,   parseFloat(el.phaseIsom2.value)  || 0),
    phaseExcen2:    Math.max(0.5, parseFloat(el.phaseExcen2.value) || 3),
    invertPhases1:  el.toggleInvert1.checked,
    invertPhases2:  el.toggleInvert2.checked,
  };
}

// ── Al fallo helpers ───────────────────────────────────────────────────────
function falloKey() {
  return cfg.superEnabled
    ? `${state.serie}-${state.superExercise}`
    : `${state.serie}`;
}

function isCurrentSeriFallo() {
  return cfg.falloSeries.has(falloKey());
}

function formatFalloKey(key) {
  if (key.includes('-')) {
    const [serie, ex] = key.split('-');
    return `Serie ${serie}${ex === '1' ? 'A' : 'B'}`;
  }
  return `Serie ${key}`;
}

function getTotalReps() {
  if (cfg.superEnabled && cfg.repsDistintas && state.superExercise === 2) return cfg.totalReps2;
  return cfg.totalReps;
}

// Syncs the counter element and shows/hides it for the current serie
function updateFalloCounterVisibility() {
  const isFallo = isCurrentSeriFallo();
  el.falloCounter.classList.toggle('hidden', !isFallo);
  if (isFallo) el.falloCount.textContent = state.falloRepsThisSerie;
}

// ── Phase helpers ──────────────────────────────────────────────────────────
const PHASE_NAMES = { conc: 'Contraer', isom: 'Mantener', excen: 'Bajar', pausa: 'Pausa' };

function isInvertPhases() {
  if (cfg.superEnabled && cfg.fasesDistintas && state.superExercise === 2) return cfg.invertPhases2;
  return cfg.invertPhases1;
}

function isPausaEnabled() {
  const useB = cfg.superEnabled && cfg.fasesDistintas && state.superExercise === 2;
  return (useB ? cfg.phasePausa2 : cfg.phasePausa) > 0;
}

function getPhaseOrder() {
  const useB     = cfg.superEnabled && cfg.fasesDistintas && state.superExercise === 2;
  const hasIsom  = (useB ? cfg.phaseIsom2 : cfg.phaseIsom) > 0;
  const hasPausa = isPausaEnabled();
  if (isInvertPhases()) {
    // Excen. → Pausa → Concen. → Isom.  (Isom always follows Concen)
    const phases = ['excen'];
    if (hasPausa) phases.push('pausa');
    phases.push('conc');
    if (hasIsom) phases.push('isom');
    return phases;
  }
  // Concen. → Isom. → Excen. → Pausa
  const phases = ['conc'];
  if (hasIsom) phases.push('isom');
  phases.push('excen');
  if (hasPausa) phases.push('pausa');
  return phases;
}

function phaseDuration(ph) {
  const useB = cfg.superEnabled && cfg.fasesDistintas && state.superExercise === 2;
  return {
    conc:  useB ? cfg.phaseConc2  : cfg.phaseConc,
    isom:  useB ? cfg.phaseIsom2  : cfg.phaseIsom,
    excen: useB ? cfg.phaseExcen2 : cfg.phaseExcen,
    pausa: useB ? cfg.phasePausa2 : cfg.phasePausa,
  }[ph];
}

// ── START ──────────────────────────────────────────────────────────────────
el.btnStart.addEventListener('click', () => {
  dismissRestToast();
  if (ctx.state === 'suspended') ctx.resume();
  cfg = readConfig();
  state = {
    serie: 1,
    rep: 1,
    phase: 'conc',
    elapsed: 0,
    paused: false,
    resting: false,
    superResting: false,
    superExercise: 1,
    falloRepsThisSerie: 0,   // reps in current serie (resets each serie)
    falloRepsPerSerie:  {},  // { key: count } recorded when each fallo serie ends
  };
  acquireWakeLock();
  showPanel('workout');
  updateStatusBar();
  el.falloCount.textContent = '0';
  updateFalloCounterVisibility();
  startCountdown(() => {
    startPhase(getPhaseOrder()[0]);
    startTicker();
  });
});

// ── Ticker ─────────────────────────────────────────────────────────────────
function startTicker() {
  clearInterval(ticker);
  let lastTime = performance.now();
  ticker = setInterval(() => {
    const now = performance.now();
    if (!state.paused) {
      state.elapsed += (now - lastTime) / 1000;
      onTick();
    }
    lastTime = now;
  }, 50);
}

function stopTicker() { clearInterval(ticker); ticker = null; }

// ── Phase logic ────────────────────────────────────────────────────────────
function startPhase(ph) {
  state.phase = ph;
  state.elapsed = 0;
  state.lastFloorSecond = 0;
  el.statusPhase.textContent = PHASE_NAMES[ph];
  setCircle(ph, 0);
  if      (ph === 'conc')  beepStart();
  else if (ph === 'excen') beepExcen();
  else                     beepPhase();
}

function onTick() {
  const dur = phaseDuration(state.phase);
  const progress = Math.min(state.elapsed / dur, 1);
  setCircle(state.phase, progress);
  el.circleText.textContent = Math.max(0, dur - state.elapsed).toFixed(2);

  if (state.phase === 'excen' && state.elapsed < dur) {
    const floorSec = Math.floor(state.elapsed);
    if (floorSec > state.lastFloorSecond) {
      state.lastFloorSecond = floorSec;
      beepExcen();
    }
  }

  if (state.elapsed >= dur) advancePhase();
}

function advancePhase() {
  const order = getPhaseOrder();
  const idx = order.indexOf(state.phase);
  if (idx < order.length - 1) {
    startPhase(order[idx + 1]);
  } else {
    repDone();
  }
}

// ── Rep done ───────────────────────────────────────────────────────────────
function repDone() {
  const fallo = isCurrentSeriFallo();
  const isLastRep = !fallo && state.rep >= getTotalReps();
  if (isLastRep) {
    serieDone();
  } else {
    if (fallo) {
      state.falloRepsThisSerie++;
      el.falloCount.textContent = state.falloRepsThisSerie;
    }
    state.rep++;
    updateStatusBar();
    if (!fallo) {
      const total = getTotalReps();
      const half  = Math.floor(total / 2) + 1;
      if (state.rep === total)                  beepLastRep();
      else if (state.rep === half && half < total) beepHalfReps();
    }
    startPhase(getPhaseOrder()[0]);
  }
}

// ── Serie done ─────────────────────────────────────────────────────────────
function serieDone() {
  // Persist fallo reps for the exercise just completed
  if (isCurrentSeriFallo() && state.falloRepsThisSerie > 0) {
    state.falloRepsPerSerie[falloKey()] = state.falloRepsThisSerie;
  }
  state.falloRepsThisSerie = 0;

  beepDone();
  if (cfg.superEnabled && state.superExercise === 1) {
    startSuperRest();
  } else {
    state.superExercise = 1;
    endSerie();
  }
}

function endSerie() {
  if (state.serie >= cfg.totalSeries) {
    finishWorkout();
  } else {
    startRest(cfg.restSeries);
  }
}

// ── Super rest ─────────────────────────────────────────────────────────────
function startSuperRest() {
  state.superResting = true;
  state.superExercise = 2;
  stopTicker();
  showPanel('rest');
  el.restLabel.textContent = 'Superserie';
  el.restCountdown.textContent = cfg.superRest;
  el.restBar.style.transition = 'none';
  el.restBar.style.width = '100%';
  startRestTicker(cfg.superRest, () => {
    state.superResting = false;
    state.rep = 1;
    setPaused(false);
    updateStatusBar();
    updateFalloCounterVisibility();
    showPanel('workout');
    startPhase(getPhaseOrder()[0]);
    startTicker();
  });
}

// ── Rest between series ────────────────────────────────────────────────────
function startRest(seconds) {
  state.resting = true;
  stopTicker();
  showPanel('rest');
  el.restLabel.textContent = 'Descanso';
  el.restCountdown.textContent = seconds;
  el.restBar.style.transition = 'none';
  el.restBar.style.width = '100%';
  startRestTicker(seconds, () => {
    state.resting = false;
    state.serie++;
    state.rep = 1;
    state.superExercise = 1;
    setPaused(false);
    updateStatusBar();
    updateFalloCounterVisibility();
    showPanel('workout');
    startPhase(getPhaseOrder()[0]);
    startTicker();
  });
}

function startRestTicker(total, onComplete) {
  clearInterval(restTicker);
  let remaining = total;
  requestAnimationFrame(() => {
    el.restBar.style.transition = `width ${total}s linear`;
    el.restBar.style.width = '0%';
  });
  beepRest();
  restTicker = setInterval(() => {
    if (state.paused) return;
    remaining--;
    el.restCountdown.textContent = Math.max(0, remaining);
    if (remaining === 15) beepBell15();
    if (remaining === 10) beepBell10();
    // Ascending tones 5→1 (low→high), same direction as initial countdown
    if (remaining >= 1 && remaining <= 5) beepCountdownTick(remaining);
    if (remaining <= 0) {
      clearInterval(restTicker);
      // Play the same GO chord as the initial countdown, then start the serie
      // after a short gap so the chord doesn't overlap with beepStart
      beepCountdownGo();
      restDoneTimer = setTimeout(() => {
        restDoneTimer = null;
        onComplete();
      }, 600);
    }
  }, 1000);
}

// ── Skip serie ─────────────────────────────────────────────────────────────
el.btnSkip.addEventListener('click', () => {
  // Cancel any pending countdown or rest-done timers before advancing
  clearInterval(countdownTimer);
  clearTimeout(countdownTimer);
  countdownTimer = null;
  clearTimeout(restDoneTimer);
  restDoneTimer = null;
  stopTicker();
  setPaused(false);
  serieDone();
});

// ── Skip rest ─────────────────────────────────────────────────────────────
el.btnSkipRest.addEventListener('click', () => {
  clearInterval(restTicker);
  clearTimeout(restDoneTimer);
  restDoneTimer = null;
  setPaused(false);
  if (state.superResting) {
    state.superResting = false;
    state.rep = 1;
    updateStatusBar();
    updateFalloCounterVisibility();
    showPanel('workout');
    startPhase(getPhaseOrder()[0]);
    startTicker();
  } else {
    state.resting = false;
    state.serie++;
    state.rep = 1;
    state.superExercise = 1;
    updateStatusBar();
    updateFalloCounterVisibility();
    showPanel('workout');
    startPhase(getPhaseOrder()[0]);
    startTicker();
  }
});

// ── Play / Pause ───────────────────────────────────────────────────────────
function handlePlayPause() {
  setPaused(!state.paused);
  if (state.resting || state.superResting) {
    if (state.paused) freezeRestBar();
    else resumeRestBar();
  }
}
el.btnPlayPause.addEventListener('click', handlePlayPause);
el.btnPlayPauseRest.addEventListener('click', handlePlayPause);

// ── Rest-between-sessions toast ────────────────────────────────────────────
function startRestToast(seconds) {
  clearInterval(restAfterTicker);
  let remaining = seconds;
  el.restToastTime.textContent = remaining;
  el.restToastBar.style.transition = 'none';
  el.restToastBar.style.width = '100%';
  el.restToast.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.restToast.classList.add('visible');
    el.restToastBar.style.transition = `width ${seconds}s linear`;
    el.restToastBar.style.width = '0%';
  }));
  restAfterTicker = setInterval(() => {
    remaining--;
    el.restToastTime.textContent = Math.max(0, remaining);
    if (remaining === 20) beepBell20();
    if (remaining === 15) beepBell15();
    if (remaining === 10) beepBell10();
    if (remaining >= 1 && remaining <= 5) beepCountdownTick(remaining);
    if (remaining <= 0) {
      clearInterval(restAfterTicker);
      beepCountdownGo();
      setTimeout(dismissRestToast, 600);
    }
  }, 1000);
}

function dismissRestToast() {
  clearInterval(restAfterTicker);
  el.restToast.classList.remove('visible');
  setTimeout(() => el.restToast.classList.add('hidden'), 400);
}

el.restToastClose.addEventListener('click', dismissRestToast);

// ── Finish ─────────────────────────────────────────────────────────────────
function finishWorkout() {
  stopTicker();
  clearInterval(restTicker);
  releaseWakeLock();
  beepDone();

  const entries = Object.entries(state.falloRepsPerSerie);
  el.doneFallo.classList.toggle('hidden', entries.length === 0);
  if (entries.length > 0) {
    el.doneFalloList.innerHTML = entries
      .map(([key, reps]) =>
        `<div class="done-fallo-entry">
           <span class="entry-label">${formatFalloKey(key)}</span>
           <span class="entry-reps">${reps} reps</span>
         </div>`)
      .join('');
  }

  showPanel('done');
}

el.btnRestart.addEventListener('click', () => {
  if (selectedRestSecs !== null) startRestToast(selectedRestSecs);
  selectedRestSecs = null;
  document.querySelectorAll('.rest-preset-btn').forEach(b => b.classList.remove('active'));
  el.doneRestCustomWrap.classList.add('hidden');
  showPanel('config');
});

// ── Status bar ─────────────────────────────────────────────────────────────
function updateStatusBar() {
  let serieText = `Serie ${state.serie}/${cfg.totalSeries}`;
  if (cfg.superEnabled) serieText += state.superExercise === 1 ? ' - A' : ' - B';
  el.statusSerie.textContent = serieText;
  el.statusRep.textContent = isCurrentSeriFallo()
    ? `Rep ${state.rep}/∞`
    : `Rep ${state.rep}/${getTotalReps()}`;
}

// ── Al fallo series UI ─────────────────────────────────────────────────────
function updateFalloSeriesUI() {
  const total = parseInt(el.numSeries.value) || 4;
  const superOn = el.toggleSuper.checked;
  el.falloSeriesBtns.innerHTML = '';

  const validKeys = new Set();
  for (let i = 1; i <= total; i++) {
    if (superOn) { validKeys.add(`${i}-1`); validKeys.add(`${i}-2`); }
    else           validKeys.add(`${i}`);
  }
  for (const k of [...falloSeriesSet]) {
    if (!validKeys.has(k)) falloSeriesSet.delete(k);
  }

  for (let i = 1; i <= total; i++) {
    if (superOn) {
      el.falloSeriesBtns.appendChild(createFalloBtn(`${i}A`, `${i}-1`));
      el.falloSeriesBtns.appendChild(createFalloBtn(`${i}B`, `${i}-2`));
    } else {
      el.falloSeriesBtns.appendChild(createFalloBtn(`${i}`, `${i}`));
    }
  }
}

function createFalloBtn(label, key) {
  const btn = document.createElement('button');
  btn.className = 'fallo-serie-btn' + (falloSeriesSet.has(key) ? ' active' : '');
  btn.textContent = label;
  btn.addEventListener('click', () => {
    if (falloSeriesSet.has(key)) {
      falloSeriesSet.delete(key);
      btn.classList.remove('active');
    } else {
      falloSeriesSet.add(key);
      btn.classList.add('active');
    }
  });
  return btn;
}

// ── Animation helpers ──────────────────────────────────────────────────────
function setVisible(element, show, onHidden) {
  if (show) {
    element.classList.remove('is-hiding', 'hidden');
  } else {
    if (element.classList.contains('hidden') || element.classList.contains('is-hiding')) return;
    element.classList.add('is-hiding');
    element.addEventListener('animationend', () => {
      element.classList.remove('is-hiding');
      element.classList.add('hidden');
      if (onHidden) onHidden();
    }, { once: true });
  }
}

function flipReorder(phasesEl, applyFn) {
  const items = Array.from(phasesEl.querySelectorAll('.phase-item'));
  const before = items.map(item => item.getBoundingClientRect().left);
  applyFn();
  items.forEach((item, i) => {
    const dx = before[i] - item.getBoundingClientRect().left;
    if (Math.abs(dx) < 1) return;
    item.style.transition = 'none';
    item.style.transform = `translateX(${dx}px)`;
  });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    items.forEach(item => {
      item.style.transition = 'transform 0.25s ease';
      item.style.transform = '';
    });
  }));
}

// ── Toggle: Al fallo ───────────────────────────────────────────────────────
el.toggleFallo.addEventListener('change', () => {
  const on = el.toggleFallo.checked;
  if (on) {
    updateFalloSeriesUI();
    setVisible(el.falloSeriesBtns, true);
  } else {
    setVisible(el.falloSeriesBtns, false, () => {
      falloSeriesSet.clear();
      el.falloSeriesBtns.innerHTML = '';
    });
  }
});

// ── Toggle: Superserie ─────────────────────────────────────────────────────
el.toggleSuper.addEventListener('change', () => {
  const on = el.toggleSuper.checked;
  el.superRest.disabled = !on;
  el.superRest.style.opacity = on ? '1' : '0.4';
  setVisible(el.fasesDistintasGroup, on);
  setVisible(el.repsDistintasGroup, on);
  if (!on) {
    el.toggleFasesDistintas.checked = false;
    setVisible(el.phasesSet2, false);
    setVisible(el.phasesEj1Label, false);
    el.toggleRepsDistintas.checked = false;
    setVisible(el.repsBGroup, false);
    setVisible(el.repsALabel, false);
  }
  if (el.toggleFallo.checked) {
    falloSeriesSet.clear();
    updateFalloSeriesUI();
  }
});

// ── Toggle: Invertir fases (FLIP animation) ───────────────────────────────
el.toggleInvert1.addEventListener('change', () => {
  const phases = document.querySelector('#phases-set-1 .phases');
  flipReorder(phases, () => phases.classList.toggle('inverted', el.toggleInvert1.checked));
});
el.toggleInvert2.addEventListener('change', () => {
  const phases = document.querySelector('#phases-set-2 .phases');
  flipReorder(phases, () => phases.classList.toggle('inverted', el.toggleInvert2.checked));
});

// ── Toggle: Fases distintas ────────────────────────────────────────────────
el.toggleFasesDistintas.addEventListener('change', () => {
  const on = el.toggleFasesDistintas.checked;
  setVisible(el.phasesSet2, on);
  setVisible(el.phasesEj1Label, on);
});

// ── Toggle: Reps distintas ─────────────────────────────────────────────────
el.toggleRepsDistintas.addEventListener('change', () => {
  const on = el.toggleRepsDistintas.checked;
  setVisible(el.repsBGroup, on);
  setVisible(el.repsALabel, on);
});

// ── Num-series → refresh fallo buttons ────────────────────────────────────
el.numSeries.addEventListener('input', () => {
  if (el.toggleFallo.checked) updateFalloSeriesUI();
});

// ── Init disabled states ───────────────────────────────────────────────────
el.superRest.style.opacity = '0.4';

// ── Rest presets (done panel) ──────────────────────────────────────────────
document.querySelectorAll('.rest-preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const isActive = btn.classList.contains('active');
    document.querySelectorAll('.rest-preset-btn').forEach(b => b.classList.remove('active'));
    el.doneRestCustomWrap.classList.add('hidden');
    if (isActive) {
      selectedRestSecs = null;
    } else {
      btn.classList.add('active');
      const sec = parseInt(btn.dataset.sec);
      if (sec === 0) {
        el.doneRestCustomWrap.classList.remove('hidden');
        selectedRestSecs = parseInt(el.doneRestCustomInput.value) || 120;
      } else {
        selectedRestSecs = sec;
      }
    }
  });
});

el.doneRestCustomInput.addEventListener('input', () => {
  selectedRestSecs = parseInt(el.doneRestCustomInput.value) || null;
});

// ── Adaptive height (split-view detection) ────────────────────────────────
function updateLayout() {
  const h = window.innerHeight;
  document.documentElement.style.setProperty('--vh', h + 'px');
  document.documentElement.classList.toggle('compact', h / window.screen.height < 0.65 || h < 500);
}
window.addEventListener('resize', updateLayout);
window.visualViewport?.addEventListener('resize', updateLayout);
updateLayout();
