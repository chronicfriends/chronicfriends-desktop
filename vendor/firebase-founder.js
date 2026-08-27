/* ===== Firebase · PIONEROS — «los 500 primeros, sean cuando sean» ==========
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design, igual que cf-identity.js, firebase-friends.js o firebase-directory.js.

   QUÉ RESUELVE (decisión de Gerhard, 20 ago 2026): el regalo de 14 meses no es
   para «quien entre antes de tal fecha», es para las 500 PRIMERAS CUENTAS. Eso
   es un contador, y un contador no cabe en una constante del build: dos móviles
   que se instalan el mismo minuto no pueden decidir cada uno por su cuenta si
   les toca. Lo decide el servidor, una sola vez, y aquí sólo se LEE.

   🔑 POR QUÉ EL NÚMERO NO SE RECALCULA NUNCA: si el veredicto fuera «¿hay menos
   de 500 cuentas?», el pionero nº 300 dejaría de serlo el día que entrara el
   nº 501. Se asigna en el momento de reclamarlo y se graba; a partir de ahí es
   suyo. El servidor guarda el número de orden (`seq`) además del sí/no, para
   poder enseñar algún día «eres el pionero nº 137».

   EN LA NUBE (contrato exacto de firestore.rules):
     system/founders                { count }        ← el contador; NADIE lo escribe desde la app
     users/{uid}/entitlement/founder { founder, seq, claimedAt }
   El documento del usuario es de SOLO LECTURA para su dueño: lo escribe la
   Cloud Function con el SDK admin, que se salta las reglas. Si se pudiera
   escribir desde el cliente, cualquiera se declararía pionero en 10 segundos.

   ⚠️ SÍNCRONO A PROPÓSITO: cfIsFounder() (design/foodscan.jsx) se llama en
   pleno render y no puede esperar a la red. Por eso get() devuelve lo que ya
   hay —memoria o caché de localStorage— y NUNCA una promesa; cuando llega el
   veredicto de verdad se avisa con el evento `cf-founder` y la pantalla se
   repinta sola.

   API — window.CFFounder
     .available          → ¿hay sesión verificada y Firestore vivo?
     .get()              → { uid, founder, seq } | null   (SÍNCRONO)
     .refresh()          → Promise<veredicto|null>: relee la nube a mano
     ._start() ._stop()  → arranque/parada manual (para los arneses)
   ===================================================================== */
(function () {
  'use strict';

  /* La MISMA clave que usa cfIsFounder() en foodscan.jsx: este módulo es quien
     la escribe (src:'cloud') y el motor de acceso quien la lee. */
  var CACHE_KEY = 'cf_founder_v1';
  var SUB       = 'entitlement/founder';
  /* Junto a la base de datos (europe-west6 = Zúrich), no en europe-west1: el
     veredicto se decide leyendo y escribiendo Firestore, y cruzar de región en
     cada alta es latencia regalada. */
  var CLAIM_URL = 'https://europe-west6-chronic-friends.cloudfunctions.net/reclamarPionero';
  /* Un alta fallida se reintenta, pero no eternamente: si la función está caída
     no se convierte en un bucle de peticiones desde todos los móviles a la vez. */
  var MAX_INTENTOS = 3;

  function CF() { try { return window.CFFirebase || null; } catch (e) { return null; } }
  function ST() { try { return window.CFStore || null; }    catch (e) { return null; } }
  function user() { try { return (CF() && CF().currentUser()) || null; } catch (e) { return null; } }
  function uid()  { var u = user(); return (u && u.uid) || null; }
  function verified() { var u = user(); return !!(u && u.emailVerified); }
  function active() { return !!(ST() && ST().available && CF() && CF().available && uid() && verified()); }

  /* ---- estado en memoria ------------------------------------------------ */
  var veredicto = null;   /* { uid, founder, seq } */
  var unsub     = null;   /* corta la escucha de Firestore */
  var atado     = null;   /* uid al que está atada la escucha actual */
  var intentos  = 0;      /* reclamaciones lanzadas para ESTE uid */

  function leerCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { return null; }
  }
  /* La caché es lo que salva a un pionero que abre la app sin cobertura —
     justo el día que peor le viene descubrir que ha perdido el regalo. */
  function guardarCache(v) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        uid: v.uid, founder: !!v.founder, seq: v.seq == null ? null : v.seq, src: 'cloud'
      }));
    } catch (e) {}
  }
  function avisar() {
    try { window.dispatchEvent(new CustomEvent('cf-founder')); } catch (e) {}
  }

  /* Publica el veredicto sólo si CAMBIA algo: sin esta comparación, cada
     snapshot de Firestore repintaría la app entera sin motivo. */
  function publicar(v) {
    var antes = veredicto;
    if (antes && v && antes.uid === v.uid && antes.founder === v.founder && antes.seq === v.seq) return;
    veredicto = v;
    if (v) guardarCache(v);
    avisar();
  }

  /* ---- reclamar el número (una vez por cuenta) -------------------------- */
  /* Se pide al servidor SÓLO si el documento no existe. El servidor decide en
     una transacción: si el contador va por debajo de 500, este uid se lleva el
     siguiente número; si no, se graba founder:false y no se vuelve a preguntar
     nunca más (el documento pasa a existir, así que esta rama no se repite). */
  function reclamar() {
    var u = user();
    if (!u || !verified()) return Promise.resolve(null);
    if (intentos >= MAX_INTENTOS) return Promise.resolve(null);
    intentos += 1;
    if (typeof fetch !== 'function') return Promise.resolve(null);
    return u.getIdToken().then(function (tok) {
      return fetch(CLAIM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok },
        body: '{}'
      });
    }).then(function (r) {
      if (!r.ok) throw new Error('http-' + r.status);
      return r.json();
    }).then(function (j) {
      /* La respuesta se usa como atajo; el que manda es el snapshot de
         Firestore, que llegará solo un instante después. */
      if (j && j.ok && uid()) publicar({ uid: uid(), founder: !!j.founder, seq: j.seq == null ? null : j.seq });
      return j;
    }).catch(function (e) {
      try { console.warn('[CFFounder] no se pudo reclamar el número de pionero:', e && e.message); } catch (_) {}
      return null;
    });
  }

  /* ---- escucha del documento propio ------------------------------------- */
  function atar() {
    var id = uid();
    if (!active() || !id) return;
    if (atado === id && unsub) return;      /* ya escuchando a esta cuenta */
    soltar();
    atado = id; intentos = 0;

    /* Antes de que llegue nada de la red: la caché, si es de ESTA cuenta. El
       regalo es de una cuenta, no de un móvil — con otro uid no vale. */
    var c = leerCache();
    if (c && c.uid === id) veredicto = { uid: id, founder: !!c.founder, seq: c.seq == null ? null : c.seq };
    else veredicto = null;

    unsub = ST().onDoc('users/' + id + '/' + SUB, function (d) {
      if (uid() !== id) return;             /* llegó tarde: ya hay otra sesión */
      if (d) {
        publicar({ uid: id, founder: !!d.founder, seq: d.seq == null ? null : d.seq });
      } else {
        /* El documento no existe: esta cuenta nunca ha reclamado su número.
           Pasa con las cuentas nuevas y con las que ya existían antes de que
           esto se construyera. */
        reclamar();
      }
    });
  }

  function soltar() {
    try { if (unsub) unsub(); } catch (e) {}
    unsub = null; atado = null;
  }

  /* Al cerrar sesión se borra el veredicto de memoria pero NO la caché: si
     vuelve a entrar la misma cuenta, sigue siendo pionera desde el primer
     render. Si entra otra, el uid no coincidirá y no heredará nada. */
  function alCambiarSesion() {
    if (active()) atar();
    else { soltar(); if (veredicto) { veredicto = null; avisar(); } }
  }

  var API = {
    get available() { return active(); },
    get: function () { return veredicto; },
    refresh: function () {
      var id = uid();
      if (!active() || !id || !ST()) return Promise.resolve(null);
      return ST().get('users/' + id + '/' + SUB).then(function (d) {
        if (uid() !== id) return null;
        if (d) { publicar({ uid: id, founder: !!d.founder, seq: d.seq == null ? null : d.seq }); return veredicto; }
        return reclamar().then(function () { return veredicto; });
      }).catch(function () { return null; });
    },
    _start: function () { alCambiarSesion(); },
    _stop: soltar
  };

  window.CFFounder = API;

  try {
    if (CF() && CF().onState) CF().onState(function () { alCambiarSesion(); });
  } catch (e) {}
  /* Y un intento al cargar, por si la sesión ya estaba restaurada antes de que
     este fichero se ejecutara. */
  try { alCambiarSesion(); } catch (e) {}

  try { console.log('[CFFounder] listo · veredicto de pionero desde la nube'); } catch (e) {}
})();
