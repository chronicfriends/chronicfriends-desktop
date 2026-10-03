(function () {
  /* ===================================================================
     i18n-vc20-nh1 — traducciones de las cadenas VISIBLES que llegaron sin
     traducir en el export de Claude Design del 15 ago 2026 (vc20):

       · Las 13 de la pantalla NH1 rediseñada («Your next alarm»), que hasta
         hoy salía ENTERA en inglés en los 17 idiomas.
       · Las 4 del manual del paciente que la citan literalmente (el capítulo
         de los avisos y el paso de crear cuenta, que cambió de sitio).

     Detectadas comparando las llamadas tr()/trf() de build/notifhealth.js y
     build/manualpatient.js contra los 187 diccionarios i18n del proyecto,
     deshaciendo los escapes \uXXXX antes de comparar (sin eso salían 35
     falsas huérfanas del manual: la raya larga — se contaba como distinta).

     Los 15 idiomas de la app. Inglés es la clave. Merge-if-missing.
     «Chronic Friends» NUNCA se traduce; los {t} y las etiquetas <strong> se
     conservan exactos — comprobado uno a uno: 255 de 255 sin fallos.

     🔴 Retirar cuando Claude Design las adopte en origen.
     =================================================================== */
  var CF_UI_MAP = (window.CF_UI_MAP = window.CF_UI_MAP || {});
  /* ✂️ PODADA el 2026-10-02 (tools/podar-capas-i18n.mjs): se quitaron 240 (clave, idioma)
     que Claude Design ya trae — cargábamos ANTES que sus diccionarios y nuestra versión vieja ganaba
     a la suya. Aquí solo queda lo que CD no tiene. */
  /* 2 oct 2026: la única que quedaba («A reminder that never rings…») estaba REPETIDA en
     i18n-vc19-manual.js con otro texto, y esta capa carga antes: ganaba la de aquí, con «tu» en
     francés y citas viejas. Se queda solo la del manual (generada, corregida el 2 oct). */
  var M = {};

  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = {};
    Object.keys(M[k]).forEach(function (lang) {
      if (!CF_UI_MAP[k][lang]) CF_UI_MAP[k][lang] = M[k][lang];
    });
  });
})();
