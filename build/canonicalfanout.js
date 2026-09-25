(function(){/* ===================================================================
   CANONICAL FAN-OUT — the approved C1–C4 merges (data level ONLY)
   -------------------------------------------------------------------
   Gerhard approved merging the four candidate canonicalKeys
   (docs/tracker-mapping.md §2.2). One measure, every original path:

   C1 mood.tone   core.mindset ⇄ mind.mdWeather ⇄ flare mood (1–5)
      Clean 5↔5↔5 bijection:
        Fighter=Sunny=5 · Positive=Partly cloudy=4 · Balanced=Cloudy=3 ·
        Negative=Rainy=2 · Depressed=Stormy=1
      🔴 SINCE 8 SEP 2026 THE RENDERED INSTANCE IS ALWAYS MINDSET.
      «Your inner weather» is not asked anywhere any more (the poda:
      one measure, ONE question), so this leg runs in one direction
      only — mindset → mdWeather — and it lives in cfJournalMirror()
      at the end of this file, not in cfCanonicalFanout(): the row is
      hidden with the unified flag OFF too, so the field has to keep
      being written with the flag OFF too. Flare mood joins via
      flaresync/flarefanout, untouched.
   C2 stiffness.morning   musc.mjStiff ⇄ CFModLogs.unlock — identical
      scales, two stores. Both surfaces stay (tool = quick surface,
      rule R4); values two-way synced with a per-day marker.
   C3 cycle.flow   pelvic.pvBleed ⇄ CFModLogs.cycle — same options
      ('None' = no cycle day). Two-way with marker.
   C4 mouth.ulcers   CFModLogs.mouth[] → 'Mouth ulcer' chip in skChips.
      One-way (a chip can't invent a mouth region); never removes.

   Rules: runs ONLY while the unified journal flag is ON (flag OFF =
   the previous app, bit for bit — D6). Additive `_canonSync` marker
   inside the day record (same pattern as _flareSync/_sync) makes every
   write idempotent and lets a manual edit on either surface win.
   Nothing is ever deleted; no component code is touched.
   =================================================================== */

/* C1 bijections (exported — flarefanout/flaresync reuse them) */
const CFC_W2M = { 'Sunny': 'Fighter', 'Partly cloudy': 'Positive', 'Cloudy': 'Balanced', 'Rainy': 'Negative', 'Stormy': 'Depressed' };
const CFC_M2W = { 'Fighter': 'Sunny', 'Positive': 'Partly cloudy', 'Balanced': 'Cloudy', 'Negative': 'Rainy', 'Depressed': 'Stormy' };
const CFC_W2N = { 'Sunny': 5, 'Partly cloudy': 4, 'Cloudy': 3, 'Rainy': 2, 'Stormy': 1 };
const CFC_N2W = { 5: 'Sunny', 4: 'Partly cloudy', 3: 'Cloudy', 2: 'Rainy', 1: 'Stormy' };

/* `cfMoodToneUnified()` lived here until 8 Sep 2026. It answered «is
   mood.tone asked as Inner weather?», and the answer is now always no:
   Mindset is the question, for everybody. Deleted rather than left
   lying — both call sites (checkin.jsx, checkinflow.jsx) simply ask
   Mindset now, and its two guards were written so that an absent
   function meant exactly that. Never re-add it. */

let cfcBusy = false;
function cfCanonicalFanout() {
  if (cfcBusy) return;
  if (!window.cfUnifiedJournalEnabled || !cfUnifiedJournalEnabled()) return;  /* D6 */
  if (!window.CFModLogs || !window.CFModules) return;
  cfcBusy = true;
  try {
    let store;
    try { store = JSON.parse(localStorage.getItem('cf-checkins') || '{}') || {}; } catch (e) { store = {}; }
    const ml = CFModLogs.get();
    const unlock = ml.unlock || {}, cycle = ml.cycle || {};
    const mouthDays = new Set((ml.mouth || []).map((m) => m && m.d).filter(Boolean));
    const days = new Set([...Object.keys(store), ...Object.keys(unlock), ...Object.keys(cycle), ...mouthDays]);
    let ckChanged = false;
    const mlWrites = [];

    days.forEach((ds) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ds)) return;
      const rec0 = store[ds] || null;
      let rec = rec0 ? { ...rec0 } : null;
      let dirty = false;
      const cs = { ...((rec0 && rec0._canonSync) || {}) };
      const ensure = () => { if (!rec) { rec = {}; } };

      /* ---- C1 mood.tone: the in-record leg moved to cfJournalMirror() ---- */

      /* ---- C2 stiffness.morning: mjStiff ⇄ unlock[ds] ---- */
      const uv = unlock[ds] || null;
      const jv = (rec && rec.mjStiff) || null;
      if (jv && jv !== cs.stiff && jv !== uv) {            /* journal edited → tool */
        mlWrites.push(['unlock', ds, jv]); cs.stiff = jv; dirty = true;
      } else if (uv && uv !== cs.stiff && jv !== uv) {     /* tool edited → journal */
        ensure(); rec.mjStiff = uv; cs.stiff = uv; dirty = true;
      } else if (jv && jv === uv && cs.stiff !== jv) { cs.stiff = jv; dirty = true; }

      /* ---- C3 cycle.flow: pvBleed ⇄ cycle[ds] ---- */
      const cyv = cycle[ds] || null;                        /* 'Spotting'|'Normal'|'Heavy' */
      const jf = (rec && rec.pvBleed) || null;              /* + 'None' */
      if (jf && jf !== cs.flow) {                           /* journal answer changed */
        if (jf === 'None') { if (cyv) mlWrites.push(['cycle', ds, null]); }
        else if (cyv !== jf) mlWrites.push(['cycle', ds, jf]);
        cs.flow = jf; dirty = true;
      } else if (cyv && cyv !== cs.flow && jf !== cyv) {    /* tool day set/changed → journal */
        ensure(); rec.pvBleed = cyv; cs.flow = cyv; dirty = true;
      } else if (!cyv && cs.flow && cs.flow !== 'None' && jf === cs.flow) {
        rec.pvBleed = 'None'; cs.flow = 'None'; dirty = true; /* tool day cleared → journal (synced value only) */
      }

      /* ---- C4 mouth spots → 'Mouth ulcer' chip (one-way, never removes) ---- */
      if (mouthDays.has(ds)) {
        ensure();
        const chips = rec.skChips || [];
        if (chips.indexOf('Mouth ulcer') < 0) { rec.skChips = [...chips, 'Mouth ulcer']; dirty = true; }
      }

      if (rec && dirty) {
        if (Object.keys(cs).length) rec._canonSync = cs;
        store[ds] = rec; ckChanged = true;
      }
    });

    if (ckChanged) {
      try { localStorage.setItem('cf-checkins', JSON.stringify(store)); } catch (e) {}
      try { window.dispatchEvent(new Event('cf-checkin-sync')); } catch (e) {}
    }
    /* tool-store writes go through the public API (fires cf-modlogs-updated;
       re-entry is busy-guarded and re-runs settle by equality) */
    mlWrites.forEach(([kind, ds, v]) => {
      try { kind === 'unlock' ? CFModLogs.setUnlock(ds, v) : CFModLogs.setCycleDay(ds, v); } catch (e) {}
    });
  } catch (e) {} finally { cfcBusy = false; }
}

/* ===================================================================
   THE JOURNAL MIRROR (8 Sep 2026) — the five questions the poda took
   out keep their box written, underneath.
   -------------------------------------------------------------------
   39 of the 49 conditions were being asked the same measure twice
   with two different names, and Endometriosis answered pain FOUR
   times in one evening. The repeated row is gone from both ways of
   filling the journal (the form and the evening flow); this is what
   keeps every chart, the radar, the analytics and the PDF a doctor
   reads exactly as they were — the C1 pattern, one measure, every
   original path:

     mjPain    ← pain      (musc on)           same 0–10 scale
     pvPain    ← pain      (pelvic on)         same 0–10 scale
     mdWeather ← mindset   (everybody)         C1 bijection
     mdSteady  ← clean     (mind on + urges)   Clean→Steady day · Slip→Had a slip
     love      ← mdConnect (mind on)           Alone all day→No · A little/Plenty→Yes

   🔴 It is NOT gated on the unified flag. The rows are hidden with
   the flag off as well, so the fields have to be written with the
   flag off as well (this is the one difference from C1–C4 above).
   🔴 IT NEVER TOUCHES AN ANSWER IT DID NOT WRITE. `_mirror` (the
   `_canonSync`/`_flareSync` pattern) remembers the last value this
   function put in each box: a box is only written when it is empty,
   when it still holds what the mirror itself wrote, or when it still
   holds the untouched CF_DEFAULTS value (the form spread the
   defaults into a day the moment you touched it until TAP20, 16 Sep
   2026 — OLD records still carry them, so this test stays for them,
   exactly like the one flarefanout.jsx makes). A real answer from
   before, and anything
   flaresync wrote from the shelter (a day's PEAK pain), stays.
   🔴 mdWeather is the one mirror WITHOUT a module gate, on purpose:
   C1 has been writing it from mindset for every account since July,
   and a chart must not lose a year of history because a row moved.
   =================================================================== */
const CFM_MIRRORS = [
  { dst: 'mjPain', src: 'pain', mod: 'musc', map: (v) => (typeof v === 'number' && isFinite(v) ? v : null) },
  { dst: 'pvPain', src: 'pain', mod: 'pelvic', map: (v) => (typeof v === 'number' && isFinite(v) ? v : null) },
  { dst: 'mdWeather', src: 'mindset', map: (v) => CFC_M2W[v] || null },
  { dst: 'mdSteady', src: 'clean', mod: 'mind', gate: 'urges', map: (v) => (v === 'Clean' ? 'Steady day' : v === 'Slip' ? 'Had a slip' : null) },
  { dst: 'love', src: 'mdConnect', mod: 'mind', map: (v) => (v === 'Alone all day' ? 'No' : (v === 'A little' || v === 'Plenty') ? 'Yes' : null) },
];
let cfmBusy = false;
function cfJournalMirror() {
  if (cfmBusy) return;
  cfmBusy = true;
  try {
    let store;
    try { store = JSON.parse(localStorage.getItem('cf-checkins') || '{}') || {}; } catch (e) { store = {}; }
    const on = (mod) => { try { return !!(window.CFModules && CFModules.isOn(mod)); } catch (e) { return false; } };
    let gates = {};
    try { gates = (window.smMindGates && smMindGates()) || {}; } catch (e) { gates = {}; }
    const DEF = window.CF_DEFAULTS || {};
    const live = CFM_MIRRORS.filter((m) => (!m.mod || on(m.mod)) && (!m.gate || !!gates[m.gate]));
    if (!live.length) { cfmBusy = false; return; }
    let changed = false;
    Object.keys(store).forEach((ds) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ds)) return;
      const rec0 = store[ds];
      if (!rec0 || typeof rec0 !== 'object') return;
      let rec = rec0, dirty = false;
      const mk = { ...(rec0._mirror || {}) };
      live.forEach((m) => {
        const want = m.map(rec0[m.src]);
        if (want == null) return;
        const cur = rec[m.dst];
        const empty = cur == null || cur === '';
        const mine = mk[m.dst] !== undefined && String(cur) === String(mk[m.dst]);
        const isDef = DEF[m.dst] !== undefined && String(cur) === String(DEF[m.dst]);
        if (!empty && !mine && !isDef) return;               /* somebody else's answer — never touched */
        if (String(cur) === String(want)) { if (mk[m.dst] !== want) { mk[m.dst] = want; dirty = true; } return; }
        if (rec === rec0) rec = { ...rec0 };
        rec[m.dst] = want; mk[m.dst] = want; dirty = true;
      });
      if (dirty) {
        if (rec === rec0) rec = { ...rec0 };
        rec._mirror = mk; store[ds] = rec; changed = true;
      }
    });
    if (changed) {
      try { localStorage.setItem('cf-checkins', JSON.stringify(store)); } catch (e) {}
      try { window.dispatchEvent(new Event('cf-checkin-sync')); } catch (e) {}
    }
  } catch (e) {} finally { cfmBusy = false; }
}

/* triggers: journal writes (saveStore hook in checkin.jsx), tool writes,
   flaresync passes, and load */
try {
  window.addEventListener('cf-modlogs-updated', () => cfCanonicalFanout());
  window.addEventListener('cf-checkin-sync', () => { cfCanonicalFanout(); cfJournalMirror(); });
  setTimeout(() => { cfCanonicalFanout(); cfJournalMirror(); }, 500);
} catch (e) {}

Object.assign(window, { cfCanonicalFanout, cfJournalMirror, CFM_MIRRORS, CFC_W2M, CFC_M2W, CFC_W2N, CFC_N2W });
})();
