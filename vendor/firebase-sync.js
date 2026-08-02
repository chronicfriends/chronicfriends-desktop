/* ===== Firebase · Motor de sincronización de SALUD (Fase 3) ============
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design. Espeja en la nube (Firestore) SOLO las "cajas" de datos de salud,
   privadas por usuario, SIN tocar la UI. La app sigue leyendo/escribiendo
   localStorage como siempre; este motor observa esas escrituras y las
   sincroniza por debajo.

   Reglas de oro:
   • LISTA BLANCA: solo se sincroniza lo listado en HEALTH_KEYS. Cualquier otra
     clave (credenciales cf_creds_v1, sesión, idioma, cachés, comunidad…) NUNCA
     sube. Un dato nuevo desconocido se queda en el móvil por defecto.
   • Aislamiento por uid: cada dato va a users/{uid}/health/{caja}. Las reglas
     de Firestore garantizan que SOLO su dueño lo lee/escribe.
   • Última escritura gana (LWW) por marca de tiempo de cliente (campo `ts`).
   • Guardia de tamaño: un doc de Firestore no puede pasar de ~1 MiB; si una
     caja es mayor (p.ej. foto-diario con imágenes base64) NO se sube y se avisa
     (esas fotos irán a Firebase Storage en una fase futura).

   Requiere: window.CFStore (firebase-firestore.js) y window.CFFirebase
   (firebase-init.js). Carga después de ambos y de firebase-auth-wire.js.
   ===================================================================== */
(function () {
  'use strict';

  /* ---- LISTA BLANCA de cajas de salud (privadas, por uid) -------------- */
  var HEALTH_KEYS = [
    'cf_profile_v1', 'cf_plan_v1', 'cf_modules_v1', 'cf_modlogs_v1',
    'cf_flaremode', 'cf_flaremode_v1', 'cf_flaremode_log_v1', 'cf_flaremode_hist_v1',
    'cf_flaremode_kitchen_v1', 'cf_flaremode_longcare_v1', 'cf_flaremode_meals_v1',
    'cf_flaremode_rec_v1', 'cf_flare_fireflies_v1', 'cf_unified_journal_v1',
    'cf_meds_v3', 'cf_taken_v2', 'cf_photodiary_v1', 'cf_health_card_v1',
    'cf_healthsync_v1', 'cf_food_tolerance_v1', 'cf_streak_v2', 'cf_ncomfort_v1',
    'cf_rating_v1', 'cf_notif_pref_v1', 'cf_notify_country_v1', 'cf_onboarded_v1',
    'cf_scanusage_v1', 'cf_last_export_v1', 'cf_radar_optout_v1', 'cf_member_since_v1',
    'cf_saved_posts_v1', 'cf_drcf_sessions_v1', 'cf_consults_v1', 'cf_consult_invites_v1',
    'cf_pt_consults_v1', 'cf_doc_live_start_v1', 'cf_doc_req_state_v1', 'cf_best_friends_v1'
  ];
  var HEALTH_SET = {}; HEALTH_KEYS.forEach(function (k) { HEALTH_SET[k] = true; });

  var MAX_BYTES = 900000;          /* margen bajo el límite de 1 MiB/doc de Firestore */
  var META_KEY = 'cf_sync_meta_v1'; /* device-local: { docId: ts } de lo ya sincronizado (NO sube) */
  var DEBOUNCE_MS = 1500;

  /* base de una clave de localStorage: 'cfns:<uid>:cf_plan_v1' → 'cf_plan_v1' */
  function baseOf(key) { var i = String(key).lastIndexOf(':'); return i >= 0 ? key.slice(i + 1) : key; }
  function isHealthKey(key) { return HEALTH_SET[baseOf(key)] === true; }
  function docIdFor(key) { return baseOf(key); }   /* la caja es el id del doc */

  function CF() { return window.CFFirebase; }
  function ST() { return window.CFStore; }
  function usable() { return !!(ST() && ST().available && CF() && CF().available); }
  function uid() { try { var u = CF().currentUser(); return u && u.uid || null; } catch (e) { return null; } }
  function verified() { try { var u = CF().currentUser(); return !!(u && u.emailVerified); } catch (e) { return false; } }
  function active() { return usable() && !!uid() && verified(); }

  /* setItem original (para escribir valores bajados SIN disparar el interceptor) */
  var rawSet = window.localStorage.setItem.bind(window.localStorage);

  function loadMeta() { try { return JSON.parse(localStorage.getItem(META_KEY)) || {}; } catch (e) { return {}; } }
  function saveMeta(m) { try { rawSet(META_KEY, JSON.stringify(m)); } catch (e) {} }
  function byteLen(s) { try { return new Blob([s]).size; } catch (e) { return (s || '').length; } }

  /* nowMillis SIN Date.now directo (el arnés de test lo puede inyectar); en el
     navegador usamos el reloj real. */
  function now() { try { return (window.CFClock && CFClock.now && CFClock.now()) || Date.now(); } catch (e) { return Date.now(); } }

  /* ---- FB13: cajas con FOTO que va a Storage (no como base64 en Firestore) --
     Para cf_health_card_v1: la imagen base64 se sube a Storage (users/{uid}/
     health/card/main.jpg) y en Firestore va SOLO la URL (`photoUrl`). Así el doc
     no infla ni choca con el límite de 1 MiB. El localStorage local NO se toca
     (sigue con la foto base64 → la tarjeta se ve OFFLINE en emergencias). */
  var CARD_KEY = 'cf_health_card_v1';
  var CARD_PHOTO_PATH = 'card/main.jpg';
  function photosReady() { return !!(window.CFPhotos && CFPhotos.available && CFPhotos.active && CFPhotos.active()); }

  /* transforma el value LOCAL → value para la NUBE (sube la foto si hace falta).
     Devuelve Promise<string>. Si algo falla, devuelve el value original (el
     guardia de tamaño decidirá) — nunca rompe la sincronización de las demás. */
  function toCloudValue(base, val) {
    if (base !== CARD_KEY || !photosReady()) return Promise.resolve(val);
    var card; try { card = JSON.parse(val); } catch (e) { return Promise.resolve(val); }
    if (!card || typeof card !== 'object') return Promise.resolve(val);
    var photo = card.photo;
    if (!photo) {                                   /* sin foto → borra el objeto en Storage */
      try { CFPhotos.del(CARD_PHOTO_PATH); } catch (e) {}
      var c0 = Object.assign({}, card); delete c0.photo; c0.photoUrl = null;
      return Promise.resolve(JSON.stringify(c0));
    }
    if (String(photo).indexOf('http') === 0) {      /* ya es URL (bajada de otro móvil) → no re-subir */
      var c1 = Object.assign({}, card); c1.photo = null; c1.photoUrl = photo;
      return Promise.resolve(JSON.stringify(c1));
    }
    if (String(photo).indexOf('data:') === 0) {     /* base64 → sube a Storage, guarda solo la URL */
      return CFPhotos.putDataURL(CARD_PHOTO_PATH, photo).then(function (r) {
        if (r && r.ok && r.url) {
          var c2 = Object.assign({}, card); c2.photo = null; c2.photoUrl = r.url;
          return JSON.stringify(c2);
        }
        return val;                                 /* subida falló → deja el value original */
      }).catch(function () { return val; });
    }
    return Promise.resolve(val);
  }

  /* transforma el value BAJADO de la nube → value LOCAL (URL lista para <img>) */
  function toLocalValue(base, value) {
    if (base !== CARD_KEY || value == null) return value;
    var card; try { card = JSON.parse(value); } catch (e) { return value; }
    if (card && typeof card === 'object' && card.photoUrl && !card.photo) {
      card.photo = card.photoUrl;                   /* la UI pinta <img src={photo}> con la URL */
      return JSON.stringify(card);
    }
    return value;
  }

  /* ---- PUSH: sube una caja de salud a la nube -------------------------- */
  function pushKey(fullKey, isRetry) {
    if (!active()) return;
    var base = baseOf(fullKey);
    var val = null; try { val = localStorage.getItem(fullKey); } catch (e) {}
    var u = uid();
    var path = 'users/' + u + '/health/' + docIdFor(fullKey);
    var meta = loadMeta();
    if (val == null) {                                /* la app borró la caja → borra en la nube */
      ST().del(path); delete meta[base]; saveMeta(meta);
      if (base === CARD_KEY) { try { if (photosReady()) CFPhotos.del(CARD_PHOTO_PATH); } catch (e) {} }
      return;
    }
    toCloudValue(base, val).then(function (cloudVal) {
      if (byteLen(cloudVal) > MAX_BYTES) {
        try { console.warn('[CFSync] "' + base + '" supera ' + MAX_BYTES + ' bytes — NO se sube'); } catch (e) {}
        return;
      }
      var ts = now();
      ST().set(path, { key: fullKey, value: cloudVal, ts: ts, updatedAt: ST().serverTime() }).then(function (r) {
        if (r && r.ok) { meta[base] = ts; saveMeta(meta); return; }
        /* rechazo por reglas: el token puede llevar claims viejos (email_verified
           tras verificar una cuenta nueva). Refresca el token y reintenta 1 vez. */
        if (!isRetry && r && String(r.code).indexOf('permission-denied') >= 0) {
          try { console.warn('[CFSync] push rechazado (permission-denied) — refresco token y reintento'); } catch (e) {}
          CF().refreshToken().then(function () { pushKey(fullKey, true); });
        }
      });
    });
  }

  /* ---- interceptor de escrituras de la app ----------------------------- */
  var pending = {};   /* fullKey → true */
  var timer = null;
  /* arranca la sync (listener + refresh de token) de forma perezosa si aún no
     está activa — cubre el caso de que onState no se re-dispare tras verificar */
  function maybeStart() { if (active() && !colUnsub) { try { startSync(); } catch (e) {} } }
  function scheduleFlush() {
    maybeStart();
    if (timer) return;
    timer = setTimeout(function () {
      timer = null;
      var keys = Object.keys(pending); pending = {};
      keys.forEach(function (k) { pushKey(k); });
    }, DEBOUNCE_MS);
  }
  var _applying = false;   /* true mientras aplicamos valores BAJADOS (no reenviar) */
  var origSet = window.localStorage.setItem;
  var origRemove = window.localStorage.removeItem;
  try {
    window.localStorage.setItem = function (k, v) {
      var r = origSet.apply(this, arguments);
      if (!_applying && isHealthKey(k)) { pending[k] = true; scheduleFlush(); }
      return r;
    };
    window.localStorage.removeItem = function (k) {
      var r = origRemove.apply(this, arguments);
      if (!_applying && isHealthKey(k)) { pending[k] = true; scheduleFlush(); }
      return r;
    };
  } catch (e) { try { console.warn('[CFSync] no pude interceptar localStorage'); } catch (e2) {} }

  /* aplica un valor bajado de la nube al localStorage SIN reenviarlo */
  function applyDown(fullKey, value) {
    _applying = true;
    try { if (value == null) localStorage.removeItem(fullKey); else localStorage.setItem(fullKey, value); }
    catch (e) {}
    _applying = false;
    /* avisa a la app para que repinte (usa el mismo evento 'storage' que ya escucha) */
    try { window.dispatchEvent(new Event('cf-sync-pulled')); } catch (e) {}
    try { window.dispatchEvent(new Event('storage')); } catch (e) {}
  }

  /* ---- reconciliación al iniciar sesión + escucha en vivo -------------- */
  var colUnsub = null;
  function startSync() {
    if (!active()) return;
    var u = uid();
    if (colUnsub) { try { colUnsub(); } catch (e) {} colUnsub = null; }

    /* 0) refresca el ID token para que las reglas vean email_verified al día
          (cuenta recién verificada) antes de la primera subida */
    try { CF().refreshToken(); } catch (e) {}

    /* 1) escucha la colección de salud en la nube → baja lo más nuevo (LWW).
          Se asigna colUnsub PRIMERO para que maybeStart() no reentre en startSync. */
    colUnsub = ST().onCol('users/' + u + '/health', function (docs) {
      var meta = loadMeta();
      docs.forEach(function (d) {
        var base = d._id;
        var localTs = meta[base] || 0;
        var cloudTs = d.ts || 0;
        if (cloudTs > localTs && d.key) {
          var incoming = toLocalValue(base, d.value);   /* FB13: URL de foto lista para <img> */
          var localVal = null; try { localVal = localStorage.getItem(d.key); } catch (e) {}
          if (localVal !== incoming) { applyDown(d.key, incoming); }
          meta[base] = cloudTs; saveMeta(meta);
        }
      });
    });

    /* 2) empuja de inicio las cajas locales que aún no estén sincronizadas */
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && isHealthKey(k)) { pending[k] = true; }
      }
      scheduleFlush();
    } catch (e) {}
    try { console.log('[CFSync] sincronización de salud ACTIVA para uid', u); } catch (e) {}
  }
  function stopSync() {
    if (colUnsub) { try { colUnsub(); } catch (e) {} colUnsub = null; }
  }

  /* arranca/para según el estado de autenticación */
  try {
    CF().onState(function (user) {
      if (user && user.emailVerified) { startSync(); }
      else { stopSync(); }
    });
  } catch (e) {}

  /* vaciar la cola pendiente antes de cerrar/ocultar la app */
  try {
    window.addEventListener('pagehide', function () { var ks = Object.keys(pending); pending = {}; ks.forEach(function (k) { pushKey(k); }); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') { var ks = Object.keys(pending); pending = {}; ks.forEach(function (k) { pushKey(k); }); }
    });
  } catch (e) {}

  /* API mínima para depurar / forzar */
  window.CFSync = {
    HEALTH_KEYS: HEALTH_KEYS,
    isHealthKey: isHealthKey,
    baseOf: baseOf,
    active: active,
    pushNow: function () { var ks = Object.keys(pending); pending = {}; ks.forEach(function (k) { pushKey(k); }); },
    _applyDown: applyDown
  };
  try { console.log('[CFSync] motor de salud cargado ·', HEALTH_KEYS.length, 'cajas en la lista blanca'); } catch (e) {}
})();
