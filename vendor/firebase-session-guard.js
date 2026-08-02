/* ===== SEC22 · Guardián de sesión de nube ==============================
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design (actualizar-desde-design.sh la conserva y reinyecta).

   PROBLEMA (hallazgo del test de SEC20 en el iPhone): la app estaba «dentro»
   con la cuenta local (cf_auth_v1) pero SIN sesión de Firebase viva — ni
   comunidad, ni sync, ni interruptores remotos, todo en silencio. Causa: el
   SDK guarda la sesión en IndexedDB, que en el WKWebView (file://) puede
   borrarse; localStorage en cambio SÍ sobrevive (por eso la cuenta local
   seguía ahí).

   ARREGLO en dos piezas:
   1) ESPEJO — cada vez que hay usuario de Firebase, guardamos su user.toJSON()
      (incluye el refresh token) en localStorage (cf_fbuser_mirror_v1).
   2) RESCATE — al arrancar, si hay cuenta local pero la primera emisión de
      onAuthStateChanged viene sin usuario: escribimos el espejo en la clave de
      persistencia localStorage del propio SDK (firebase:authUser:<apiKey>:
      <appName>) y recargamos UNA vez (candado en sessionStorage). Al volver,
      el SDK encuentra al usuario ahí (su PersistenceUserManager recorre TODAS
      las persistencias disponibles y migra la que tenga datos) y la sesión
      revive sin pedir nada al usuario.
   Si no hay espejo, no coincide el email (multi-cuenta: lección del bug de
   fuga del 22 jul) o el rescate ya se intentó: aviso SUAVE de volver a
   iniciar sesión. NUNCA se bloquea el uso local.
   ===================================================================== */
(function () {
  'use strict';

  var MIRROR_KEY = 'cf_fbuser_mirror_v1';
  var RETRY_KEY = 'cf_sec22_retry_v1';      /* sessionStorage: 1 rescate por arranque */
  var GRACE_MS = 3000;                      /* re-comprobación antes de actuar */

  function FB() { return window.CFFirebase; }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function T(key, fallback) {
    try { if (typeof window.tr === 'function') { var s = window.tr(key); if (s && s !== key) return s; } } catch (e) {}
    return fallback;
  }

  /* email de la sesión local (cf_auth_v1) — si no hay, el guardián no actúa */
  function localEmail() {
    try {
      var a = JSON.parse(localStorage.getItem('cf_auth_v1'));
      return (a && a.email) ? String(a.email).toLowerCase().trim() : null;
    } catch (e) { return null; }
  }

  /* clave de persistencia localStorage del SDK: firebase:authUser:<apiKey>:<appName> */
  function sdkKey() {
    try {
      var app = window.firebase.app();
      return 'firebase:authUser:' + app.options.apiKey + ':' + app.name;
    } catch (e) { return null; }
  }

  /* ---- aviso suave (mismo patrón visual que el toast del auth-wire) ----- */
  var _shown = false;
  function softNotice() {
    if (_shown) return; _shown = true;
    try {
      var el = document.createElement('div');
      el.setAttribute('role', 'status');
      el.style.cssText = 'position:fixed;left:50%;top:22px;transform:translateX(-50%);z-index:100000;'
        + 'max-width:88%;padding:12px 16px;border-radius:14px;font-family:inherit;font-size:13px;font-weight:700;'
        + 'line-height:1.35;text-align:center;box-shadow:0 14px 34px -10px rgba(8,30,8,.55);'
        + 'background:#fff7e8;color:#8a5a17;border:1px solid rgba(190,140,60,.3);pointer-events:none;'
        + 'transition:opacity .3s ease';
      el.textContent = T('fb_session_expired',
        'Your cloud session expired. Sign out and back in to keep community and sync working.');
      document.body.appendChild(el);
      setTimeout(function () { el.style.opacity = '0'; }, 7000);
      setTimeout(function () { try { el.remove(); } catch (e) {} }, 7600);
    } catch (e) {}
  }

  function start() {
    if (!FB() || !FB().available) return;             /* sin SDK: nada que vigilar */
    var auth;
    try { auth = window.firebase.auth(); } catch (e) { return; }

    /* 1) ESPEJO — onIdTokenChanged también salta en los refrescos de token,
       así el espejo lleva siempre el refresh token más reciente. */
    try {
      auth.onIdTokenChanged(function (u) {
        if (!u) return;                               /* el borrado explícito ya limpia; un null transitorio no toca el espejo */
        try { lsSet(MIRROR_KEY, JSON.stringify(u.toJSON())); } catch (e) {}
      });
    } catch (e) {}

    /* cierre de sesión / borrado EXPLÍCITOS → el espejo muere con ellos */
    try {
      var _out = FB().signOutFb, _del = FB().deleteAccount;
      FB().signOutFb = function () { lsDel(MIRROR_KEY); return _out.apply(this, arguments); };
      FB().deleteAccount = function () {
        var p = _del.apply(this, arguments);
        return p.then(function (r) { if (r && r.ok) lsDel(MIRROR_KEY); return r; });
      };
    } catch (e) {}

    /* 2) RESCATE — decidimos con la PRIMERA emisión (ahí el SDK ya terminó de
       leer sus persistencias); un temporizador podría ganar la carrera. */
    var first = true, rescued = sessionStorage.getItem(RETRY_KEY) === '1';
    try {
      auth.onAuthStateChanged(function (u) {
        if (first) {
          first = false;
          if (u) return;                              /* sesión de nube viva: no hay nada que rescatar */
          setTimeout(function () {
            if (auth.currentUser) return;             /* apareció durante la gracia */
            var em = localEmail();
            if (!em) return;                          /* sin cuenta local: pantalla de login normal */
            var raw = lsGet(MIRROR_KEY), mu = null;
            try { mu = raw && JSON.parse(raw); } catch (e) { mu = null; }
            var mEmail = mu && mu.email ? String(mu.email).toLowerCase().trim() : null;
            if (mu && mEmail === em && !rescued) {
              var key = sdkKey();
              if (key && lsSet(key, JSON.stringify(mu))) {
                try { sessionStorage.setItem(RETRY_KEY, '1'); } catch (e) {}
                try { console.log('[CFSessionGuard] sesión de nube muerta — rescatando del espejo y recargando'); } catch (e) {}
                location.reload();
                return;
              }
            }
            softNotice();                             /* sin espejo válido o rescate ya intentado */
          }, GRACE_MS);
          return;
        }
        /* tras un rescate, si el usuario revivió y LUEGO cae a null es que el
           token está revocado de verdad → espejo fuera y aviso (sin bucles). */
        if (!u && rescued) { lsDel(MIRROR_KEY); softNotice(); }
      });
    } catch (e) {}

    window.CFSessionGuard = { version: 1, mirrorKey: MIRROR_KEY };
    try { console.log('[CFSessionGuard] activo · rescate previo=' + rescued); } catch (e) {}
  }

  /* firebase-init va antes en el index.html, así que CFFirebase ya existe */
  start();
})();
