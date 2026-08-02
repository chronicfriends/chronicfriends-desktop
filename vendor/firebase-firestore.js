/* ===== Firebase · Firestore — puente de datos (Fase 3) =================
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design. Inicializa Cloud Firestore sobre la app ya creada por
   firebase-init.js y expone window.CFStore: una API genérica y defensiva
   (get/set/del/onDoc/colAdd/onCol) que el motor de sincronización
   (firebase-sync.js) usa por debajo.

   • Offline-first: intenta habilitar la persistencia local (IndexedDB) para
     que la app funcione sin red y sincronice al recuperar conexión. Si el
     WebView no soporta IndexedDB, Firestore sigue en memoria (online) y NADA
     rompe: available queda true pero sin caché en disco.
   • Si el SDK de Firestore no cargó, CFStore.available = false y todos los
     métodos resuelven a un fallo controlado — la app local sigue igual.

   Requisitos de carga (index.html, en este orden):
     firebase-app-compat.js → firebase-auth-compat.js →
     firebase-firestore-compat.js → firebase-init.js → firebase-firestore.js
   ===================================================================== */
(function () {
  'use strict';

  function ok(extra) { return Object.assign({ ok: true }, extra || {}); }
  function fail(e) {
    return { ok: false, code: (e && e.code) || 'unknown', message: (e && e.message) || String(e) };
  }

  var haveSDK = typeof window.firebase !== 'undefined'
    && window.firebase.firestore
    && window.firebase.apps && window.firebase.apps.length > 0;

  if (!haveSDK) {
    window.CFStore = {
      available: false,
      ready: Promise.resolve(false),
      _reason: 'firestore-sdk-or-app-missing',
      set: function () { return Promise.resolve({ ok: false, code: 'unavailable' }); },
      get: function () { return Promise.resolve(null); },
      del: function () { return Promise.resolve({ ok: false, code: 'unavailable' }); },
      onDoc: function () { return function () {}; },
      colAdd: function () { return Promise.resolve({ ok: false, code: 'unavailable' }); },
      colSet: function () { return Promise.resolve({ ok: false, code: 'unavailable' }); },
      likeBatch: function () { return Promise.resolve({ ok: false, code: 'unavailable' }); },
      onCol: function () { return function () {}; },
      onGroup: function () { return function () {}; },
      listCol: function () { return Promise.resolve([]); },
      serverTime: function () { return null; }
    };
    try { console.warn('[CFStore] Firestore no disponible (SDK/app ausente) — puente inerte'); } catch (e) {}
    return;
  }

  var db = window.firebase.firestore();
  /* Ignora campos undefined en vez de lanzar error. La UI crea objetos (posts,
     etc.) con campos opcionales que pueden ser undefined (p.ej. category/title
     sin rellenar); sin esto, un solo undefined haría fallar TODA la escritura
     en silencio. Debe llamarse antes de cualquier operación. */
  try { db.settings({ ignoreUndefinedProperties: true }); } catch (e) {}
  var FV = window.firebase.firestore.FieldValue;

  /* Persistencia offline (IndexedDB). En WKWebView file:// puede fallar; no es
     fatal — Firestore seguirá funcionando online. synchronizeTabs:false porque
     el WebView es una sola "pestaña". */
  var persistReady = db.enablePersistence({ synchronizeTabs: false })
    .then(function () { try { console.log('[CFStore] persistencia offline ON'); } catch (e) {} return true; })
    .catch(function (err) {
      try { console.warn('[CFStore] sin persistencia offline (' + (err && err.code) + ') — sigo online'); } catch (e) {}
      return false;
    });

  function ref(path) { return db.doc(path); }
  function colRef(path) { return db.collection(path); }

  /* ---- FB9 · reintentos con backoff exponencial + jitter --------------------
     Las escrituras a Firestore pueden fallar por causas TRANSITORIAS de red
     (conexión intermitente del móvil, servidor saturado). Sin reintento, ese
     dato de salud se quedaba pendiente hasta el próximo cambio. Aquí se reintenta
     solo ante códigos transitorios, con espera creciente y un jitter aleatorio
     para no golpear todos a la vez ("thundering herd").

     SOLO se aplica a operaciones IDEMPOTENTES (set/colSet/del sobre un path o id
     determinista): reintentarlas es seguro aunque la primera sí llegara al
     servidor. colAdd (id automático) NO se reintenta: crearía duplicados.
     permission-denied NO es transitorio (lo gestiona firebase-sync.js refrescando
     el token), así que tampoco se reintenta aquí. */
  var RETRYABLE = {
    'unavailable': true, 'deadline-exceeded': true, 'internal': true,
    'aborted': true, 'resource-exhausted': true, 'cancelled': true
  };
  var MAX_RETRIES = 4;      /* 5 intentos en total */
  var BASE_DELAY = 400;     /* ms; 400 → 800 → 1600 → 3200 (+ jitter) */

  /* fn: () => Promise<{ok, code}>. Reintenta mientras !ok && código transitorio. */
  function withRetry(fn) {
    function attempt(n) {
      return fn().then(function (r) {
        if (r && r.ok) return r;
        if (n >= MAX_RETRIES || !r || !RETRYABLE[r.code]) return r;
        var delay = BASE_DELAY * Math.pow(2, n) + Math.floor(Math.random() * BASE_DELAY);
        try { console.warn('[CFStore] reintento ' + (n + 1) + '/' + MAX_RETRIES + ' tras "' + r.code + '" en ' + delay + 'ms'); } catch (e) {}
        return new Promise(function (resolve) {
          setTimeout(function () { resolve(attempt(n + 1)); }, delay);
        });
      });
    }
    return attempt(0);
  }

  var API = {
    available: true,
    db: db,
    ready: persistReady,

    /* set con merge por defecto (no pisa campos que no envías). FB9: reintento. */
    set: function (path, data, opts) {
      return withRetry(function () {
        try {
          return ref(path).set(data, { merge: !(opts && opts.overwrite) })
            .then(function () { return ok(); }).catch(fail);
        } catch (e) { return Promise.resolve(fail(e)); }
      });
    },

    /* lee un doc → devuelve su data (objeto) o null si no existe. */
    get: function (path) {
      try {
        return ref(path).get().then(function (snap) {
          return snap.exists ? snap.data() : null;
        }).catch(function () { return null; });
      } catch (e) { return Promise.resolve(null); }
    },

    del: function (path) {
      return withRetry(function () {
        try { return ref(path).delete().then(function () { return ok(); }).catch(fail); }
        catch (e) { return Promise.resolve(fail(e)); }
      });
    },

    /* escucha en tiempo real un doc; cb(data|null). Devuelve unsubscribe. */
    onDoc: function (path, cb) {
      try {
        return ref(path).onSnapshot(
          function (snap) { try { cb(snap.exists ? snap.data() : null, snap); } catch (e) {} },
          function () {}
        );
      } catch (e) { return function () {}; }
    },

    /* añade un doc con id automático a una colección → devuelve {ok,id}.
       FB9: NO se reintenta (id automático = no idempotente; un reintento tras un
       timeout que sí llegó al servidor crearía un duplicado). */
    colAdd: function (path, data) {
      try { return colRef(path).add(data).then(function (r) { return ok({ id: r.id }); }).catch(fail); }
      catch (e) { return Promise.resolve(fail(e)); }
    },

    /* set de un doc con id explícito dentro de una colección. FB9: reintento
       (idempotente: el id es determinista). */
    colSet: function (path, id, data, opts) {
      return withRetry(function () {
        try {
          return colRef(path).doc(id).set(data, { merge: !(opts && opts.overwrite) })
            .then(function () { return ok(); }).catch(fail);
        } catch (e) { return Promise.resolve(fail(e)); }
      });
    },

    /* FB3b · escritura ATÓMICA del like + su contador denormalizado.
       En un solo db.batch(): crea (delta>0) o borra (delta<0) el doc de like del
       usuario Y ajusta community_posts/{cid}.likes con FieldValue.increment(delta).
       Atómico = el contador NUNCA se descuadra del like real.
       NO se reintenta con withRetry: increment NO es idempotente (un reintento tras
       un commit que sí llegó doblaría el contador). Un fallo transitorio se
       reconcilia solo en el siguiente listener/toggle; doble-contar sería peor. */
    likeBatch: function (postDocPath, likeDocPath, likeData, delta) {
      try {
        var b = db.batch();
        if (delta > 0) b.set(ref(likeDocPath), likeData, { merge: true });
        else           b.delete(ref(likeDocPath));
        b.set(ref(postDocPath), { likes: FV.increment(delta) }, { merge: true });
        return b.commit().then(function () { return ok(); }).catch(fail);
      } catch (e) { return Promise.resolve(fail(e)); }
    },

    /* escucha una colección/consulta; cb(arrayDeDocs con _id). Devuelve unsub.
       queryFn opcional: recibe la colección y devuelve una query (where/orderBy). */
    onCol: function (path, cb, queryFn) {
      try {
        var q = colRef(path);
        if (typeof queryFn === 'function') { try { q = queryFn(q) || q; } catch (e) {} }
        return q.onSnapshot(
          function (snap) {
            var out = [];
            snap.forEach(function (d) { var o = d.data() || {}; o._id = d.id; out.push(o); });
            try { cb(out, snap); } catch (e) {}
          },
          function () {}
        );
      } catch (e) { return function () {}; }
    },

    /* lee una colección una vez → array de docs con _id. */
    listCol: function (path, queryFn) {
      try {
        var q = colRef(path);
        if (typeof queryFn === 'function') { try { q = queryFn(q) || q; } catch (e) {} }
        return q.get().then(function (snap) {
          var out = []; snap.forEach(function (d) { var o = d.data() || {}; o._id = d.id; out.push(o); });
          return out;
        }).catch(function () { return []; });
      } catch (e) { return Promise.resolve([]); }
    },

    /* escucha TODAS las subcolecciones con un mismo nombre (collectionGroup),
       p.ej. todos los `likes`/`comments` de todos los posts en un solo listener.
       cb(arrayDeDocs con _id). Devuelve unsub.
       queryFn opcional (FB3, coste Blaze): recibe la collectionGroup y devuelve
       una query (orderBy/limit) para ACOTAR las lecturas por sesión. Sin él, se
       escucha el grupo entero (comportamiento previo). Si la query fallara, se
       degrada al grupo sin filtro. */
    onGroup: function (collectionId, cb, queryFn) {
      try {
        var g = db.collectionGroup(collectionId);
        if (typeof queryFn === 'function') { try { g = queryFn(g) || g; } catch (e) {} }
        return g.onSnapshot(
          function (snap) {
            var out = [];
            snap.forEach(function (d) {
              var o = d.data() || {}; o._id = d.id;
              /* id del doc PADRE (p.ej. el community_posts/{cid} de un comment),
                 derivado del PATH — no es un campo del doc, así no viola el `hasOnly`
                 de las reglas. Permite enrutar cada subdoc a su padre en el cliente. */
              try { o._pid = (d.ref && d.ref.parent && d.ref.parent.parent && d.ref.parent.parent.id) || null; } catch (e) { o._pid = null; }
              out.push(o);
            });
            try { cb(out, snap); } catch (e) {}
          },
          function (err) {
            /* FB6: nunca tragarse el error en silencio — deja rastro para
               diagnosticar reglas/índices sin romper la app */
            try { console.warn('[cf-firestore] onGroup(' + collectionId + ') error:', err && err.code, err && err.message); } catch (e) {}
          }
        );
      } catch (e) { return function () {}; }
    },

    serverTime: function () { return FV.serverTimestamp(); }
  };

  window.CFStore = API;
  try { console.log('[CFStore] listo · Firestore available=true'); } catch (e) {}
})();
