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
  preview: document.getElementById('preview-panel'),
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
  weightsList:     document.getElementById('weights-list'),
  btnStart:        document.getElementById('btn-start'),
  btnPlayPause:     document.getElementById('btn-play-pause'),
  btnPlayPauseRest: document.getElementById('btn-play-pause-rest'),
  btnSkip:         document.getElementById('btn-skip'),
  btnSkipLabel:    document.getElementById('btn-skip-label'),
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
  restToastLabel:       document.getElementById('rest-toast-label'),
  restToastTime:        document.getElementById('rest-toast-time'),
  restToastBar:         document.getElementById('rest-toast-bar'),
  restToastBarWrap:     document.getElementById('rest-toast-bar-wrap'),
  restToastClose:       document.getElementById('rest-toast-close'),
  restToastInfo:        document.getElementById('rest-toast-info'),
  restToastCustom:      document.getElementById('rest-toast-custom'),
  restToastCustomInput: document.getElementById('rest-toast-custom-input'),
  restToastCustomStart: document.getElementById('rest-toast-custom-start'),
  quickRestRow:            document.getElementById('quick-rest-row'),
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
  btnSaveExercise:      document.getElementById('btn-save-exercise'),
  exercisesList:        document.getElementById('exercises-list'),
  exercisesEmpty:       document.getElementById('exercises-empty'),
  btnExportExercises:   document.getElementById('btn-export-exercises'),
  btnImportExercises:   document.getElementById('btn-import-exercises'),
  importExercisesInput: document.getElementById('import-exercises-input'),
  btnMergeExercises:    document.getElementById('btn-merge-exercises'),
  btnMergeCancel:       document.getElementById('btn-merge-cancel'),
  btnMergeConfirm:      document.getElementById('btn-merge-confirm'),
  saveExerciseModal:    document.getElementById('save-exercise-modal'),
  saveExerciseBackdrop: document.getElementById('save-exercise-backdrop'),
  saveExerciseNameInput: document.getElementById('save-exercise-name-input'),
  saveExerciseNameSuper: document.getElementById('save-exercise-name-super'),
  saveExerciseNameAInput: document.getElementById('save-exercise-name-a-input'),
  saveExerciseNameBInput: document.getElementById('save-exercise-name-b-input'),
  saveExerciseCancel:   document.getElementById('save-exercise-cancel'),
  saveExerciseConfirm:  document.getElementById('save-exercise-confirm'),
  seriesModule:         document.getElementById('series-module'),
  seriesModuleBody:     document.getElementById('series-module-body'),
  seriesCollapseBtn:    document.getElementById('series-collapse-btn'),
  actionsStack:         document.getElementById('actions-stack'),
  seriesEditingLabel:   document.getElementById('series-editing-label'),
  seriesEditingNames:   document.getElementById('series-editing-names'),
  seriesModuleShine:    document.getElementById('series-module-shine'),
  renameExerciseModal:    document.getElementById('rename-exercise-modal'),
  renameExerciseBackdrop: document.getElementById('rename-exercise-backdrop'),
  renameExerciseInput:    document.getElementById('rename-exercise-input'),
  renameExerciseCancel:   document.getElementById('rename-exercise-cancel'),
  renameExerciseConfirm:  document.getElementById('rename-exercise-confirm'),
  btnBackPreview:     document.getElementById('btn-back-preview'),
  previewTitles:      document.getElementById('preview-titles'),
  previewSuperRow:    document.getElementById('preview-super-row'),
  previewSuperValue:  document.getElementById('preview-super-value'),
  previewSeriesReps:  document.getElementById('preview-series-reps'),
  previewFalloRow:    document.getElementById('preview-fallo-row'),
  previewFalloTags:   document.getElementById('preview-fallo-tags'),
  previewWeightsRow:  document.getElementById('preview-weights-row'),
  previewWeightsList: document.getElementById('preview-weights-list'),
  previewRestSeries:  document.getElementById('preview-rest-series'),
  previewPhasesRow:   document.getElementById('preview-phases-row'),
  btnPreviewEdit:     document.getElementById('btn-preview-edit'),
  btnPreviewStart:    document.getElementById('btn-preview-start'),
  previewSeriesModule: document.getElementById('preview-series-module'),
  previewActions:      document.getElementById('preview-actions'),
  previewEditSlot:     document.getElementById('preview-edit-slot'),
  exercisesRow:        document.getElementById('exercises-row'),
  intensityRegister:   document.getElementById('intensity-register'),
  intensitySections:   document.getElementById('intensity-sections'),
  intensityConfirm:    document.getElementById('intensity-confirm'),
  previewIntensityRowA:   document.getElementById('preview-intensity-row-a'),
  previewIntensityLabelA: document.getElementById('preview-intensity-label-a'),
  previewIntensityListA:  document.getElementById('preview-intensity-list-a'),
  previewIntensityRowB:   document.getElementById('preview-intensity-row-b'),
  previewIntensityLabelB: document.getElementById('preview-intensity-label-b'),
  previewIntensityListB:  document.getElementById('preview-intensity-list-b'),
  previewIntensityLegend: document.getElementById('preview-intensity-legend'),
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

// Weight (Kg) per serie — "N" (no super) or "N-1"/"N-2" (super), same key scheme as falloSeriesSet
let weightsMap = new Map();

let selectedRestSecs = null;
let restAfterTicker  = null;

// Toast mode: null (hidden) | 'standalone' (optional rest, own ticker) | 'linked' (minimized workout rest)
let toastMode = null;

// ── Saved exercises (localStorage) ──────────────────────────────────────────
const EXERCISES_KEY = 'gym-timer-exercises';

function loadExercises() {
  try {
    const raw = JSON.parse(localStorage.getItem(EXERCISES_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch (_) {
    return [];
  }
}
function saveExercises() {
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
}

// ── Export / Import (backup outside localStorage) ───────────────────────────
function exportExercises() {
  const blob = new Blob([JSON.stringify(exercises, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gym-timer-ejercicios-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importExercisesFromFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let imported;
    try {
      imported = JSON.parse(reader.result);
    } catch (_) {
      alert('El archivo no es un JSON válido.');
      return;
    }
    if (!Array.isArray(imported)) {
      alert('El archivo no tiene el formato esperado.');
      return;
    }
    if (!confirm(`Se van a reemplazar los ${exercises.length} ejercicios actuales por los ${imported.length} del archivo. ¿Continuar?`)) {
      return;
    }
    exercises = imported;
    saveExercises();
    renderExercisesList();
  };
  reader.readAsText(file);
}

el.btnExportExercises.addEventListener('click', exportExercises);
el.btnImportExercises.addEventListener('click', () => el.importExercisesInput.click());
el.importExercisesInput.addEventListener('change', () => {
  const file = el.importExercisesInput.files[0];
  el.importExercisesInput.value = '';
  if (file) importExercisesFromFile(file);
});

let exercises = loadExercises();
let editingExerciseId = null;
// True only while the user is actively in "editing a saved exercise" mode
// (entered via the ✎ button) — separate from editingExerciseId, which also
// gets set right after saving a brand-new exercise (so a second Guardar
// overwrites instead of duplicating) without that implying "edit mode".
let isEditingExercise = false;

// Which saved exercise is shown on the read-only preview screen (Play button)
let previewingExerciseId = null;
// True while the real, editable Series module has been moved into the
// preview screen (Editar tapped from there) instead of living in #config-panel
let inlineEditFromPreview = false;

// Merge-two-exercises-into-a-superserie selection mode
let mergeSelectMode = false;
let mergeSelection = []; // up to 2 exercise ids

// Which saved exercise the currently running (or just-finished) workout came
// from, if any — set by startWorkout(), read once by finishWorkout() to
// decide whether "Registrar intensidad" applies.
let activeSourceExerciseId = null;

// ── Intensity tracking ───────────────────────────────────────────────────
const FEELING_OPTIONS = [
  { key: 'muy-bien',   icon: 'icons/feeling-muy-bien.png',   label: 'Muy bien' },
  { key: 'bien',       icon: 'icons/feeling-bien.png',       label: 'Bien' },
  { key: 'justo',      icon: 'icons/feeling-justo.png',      label: 'Justo' },
  { key: 'faltaron-2', icon: 'icons/feeling-faltaron-2.png', label: 'Faltaron ≤ 2' },
  { key: 'faltaron-4', icon: 'icons/feeling-faltaron-4.png', label: 'Faltaron ≤ 4' },
  { key: 'faltaron-5', icon: 'icons/feeling-faltaron-5.png', label: 'Faltaron ≥ 5' },
];
let pendingIntensitySelections = {};

function makeExerciseId() {
  return (crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

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

// ── Countdown before workout (also reused as the post-skip grace period) ───
function startCountdown(seconds, onComplete) {
  let count = seconds;
  el.statusPhase.textContent = 'Preparate...';
  el.btnSkipLabel.textContent = 'Skip Intro';
  const updateCircle = (c) => {
    const r = R_MAX * ((seconds - c) / seconds);
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
      countdownTimer = setTimeout(() => {
        countdownTimer = null;
        el.btnSkipLabel.textContent = 'Skip serie';
        onComplete();
      }, 500);
    }
  }, 1000);
}

// 3s grace period before actually starting reps — used both when skipping
// rest and when skipping the initial 10s intro countdown, so the user always
// gets a moment to put the phone down before the exercise really begins.
function startGracePeriod(onComplete) {
  startCountdown(3, onComplete);
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
  if (toastMode === 'linked') hideToast();
  state.minimized = false;
  toastMode = null;
  editingExerciseId = null;
  isEditingExercise = false;
  updateEditingUI();
  el.quickRestRow.classList.remove('disabled');
  showPanel('config');
}

el.btnBackWorkout.addEventListener('click', goToConfig);
el.btnBackRest.addEventListener('click', minimizeWorkout);

// ── Config read ────────────────────────────────────────────────────────────
function readConfig() {
  return {
    totalSeries:   parseInt(el.numSeries.value)   || 4,
    totalReps:     parseInt(el.numReps.value)     || 10,
    falloSeries:   new Set(falloSeriesSet),
    weights:       Object.fromEntries(weightsMap),
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

// JSON-safe snapshot of the current form, for saving as an exercise
function serializeCurrentConfig() {
  const config = readConfig();
  config.falloSeries = [...config.falloSeries];
  return config;
}

// Inverse of readConfig() — applies a saved config back onto the form.
// Sets superserie/fases-distintas/reps-distintas/invert first (dispatching
// their existing 'change' handlers to reuse all the show/hide logic), then
// restores al-fallo last so the superserie handler's "clear fallo on change"
// side effect doesn't wipe out the fallo series we're about to restore.
function applyConfigToForm(config) {
  el.numSeries.value  = config.totalSeries;
  el.numReps.value    = config.totalReps;
  el.restSeries.value = config.restSeries;
  el.superRest.value  = config.superRest;
  el.phaseConc.value  = config.phaseConc;
  el.phaseIsom.value  = config.phaseIsom;
  el.phaseExcen.value = config.phaseExcen;
  el.phasePausa.value  = config.phasePausa;
  el.phasePausa2.value = config.phasePausa2;
  el.numReps2.value    = config.totalReps2;
  el.phaseConc2.value  = config.phaseConc2;
  el.phaseIsom2.value  = config.phaseIsom2;
  el.phaseExcen2.value = config.phaseExcen2;

  el.toggleSuper.checked = config.superEnabled;
  el.toggleSuper.dispatchEvent(new Event('change'));

  el.toggleFasesDistintas.checked = config.fasesDistintas;
  el.toggleFasesDistintas.dispatchEvent(new Event('change'));

  el.toggleRepsDistintas.checked = config.repsDistintas;
  el.toggleRepsDistintas.dispatchEvent(new Event('change'));

  weightsMap = new Map(Object.entries(config.weights || {}));
  updateWeightsUI();

  if (el.toggleInvert1.checked !== config.invertPhases1) {
    el.toggleInvert1.checked = config.invertPhases1;
    el.toggleInvert1.dispatchEvent(new Event('change'));
  }
  if (el.toggleInvert2.checked !== config.invertPhases2) {
    el.toggleInvert2.checked = config.invertPhases2;
    el.toggleInvert2.dispatchEvent(new Event('change'));
  }

  falloSeriesSet = new Set(config.falloSeries);
  el.toggleFallo.checked = falloSeriesSet.size > 0;
  if (el.toggleFallo.checked) {
    updateFalloSeriesUI();
    setVisible(el.falloSeriesBtns, true);
  } else {
    el.falloSeriesBtns.innerHTML = '';
    setVisible(el.falloSeriesBtns, false);
  }
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
function startWorkout(sourceExerciseId = null) {
  if (toastMode === 'linked') {
    if (!confirm('Hay un entrenamiento en curso. ¿Descartarlo y empezar uno nuevo?')) return;
    goToConfig();
  } else if (toastMode === 'standalone') {
    dismissRestToast();
  }
  activeSourceExerciseId = sourceExerciseId;
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
    minimized: false,
    superExercise: 1,
    falloRepsThisSerie: 0,   // reps in current serie (resets each serie)
    falloRepsPerSerie:  {},  // { key: count } recorded when each fallo serie ends
  };
  acquireWakeLock();
  showPanel('workout');
  updateStatusBar();
  el.falloCount.textContent = '0';
  updateFalloCounterVisibility();
  startCountdown(10, () => {
    startPhase(getPhaseOrder()[0]);
    startTicker();
  });
}

el.btnStart.addEventListener('click', () => {
  if (isEditingExercise) cancelEditingExercise();
  else startWorkout();
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
  state.restTotal = cfg.superRest;
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
    unminimizeSilently();
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
  state.restTotal = seconds;
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
    unminimizeSilently();
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
    if (state.minimized) el.restToastTime.textContent = Math.max(0, remaining);
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
  if (countdownTimer) {
    // "Skip Intro" — actually skip: cancel the countdown and start the reps
    // immediately. Chaining another countdown here (even a short one) looked
    // and felt like the intro had just restarted instead of being skipped.
    clearInterval(countdownTimer);
    clearTimeout(countdownTimer);
    countdownTimer = null;
    setPaused(false);
    el.btnSkipLabel.textContent = 'Skip serie';
    startPhase(getPhaseOrder()[0]);
    startTicker();
    return;
  }
  // Skip serie
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
    startGracePeriod(() => {
      startPhase(getPhaseOrder()[0]);
      startTicker();
    });
  } else {
    state.resting = false;
    state.serie++;
    state.rep = 1;
    state.superExercise = 1;
    updateStatusBar();
    updateFalloCounterVisibility();
    showPanel('workout');
    startGracePeriod(() => {
      startPhase(getPhaseOrder()[0]);
      startTicker();
    });
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

// Shows the countdown view (label/time/bar) and hides the custom-input view
function showToastCountdownView() {
  el.restToastInfo.classList.remove('hidden');
  el.restToastCustom.classList.add('hidden');
  el.restToastBarWrap.classList.remove('hidden');
}

// ── Rest-between-sessions toast (standalone: optional post-workout rest, or
//    the manual quick-rest button on the config screen) ────────────────────
function startRestToast(seconds) {
  toastMode = 'standalone';
  showToastCountdownView();
  el.restToastLabel.textContent = 'Siguiente en';
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

function hideToast() {
  el.restToast.classList.remove('visible');
  setTimeout(() => el.restToast.classList.add('hidden'), 400);
}

function dismissRestToast() {
  clearInterval(restAfterTicker);
  hideToast();
  toastMode = null;
  document.querySelectorAll('#quick-rest-presets .rest-preset-btn').forEach(b => b.classList.remove('active'));
}

// ── Rest toast (custom-input: gear button lets the user type a duration) ──
function showCustomRestInput() {
  toastMode = 'custom-input';
  el.restToastInfo.classList.add('hidden');
  el.restToastCustom.classList.remove('hidden');
  el.restToastBarWrap.classList.add('hidden');
  el.restToastCustomInput.value = 120;
  el.restToast.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.restToast.classList.add('visible');
  }));
  setTimeout(() => el.restToastCustomInput.focus(), 350);
}

function startCustomToast() {
  const sec = Math.max(10, parseInt(el.restToastCustomInput.value) || 120);
  startRestToast(sec);
}

el.restToastCustomStart.addEventListener('click', startCustomToast);
el.restToastCustomInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') startCustomToast();
});

// ── Rest toast (linked: workout rest minimized via the back button) ───────
function minimizeWorkout() {
  state.minimized = true;
  toastMode = 'linked';
  showToastCountdownView();
  const remaining = Math.max(0, parseInt(el.restCountdown.textContent) || 0);
  const total = state.restTotal || remaining || 1;
  const pct = Math.max(0, Math.min(1, remaining / total)) * 100;
  el.restToastLabel.textContent = 'Volver al entreno';
  el.restToastTime.textContent = remaining;
  el.restToastBar.style.transition = 'none';
  el.restToastBar.style.width = pct + '%';
  el.restToast.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.restToast.classList.add('visible');
    if (!state.paused) {
      el.restToastBar.style.transition = `width ${remaining}s linear`;
      el.restToastBar.style.width = '0%';
    }
  }));
  el.quickRestRow.classList.add('disabled');
  showPanel('config');
}

// Clears the linked-toast state without switching panels — used when a
// minimized rest finishes on its own and startRest/startSuperRest are about
// to showPanel('workout') themselves.
function unminimizeSilently() {
  if (!state.minimized) return;
  state.minimized = false;
  toastMode = null;
  hideToast();
  el.quickRestRow.classList.remove('disabled');
}

function unminimizeWorkout() {
  state.minimized = false;
  toastMode = null;
  hideToast();
  el.quickRestRow.classList.remove('disabled');
  showPanel('rest');
  if (state.paused) freezeRestBar();
  else resumeRestBar();
}

el.restToastClose.addEventListener('click', (e) => {
  e.stopPropagation();
  if (toastMode === 'linked') {
    if (confirm('Hay un entrenamiento en curso. ¿Cancelarlo?')) goToConfig();
  } else {
    dismissRestToast();
  }
});

el.restToast.addEventListener('click', () => {
  if (toastMode === 'linked') unminimizeWorkout();
});

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

  renderIntensityRegisterSection();

  showPanel('done');
}

el.btnRestart.addEventListener('click', () => {
  if (selectedRestSecs !== null) startRestToast(selectedRestSecs);
  selectedRestSecs = null;
  editingExerciseId = null;
  isEditingExercise = false;
  updateEditingUI();
  document.querySelectorAll('#done-rest-presets .rest-preset-btn').forEach(b => b.classList.remove('active'));
  el.doneRestCustomWrap.classList.add('hidden');
  showPanel('config');
});

// ── Register intensity (done panel) ─────────────────────────────────────────
// cfg still holds the config of the workout that just finished (it's only
// reassigned by the next startWorkout()), so the last serie's weight(s) are
// read straight from there.
function createIntensitySection(slot, name, weight) {
  const wrap = document.createElement('div');
  wrap.className = 'intensity-section';

  const title = document.createElement('div');
  title.className = 'intensity-section-title';
  title.textContent = slot === 'single' ? name : `${slot}: ${name}`;
  wrap.appendChild(title);

  const weightLine = document.createElement('div');
  weightLine.className = 'intensity-weight';
  weightLine.textContent = `Último peso: ${weight ? weight + ' Kg' : '-'}`;
  wrap.appendChild(weightLine);

  const options = document.createElement('div');
  options.className = 'intensity-options';
  FEELING_OPTIONS.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'intensity-option';
    btn.innerHTML = `<img class="intensity-emoji" src="${opt.icon}" alt="${opt.label}"><span class="intensity-caption">${opt.label}</span>`;
    btn.addEventListener('click', () => {
      options.querySelectorAll('.intensity-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pendingIntensitySelections[slot] = { key: opt.key, weight };
      updateIntensityConfirmState();
    });
    options.appendChild(btn);
  });
  wrap.appendChild(options);

  return wrap;
}

// Renders the section inline on the done panel (no popup) — only visible
// when this workout came from a saved exercise.
function renderIntensityRegisterSection() {
  el.intensityRegister.classList.toggle('hidden', !activeSourceExerciseId);
  if (!activeSourceExerciseId) return;

  const exercise = exercises.find(e => e.id === activeSourceExerciseId);
  if (!exercise) { el.intensityRegister.classList.add('hidden'); return; }

  pendingIntensitySelections = {};
  el.intensitySections.innerHTML = '';
  el.intensityConfirm.classList.remove('hidden');
  el.intensityConfirm.disabled = true;

  const lastSerie = cfg.totalSeries;
  if (cfg.superEnabled) {
    el.intensitySections.appendChild(
      createIntensitySection('A', exercise.nameA ?? exercise.name ?? '', cfg.weights[`${lastSerie}-1`]));
    el.intensitySections.appendChild(
      createIntensitySection('B', exercise.nameB ?? '', cfg.weights[`${lastSerie}-2`]));
  } else {
    el.intensitySections.appendChild(
      createIntensitySection('single', exercise.name, cfg.weights[`${lastSerie}`]));
  }
}

// "Guardar" stays grayed out (disabled) until every applicable exercise has a selection
function updateIntensityConfirmState() {
  const slots = cfg.superEnabled ? ['A', 'B'] : ['single'];
  el.intensityConfirm.disabled = !slots.every(slot => pendingIntensitySelections[slot]);
}

function confirmIntensity() {
  const slots = cfg.superEnabled ? ['A', 'B'] : ['single'];
  if (!slots.every(slot => pendingIntensitySelections[slot])) return; // one per exercise is required

  const idx = exercises.findIndex(e => e.id === activeSourceExerciseId);
  if (idx === -1) return;
  const exercise = exercises[idx];
  const date = Date.now();

  slots.forEach(slot => {
    const { key, weight } = pendingIntensitySelections[slot];
    const logKey = slot === 'single' ? 'intensityLog' : slot === 'A' ? 'intensityLogA' : 'intensityLogB';
    if (!exercise[logKey]) exercise[logKey] = [];
    exercise[logKey].push({ feeling: key, weight: weight || null, date });
  });

  saveExercises();
  el.intensitySections.innerHTML = '<div class="intensity-saved-msg">✓ Intensidad guardada</div>';
  el.intensityConfirm.classList.add('hidden');
}

el.intensityConfirm.addEventListener('click', confirmIntensity);

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

// ── Weights per serie ───────────────────────────────────────────────────────
function updateWeightsUI() {
  const total = parseInt(el.numSeries.value) || 4;
  const superOn = el.toggleSuper.checked;
  el.weightsList.innerHTML = '';

  const validKeys = new Set();
  for (let i = 1; i <= total; i++) {
    if (superOn) { validKeys.add(`${i}-1`); validKeys.add(`${i}-2`); }
    else           validKeys.add(`${i}`);
  }
  for (const k of [...weightsMap.keys()]) {
    if (!validKeys.has(k)) weightsMap.delete(k);
  }

  if (superOn) {
    // All of exercise A's series first, then all of B's — not interleaved
    for (let i = 1; i <= total; i++) el.weightsList.appendChild(createWeightInput(`S.${i}A`, `${i}-1`));
    for (let i = 1; i <= total; i++) el.weightsList.appendChild(createWeightInput(`S.${i}B`, `${i}-2`));
  } else {
    for (let i = 1; i <= total; i++) el.weightsList.appendChild(createWeightInput(`S.${i}`, `${i}`));
  }
}

function createWeightInput(label, key) {
  const wrap = document.createElement('div');
  wrap.className = 'weight-item';

  const lbl = document.createElement('span');
  lbl.className = 'weight-label';
  lbl.textContent = label;
  if (key.includes('-')) lbl.style.color = accentColorForKey(key);

  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'num-input small weight-input';
  input.min = '0';
  input.step = '0.5';
  input.placeholder = '0';
  if (weightsMap.has(key)) input.value = weightsMap.get(key);
  input.addEventListener('input', () => {
    if (input.value === '') weightsMap.delete(key);
    else weightsMap.set(key, parseFloat(input.value));
  });

  const unit = document.createElement('span');
  unit.className = 'unit';
  unit.textContent = 'Kg';

  wrap.append(lbl, input, unit);
  return wrap;
}

// ── Exercises list ──────────────────────────────────────────────────────────
function isSuperExercise(exercise) {
  return exercise.nameA !== undefined && exercise.nameB !== undefined;
}

function renderExercisesList() {
  el.exercisesList.innerHTML = '';
  el.exercisesEmpty.classList.toggle('hidden', exercises.length > 0);
  exercises.forEach(exercise => {
    el.exercisesList.appendChild(mergeSelectMode ? createMergeSelectItem(exercise) : createExerciseItem(exercise));
  });
}

function createExerciseItem(exercise) {
  const item = document.createElement('div');
  item.className = 'exercise-item';
  item.dataset.id = exercise.id;
  const isSuper = isSuperExercise(exercise);

  const handle = document.createElement('div');
  handle.className = 'exercise-drag-handle';
  for (let i = 0; i < 6; i++) handle.appendChild(document.createElement('i'));
  handle.addEventListener('pointerdown', (e) => startExerciseDrag(e, item));

  const nameCol = document.createElement('div');
  nameCol.className = 'exercise-name-col';
  if (isSuper) {
    nameCol.appendChild(createExerciseNameLine(exercise.nameA));
    nameCol.appendChild(createExerciseNameLine(exercise.nameB));
  } else {
    nameCol.appendChild(createExerciseNameLine(exercise.name));
  }

  const playBtn = document.createElement('button');
  playBtn.className = 'exercise-btn exercise-btn-play';
  playBtn.textContent = '▶';
  playBtn.addEventListener('click', () => {
    showExercisePreview(exercise);
  });

  const editBtn = document.createElement('button');
  editBtn.className = 'exercise-btn exercise-btn-edit';
  editBtn.textContent = '✎';
  editBtn.addEventListener('click', () => {
    applyConfigToForm(exercise.config);
    editingExerciseId = exercise.id;
    isEditingExercise = true;
    updateEditingUI();
    panels.config.scrollTo({ top: 0, behavior: 'smooth' });
  });

  item.append(handle, nameCol);

  if (isSuper) {
    const splitBtn = document.createElement('button');
    splitBtn.className = 'exercise-btn exercise-btn-split';
    splitBtn.textContent = '🔀';
    splitBtn.title = 'Separar en dos ejercicios';
    splitBtn.addEventListener('click', () => {
      if (confirm(`¿Separar "${exercise.name}" en dos ejercicios individuales?`)) {
        splitExercise(exercise.id);
      }
    });
    item.appendChild(splitBtn);
  }

  item.append(editBtn, playBtn);
  return item;
}

// Rendered instead of createExerciseItem() while merge-select mode is active —
// only non-super exercises can be picked (superserie ones show dimmed).
function createMergeSelectItem(exercise) {
  const item = document.createElement('div');
  item.className = 'exercise-item';
  item.dataset.id = exercise.id;
  const isSuper = isSuperExercise(exercise);

  const nameCol = document.createElement('div');
  nameCol.className = 'exercise-name-col';
  if (isSuper) {
    nameCol.appendChild(createExerciseNameLine(exercise.nameA));
    nameCol.appendChild(createExerciseNameLine(exercise.nameB));
  } else {
    nameCol.appendChild(createExerciseNameLine(exercise.name));
  }

  const check = document.createElement('span');
  check.className = 'exercise-merge-check';
  check.textContent = mergeSelection.includes(exercise.id) ? '✓' : '';

  item.append(nameCol, check);

  if (isSuper) {
    item.classList.add('merge-disabled');
  } else {
    item.classList.add('merge-selectable');
    if (mergeSelection.includes(exercise.id)) item.classList.add('merge-selected');
    item.addEventListener('click', () => toggleMergeSelection(exercise.id));
  }

  return item;
}

// ── Merge two exercises into one superserie ─────────────────────────────────
function enterMergeSelectMode() {
  mergeSelectMode = true;
  mergeSelection = [];
  el.btnMergeExercises.classList.add('hidden');
  el.btnMergeCancel.classList.remove('hidden');
  el.btnMergeConfirm.classList.remove('hidden');
  el.btnMergeConfirm.disabled = true;
  renderExercisesList();
}

function exitMergeSelectMode() {
  mergeSelectMode = false;
  mergeSelection = [];
  el.btnMergeExercises.classList.remove('hidden');
  el.btnMergeCancel.classList.add('hidden');
  el.btnMergeConfirm.classList.add('hidden');
  renderExercisesList();
}

function toggleMergeSelection(id) {
  const idx = mergeSelection.indexOf(id);
  if (idx !== -1) {
    mergeSelection.splice(idx, 1);
  } else {
    if (mergeSelection.length >= 2) return; // deselect one first
    mergeSelection.push(id);
  }
  el.btnMergeConfirm.disabled = mergeSelection.length !== 2;
  renderExercisesList();
}

el.btnMergeExercises.addEventListener('click', enterMergeSelectMode);
el.btnMergeCancel.addEventListener('click', exitMergeSelectMode);
el.btnMergeConfirm.addEventListener('click', () => {
  if (mergeSelection.length === 2) mergeExercises(mergeSelection[0], mergeSelection[1]);
});

const DEFAULT_SUPER_REST = 20;   // matches #super-rest's HTML default
const DEFAULT_REST_SERIES = 120; // matches #rest-series's HTML default

// Combines two standalone exercises (selection order → A, B) into one
// superserie exercise. Series/reps/phases/weights/al-fallo/intensity each
// carry over to their own A or B slot; short rest and descanso interseries
// reset to the standard defaults since neither source value applies anymore.
function mergeExercises(idA, idB) {
  const idxA = exercises.findIndex(e => e.id === idA);
  const idxB = exercises.findIndex(e => e.id === idB);
  if (idxA === -1 || idxB === -1) { exitMergeSelectMode(); return; }
  const exA = exercises[idxA];
  const exB = exercises[idxB];
  const cfgA = exA.config;
  const cfgB = exB.config;

  const weights = {};
  Object.entries(cfgA.weights || {}).forEach(([k, v]) => { weights[`${k}-1`] = v; });
  Object.entries(cfgB.weights || {}).forEach(([k, v]) => { weights[`${k}-2`] = v; });

  const falloSeries = [
    ...(cfgA.falloSeries || []).map(k => `${k}-1`),
    ...(cfgB.falloSeries || []).map(k => `${k}-2`),
  ];

  const samePhases = cfgA.phaseConc === cfgB.phaseConc && cfgA.phaseIsom === cfgB.phaseIsom &&
    cfgA.phaseExcen === cfgB.phaseExcen && cfgA.phasePausa === cfgB.phasePausa &&
    cfgA.invertPhases1 === cfgB.invertPhases1;

  const mergedConfig = {
    totalSeries: Math.max(cfgA.totalSeries, cfgB.totalSeries),
    totalReps: cfgA.totalReps,
    totalReps2: cfgB.totalReps,
    repsDistintas: cfgA.totalReps !== cfgB.totalReps,
    falloSeries,
    weights,
    restSeries: DEFAULT_REST_SERIES,
    superEnabled: true,
    superRest: DEFAULT_SUPER_REST,
    phaseConc: cfgA.phaseConc,
    phaseIsom: cfgA.phaseIsom,
    phaseExcen: cfgA.phaseExcen,
    phasePausa: cfgA.phasePausa,
    phasePausa2: cfgB.phasePausa,
    fasesDistintas: !samePhases,
    phaseConc2: cfgB.phaseConc,
    phaseIsom2: cfgB.phaseIsom,
    phaseExcen2: cfgB.phaseExcen,
    invertPhases1: cfgA.invertPhases1,
    invertPhases2: cfgB.invertPhases1,
  };

  const merged = {
    id: makeExerciseId(),
    name: `${exA.name} / ${exB.name}`,
    nameA: exA.name,
    nameB: exB.name,
    config: mergedConfig,
  };
  if (exA.intensityLog && exA.intensityLog.length) merged.intensityLogA = exA.intensityLog;
  if (exB.intensityLog && exB.intensityLog.length) merged.intensityLogB = exB.intensityLog;

  // Replace both originals with the merged entry, at the earliest position
  const insertAt = Math.min(idxA, idxB);
  exercises = exercises.filter(e => e.id !== idA && e.id !== idB);
  exercises.splice(insertAt, 0, merged);

  saveExercises();
  exitMergeSelectMode(); // also re-renders the list
}

// Inverse of mergeExercises() — breaks a superserie exercise back into two
// standalone ones, carrying each side's series/reps/phases/weights/al-fallo/
// intensity back to its own exercise.
function splitExercise(id) {
  const idx = exercises.findIndex(e => e.id === id);
  if (idx === -1) return;
  const ex = exercises[idx];
  const cfg = ex.config;

  function remapWeights(suffix) {
    const out = {};
    Object.entries(cfg.weights || {}).forEach(([k, v]) => {
      if (k.endsWith(suffix)) out[k.slice(0, -suffix.length)] = v;
    });
    return out;
  }
  function remapFallo(suffix) {
    return (cfg.falloSeries || [])
      .filter(k => k.endsWith(suffix))
      .map(k => k.slice(0, -suffix.length));
  }
  function baseConfig(totalReps, phaseConc, phaseIsom, phaseExcen, phasePausa, invertPhases1, weightSuffix, falloSuffix) {
    return {
      totalSeries: cfg.totalSeries,
      totalReps,
      falloSeries: remapFallo(falloSuffix),
      weights: remapWeights(weightSuffix),
      restSeries: cfg.restSeries,
      superEnabled: false,
      superRest: DEFAULT_SUPER_REST,
      phaseConc, phaseIsom, phaseExcen, phasePausa,
      phasePausa2: 0,
      repsDistintas: false,
      totalReps2: 10,
      fasesDistintas: false,
      phaseConc2: 1, phaseIsom2: 1, phaseExcen2: 3,
      invertPhases1, invertPhases2: false,
    };
  }

  const exerciseA = {
    id: makeExerciseId(),
    name: ex.nameA ?? ex.name ?? '',
    config: baseConfig(cfg.totalReps, cfg.phaseConc, cfg.phaseIsom, cfg.phaseExcen, cfg.phasePausa, cfg.invertPhases1, '-1', '-1'),
  };
  if (ex.intensityLogA && ex.intensityLogA.length) exerciseA.intensityLog = ex.intensityLogA;

  const exerciseB = {
    id: makeExerciseId(),
    name: ex.nameB ?? '',
    config: baseConfig(cfg.totalReps2, cfg.phaseConc2, cfg.phaseIsom2, cfg.phaseExcen2, cfg.phasePausa2, cfg.invertPhases2, '-2', '-2'),
  };
  if (ex.intensityLogB && ex.intensityLogB.length) exerciseB.intensityLog = ex.intensityLogB;

  exercises.splice(idx, 1, exerciseA, exerciseB);
  saveExercises();
  renderExercisesList();
}

function createExerciseNameLine(text) {
  const line = document.createElement('div');
  line.className = 'exercise-name-line';

  const span = document.createElement('span');
  span.className = 'exercise-name-text';
  span.textContent = text;
  line.appendChild(span);

  setupNameMarquee(line, span);
  return line;
}

// Scrolls the full name at a constant pace when it doesn't fit, jumping back
// to the start and pausing 1.5s before repeating — instead of ellipsis.
function setupNameMarquee(lineEl, textEl) {
  requestAnimationFrame(() => {
    const overflow = textEl.scrollWidth - lineEl.clientWidth;
    if (overflow <= 2) return;
    const SPEED = 40;        // px/s — constant scroll pace regardless of name length
    const START_PAUSE = 1.5; // s — wait at the start before it begins moving
    const END_PAUSE = 1.5;   // s — wait at the end, holding the last letters, before jumping back
    const scrollTime = overflow / SPEED;
    const total = START_PAUSE + scrollTime + END_PAUSE;
    const scrollStart = START_PAUSE / total;
    const scrollEnd = (START_PAUSE + scrollTime) / total;
    // Holding the last keyframe at -overflow through 100% means the pause
    // happens at the end; looping (iterations: Infinity) then snaps straight
    // back to the 0% keyframe with no animated transition — an instant jump.
    textEl.animate([
      { transform: 'translateX(0)', offset: 0 },
      { transform: 'translateX(0)', offset: scrollStart },
      { transform: `translateX(${-overflow}px)`, offset: scrollEnd },
      { transform: `translateX(${-overflow}px)`, offset: 1 },
    ], { duration: total * 1000, iterations: Infinity, easing: 'linear' });
  });
}

// ── Exercise preview (read-only screen shown before starting) ─────────────
// "A"/"B" keys look like "N-1"/"N-2" (superserie) or plain "N" otherwise —
// same scheme as falloSeriesSet/weightsMap. "-2" is always exercise B.
function accentColorForKey(key) {
  return key.endsWith('-2') ? 'var(--exercise-b)' : 'var(--exercise-a)';
}

function formatKeyTag(key, isSuper) {
  if (!isSuper) return `S.${key}`;
  const [serie, ex] = key.split('-');
  return `S.${serie}${ex === '1' ? 'A' : 'B'}`;
}

function showExercisePreview(exercise) {
  previewingExerciseId = exercise.id;
  renderExercisePreview(exercise);
  showPanel('preview');
}

function renderExercisePreview(exercise) {
  const config = exercise.config;
  const isSuper = config.superEnabled;

  // Titles
  el.previewTitles.innerHTML = '';
  if (isSuper) {
    el.previewTitles.appendChild(makePreviewTitleLine('A', exercise.nameA ?? exercise.name ?? '', 'var(--exercise-a)'));
    el.previewTitles.appendChild(makePreviewTitleLine('B', exercise.nameB ?? '', 'var(--exercise-b)'));
  } else {
    el.previewTitles.appendChild(makePreviewTitleLine(null, exercise.name, 'var(--exercise-a)'));
  }

  // Superserie — read-only one-liner, hidden entirely if not superserie
  el.previewSuperRow.classList.toggle('hidden', !isSuper);
  if (isSuper) {
    el.previewSuperValue.textContent = `⏸️ Short rest entre serie A y B de: ${config.superRest}s`;
  }

  // Series + Reps
  el.previewSeriesReps.innerHTML = '';
  el.previewSeriesReps.appendChild(makeReadonlyField('🔢 Series', config.totalSeries));
  if (isSuper && config.repsDistintas) {
    el.previewSeriesReps.appendChild(makeReadonlyField('🔁 Reps', config.totalReps, 'A', 'var(--exercise-a)'));
    el.previewSeriesReps.appendChild(makeReadonlyField('🔁 Reps', config.totalReps2, 'B', 'var(--exercise-b)'));
  } else {
    el.previewSeriesReps.appendChild(makeReadonlyField('🔁 Reps', config.totalReps));
  }

  // Al fallo — only the series actually marked, tagged and colored
  const falloKeys = config.falloSeries || [];
  el.previewFalloRow.classList.toggle('hidden', falloKeys.length === 0);
  el.previewFalloTags.innerHTML = '';
  falloKeys.forEach((key, i) => {
    if (i > 0) el.previewFalloTags.appendChild(document.createTextNode(', '));
    const tag = document.createElement('span');
    tag.className = 'preview-tag';
    tag.style.color = accentColorForKey(key);
    tag.textContent = formatKeyTag(key, isSuper);
    el.previewFalloTags.appendChild(tag);
  });

  // Weights — always shown for every serie (even at 0/unrecorded, shown as
  // "-", since an exercise may sometimes be bodyweight-only). A/B pairs are
  // wrapped together so a line-break moves both, never just one.
  el.previewWeightsList.innerHTML = '';
  const weights = config.weights || {};
  for (let i = 1; i <= config.totalSeries; i++) {
    if (isSuper) {
      const pair = document.createElement('div');
      pair.className = 'weight-pair';
      pair.appendChild(makeWeightDisplay(`${i}-1`, weights[`${i}-1`], isSuper));
      pair.appendChild(makeWeightDisplay(`${i}-2`, weights[`${i}-2`], isSuper));
      el.previewWeightsList.appendChild(pair);
    } else {
      el.previewWeightsList.appendChild(makeWeightDisplay(`${i}`, weights[`${i}`], isSuper));
    }
  }
  el.previewWeightsRow.classList.remove('hidden');

  // Intensidad — last 3 records (most recent first), only if any exist.
  // A/B rows get their matching accent color; the legend goes right after
  // the last row shown (B in superserie, A otherwise).
  let anyIntensity;
  if (isSuper) {
    const hasA = renderIntensityHistory(el.previewIntensityRowA, el.previewIntensityLabelA, el.previewIntensityListA,
      '💪 Int. A', exercise.intensityLogA, 'var(--exercise-a)');
    const hasB = renderIntensityHistory(el.previewIntensityRowB, el.previewIntensityLabelB, el.previewIntensityListB,
      '💪 Int. B', exercise.intensityLogB, 'var(--exercise-b)');
    anyIntensity = hasA || hasB;
  } else {
    anyIntensity = renderIntensityHistory(el.previewIntensityRowA, el.previewIntensityLabelA, el.previewIntensityListA,
      '💪 Int.', exercise.intensityLog);
    el.previewIntensityRowB.classList.add('hidden');
  }
  el.previewIntensityLegend.classList.toggle('hidden', !anyIntensity);
  if (anyIntensity) renderIntensityLegend();

  // Descanso interseries
  el.previewRestSeries.textContent = `${config.restSeries}s`;

  // Fases
  el.previewPhasesRow.innerHTML = '';
  if (isSuper && config.fasesDistintas) {
    el.previewPhasesRow.appendChild(makePhaseSummary('A', config, false, 'var(--exercise-a)'));
    el.previewPhasesRow.appendChild(makePhaseSummary('B', config, true, 'var(--exercise-b)'));
  } else {
    el.previewPhasesRow.appendChild(makePhaseSummary(null, config, false, 'var(--exercise-a)'));
  }
}

function makePreviewTitleLine(tag, name, color) {
  const line = document.createElement('div');
  line.className = 'preview-title-line';
  line.style.color = color;
  line.textContent = tag ? `${tag}: ${name}` : name;
  return line;
}

function makeReadonlyField(label, value, tag, color) {
  const wrap = document.createElement('div');
  wrap.className = 'readonly-field';
  if (tag) {
    const t = document.createElement('span');
    t.className = 'preview-tag';
    t.style.color = color;
    t.textContent = tag;
    wrap.appendChild(t);
  }
  const lbl = document.createElement('span');
  lbl.className = 'config-label';
  lbl.textContent = label;
  const val = document.createElement('span');
  val.className = 'readonly-value';
  val.textContent = value;
  wrap.append(lbl, val);
  return wrap;
}

function makeWeightDisplay(key, value, isSuper) {
  const item = document.createElement('div');
  item.className = 'weight-item';

  const tag = document.createElement('span');
  tag.className = 'weight-label preview-tag';
  tag.style.color = accentColorForKey(key);
  tag.textContent = formatKeyTag(key, isSuper);

  const val = document.createElement('span');
  val.className = 'readonly-value';
  val.textContent = value ? `${value} Kg` : '-';

  item.append(tag, val);
  return item;
}

// Last 3 intensity records for one exercise slot, most recent first
const INTENSITY_POSITION_LABELS = ['Última', 'Anterior', 'Anteanterior'];

function renderIntensityHistory(rowEl, labelEl, listEl, label, log, color) {
  const entries = (log || []).slice(-3).reverse();
  rowEl.classList.toggle('hidden', entries.length === 0);
  if (entries.length === 0) return false;
  labelEl.textContent = label;
  labelEl.style.color = color || '';
  listEl.innerHTML = '';
  entries.forEach((record, i) => listEl.appendChild(createIntensityChip(record, INTENSITY_POSITION_LABELS[i])));
  return true;
}

// Icon + caption key so the history chips (icon-only) stay legible
function renderIntensityLegend() {
  el.previewIntensityLegend.innerHTML = '';
  FEELING_OPTIONS.forEach(opt => {
    const item = document.createElement('div');
    item.className = 'intensity-legend-item';

    const icon = document.createElement('img');
    icon.className = 'intensity-legend-icon';
    icon.src = opt.icon;
    icon.alt = opt.label;

    const label = document.createElement('span');
    label.className = 'intensity-legend-label';
    label.textContent = opt.label;

    item.append(icon, label);
    el.previewIntensityLegend.appendChild(item);
  });
}

function createIntensityChip(record, positionLabel) {
  const wrap = document.createElement('div');
  wrap.className = 'intensity-chip-wrap';

  const chip = document.createElement('div');
  chip.className = 'intensity-chip';

  const opt = FEELING_OPTIONS.find(o => o.key === record.feeling);
  const icon = document.createElement('img');
  icon.className = 'intensity-chip-emoji';
  if (opt) { icon.src = opt.icon; icon.alt = opt.label; }

  const val = document.createElement('span');
  val.className = 'readonly-value';
  val.textContent = record.weight ? `${record.weight} Kg` : '-';

  chip.append(icon, val);

  const when = document.createElement('span');
  when.className = 'intensity-chip-when';
  when.textContent = positionLabel;

  wrap.append(chip, when);
  return wrap;
}

function makePhaseSummary(tag, config, useB, color) {
  const wrap = document.createElement('div');
  wrap.className = 'preview-phase-set';

  if (tag) {
    const t = document.createElement('span');
    t.className = 'preview-tag';
    t.style.color = color;
    t.textContent = `${tag}:`;
    wrap.appendChild(t);
  }

  const conc  = useB ? config.phaseConc2  : config.phaseConc;
  const isom  = useB ? config.phaseIsom2  : config.phaseIsom;
  const excen = useB ? config.phaseExcen2 : config.phaseExcen;
  const pausa = useB ? config.phasePausa2 : config.phasePausa;

  // Same colors as the phase labels in the editable module (.phase-label.*)
  const phases = [{ label: 'Concen.', value: conc, color: 'var(--green)' }];
  if (isom > 0) phases.push({ label: 'Isom.', value: isom, color: 'var(--blue)' });
  phases.push({ label: 'Excen.', value: excen, color: 'var(--orange)' });
  if (pausa > 0) phases.push({ label: 'Pausa', value: pausa, color: 'var(--gray)' });

  // Each phase's name + seconds is one atomic unit — if it wraps to the
  // next line, the name goes with it instead of splitting from its value.
  phases.forEach(p => {
    const item = document.createElement('span');
    item.className = 'preview-phase-item';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'preview-phase-name';
    nameSpan.style.color = p.color;
    nameSpan.textContent = p.label;

    item.appendChild(nameSpan);
    item.appendChild(document.createTextNode(` ${p.value}s`));
    wrap.appendChild(item);
  });

  return wrap;
}

// Moves the real, editable Series module + Guardar/Iniciar into the preview
// screen (instead of navigating to the config screen to edit) — reuses every
// bit of existing editable-form logic since it's the actual same DOM nodes.
// Whether the Series module was collapsed on the main config screen right
// before Editar forced it open here — restored as-is when editing ends,
// without ever touching the persisted collapse preference (localStorage).
let seriesWasCollapsedBeforeInlineEdit = false;

function enterInlinePreviewEdit() {
  inlineEditFromPreview = true;

  seriesWasCollapsedBeforeInlineEdit = el.seriesModule.classList.contains('collapsed');
  if (seriesWasCollapsedBeforeInlineEdit) {
    el.seriesModule.classList.remove('collapsed');
    el.actionsStack.classList.remove('collapsed');
    el.seriesModuleBody.style.maxHeight = '';
    el.actionsStack.style.maxHeight = '';
    el.seriesCollapseBtn.setAttribute('aria-expanded', 'true');
  }

  // Collapsing has no use while editing inline here (it would just hide the
  // fields the user is trying to edit) — remove the option entirely, without
  // touching how collapse behaves back on the normal config screen.
  el.seriesCollapseBtn.classList.add('hidden');

  el.previewSeriesModule.classList.add('hidden');
  el.previewActions.classList.add('hidden');
  el.previewEditSlot.classList.remove('hidden');
  el.previewEditSlot.appendChild(el.seriesModule);
  el.previewEditSlot.appendChild(el.actionsStack);
}

// Moves them back to their normal place in #config-panel and shows the
// read-only summary again, staying on the preview screen throughout.
function exitInlinePreviewEdit() {
  if (!inlineEditFromPreview) return;
  inlineEditFromPreview = false;
  panels.config.insertBefore(el.seriesModule, el.exercisesRow);
  panels.config.insertBefore(el.actionsStack, el.exercisesRow);
  el.previewEditSlot.classList.add('hidden');
  el.previewSeriesModule.classList.remove('hidden');
  el.previewActions.classList.remove('hidden');
  el.seriesCollapseBtn.classList.remove('hidden');

  if (seriesWasCollapsedBeforeInlineEdit) {
    el.seriesModule.classList.add('collapsed');
    el.actionsStack.classList.add('collapsed');
    el.seriesModuleBody.style.maxHeight = '0px';
    el.actionsStack.style.maxHeight = '0px';
    el.seriesCollapseBtn.setAttribute('aria-expanded', 'false');
  }
}

el.btnBackPreview.addEventListener('click', () => {
  if (inlineEditFromPreview) {
    cancelEditingExercise(); // asks for confirmation, reverts, stays on preview
    return;
  }
  showPanel('config');
});

el.btnPreviewEdit.addEventListener('click', () => {
  const exercise = exercises.find(e => e.id === previewingExerciseId);
  if (!exercise) return;
  applyConfigToForm(exercise.config);
  editingExerciseId = exercise.id;
  isEditingExercise = true;
  updateEditingUI();
  enterInlinePreviewEdit();
});

el.btnPreviewStart.addEventListener('click', () => {
  const exercise = exercises.find(e => e.id === previewingExerciseId);
  if (!exercise) return;
  applyConfigToForm(exercise.config);
  startWorkout(exercise.id);
});

// ── Editing-mode UI (pink border, name label, Guardar/Cancelar swap) ───────
let wasEditingExercise = false;

// Glass-glint sweep, played once right when edit mode ends
function playSeriesShine() {
  const shine = el.seriesModuleShine;
  shine.classList.remove('sweep');
  void shine.offsetWidth; // force reflow so the animation restarts reliably
  shine.classList.add('sweep');
}

// Without this, ".sweep" stays attached after the animation ends, and CSS
// animations restart on their own whenever the element toggles out of and
// back into display:none (e.g. leaving/returning from the exercise preview
// panel) — replaying the shine on plain navigation instead of only on save.
el.seriesModuleShine.addEventListener('animationend', () => {
  el.seriesModuleShine.classList.remove('sweep');
});

function updateEditingUI() {
  const exercise = isEditingExercise ? exercises.find(e => e.id === editingExerciseId) : null;

  if (wasEditingExercise && !isEditingExercise) playSeriesShine();
  wasEditingExercise = isEditingExercise;

  el.seriesModule.classList.toggle('editing', isEditingExercise);
  el.seriesEditingLabel.classList.toggle('hidden', !isEditingExercise);
  el.seriesEditingNames.classList.toggle('hidden', !isEditingExercise);
  el.seriesEditingNames.innerHTML = '';

  if (exercise) {
    if (exercise.nameA !== undefined && exercise.nameB !== undefined) {
      el.seriesEditingNames.appendChild(createEditingNameRow('A', exercise.nameA));
      el.seriesEditingNames.appendChild(createEditingNameRow('B', exercise.nameB));
    } else {
      el.seriesEditingNames.appendChild(createEditingNameRow(null, exercise.name));
    }
  }

  el.btnSaveExercise.textContent = isEditingExercise ? 'Guardar Cambios' : 'Guardar';
  el.btnStart.textContent = isEditingExercise ? 'Cancelar' : 'INICIAR';
  el.btnStart.classList.toggle('btn-cancel-edit', isEditingExercise);
}

function createEditingNameRow(slotLabel, name) {
  const row = document.createElement('div');
  row.className = 'editing-name-row';

  if (slotLabel) {
    const tag = document.createElement('span');
    tag.className = 'editing-name-tag';
    tag.textContent = slotLabel;
    row.appendChild(tag);
  }

  const text = document.createElement('span');
  text.className = 'editing-name-text';
  text.textContent = name;
  row.appendChild(text);

  const btn = document.createElement('button');
  btn.className = 'editing-name-edit-btn';
  btn.textContent = '✎';
  btn.addEventListener('click', () => openRenameModal(slotLabel || 'single'));
  row.appendChild(btn);

  return row;
}

function cancelEditingExercise() {
  if (!confirm('¿Salir sin guardar los cambios?')) return;
  const original = exercises.find(e => e.id === editingExerciseId);
  if (original) applyConfigToForm(original.config);
  editingExerciseId = null;
  isEditingExercise = false;
  updateEditingUI();
  if (inlineEditFromPreview) {
    exitInlinePreviewEdit();
    if (original) renderExercisePreview(original);
  }
}

// ── Rename modal (pencil next to each name while editing) ──────────────────
let renamingSlot = null; // 'single' | 'A' | 'B'

function openRenameModal(slot) {
  const exercise = exercises.find(e => e.id === editingExerciseId);
  if (!exercise) return;
  renamingSlot = slot;
  const current = slot === 'A' ? exercise.nameA : slot === 'B' ? exercise.nameB : exercise.name;
  el.renameExerciseInput.value = current || '';
  el.renameExerciseModal.classList.remove('hidden');
  setTimeout(() => el.renameExerciseInput.focus(), 50);
}

function closeRenameModal() {
  el.renameExerciseModal.classList.add('hidden');
  renamingSlot = null;
}

function confirmRename() {
  const newName = el.renameExerciseInput.value.trim();
  if (!newName) { el.renameExerciseInput.focus(); return; }
  const exercise = exercises.find(e => e.id === editingExerciseId);
  if (exercise) {
    if (renamingSlot === 'A') exercise.nameA = newName;
    else if (renamingSlot === 'B') exercise.nameB = newName;
    else exercise.name = newName;
    if (renamingSlot === 'A' || renamingSlot === 'B') {
      exercise.name = `${exercise.nameA} / ${exercise.nameB}`;
    }
    saveExercises();
    renderExercisesList();
    updateEditingUI();
  }
  closeRenameModal();
}

el.renameExerciseConfirm.addEventListener('click', confirmRename);
el.renameExerciseCancel.addEventListener('click', closeRenameModal);
el.renameExerciseBackdrop.addEventListener('click', closeRenameModal);
el.renameExerciseInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmRename();
  if (e.key === 'Escape') closeRenameModal();
});

// ── Save-exercise modal ─────────────────────────────────────────────────────
function openSaveExerciseModal() {
  const existing = editingExerciseId && exercises.find(e => e.id === editingExerciseId);
  const superOn = el.toggleSuper.checked;

  el.saveExerciseNameSuper.classList.toggle('hidden', !superOn);
  el.saveExerciseNameInput.classList.toggle('hidden', superOn);

  if (superOn) {
    el.saveExerciseNameAInput.value = existing ? (existing.nameA ?? existing.name ?? '') : '';
    el.saveExerciseNameBInput.value = existing ? (existing.nameB ?? '') : '';
  } else {
    el.saveExerciseNameInput.value = existing ? (existing.name ?? '') : '';
  }

  el.saveExerciseModal.classList.remove('hidden');
  setTimeout(() => (superOn ? el.saveExerciseNameAInput : el.saveExerciseNameInput).focus(), 50);
}

function closeSaveExerciseModal() {
  el.saveExerciseModal.classList.add('hidden');
}

function confirmSaveExercise() {
  const superOn = el.toggleSuper.checked;
  let name, nameA, nameB;

  if (superOn) {
    nameA = el.saveExerciseNameAInput.value.trim();
    nameB = el.saveExerciseNameBInput.value.trim();
    if (!nameA) { el.saveExerciseNameAInput.focus(); return; }
    if (!nameB) { el.saveExerciseNameBInput.focus(); return; }
    name = `${nameA} / ${nameB}`;
  } else {
    name = el.saveExerciseNameInput.value.trim();
    if (!name) { el.saveExerciseNameInput.focus(); return; }
  }

  const config = serializeCurrentConfig();
  const entry = superOn ? { name, nameA, nameB, config } : { name, config };
  const existingIndex = editingExerciseId ? exercises.findIndex(e => e.id === editingExerciseId) : -1;
  if (existingIndex !== -1) {
    exercises[existingIndex] = { id: editingExerciseId, ...entry };
  } else {
    editingExerciseId = makeExerciseId();
    exercises.push({ id: editingExerciseId, ...entry });
  }
  saveExercises();
  renderExercisesList();
  closeSaveExerciseModal();
}

// Editing an existing exercise: "Guardar Cambios" saves the current form's
// config straight away (name/nameA/nameB are untouched — those are only
// changed via the ✎ next to each name) and exits edit mode. No popup.
function saveEditedExerciseDirectly() {
  const idx = exercises.findIndex(e => e.id === editingExerciseId);
  if (idx === -1) return;
  exercises[idx] = { ...exercises[idx], config: serializeCurrentConfig() };
  saveExercises();
  renderExercisesList();
  editingExerciseId = null;
  isEditingExercise = false;
  updateEditingUI();
  if (inlineEditFromPreview) {
    exitInlinePreviewEdit();
    renderExercisePreview(exercises[idx]);
  }
}

el.btnSaveExercise.addEventListener('click', () => {
  if (isEditingExercise) saveEditedExerciseDirectly();
  else openSaveExerciseModal();
});
el.saveExerciseConfirm.addEventListener('click', confirmSaveExercise);
el.saveExerciseCancel.addEventListener('click', closeSaveExerciseModal);
el.saveExerciseBackdrop.addEventListener('click', closeSaveExerciseModal);
[el.saveExerciseNameInput, el.saveExerciseNameAInput, el.saveExerciseNameBInput].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmSaveExercise();
    if (e.key === 'Escape') closeSaveExerciseModal();
  });
});

// ── Reorder exercises (Pointer Events — native HTML5 drag doesn't fire on
//    touch in several mobile browsers, and this is a touch-first PWA) ──────
function getDragAfterElement(container, y) {
  const els = [...container.querySelectorAll('.exercise-item:not(.dragging)')];
  return els.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - (box.top + box.height / 2);
    if (offset < 0 && offset > closest.offset) return { offset, element: child };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}

function startExerciseDrag(e, item) {
  e.preventDefault();
  const handle = e.currentTarget;
  const list = el.exercisesList;
  let startY = e.clientY;
  item.classList.add('dragging');
  item.style.position = 'relative';

  function onMove(ev) {
    const afterEl = getDragAfterElement(list, ev.clientY);
    const currentNext = item.nextElementSibling;
    if (afterEl !== item && afterEl !== currentNext) {
      const prevTop = item.getBoundingClientRect().top;
      if (afterEl == null) list.appendChild(item);
      else list.insertBefore(item, afterEl);
      const newTop = item.getBoundingClientRect().top;
      startY += (newTop - prevTop);
    }
    item.style.transform = `translateY(${ev.clientY - startY}px)`;
  }

  function onUp(ev) {
    handle.releasePointerCapture(ev.pointerId);
    handle.removeEventListener('pointermove', onMove);
    handle.removeEventListener('pointerup', onUp);
    handle.removeEventListener('pointercancel', onUp);
    item.classList.remove('dragging');
    item.style.transform = '';
    item.style.position = '';
    syncExercisesOrderFromDOM();
  }

  handle.setPointerCapture(e.pointerId);
  handle.addEventListener('pointermove', onMove);
  handle.addEventListener('pointerup', onUp);
  handle.addEventListener('pointercancel', onUp);
}

function syncExercisesOrderFromDOM() {
  const ids = [...el.exercisesList.querySelectorAll('.exercise-item')].map(i => i.dataset.id);
  exercises.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  saveExercises();
}

// ── Series module collapse (persisted, animated) ────────────────────────────
const SERIES_COLLAPSED_KEY = 'gym-timer-series-collapsed';

// Animates max-height from/to the element's real content height, so the
// collapse/expand is proportional instead of an instant .hidden toggle.
// Measures scrollHeight with maxHeight momentarily released to 'none' —
// avoids any ambiguity from measuring while still constrained to 0.
function animateCollapse(element, collapsed) {
  if (collapsed) {
    const prev = element.style.maxHeight;
    element.style.maxHeight = 'none';
    const full = element.scrollHeight;
    element.style.maxHeight = prev || full + 'px';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        element.style.maxHeight = '0px';
      });
    });
  } else {
    const prev = element.style.maxHeight;
    element.style.maxHeight = 'none';
    const full = element.scrollHeight;
    element.style.maxHeight = prev;
    requestAnimationFrame(() => {
      element.style.maxHeight = full + 'px';
    });
    const onEnd = (e) => {
      if (e.propertyName !== 'max-height') return;
      element.style.maxHeight = '';
      element.removeEventListener('transitionend', onEnd);
    };
    element.addEventListener('transitionend', onEnd);
  }
}

function setSeriesCollapsed(collapsed, { animate = true } = {}) {
  el.seriesModule.classList.toggle('collapsed', collapsed);
  el.actionsStack.classList.toggle('collapsed', collapsed);
  el.seriesCollapseBtn.setAttribute('aria-expanded', String(!collapsed));
  localStorage.setItem(SERIES_COLLAPSED_KEY, String(collapsed));

  if (animate) {
    animateCollapse(el.seriesModuleBody, collapsed);
    animateCollapse(el.actionsStack, collapsed);
  } else {
    el.seriesModuleBody.style.maxHeight = collapsed ? '0px' : '';
    el.actionsStack.style.maxHeight = collapsed ? '0px' : '';
  }
}

el.seriesCollapseBtn.addEventListener('click', () => {
  setSeriesCollapsed(!el.seriesModule.classList.contains('collapsed'));
});

// Apply the stored state on load without animating (avoids a visible flash/slide on first paint)
setSeriesCollapsed(localStorage.getItem(SERIES_COLLAPSED_KEY) === 'true', { animate: false });

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
  updateWeightsUI();
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

// ── Num-series → refresh fallo buttons + weights ──────────────────────────
el.numSeries.addEventListener('input', () => {
  if (el.toggleFallo.checked) updateFalloSeriesUI();
  updateWeightsUI();
});

// ── Init disabled states ───────────────────────────────────────────────────
el.superRest.style.opacity = '0.4';

// ── Rest presets (done panel) ──────────────────────────────────────────────
document.querySelectorAll('#done-rest-presets .rest-preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const isActive = btn.classList.contains('active');
    document.querySelectorAll('#done-rest-presets .rest-preset-btn').forEach(b => b.classList.remove('active'));
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

// ── Rest presets (quick-rest, config panel) ────────────────────────────────
// Presets start the toast immediately; the gear button (data-sec="0") opens
// the toast in custom-input mode instead — startCustomToast() starts it once
// the user confirms a duration.
document.querySelectorAll('#quick-rest-presets .rest-preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (toastMode === 'linked') return; // guarded by CSS too, belt & suspenders
    const isActive = btn.classList.contains('active');
    document.querySelectorAll('#quick-rest-presets .rest-preset-btn').forEach(b => b.classList.remove('active'));
    if (isActive) {
      dismissRestToast();
      return;
    }
    btn.classList.add('active');
    const sec = parseInt(btn.dataset.sec);
    if (sec === 0) {
      showCustomRestInput();
    } else {
      startRestToast(sec);
    }
  });
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

renderExercisesList();
updateWeightsUI();
updateEditingUI();

// ── App-update banner ───────────────────────────────────────────────────────
// index.html's inline script dispatches this once a genuinely new service
// worker version has activated (not on first install). Reload is entirely
// user-triggered, so it never interrupts a workout in progress.
const updateToast = document.getElementById('update-toast');
const updateToastBtn = document.getElementById('update-toast-btn');
const updateToastClose = document.getElementById('update-toast-close');

window.addEventListener('sw-update-ready', () => {
  updateToast.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    updateToast.classList.add('visible');
  }));
});

updateToastBtn.addEventListener('click', () => window.location.reload());
updateToastClose.addEventListener('click', () => {
  updateToast.classList.remove('visible');
  setTimeout(() => updateToast.classList.add('hidden'), 400);
});
