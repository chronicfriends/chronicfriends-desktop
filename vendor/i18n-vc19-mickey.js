(function () {
  /* ===================================================================
     i18n-vc19-mickey — traducciones de las cadenas VISIBLES que llegaron
     sin traducir en el export de Claude Design del 13 ago 2026 (23:31),
     la tanda de 9 prompts de Mickey + los 4 parches.

     Detectadas comparando todas las llamadas tr()/trf() de los 20 ficheros
     que tocó el zip contra los 366 diccionarios i18n del proyecto.
     Sin esto salen EN INGLÉS en los 16 idiomas de la app.

     Los 15 idiomas de la app. Inglés es la clave. Merge-if-missing.
     «Chronic Friends» NUNCA se traduce. Los {n} y {t} y las etiquetas
     <strong> se conservan tal cual.

     🔴 PENDIENTE de que CD las adopte EN ORIGEN: mientras vivan solo aquí,
     este fichero tiene que seguir inyectándose tras cada export.
     =================================================================== */
  if (typeof CF_UI_MAP === 'undefined') return;

  /* ✂️ PODADA el 2026-10-02 (tools/podar-capas-i18n.mjs): se quitaron 585 (clave, idioma)
     que Claude Design ya trae — cargábamos ANTES que sus diccionarios y nuestra versión vieja ganaba
     a la suya. Aquí solo queda lo que CD no tiene. */
  /* 2 oct 2026 (export 1.0.8d): las 8 claves que quedaban tras la poda NO las usa ninguna pantalla
     (grep en webapp/build, vendor y native/App.js: 0) — frases muertas de pantallas que Claude Design ya
     rediseñó. Fuera. La capa queda vacía; se conserva el fichero porque actualizar-desde-design.sh lo inyecta. */
  var M = {};

  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = {};
    Object.keys(M[k]).forEach(function (lang) {
      if (!CF_UI_MAP[k][lang]) CF_UI_MAP[k][lang] = M[k][lang];
    });
  });
})();
