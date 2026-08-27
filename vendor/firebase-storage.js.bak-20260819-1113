/* ===== Firebase · Storage — puente de FOTOS de salud (Fase 3, FB13) =====
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design. Sube las imágenes de salud (tarjeta médica, foto-diario) a Firebase
   Storage bajo users/{uid}/health/**, que las storage.rules (FB5) aíslan por
   dueño verificado. Expone window.CFPhotos con una API mínima y defensiva.

   Por qué Storage y no Firestore: una imagen base64 mete cientos de KB en un
   doc de Firestore (límite 1 MiB/doc + coste por lectura). Storage guarda el
   binario aparte y en Firestore va SOLO la URL de descarga.

   Defensivo: si el SDK de Storage no cargó, no hay red o no hay sesión
   verificada, `available`/`putDataURL` degradan a un fallo controlado y NADA
   rompe — la foto se queda como hoy (local en el dispositivo).

   Requisitos de carga (index.html, en este orden):
     firebase-app-compat.js → firebase-auth-compat.js →
     firebase-storage-compat.js → firebase-init.js → firebase-storage.js
   ===================================================================== */
(function () {
  'use strict';

  function ok(extra) { return Object.assign({ ok: true }, extra || {}); }
  function fail(e) {
    return { ok: false, code: (e && e.code) || 'unknown', message: (e && e.message) || String(e) };
  }

  var haveSDK = typeof window.firebase !== 'undefined'
    && window.firebase.storage
    && window.firebase.apps && window.firebase.apps.length > 0;

  if (!haveSDK) {
    window.CFPhotos = {
      available: false,
      _reason: 'storage-sdk-or-app-missing',
      putDataURL: function () { return Promise.resolve({ ok: false, code: 'unavailable' }); },
      del: function () { return Promise.resolve({ ok: false, code: 'unavailable' }); }
    };
    try { console.warn('[CFPhotos] Storage no disponible (SDK/app ausente) — puente inerte'); } catch (e) {}
    return;
  }

  var storage = window.firebase.storage();

  /* ---- FB9 · reintentos con backoff exponencial + jitter --------------------
     Igual que en CFStore: las subidas de fotos de salud pueden fallar por red
     transitoria. Se reintenta con espera creciente + jitter. Es seguro porque
     el subpath es determinista (idempotente: re-subir sobrescribe el mismo
     objeto). No se reintentan errores deterministas (no-session, not-a-data-url)
     ni los de permisos. */
  var RETRYABLE = {
    'storage/retry-limit-exceeded': true, 'storage/canceled': true,
    'storage/unknown': true, 'storage/server-file-wrong-size': true
  };
  var MAX_RETRIES = 4;
  var BASE_DELAY = 500;
  function withRetry(fn) {
    function attempt(n) {
      return fn().then(function (r) {
        if (r && r.ok) return r;
        if (n >= MAX_RETRIES || !r || !RETRYABLE[r.code]) return r;
        var delay = BASE_DELAY * Math.pow(2, n) + Math.floor(Math.random() * BASE_DELAY);
        try { console.warn('[CFPhotos] reintento ' + (n + 1) + '/' + MAX_RETRIES + ' tras "' + r.code + '" en ' + delay + 'ms'); } catch (e) {}
        return new Promise(function (resolve) {
          setTimeout(function () { resolve(attempt(n + 1)); }, delay);
        });
      });
    }
    return attempt(0);
  }

  function CF() { return window.CFFirebase; }
  function uid() { try { var u = CF().currentUser(); return u && u.uid || null; } catch (e) { return null; } }
  function verified() { try { var u = CF().currentUser(); return !!(u && u.emailVerified); } catch (e) { return false; } }
  /* solo operamos con sesión verificada: las reglas lo exigen igual */
  function active() { return !!uid() && verified(); }

  /* ref a users/{uid}/health/{subpath} (donde las reglas permiten al dueño) */
  function healthRef(subpath) { return storage.ref('users/' + uid() + '/health/' + subpath); }

  window.CFPhotos = {
    available: true,
    active: active,

    /* sube un data URL base64 (data:image/...;base64,...) y devuelve {ok,url}
       con la downloadURL pública-con-token para pintarla con <img src>. */
    putDataURL: function (subpath, dataURL) {
      if (!active()) return Promise.resolve({ ok: false, code: 'no-session' });
      if (typeof dataURL !== 'string' || dataURL.indexOf('data:') !== 0) {
        return Promise.resolve({ ok: false, code: 'not-a-data-url' });
      }
      return withRetry(function () {
        try {
          var ref = healthRef(subpath);
          return ref.putString(dataURL, 'data_url')
            .then(function () { return ref.getDownloadURL(); })
            .then(function (url) { return ok({ url: url }); })
            .catch(fail);
        } catch (e) { return Promise.resolve(fail(e)); }
      });
    },

    /* sube un Blob (lo usará el foto-diario en Fase 2, que trabaja con Blobs) */
    putBlob: function (subpath, blob, contentType) {
      if (!active()) return Promise.resolve({ ok: false, code: 'no-session' });
      return withRetry(function () {
        try {
          var ref = healthRef(subpath);
          var meta = contentType ? { contentType: contentType } : undefined;
          return ref.put(blob, meta)
            .then(function () { return ref.getDownloadURL(); })
            .then(function (url) { return ok({ url: url }); })
            .catch(fail);
        } catch (e) { return Promise.resolve(fail(e)); }
      });
    },

    /* borra el objeto (no falla si ya no existe) */
    del: function (subpath) {
      if (!active()) return Promise.resolve({ ok: false, code: 'no-session' });
      try {
        return healthRef(subpath).delete()
          .then(function () { return ok(); })
          .catch(function () { return { ok: false }; });   /* object-not-found → no pasa nada */
      } catch (e) { return Promise.resolve({ ok: false }); }
    }
  };
  try { console.log('[CFPhotos] motor de fotos de salud cargado · available=true'); } catch (e) {}
})();
