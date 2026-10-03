(function () {
  /* ===================================================================
     i18n-vc20-restos — las 7 cadenas que TODAVIA salian en ingles en los
     15 idiomas, encontradas en el barrido completo del 15 ago 2026 (vc20).
     No venian del export de hoy: llevaban varias versiones ahi.

     Origen: flaremodecomfort (luz suave del Modo brote), healthsyncui,
     modjournal, onboarding (el tour del Flare Radar) y readingslog.

     🔴 «never used to predict anything» se traduce LITERAL en todos los
     idiomas: es lenguaje regulado (la app no predice nada) — comprobado
     idioma por idioma. «Flare Radar» y «Chronic Friends» no se traducen.
     =================================================================== */
  var CF_UI_MAP = (window.CF_UI_MAP = window.CF_UI_MAP || {});
  /* ✂️ PODADA el 2026-10-02 (tools/podar-capas-i18n.mjs): se quitaron 105 (clave, idioma)
     que Claude Design ya trae — cargábamos ANTES que sus diccionarios y nuestra versión vieja ganaba
     a la suya. Aquí solo queda lo que CD no tiene. */
  var M = {};

  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = {};
    Object.keys(M[k]).forEach(function (lang) {
      if (!CF_UI_MAP[k][lang]) CF_UI_MAP[k][lang] = M[k][lang];
    });
  });
})();
