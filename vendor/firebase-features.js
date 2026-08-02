/* SEC20 · Interruptores remotos — apagar una función sin publicar un build.
   ─────────────────────────────────────────────────────────────────────────
   Documento system/features en Firestore: un booleano por función. Lo escribe
   SOLO la herramienta admin de la Pi (tools/set-features.mjs); desde la app
   nadie puede tocarlo (regla SL12: system/* se lee logueado, se escribe nunca).

   Cómo actúa:
   • Este script corre DESPUÉS de definirse los componentes (build/foodscan.js…)
     y ANTES de montarse la app (build/app.js) → la copia cacheada de los
     interruptores (cf_features_v1) se aplica antes del primer render.
   • Tras el login se relee el documento y se recachea; un flag recién apagado
     se aplica también en caliente (surte efecto en el siguiente render, p.ej.
     al cambiar de pestaña). Encender de nuevo pide reabrir la app.
   • Sin red, sin doc o sin haberlo leído nunca → todo encendido. La app jamás
     se rompe por culpa de este mecanismo.
   • Apagar NUNCA borra el global: se sustituye por un stub que no pinta nada.
     (Lección CR_globe 1 ago: un ReferenceError deja TODA la app en blanco.)
   • El apagado manda aunque el usuario tenga Premium: el stub se pinta (vacío)
     antes de que ningún gate de Premium llegue a evaluarse. */
(function () {
  var KEY = 'cf_features_v1';

  /* interruptor → globales que dejan de pintarse cuando está en false.
     drcf y verified quedan RESERVADOS: sus módulos no se cargan desde el
     27 jul (UX16), pero si un build futuro los recupera, el flag ya manda.
     community también reservado: es pestaña principal (tabbar de app.jsx),
     apagarla exige cableado propio y se hará si algún día hace falta. */
  var GATES = {
    drcf:       ['DrCFScreen'],
    verified:   ['VerifiedAssistant', 'VerifiedEmblem'],
    foodscan:   ['FoodScanLauncher', 'FoodScanShortcut'],
    activity:   ['DiseaseActivityBlock'],
    healthsync: ['CFHealthSyncNotice', 'CFHealthSyncFlareCard', 'CFHealthSyncTodayCard',
                 'CFHealthSyncTodayNormalCard', 'HealthSyncPanel', 'HealthSyncSettingsRow'],
    community:  []
  };

  function Off() { return null; } /* stub: truthy (no rompe guardas), no pinta nada */

  function readCache() {
    try { var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; }
    catch (e) { return null; }
  }
  function writeCache(f) { try { localStorage.setItem(KEY, JSON.stringify(f)); } catch (e) {} }

  var flags = readCache() || {};
  var offApplied = {};

  function apply() {
    var hidden = [];
    Object.keys(GATES).forEach(function (f) {
      if (flags[f] === false && !offApplied[f]) {
        GATES[f].forEach(function (g) {
          if (typeof window[g] === 'function' && window[g] !== Off) { window[g] = Off; hidden.push(g); }
        });
        offApplied[f] = true;
      }
    });
    if (hidden.length) { try { console.log('[cf-features] apagado remoto:', hidden.join(', ')); } catch (e) {} }
  }

  window.CFFeatures = {
    isOn: function (name) { return flags[name] !== false; },
    all: function () {
      var o = {};
      Object.keys(GATES).forEach(function (k) { o[k] = flags[k] !== false; });
      return o;
    }
  };

  apply(); /* copia cacheada — antes del montaje de React */

  /* Tras el login, releer el documento y recachear (1 vez por arranque). */
  function watch() {
    if (!window.CFFirebase || !CFFirebase.available) return;
    if (!window.CFStore || !CFStore.available) return;
    var done = false;
    try {
      CFFirebase.onState(function (user) {
        if (!user || done) return;
        done = true;
        CFStore.get('system/features').then(function (data) {
          if (!data) return; /* sin doc → no tocar nada */
          var next = {};
          Object.keys(GATES).forEach(function (k) {
            if (typeof data[k] === 'boolean') next[k] = data[k];
          });
          flags = next; writeCache(next); apply();
          try { console.log('[cf-features] system/features leído:', JSON.stringify(window.CFFeatures.all())); } catch (e) {}
        });
      });
    } catch (e) { /* puente inerte → todo encendido */ }
  }
  watch();

  try { console.log('[cf-features] listo · cache=' + (readCache() ? 'sí' : 'no')); } catch (e) {}
})();
