(function(){/* ===================================================================
   i18nfix10 — D5.8: purchase-failure notice on the onboarding paywall
   (choosePlan no longer swallows errors; this is the visible message).
   Merge-if-missing. Loaded after i18nfix9.
   =================================================================== */(function(){if(typeof CF_UI_MAP==='undefined')return;/* ✂️ PODADA el 2026-10-02 (tools/podar-capas-i18n.mjs): se quitaron 30 (clave, idioma)
     que Claude Design ya trae — cargábamos ANTES que sus diccionarios y nuestra versión vieja ganaba
     a la suya. Aquí solo queda lo que CD no tiene. */
  var M = {};

  Object.keys(M).forEach(function(k){if(!CF_UI_MAP[k])CF_UI_MAP[k]={};Object.keys(M[k]).forEach(function(lang){if(!CF_UI_MAP[k][lang])CF_UI_MAP[k][lang]=M[k][lang];});});})();
})();
