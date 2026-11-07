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
   • Solo sube lo que ha CAMBIADO aquí, y nunca a ciegas (A9 bis, abajo).
   • Guardia de tamaño: un doc de Firestore no puede pasar de ~1 MiB; si una
     caja es mayor NO se sube y se avisa.
   • 📸 EL FOTO-DIARIO NO SE RESPALDA, Y AQUÍ NO SE PROMETE QUE SÍ (FB19,
     23 ago 2026). `cf_photodiary_v1` estuvo meses en esta lista y NUNCA subió
     ni una foto: photodiary.jsx guarda en IndexedDB (store `photos`) y este
     motor solo intercepta escrituras de localStorage, así que la clave no
     llegaba a mirarse. No rompía nada — pero cualquiera que leyera la lista
     para decidir (yo incluido, el 13 ago) concluía que las fotos de un
     paciente estaban a salvo. Fuera de la lista: las fotos viven SOLO en el
     teléfono y se pierden si se desinstala la app. Si algún día se respaldan
     de verdad, será por Firebase Storage (como la tarjeta médica, FB13) y NO
     volviendo a poner la clave aquí, que no serviría de nada.

   🔴 A9 bis (7 nov 2026 · auditoría del 5 nov) — UN MÓVIL CON DATOS VIEJOS YA
   NO PISA LO NUEVO DEL OTRO. Hasta hoy, cada vez que se abría la app el motor
   volvía a subir TODAS las cajas con la hora del momento, aunque no hubieran
   cambiado. Si la nube tardaba más de 1,5 s en contestar, la copia vieja ganaba
   y borraba en los DOS aparatos el diario, la medicación o el modo brote nuevos.
   Ahora:
     1. Solo sube lo que ha cambiado AQUÍ. De cada caja se guarda la huella del
        valor que este móvil tenía cuando quedó al día con la nube (su BASE). Si
        el valor de ahora tiene otra huella, es un cambio de aquí. Reescribir el
        mismo valor (la pantalla de Medicación al montarse) no es un cambio.
     2. Antes de escribir, lee la nube, y escribe solo si nadie ha escrito
        entretanto (CFStore.setIfNotNewer, una transacción). Sin red no escribe:
        el cambio sigue pendiente por su huella —aunque se cierre la app— y sale
        cuando vuelva la red.
     3. Si la caja cambió AQUÍ y también en la NUBE desde la base, en las cajas
        que son objetos (el diario por días, las tomas por dosis, la tarjeta…)
        se JUNTAN los dos cambios: se queda lo que cambió cada lado, también
        DENTRO de una misma entrada, campo a campo (el día de hoy con los pasos
        que rellena Health Sync aquí y el ánimo que se apuntó en el otro móvil se
        quedan los dos). Solo si los dos cambiaron el MISMO campo gana el cambio
        más reciente. En las demás cajas gana el cambio más reciente. Lo de aquí
        que pierde un choque se guarda en el móvil (cf_sync_conflicts_v1, los 5
        últimos), para poder recuperarlo.
     4. Primer arranque con este motor (cajas aún sin huella): al arrancar se
        mira cada una contra la nube. Si la nube no se ha movido desde la última
        sincronización y aquí hay otra cosa, es un cambio de aquí y sube. Si la
        nube sí se movió, se juntan las entradas de los dos lados y, en un
        choque, gana la nube (de una copia sin base no se puede saber si es nueva
        o vieja: lo seguro es no pisar).
     5. Lo que no se pudo GUARDAR aquí (almacenamiento lleno) nunca se da por
        sincronizado; borrar en la nube va con la misma condición que escribir
        (CFStore.delIfNotNewer); y las vueltas que se repiten esperan, como
        cualquier cambio, en vez de leer la nube sin parar.
   Revisión independiente del 7 nov (auditorias/20261107-revision-a9bis/INFORME.md,
   Historial CF [4138]): H1-H6 corregidos aquí; H7 (un día borrado en el otro móvil
   puede volver UNA vez en el primer arranque sin caché) queda como límite conocido.
   Estado del aparato, por cuenta (CFNS lo guarda en el espacio de cada cuenta;
   nada de esto sube):
     cf_sync_meta_v1      { caja: ts de la versión de la nube que es la base } (ya existía)
     cf_sync_hash_v1      { caja: huella del valor local de esa base } ('-' = no existe)
     cf_sync_basekeys_v1  { caja: { entrada: huella } } de la base, si la caja es un objeto
     cf_sync_alias_v1     { cf_health_card_v1: { photo: huella de la URL de su foto en la nube } }
     cf_sync_edit_v1      { caja: hora del último cambio hecho aquí que aún no ha subido }
     cf_sync_conflicts_v1 [ lo de aquí que perdió un choque: {caja, a, valor} ] (los 5 últimos)
   Bancos: tools/tests/arranque-sync-harness.mjs (A9 bis, con control negativo) ·
   bienvenida-sync-harness.mjs · chat1-sync-harness.mjs · sync-harness.mjs

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
    'cf_meds_v3', 'cf_taken_v2', 'cf_health_card_v1',
    'cf_healthsync_v1', 'cf_food_tolerance_v1', 'cf_streak_v2', 'cf_ncomfort_v1',
    'cf_rating_v1', 'cf_notif_pref_v1', 'cf_notify_country_v1', 'cf_onboarded_v1',
    'cf_scanusage_v1', 'cf_last_export_v1', 'cf_radar_optout_v1', 'cf_member_since_v1',
    'cf_saved_posts_v1',
    /* MURO1 (18 oct 2026): el filtro del muro y de la Sala (enfermedad + idioma) se queda
       guardado y sigue a la persona en otro móvil, como las publicaciones guardadas. */
    'cf_feed_filter_v1',
    'cf_drcf_sessions_v1', 'cf_consults_v1', 'cf_consult_invites_v1',
    'cf_pt_consults_v1', 'cf_doc_live_start_v1', 'cf_doc_req_state_v1', 'cf_best_friends_v1',

    /* 🔴 FB21 (16 sep 2026) — LAS CAJAS ANTIGUAS, LAS DEL GUION. Esta lista se
       escribió el 13 jul con el criterio «cf_algo_v1» y se dejó fuera, sin querer,
       a las cajas más viejas, que se llaman con guion. Consecuencia: el DIARIO, el
       registro de comidas, el peso/altura/edad/años y las citas NUNCA salían del
       teléfono — al entrar con la misma cuenta en otro móvil aparecían vacíos.
       Lo reportó Gerhard el 16 sep probando la app en sus dos iPhones.
       🪤 Por qué no se vio en dos meses: 'cf_unified_journal_v1' SÍ está en la lista
       y suena a «diario unificado»… pero es el INTERRUPTOR de esa función
       (design/unifiedjournal.jsx:31), no los datos. Al verificar la Fase 3 en el
       iPhone se miró QUÉ CAJAS aparecían en Firestore, no qué había dentro.
       La caja cf-hs-purged (sin comillas aquí a propósito, para que ningún barrido
       que lea esta lista la cuente como incluida) se queda FUERA: es una marca
       técnica del aparato, no un dato del usuario. */
    'cf-checkins', 'cf-foodlog', 'cf-profile', 'cf-appointments',

    /* 🔴 FB21, segunda tanda (16 sep 2026, con el «sí» de Gerhard) — SEGURIDAD Y
       CONSENTIMIENTOS. Que la lista de gente bloqueada no viajara era el peor de
       los dos: al cambiar de móvil se perdía y esa persona volvía a poder
       escribirte. Los consentimientos, además, son la prueba de lo que el usuario
       aceptó, y volver a preguntárselo en cada teléfono no es aceptable.
       ⚠️ Estas cuatro claves NO llevan el prefijo cfns:<uid>: se guardan igual
       para todas las cuentas del mismo aparato (así nacieron, ver design/blocks.jsx:11).
       Sincronizarlas no empeora eso —ya se compartían en el teléfono—, pero si
       algún día se aíslan por cuenta, hay que revisarlo aquí.
       cf_reports_queue_v1 se queda FUERA a propósito: es una COLA de denuncias
       pendientes de enviar, y compartirla haría que dos móviles enviasen la misma. */
    'cf_blocked_v1', 'cf_muted_content_v1', 'cf_consent_v1', 'cf_health_consent_v1',
    'cf_age_verified_v1'
  ];
  var HEALTH_SET = {}; HEALTH_KEYS.forEach(function (k) { HEALTH_SET[k] = true; });

  var MAX_BYTES = 900000;               /* margen bajo el límite de 1 MiB/doc de Firestore */
  var META_KEY = 'cf_sync_meta_v1';     /* { caja: ts de la versión de la nube que es la base } (NO sube) */
  var HASH_KEY = 'cf_sync_hash_v1';     /* A9 bis: { caja: huella del valor local de la base } */
  var KEYS_KEY = 'cf_sync_basekeys_v1'; /* A9 bis: { caja: { entrada: huella } } de la base */
  var ALIAS_KEY = 'cf_sync_alias_v1';   /* A9 bis: la URL de la foto de la tarjeta en la nube, en la base */
  var EDIT_KEY = 'cf_sync_edit_v1';     /* A9 bis: { caja: hora del último cambio de aquí sin subir } */
  var CONFLICTS_KEY = 'cf_sync_conflicts_v1';   /* A9 bis: lo de aquí que perdió un choque (no sube) */
  var DELS_KEY = 'cf_sync_del_v1';      /* A9 bis: { caja: hora } de las cajas que la APP borró aquí (removeItem) */
  var CONFLICTS_MAX = 5, CONFLICT_MAX_BYTES = 30000;
  var DEBOUNCE_MS = 1500;
  var MAX_ROUNDS = 3;                   /* lectura + escritura condicional: vueltas si alguien escribe en medio */
  var RETRY_MIN = 15000, RETRY_MAX = 300000;

  /* base de una clave de localStorage: 'cfns:<uid>:cf_plan_v1' → 'cf_plan_v1' */
  function baseOf(key) { var i = String(key).lastIndexOf(':'); return i >= 0 ? key.slice(i + 1) : key; }
  function isHealthKey(key) { return HEALTH_SET[baseOf(key)] === true; }
  function docIdFor(key) { return baseOf(key); }   /* la caja es el id del doc */

  /* 🔒 CHAT1 (2 nov 2026) — CADA CUENTA, SOLO LO SUYO, Y SIN SU CORREO EN LA NUBE.
     El móvil guarda las cajas de cada cuenta con el espacio de esa cuenta: 'cfns:pat:<correo>:cf_x'
     (Chronic Friends.html, CFNS). Hasta hoy el arranque recorría TODAS las claves del móvil y subía
     también las de OTRA cuenta usada en ese teléfono a la nube de la que estaba dentro, pisando su
     caja; y cada caja subía con `key` = la clave entera, o sea con el correo dentro. Barrido de
     Firestore del 2 nov: 438 cajas con un correo en `key` (61 cuentas) y 61 de ellas de OTRA cuenta
     (8 cuentas de pruebas de Gerhard, ningún usuario de fuera). Ahora:
       · solo se sube lo del espacio de la cuenta de dentro (mine);
       · en la nube va `key` = la caja sola ('cf_x'): el parche CFNS la lleva al espacio de cada cuenta;
       · al bajar, una caja con el espacio de OTRA cuenta no se aplica y se repone la propia. */
  function myPrefix() { try { var n = window.CFNS; return (n && n.prefix && n.prefix()) || null; } catch (e) { return null; } }
  function isNsKey(k) { return String(k || '').indexOf('cfns:') === 0; }
  function mine(k) {
    if (!isNsKey(k)) return true;                     /* sin espacio: el parche CFNS la lleva al de esta cuenta */
    var p = myPrefix();
    return !p || String(k).indexOf(p) === 0;          /* sin CFNS (bancos de prueba) todo es de la cuenta, como antes */
  }
  /* la clave LOCAL de una caja de la nube para la cuenta de dentro */
  function localKeyOf(d, base) {
    if (d && d.key && isNsKey(d.key)) return d.key;   /* legado: ya viene con el espacio (y es de esta cuenta) */
    var p = myPrefix();
    return p ? p + base : base;
  }

  function CF() { return window.CFFirebase; }
  function ST() { return window.CFStore; }
  function usable() { return !!(ST() && ST().available && CF() && CF().available); }
  function uid() { try { var u = CF().currentUser(); return u && u.uid || null; } catch (e) { return null; } }
  function verified() { try { var u = CF().currentUser(); return !!(u && u.emailVerified); } catch (e) { return false; } }
  /* LOGOUT1 (21 oct 2026) — solo con alguien DENTRO de la app y que sea la
     misma cuenta que la de Firebase. Antes bastaba Firebase: tras «Tanca la
     sessió» (que no salía de Firebase) la sync seguía viva con la pantalla de
     entrar delante, bajaba los datos de salud al espacio 'anon' del móvil y
     podía subir a la nube lo que hubiera en 'anon'. */
  function localOk() {
    try {
      var a = JSON.parse(localStorage.getItem('cf_auth_v1'));
      if (!a) return false;
      var le = String(a.email || '').toLowerCase().trim();
      var u = CF().currentUser(), fe = String((u && u.email) || '').toLowerCase().trim();
      return !le || !fe || le === fe;
    } catch (e) { return false; }
  }
  function active() { return usable() && !!uid() && verified() && localOk(); }

  /* setItem original (para escribir valores bajados SIN disparar el interceptor) */
  var rawSet = window.localStorage.setItem.bind(window.localStorage);

  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function loadMap(key) {
    try { var m = JSON.parse(localStorage.getItem(key)); return (m && typeof m === 'object') ? m : {}; } catch (e) { return {}; }
  }
  function saveMap(key, m) { try { rawSet(key, JSON.stringify(m)); } catch (e) {} }
  function byteLen(s) { try { return new Blob([s]).size; } catch (e) { return (s || '').length; } }

  /* nowMillis SIN Date.now directo (el arnés de test lo puede inyectar); en el
     navegador usamos el reloj real. */
  /* A9 bis: window.CFClock, no el nombre suelto: fuera del navegador (bancos con new Function) el nombre
     suelto no existe y caía siempre en Date.now(), así que los bancos no controlaban la hora de los cambios.
     Igual que firebase-chat.js / friends.js. En la app es lo mismo. */
  function now() { try { return (window.CFClock && window.CFClock.now && window.CFClock.now()) || Date.now(); } catch (e) { return Date.now(); } }

  /* ---- A9 bis · huellas ------------------------------------------------
     cyrb53: huella rápida de 53 bits de un texto. Solo compara versiones de LA
     MISMA caja en el mismo aparato; no es seguridad. */
  function cyrb53(str) {
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57, i, ch;
    for (i = 0; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  function hstr(s) { return s == null ? '-' : 'h' + cyrb53(String(s)); }            /* huella de una caja entera */
  function hv(v) { return v === undefined ? null : 'h' + cyrb53(JSON.stringify(v)); } /* huella de una entrada */
  function isPlainObj(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function parseObj(s) {
    if (s == null) return null;
    try { var o = JSON.parse(s); return isPlainObj(o) ? o : null; } catch (e) { return null; }
  }
  /* huellas de las entradas de la base. Si la entrada es un objeto (un día del diario), también las de sus
     campos: { entrada: { h: huella, f: { campo: huella } } }; si no, { entrada: huella } (H1 de la revisión) */
  function topHashes(s) {
    var o = parseObj(s); if (!o) return null;
    var r = {};
    Object.keys(o).forEach(function (k) {
      var v = o[k];
      if (isPlainObj(v)) { var f = {}; Object.keys(v).forEach(function (q) { f[q] = hv(v[q]); }); r[k] = { h: hv(v), f: f }; }
      else r[k] = hv(v);
    });
    return r;
  }
  function entryHash(e) { return e == null ? null : (typeof e === 'object' ? e.h : e); }

  /* ---- FB13: cajas con FOTO que va a Storage (no como base64 en Firestore) --
     Para cf_health_card_v1: la imagen base64 se sube a Storage (users/{uid}/
     health/card/main.jpg) y en Firestore va SOLO la URL (`photoUrl`). Así el doc
     no infla ni choca con el límite de 1 MiB. El localStorage local NO se toca
     (sigue con la foto base64 → la tarjeta se ve OFFLINE en emergencias). */
  var CARD_KEY = 'cf_health_card_v1';
  var CARD_PHOTO_PATH = 'card/main.jpg';
  function photosReady() { return !!(window.CFPhotos && CFPhotos.available && CFPhotos.active && CFPhotos.active()); }
  function photoUrlIn(V) {
    var c = parseObj(V);
    return (c && typeof c.photo === 'string' && c.photo.indexOf('http') === 0) ? c.photo : null;
  }

  /* A9 bis · la MISMA foto que ya está en la nube no se vuelve a subir. Antes se subía en cada
     arranque, y una copia vieja podía pisar en main.jpg la foto nueva del otro móvil (R4 de la
     revisión del 5 nov). Se reutiliza la URL si la foto de aquí no ha cambiado desde la base y la
     de la nube tampoco. */
  function reusablePhotoUrl(base, photo, Cl) {
    var bk = loadMap(KEYS_KEY)[base], al = loadMap(ALIAS_KEY)[base], co = parseObj(Cl);
    if (!bk || !al || !co || typeof co.photo !== 'string' || co.photo.indexOf('http') !== 0) return null;
    if (bk.photo !== hv(photo)) return null;          /* la foto de aquí cambió desde la base: hay que subirla */
    if (hv(co.photo) !== al.photo) return null;       /* la de la nube ya no es la de la base */
    return co.photo;
  }

  /* value LOCAL → value para la NUBE (sube la foto si hace falta). Devuelve
     Promise<{value, url}>. Si algo falla, devuelve el value original (el guardia
     de tamaño decidirá) — nunca rompe la sincronización de las demás. */
  function cloudValueFor(base, val, Cl) {
    if (base !== CARD_KEY || !photosReady()) return Promise.resolve({ value: val, url: null });
    var card = parseObj(val);
    if (!card) return Promise.resolve({ value: val, url: null });
    var photo = card.photo;
    if (!photo) {                                   /* sin foto → borra el objeto en Storage */
      try { CFPhotos.del(CARD_PHOTO_PATH); } catch (e) {}
      var c0 = Object.assign({}, card); delete c0.photo; c0.photoUrl = null;
      return Promise.resolve({ value: JSON.stringify(c0), url: null });
    }
    if (String(photo).indexOf('http') === 0) {      /* ya es URL (bajada de otro móvil) → no re-subir */
      var c1 = Object.assign({}, card); c1.photo = null; c1.photoUrl = photo;
      return Promise.resolve({ value: JSON.stringify(c1), url: photo });
    }
    if (String(photo).indexOf('data:') === 0) {     /* base64 → sube a Storage, guarda solo la URL */
      var reuse = reusablePhotoUrl(base, photo, Cl);
      if (reuse) {
        var c3 = Object.assign({}, card); c3.photo = null; c3.photoUrl = reuse;
        return Promise.resolve({ value: JSON.stringify(c3), url: reuse });
      }
      return CFPhotos.putDataURL(CARD_PHOTO_PATH, photo).then(function (r) {
        if (r && r.ok && r.url) {
          var c2 = Object.assign({}, card); c2.photo = null; c2.photoUrl = r.url;
          return { value: JSON.stringify(c2), url: r.url };
        }
        return { value: val, url: null };           /* subida falló → deja el value original */
      }).catch(function () { return { value: val, url: null }; });
    }
    return Promise.resolve({ value: val, url: null });
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

  /* ---- A9 bis · estado de cada caja en este aparato --------------------- */
  function baseKnown(base) { return own(loadMap(HASH_KEY), base); }
  /* true = cambiada aquí desde la base · false = igual que la base · null = sin base (motor de antes) */
  function isDirty(base, L) {
    var hs = loadMap(HASH_KEY);
    if (!own(hs, base)) return null;
    return hstr(L) !== hs[base];
  }
  /* la hora del cambio se guarda solo con una cuenta de nube puesta; sin ella (al abrir, antes de
     que Firebase recupere la sesión, o mientras se BORRA la cuenta y se vacía el móvil) se queda en
     memoria: así el borrado de cuenta no deja en el móvil un resto con su espacio (M15). */
  var memEdit = {};
  function editOf(base) { return Math.max(loadMap(EDIT_KEY)[base] || 0, memEdit[base] || 0); }
  function noteEdit(base) {
    if (!uid()) { memEdit[base] = now(); return; }
    var e = loadMap(EDIT_KEY); e[base] = now(); saveMap(EDIT_KEY, e);
  }
  /* 🔒 Solo se BORRA en la nube lo que la app borró aquí de verdad (removeItem). Una caja que «no está» en el
     móvil por otro motivo (no se pudo guardar, otra clave, almacenamiento vaciado) se vuelve a bajar de la nube,
     nunca se borra allí (H2-b de la revisión: con el almacenamiento lleno se borraba la caja de la nube). */
  /* sin cuenta de nube todavía (al abrir, antes de que Firebase recupere la sesión) el borrado se apunta en
     memoria y se guarda al entrar (N2 de la 2.ª revisión: si no, resucitaba). Sin sesión LOCAL (cf_auth_v1)
     no se apunta nada: es borrar la cuenta y vaciar el móvil, no borrar datos. */
  var memDel = {};
  function localSession() { try { return !!JSON.parse(localStorage.getItem('cf_auth_v1')); } catch (e) { return false; } }
  function markDeleted(base, on) {
    if (on && !uid()) { if (localSession()) memDel[base] = now(); return; }
    if (!on) delete memDel[base];
    var d = loadMap(DELS_KEY);
    if (on) d[base] = now(); else if (own(d, base)) delete d[base]; else return;
    saveMap(DELS_KEY, d);
  }
  function deletedHere(base) { return own(loadMap(DELS_KEY), base) || own(memDel, base); }
  /* al entrar la sesión de nube: lo apuntado en memoria pasa a guardarse (borrados y horas de los cambios) */
  function persistMem() {
    var k, d = loadMap(DELS_KEY), e = loadMap(EDIT_KEY), cd = false, ce = false;
    for (k in memDel) if (own(memDel, k)) { d[k] = memDel[k]; cd = true; }
    for (k in memEdit) if (own(memEdit, k) && !(e[k] >= memEdit[k])) { e[k] = memEdit[k]; ce = true; }
    if (cd) saveMap(DELS_KEY, d);
    if (ce) saveMap(EDIT_KEY, e);
    memDel = {};
  }
  /* la caja queda AL DÍA con la nube: V es su valor local, ts el de su versión en la nube.
     Se relee cada mapa justo antes de escribirlo (FB22: nunca una copia leída antes de esperar). */
  /* keepEdit: la app ya ha vuelto a cambiar la caja sobre esta base → se conserva la hora de ese cambio */
  function setBase(base, V, ts, cloudPhotoUrl, keepEdit) {
    var meta = loadMap(META_KEY), hs = loadMap(HASH_KEY), ks = loadMap(KEYS_KEY), al = loadMap(ALIAS_KEY), ed = loadMap(EDIT_KEY);
    if (ts != null) meta[base] = ts; else delete meta[base];
    hs[base] = hstr(V);
    var t = topHashes(V);
    if (t) ks[base] = t; else delete ks[base];
    if (base === CARD_KEY) {
      var u = cloudPhotoUrl || photoUrlIn(V);
      if (u) al[base] = { photo: hv(u) }; else delete al[base];
    }
    if (!keepEdit) { delete ed[base]; delete memEdit[base]; }
    saveMap(META_KEY, meta); saveMap(HASH_KEY, hs); saveMap(KEYS_KEY, ks); saveMap(ALIAS_KEY, al); saveMap(EDIT_KEY, ed);
    if (!keepEdit) markDeleted(base, false);        /* al día con la nube: ya no queda ningún borrado pendiente */
  }
  /* lo de aquí que PIERDE un choque no se tira sin más: se guarda en el móvil (los 5 últimos, hasta 30 KB
     cada uno; si es más grande, solo su huella y su tamaño). No sube a ninguna parte. */
  function keepLost(base, L, cloudTs) {
    if (L == null) return;
    try {
      var list = JSON.parse(localStorage.getItem(CONFLICTS_KEY) || '[]');
      if (!Array.isArray(list)) list = [];
      var e = { caja: base, a: now(), editado: editOf(base), nube: cloudTs || 0 };
      if (String(L).length <= CONFLICT_MAX_BYTES) e.valor = String(L); else { e.huella = hstr(L); e.tam = String(L).length; }
      list.push(e);
      while (list.length > CONFLICTS_MAX) list.shift();
      rawSet(CONFLICTS_KEY, JSON.stringify(list));
    } catch (x) {}
    try { console.warn('[CFSync] "' + base + '": un cambio de aquí perdió frente a uno más nuevo de la nube (guardado en ' + CONFLICTS_KEY + ')'); } catch (x2) {}
  }
  /* aplica un valor bajado y comprueba que SE GUARDÓ (con el almacenamiento lleno, setItem falla en silencio) */
  function applyOk(fullKey, value) {
    applyDown(fullKey, value);
    if (safeGet(fullKey) === value) return true;
    try { console.warn('[CFSync] no se pudo guardar "' + baseOf(fullKey) + '" en este móvil (¿almacenamiento lleno?) — no se da por sincronizada'); } catch (e) {}
    return false;
  }

  /* ---- A9 bis · juntar dos copias de una caja-objeto ----------------------
     bk = huellas de las entradas de la BASE (null = sin base: unión).
     Por cada entrada: si solo cambió un lado desde la base, gana ese lado (también
     si lo que hizo fue BORRARLA); si cambiaron los dos, gana el cambio más
     reciente (localWins). Sin base: unión, y en un choque gana la nube.
     aliases: para la foto de la tarjeta, la huella de su URL en la nube (la misma
     foto vive aquí como base64 y en la nube como URL). */
  /* deep = true en el primer nivel: si los dos lados cambiaron la MISMA entrada y las dos son objetos (un
     día del diario), se juntan sus CAMPOS con las huellas de campo de la base (H1 de la revisión: el relleno
     de Health Sync de hoy ya no se lleva el día entero que se apuntó en el otro móvil).
     st.perdidos cuenta lo de aquí que pierde en un choque (va a la caja de conflictos). */
  function mergeLevel(bk, Lo, Co, localWins, aliases, deep, st) {
    var out = {}, keys = [], seen = {};
    Object.keys(Co).forEach(function (k) { if (!seen[k]) { seen[k] = 1; keys.push(k); } });
    Object.keys(Lo).forEach(function (k) { if (!seen[k]) { seen[k] = 1; keys.push(k); } });
    keys.forEach(function (k) {
      var inL = own(Lo, k), inC = own(Co, k);
      var hl = inL ? hv(Lo[k]) : null, hc = inC ? hv(Co[k]) : null;
      var pick, both = inL && inC && isPlainObj(Lo[k]) && isPlainObj(Co[k]);
      if (hl === hc) pick = 'L';
      else if (bk) {
        var be = own(bk, k) ? bk[k] : null;
        var hb = entryHash(be);
        var alt = (aliases && own(aliases, k)) ? aliases[k] : null;
        var lSame = hl === hb || (alt != null && hl === alt);
        var cSame = hc === hb || (alt != null && hc === alt);
        if (lSame && !cSame) pick = 'C';
        else if (cSame && !lSame) pick = 'L';
        else if (lSame && cSame) pick = 'L';       /* la misma cosa en dos formas (foto base64 / URL): la de aquí */
        else if (deep && both) { out[k] = mergeLevel((be && typeof be === 'object') ? be.f : {}, Lo[k], Co[k], localWins, null, false, st); return; }
        else { pick = localWins ? 'L' : 'C'; if (!localWins && st) st.perdidos++; }
      } else {                                      /* sin base: unión; si los dos tienen la entrada, se juntan sus campos */
        if (!inL) pick = 'C';
        else if (!inC) pick = 'L';
        else if (deep && both) { out[k] = mergeLevel(null, Lo[k], Co[k], false, null, false, st); return; }
        else { pick = 'C'; if (st) st.perdidos++; }
      }
      if (pick === 'L') { if (inL) out[k] = Lo[k]; }
      else if (inC) out[k] = Co[k];
    });
    return out;
  }

  /* ---- A9 bis · qué hacer con una caja cambiada aquí (o sin base) a la vista de la nube ----
     C = doc de la nube (o null) · Cl = su valor en forma LOCAL.
     Devuelve { write: valorLocal } | { del: true } | { apply: valorLocal } | { same: true } */
  function resolve(base, L, C, Cl, force) {
    if (force) return L != null ? { write: L } : { same: true };
    if (Cl != null && L === Cl) return { same: true };
    if (Cl == null) return L != null ? { write: L } : { same: true };   /* la nube no la tiene: sube */
    var cloudTs = C.ts || 0;
    var meta = loadMap(META_KEY)[base] || 0;
    var known = baseKnown(base);
    var cloudMoved = cloudTs > meta;
    var localWins = known && editOf(base) > cloudTs;
    if (L == null) {
      /* solo es un borrado si la APP la borró aquí; si no, falta por otra causa y se vuelve a bajar */
      if (!known || !deletedHere(base)) return { apply: Cl };
      return (!cloudMoved || localWins) ? { del: true } : { apply: Cl };
    }
    /* 🔒 FB22 — la marca de la bienvenida solo va HACIA DELANTE: un «0» provisional de un
       móvil nuevo nunca deshace un «1». */
    if (base === 'cf_onboarded_v1' && (L === '1' || Cl === '1')) return L === '1' ? { write: '1' } : { apply: Cl };
    if (!cloudMoved && (known || meta > 0)) return { write: L };         /* la nube sigue en la base: lo de aquí es lo nuevo */
    var Lo = parseObj(L), Co = parseObj(Cl);
    if (Lo && Co) {
      var st = { perdidos: 0 };
      var M = mergeLevel(known ? (loadMap(KEYS_KEY)[base] || null) : null, Lo, Co, localWins, loadMap(ALIAS_KEY)[base] || null, true, st);
      var hM = hv(M);
      if (hM === hv(Co)) return { apply: Cl, lost: st.perdidos > 0 };
      if (hM === hv(Lo)) return { write: L };
      return { write: JSON.stringify(M), lost: st.perdidos > 0 };
    }
    return localWins ? { write: L } : { apply: Cl, lost: true };
  }

  /* ---- interceptor de escrituras de la app ----------------------------- */
  var pending = {};   /* fullKey → { force } */
  var timer = null;
  var syncing = false;
  /* arranca la sync (listener + refresh de token) de forma perezosa si aún no
     está activa — cubre el caso de que onState no se re-dispare tras verificar */
  function maybeStart() { if (active() && !syncing) { try { startSync(); } catch (e) {} } }
  function queue(k, opts) {
    var cur = pending[k] || {};
    pending[k] = { force: !!(cur.force || (opts && opts.force)) };
  }
  function scheduleFlush() {
    maybeStart();
    if (timer) return;
    timer = setTimeout(function () { timer = null; flushNow(); }, DEBOUNCE_MS);
  }
  function flushNow() {
    var ks = Object.keys(pending), ps = pending; pending = {};
    return Promise.all(ks.map(function (k) { return syncBox(k, ps[k]); }));
  }
  function scanLocal(fn) {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && isHealthKey(k) && mine(k)) fn(k, baseOf(k));
      }
    } catch (e) {}
  }
  /* todo lo cambiado aquí que no ha subido: lo que hay en el móvil con otra huella, lo que aún NO tiene huella
     (motor de antes, caja nueva: se mira contra la nube una vez; H3 de la revisión) y lo BORRADO aquí */
  function queueDirty() {
    var seen = {};
    scanLocal(function (k, base) { seen[base] = true; if (isDirty(base, safeGet(k)) !== false) queue(k); });
    try {
      /* lo que tenía base y ya no está en el móvil: si la app lo BORRÓ, se borra en la nube (con condición);
         si falta por otra causa, resolve() lo vuelve a bajar */
      Object.keys(loadMap(HASH_KEY)).forEach(function (base) {
        if (!HEALTH_SET[base] || seen[base]) return;                  /* sigue en el móvil con otra clave: no falta */
        var k = localKeyOf(null, base);
        if (safeGet(k) == null && isDirty(base, null) === true) queue(k);
      });
    } catch (e) {}
  }

  var _applying = false;   /* true mientras aplicamos valores BAJADOS (no reenviar) */
  var origSet = window.localStorage.setItem;
  var origRemove = window.localStorage.removeItem;
  /* A9 bis · solo cuenta como cambio lo que CAMBIA el valor: la pantalla de Medicación reescribe
     su caja al montarse con lo mismo que había, y eso subía la copia vieja (R6). */
  function noteLocalChange(k) { noteEdit(baseOf(k)); queue(k); scheduleFlush(); }
  try {
    window.localStorage.setItem = function (k, v) {
      var watch = !_applying && isHealthKey(k) && mine(k);
      var prev = watch ? safeGet(k) : null;
      var r = origSet.apply(this, arguments);
      if (watch && prev !== String(v)) { if (prev === null) markDeleted(baseOf(k), false); noteLocalChange(k); }
      return r;
    };
    window.localStorage.removeItem = function (k) {
      var watch = !_applying && isHealthKey(k) && mine(k);
      var prev = watch ? safeGet(k) : null;
      var r = origRemove.apply(this, arguments);
      if (watch && prev !== null) { markDeleted(baseOf(k), true); noteLocalChange(k); }
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

  /* ---- A9 bis · subir una caja: leer la nube, decidir, escribir si nadie escribió en medio ---- */
  var inflight = {}, again = {};
  var lastCloud = {}, cloudSeen = false;   /* lo último que trajo el listener (solo para bancos sin lectura) */
  var retryTimer = null, retryDelay = RETRY_MIN;

  function retryLater() {
    if (retryTimer) return;
    retryTimer = setTimeout(function () { retryTimer = null; if (!active()) return; queueDirty(); flushNow(); }, retryDelay);
    try { if (retryTimer && retryTimer.unref) retryTimer.unref(); } catch (e) {}
    retryDelay = Math.min(retryDelay * 2, RETRY_MAX);
  }
  function markAgain(base, fullKey, opts) {
    var a = again[base] || {};
    a.key = fullKey; a.force = !!(a.force || (opts && opts.force));
    again[base] = a;
  }

  function readCloud(path, base) {
    var S = ST();
    if (S.getExists) {
      return Promise.resolve(S.getExists(path)).then(function (r) { return r || { ok: false, code: 'unknown' }; },
        function () { return { ok: false, code: 'unknown' }; });
    }
    if (S.get) {
      return Promise.resolve(S.get(path)).then(function (d) { return { ok: true, exists: !!d, data: d || null }; },
        function () { return { ok: false, code: 'unknown' }; });
    }
    if (!cloudSeen) return Promise.resolve({ ok: false, code: 'unavailable' });
    var d0 = lastCloud[base] || null;
    return Promise.resolve({ ok: true, exists: !!d0, data: d0 });
  }
  /* escribe SOLO si el doc de la nube sigue siendo el que se leyó (transacción en CFStore) */
  function writeIfUnchanged(path, doc, C) {
    var S = ST();
    if (S.setIfNotNewer && !(C && !(C.ts > 0))) return Promise.resolve(S.setIfNotNewer(path, doc, C ? C.ts : 0));
    return Promise.resolve(S.set(path, doc, { overwrite: true }));   /* sin transacción (o doc sin ts): como antes */
  }
  /* borra SOLO si el doc sigue siendo el que se leyó: un borrado decidido con una copia vieja (sin red) no se
     lleva lo nuevo del otro móvil al volver la red (H5 de la revisión) */
  function delIfUnchanged(path, C) {
    var S = ST();
    if (S.delIfNotNewer && C && C.ts > 0) return Promise.resolve(S.delIfNotNewer(path, C.ts));
    return Promise.resolve(S.del(path));
  }

  function syncBox(fullKey, opts) {
    opts = opts || {};
    if (!active() || !mine(fullKey)) return Promise.resolve();   /* CHAT1: nunca la caja de otra cuenta del móvil */
    var base = baseOf(fullKey);
    if (inflight[base]) { markAgain(base, fullKey, opts); return inflight[base]; }
    var p = syncLoop(fullKey, base, opts, 0).then(null, function (e) {
      try { console.warn('[CFSync] "' + base + '": ' + (e && e.message)); } catch (x) {}
    }).then(function () {
      delete inflight[base];
      var a = again[base]; delete again[base];
      /* otra vuelta, pero ESPERANDO como cualquier cambio (antes salía al instante: al escribir una nota
         eran cientos de lecturas por minuto — H6 y H2-c de la revisión) */
      if (a) { queue(a.key || fullKey, { force: a.force }); scheduleFlush(); }
    });
    inflight[base] = p;
    return p;
  }

  function refreshThen(fullKey, base, opts, round) {
    /* rechazo por reglas: el token puede llevar claims viejos (email_verified
       tras verificar una cuenta nueva). Refresca el token y reintenta 1 vez. */
    try { console.warn('[CFSync] rechazado (permission-denied) — refresco token y reintento'); } catch (e) {}
    return Promise.resolve(CF().refreshToken()).then(function () {
      return syncLoop(fullKey, base, { force: opts.force, retried: true }, round);
    });
  }

  function syncLoop(fullKey, base, opts, round) {
    var L = safeGet(fullKey);
    if (!opts.force && isDirty(base, L) === false) return Promise.resolve();   /* sin cambios aquí: nada que subir */
    var path = 'users/' + uid() + '/health/' + docIdFor(fullKey);
    return readCloud(path, base).then(function (rc) {
      if (!active() || !mine(fullKey)) return null;
      if (!rc || !rc.ok) {
        if (rc && String(rc.code).indexOf('permission-denied') >= 0 && !opts.retried) return refreshThen(fullKey, base, opts, round);
        retryLater(); return null;                                  /* sin red: sigue pendiente (lo recuerda su huella) */
      }
      /* si la app la cambió mientras se leía la nube, se decide con lo de AHORA y la misma lectura (la
         escritura sigue siendo condicional). Antes se dejaba para otra vuelta, y tecleando a ritmo constante
         la nota no subía hasta parar (h9-b de la 2.ª revisión). */
      L = safeGet(fullKey);
      if (!opts.force && isDirty(base, L) === false) return null;
      var C = rc.exists ? (rc.data || null) : null;
      var cloudTs = C ? (C.ts || 0) : 0;
      var Cl = (C && C.key) ? toLocalValue(base, C.value) : null;
      var plan = resolve(base, L, C, Cl, !!opts.force);

      if (plan.same) { setBase(base, L, Cl != null ? cloudTs : null, photoUrlIn(Cl)); return null; }

      if (plan.apply !== undefined) {                               /* gana la nube */
        if (plan.lost) keepLost(base, L, cloudTs);
        /* H2: si no se pudo guardar aquí (almacenamiento lleno), ni base nueva ni repetir al instante */
        if (plan.apply !== L && !applyOk(fullKey, plan.apply)) { retryLater(); return null; }
        setBase(base, plan.apply, cloudTs);
        return null;
      }

      if (plan.del) {                                               /* la app la borró aquí */
        return delIfUnchanged(path, C).then(function (r) {
          if (r && r.ok && r.skipped) {                             /* la nube cambió entretanto: se vuelve a decidir */
            if (round + 1 < MAX_ROUNDS) return syncLoop(fullKey, base, opts, round + 1);
            retryLater(); return null;
          }
          if (!r || r.ok === false) { retryLater(); return null; }
          if (base === CARD_KEY) { try { if (photosReady()) CFPhotos.del(CARD_PHOTO_PATH); } catch (e) {} }
          if (safeGet(fullKey) == null) setBase(base, null, null); else markAgain(base, fullKey, opts);
          return null;
        });
      }

      var V = plan.write;
      return cloudValueFor(base, V, Cl).then(function (cv) {
        if (byteLen(cv.value) > MAX_BYTES) {
          try { console.warn('[CFSync] "' + base + '" supera ' + MAX_BYTES + ' bytes — NO se sube'); } catch (e) {}
          return null;
        }
        var T = Math.max(now(), cloudTs + 1);
        var doc = { key: base, value: cv.value, ts: T, updatedAt: ST().serverTime() };   /* CHAT1: sin el correo */
        return writeIfUnchanged(path, doc, C).then(function (r) {
          if (r && r.ok && !r.skipped) {
            retryDelay = RETRY_MIN;
            if (plan.lost) keepLost(base, L, cloudTs);
            if (safeGet(fullKey) !== L) {                           /* la app volvió a cambiarla mientras subía */
              /* H4: si se subió tal cual lo de aquí, la base pasa a ser ESO y lo de ahora queda como un cambio
                 sobre ello (la propia escritura ya no parece «la nube se movió», que con relojes desfasados
                 perdía la corrección). Si se subió algo JUNTADO, la base no se mueve: lo de ahora no sale de ahí. */
              if (V === L) setBase(base, V, T, cv.url, true);
              markAgain(base, fullKey, opts); return null;
            }
            if (V !== L && !applyOk(fullKey, V)) { retryLater(); return null; }   /* lo juntado no cupo aquí (H2) */
            setBase(base, V, T, cv.url);
            return null;
          }
          if (r && r.ok && r.skipped) {                             /* alguien escribió entre la lectura y la escritura */
            if (round + 1 < MAX_ROUNDS) return syncLoop(fullKey, base, opts, round + 1);
            retryLater(); return null;
          }
          if (r && String(r.code).indexOf('permission-denied') >= 0 && !opts.retried) return refreshThen(fullKey, base, opts, round);
          retryLater(); return null;
        });
      });
    });
  }

  /* ---- lo que llega de la nube (escucha en vivo) ------------------------ */
  function onCloudDoc(d) {
    var base = d._id;
    /* CHAT1: una caja que subió aquí OTRA cuenta de un móvil compartido (su `key` lleva otro
       espacio) no es de esta persona: no se aplica, y se repone la propia si la hay. */
    if (d.key && !mine(d.key)) {
      var propia = localKeyOf(null, base);
      if (safeGet(propia) != null) queue(propia, { force: true });
      return;
    }
    if (!d.key) return;
    var cloudTs = d.ts || 0;
    var localTs = loadMap(META_KEY)[base] || 0;
    var known = baseKnown(base);
    if (known && !(cloudTs > localTs)) return;                      /* nada más nuevo que la base de aquí */
    var lk = localKeyOf(d, base);
    var incoming = toLocalValue(base, d.value);                     /* FB13: URL de foto lista para <img> */
    var L = safeGet(lk);
    if (!known) {                                                   /* sin huella: motor de antes o móvil nuevo */
      if (L === incoming) { setBase(base, L, cloudTs, photoUrlIn(incoming)); return; }
      if (L == null) { if (applyOk(lk, incoming)) setBase(base, incoming, cloudTs); return; }   /* H2 */
      if (localTs > 0 && cloudTs <= localTs) {                      /* la nube no se movió: lo de aquí es un cambio sin subir */
        setBase(base, incoming, cloudTs); queue(lk); return;
      }
      queue(lk); return;                                            /* la nube se movió: se decide leyéndola */
    }
    if (L === incoming) { setBase(base, L, cloudTs, photoUrlIn(incoming)); return; }
    if (isDirty(base, L) === false) {                               /* sin cambios aquí: gana la nube */
      /* 🔒 FB22 — la marca de la bienvenida solo va HACIA DELANTE. Un móvil nuevo
         escribe un «0» provisional al iniciar sesión (enterReturning) y puede subirlo
         antes de haber visto la nube; ese «0» nunca deshace aquí un «1»: se ignora y
         se vuelve a subir el «1» para curar la nube. */
      if (base === 'cf_onboarded_v1' && L === '1') { queue(lk, { force: true }); return; }
      if (applyOk(lk, incoming)) setBase(base, incoming, cloudTs);  /* H2: lo que no se pudo guardar no se da por al día */
      return;
    }
    queue(lk);                                                      /* cambiada aquí Y en la nube: se juntan */
  }

  /* ---- reconciliación al iniciar sesión + escucha en vivo -------------- */
  var colUnsub = null;
  function startSync() {
    if (!active()) return;
    var u = uid();
    syncing = true;
    if (colUnsub) { try { colUnsub(); } catch (e) {} colUnsub = null; }
    cloudSeen = false; lastCloud = {};
    persistMem();                                   /* N2: lo borrado/cambiado antes de recuperar la sesión */

    /* 0) refresca el ID token para que las reglas vean email_verified al día
          (cuenta recién verificada) antes de la primera subida */
    try { CF().refreshToken(); } catch (e) {}

    /* 1) escucha la colección de salud en la nube */
    colUnsub = ST().onCol('users/' + u + '/health', function (docs) {
      if (!active()) return;                          /* LOGOUT1: la cuenta local ya no está (o es otra): no se baja nada a 'anon' */
      var lc = {};
      (docs || []).forEach(function (d) { if (d && d._id) lc[d._id] = d; });
      lastCloud = lc; cloudSeen = true;
      (docs || []).forEach(function (d) { if (d && d._id) { try { onCloudDoc(d); } catch (e) {} } });
      if (Object.keys(pending).length) scheduleFlush();
    });

    /* 2) A9 bis: al arrancar se mira SOLO lo cambiado aquí sin subir y lo que aún no tiene huella (antes:
          subían TODAS las cajas a ciegas). Lo segundo, una vez: no depende de que el SDK avise de una foto
          del servidor, que no avisa si la caché ya traía lo mismo (H3 de la revisión). */
    queueDirty();
    scheduleFlush();
    try { console.log('[CFSync] sincronización de salud ACTIVA para uid', u); } catch (e) {}
  }
  function stopSync() {
    syncing = false;
    if (colUnsub) { try { colUnsub(); } catch (e) {} colUnsub = null; }
  }

  /* arranca/para según el estado de autenticación */
  try {
    CF().onState(function (user) {
      if (user && user.emailVerified) { startSync(); }
      else { stopSync(); }
    });
  } catch (e) {}

  /* N1 de la 2.ª revisión: subir YA, repitiendo mientras queden vueltas (una corrección hecha mientras subía
     el cambio anterior queda como «otra vuelta»; si solo se esperaba al temporizador, al cerrar sesión o pasar
     a segundo plano moría con la recarga). Como mucho 3 vueltas. */
  function pushAll() {
    var vueltas = 0;
    function vuelta() {
      queueDirty();
      return flushNow().then(function () {
        vueltas++;
        if (vueltas < 3 && (Object.keys(pending).length || Object.keys(again).length)) return vuelta();
      });
    }
    return vuelta();
  }

  /* vaciar lo pendiente antes de cerrar/ocultar la app; reintentar al volver o al recuperar la red */
  try {
    window.addEventListener('pagehide', function () { pushAll(); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') { pushAll(); }
      else if (document.visibilityState === 'visible' && active()) { queueDirty(); scheduleFlush(); }
    });
    window.addEventListener('online', function () { if (active()) { queueDirty(); scheduleFlush(); } });
  } catch (e) {}

  /* API mínima para depurar / forzar */
  window.CFSync = {
    HEALTH_KEYS: HEALTH_KEYS,
    isHealthKey: isHealthKey,
    baseOf: baseOf,
    active: active,
    /* sube YA todo lo cambiado aquí; devuelve una promesa (LOGOUT1 la espera, con tope) */
    pushNow: pushAll,
    _applyDown: applyDown
  };
  try { console.log('[CFSync] motor de salud cargado ·', HEALTH_KEYS.length, 'cajas en la lista blanca'); } catch (e) {}
})();
