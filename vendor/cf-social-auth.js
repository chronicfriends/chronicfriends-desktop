/* ===== LOGIN1 · «Continuar con Apple / Google» de VERDAD (19 oct 2026) =====
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude Design
   (actualizar-desde-design.sh la conserva y la reinyecta tras firebase-auth-wire.js).

   POR QUÉ: Apple rechazó la app el 6 ago 2026 (guideline 4) porque el login social
   de antes era SIMULADO. Desde la 1.0.8i, la pantalla de Claude Design (auth.jsx,
   SocialBlock) solo pinta los botones si existe ESTE motor, y solo los que él dice:

     window.CFSocialAuth = {
       available: { apple: boolean, google: boolean },        ← se lee en cada pintado
       signIn('apple' | 'google') → Promise<
           { ok: true, isNew: boolean }                        ← la sesión YA está abierta
         | { ok: false, code: 'cancelled' | 'account-exists' | 'network' | 'unavailable' | 'error' } >,
       suggestedName() → el nombre de pila que dio el proveedor, o ''
     }
     + el aviso 'cf-social-auth' en window cuando cambia `available`.

   CÓMO: el móvil (native/vendor/authbridge.js) abre la hoja OFICIAL de Apple o de
   Google y devuelve su token de identidad; aquí se abre con él la sesión de Firebase
   (signInWithCredential) y se escribe la identidad en CFAuth igual que el login por
   correo (firebase-auth-wire.js: enterFresh / enterReturning), pero SIN recargar: la
   recarga es de la pantalla (socialEnter).
     · Apple: nonce aleatorio (crypto.getRandomValues). Al móvil va su SHA-256 y a
       Firebase el original: un token robado no sirve para abrir otra sesión.
     · Nada se inventa: sin el puente del móvil (navegador, app 1.0.8 o anterior), sin
       Firebase o sin correo en la cuenta → no hay botones, o un fallo honesto.
     · Solo pacientes (role 'patient'). El nombre del proveedor NO se escribe en el
       perfil: solo se guarda el nombre de pila como SUGERENCIA para el «¿Cómo te
       llamamos?» (Apple rechaza las apps que vuelven a pedir lo que ya dio), en el
       espacio privado de la cuenta, y se borra al terminar la bienvenida.

   BORRAR LA CUENTA (Apple 5.1.1(v) · FB20): para una cuenta de Apple o Google SIN
   contraseña, CFAuthFB.deleteAccountFull primero vuelve a pedir la identidad al
   proveedor (Firebase exige un inicio reciente para borrar y no hay contraseña que
   pedir) y, si es de Apple, REVOCA su token con el código de esa misma hoja. Luego
   sigue el borrado de siempre (huella en la nube + usuario + datos locales).
   ===================================================================== */
(function () {
  'use strict';

  var PROVIDERS = ['apple', 'google'];
  var WAIT_MS = 5 * 60 * 1000;          /* la hoja del proveedor puede tardar (contraseña, 2FA) */
  var CF_ONB_KEY = 'cf_onboarded_v1', CF_FRESH_KEY = 'cf_fresh_v1';
  var NAME_KEY = 'cf_social_name_v1';   /* empieza por cf_: va al espacio privado de la cuenta */

  function T(key, fallback) {
    try { if (typeof window.tr === 'function') { var s = window.tr(key); if (s && s !== key) return s; } } catch (e) {}
    return fallback;
  }
  function log(m) { try { console.log('[CFSocialAuth] ' + m); } catch (e) {} }
  function bridge() { var b = window.ReactNativeWebView; return b && typeof b.postMessage === 'function' ? b : null; }
  function fbOk() { return !!(window.CFFirebase && window.CFFirebase.available && window.firebase && window.firebase.auth); }
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { window.localStorage.removeItem(k); } catch (e) {} }
  function onbDone() { return lsGet(CF_ONB_KEY) === '1'; }

  /* ---- SHA-256 en JS puro, para el nonce de Apple (64 caracteres hexadecimales, una vez
     por inicio de sesión). Sin crypto.subtle, que en el WebView desde file:// no siempre
     está. Solo ASCII. Comprobado contra el de node en tools/tests/social-auth-harness.mjs. */
  var K256 = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  function ror(x, n) { return (x >>> n) | (x << (32 - n)); }
  function sha256Hex(str) {
    var m = [], i, t;
    for (i = 0; i < str.length; i++) { var ch = str.charCodeAt(i); if (ch > 0x7f) return null; m.push(ch); }
    var bits = m.length * 8;
    m.push(0x80);
    while (m.length % 64 !== 56) m.push(0);
    m.push(0, 0, 0, 0, (bits >>> 24) & 255, (bits >>> 16) & 255, (bits >>> 8) & 255, bits & 255);
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var W = new Array(64);
    for (var off = 0; off < m.length; off += 64) {
      for (t = 0; t < 16; t++) W[t] = (m[off + 4 * t] << 24) | (m[off + 4 * t + 1] << 16) | (m[off + 4 * t + 2] << 8) | m[off + 4 * t + 3];
      for (t = 16; t < 64; t++) {
        var x = W[t - 15], y = W[t - 2];
        W[t] = (W[t - 16] + (ror(x, 7) ^ ror(x, 18) ^ (x >>> 3)) + W[t - 7] + (ror(y, 17) ^ ror(y, 19) ^ (y >>> 10))) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var t1 = (h + (ror(e, 6) ^ ror(e, 11) ^ ror(e, 25)) + ((e & f) ^ (~e & g)) + K256[t] + W[t]) | 0;
        var t2 = ((ror(a, 2) ^ ror(a, 13) ^ ror(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = '';
    for (i = 0; i < 8; i++) out += ('00000000' + (H[i] >>> 0).toString(16)).slice(-8);
    return out;
  }
  /* 32 bytes del generador del sistema; sin él, Apple no se ofrece (nunca Math.random) */
  function randomNonce() {
    try {
      var a = new Uint8Array(32);
      window.crypto.getRandomValues(a);
      var s = '';
      for (var i = 0; i < a.length; i++) s += ('0' + a[i].toString(16)).slice(-2);
      return s;
    } catch (e) { return null; }
  }

  /* ---- qué ofrece el móvil (inyectado al arrancar + respuesta a 'auth:ready') ---- */
  var available = { apple: false, google: false };
  function setCaps(c) {
    var on = !!(bridge() && fbOk());
    var a = on && !!(c && c.apple === true), g = on && !!(c && c.google === true);
    if (a === available.apple && g === available.google) return;
    available.apple = a; available.google = g;
    try { window.dispatchEvent(new window.Event('cf-social-auth')); } catch (e) {}
  }

  /* ---- preguntas al móvil: una respuesta por id, o un fallo honesto pasados 5 min ---- */
  var waiting = {}, seq = 0;
  try {
    window.addEventListener('cf-auth-native-result', function (ev) {
      var d = ev && ev.detail;
      if (!d || typeof d.id !== 'string' || !waiting[d.id]) return;
      var w = waiting[d.id]; delete waiting[d.id]; w(d);
    });
    window.addEventListener('cf-auth-native-caps', function (ev) { setCaps(ev && ev.detail); });
  } catch (e) {}
  function ask(msg) {
    return new Promise(function (resolve) {
      var b = bridge();
      if (!b) { resolve({ ok: false, error: 'unavailable' }); return; }
      var id = 'au' + Date.now().toString(36) + '-' + (++seq);
      var tm = setTimeout(function () { if (waiting[id]) { delete waiting[id]; resolve({ ok: false, error: 'error' }); } }, WAIT_MS);
      waiting[id] = function (d) { clearTimeout(tm); resolve(d); };
      msg.id = id;
      try { b.postMessage(JSON.stringify(msg)); }
      catch (e) { delete waiting[id]; clearTimeout(tm); resolve({ ok: false, error: 'error' }); }
    });
  }

  /* la hoja del proveedor → credencial de Firebase (o el código de fallo para la pantalla) */
  function obtain(p, mode) {
    var raw = null, msg = { t: 'auth:signin', provider: p, mode: mode };
    if (p === 'apple') {
      raw = randomNonce();
      if (!raw) return Promise.resolve({ ok: false, code: 'unavailable' });
      msg.nonce = sha256Hex(raw);
    }
    return ask(msg).then(function (d) {
      if (!d || d.ok !== true || typeof d.idToken !== 'string' || !d.idToken) {
        var c = d && d.error;
        return { ok: false, code: c === 'cancelled' || c === 'network' || c === 'unavailable' ? c : 'error' };
      }
      var fa = window.firebase.auth, cred;
      try {
        cred = p === 'apple'
          ? new fa.OAuthProvider('apple.com').credential({ idToken: d.idToken, rawNonce: raw })
          : fa.GoogleAuthProvider.credential(d.idToken);
      } catch (e) { return { ok: false, code: 'error' }; }
      return { ok: true, cred: cred, authCode: typeof d.authCode === 'string' ? d.authCode : null,
        givenName: typeof d.givenName === 'string' ? d.givenName.slice(0, 40) : '' };
    });
  }

  function fbCode(e) {
    var c = String((e && e.code) || '');
    if (c.indexOf('account-exists-with-different-credential') >= 0 || c.indexOf('credential-already-in-use') >= 0
      || c.indexOf('email-already-in-use') >= 0) return 'account-exists';
    if (c.indexOf('network') >= 0) return 'network';
    if (c.indexOf('operation-not-allowed') >= 0) return 'unavailable';
    return 'error';
  }
  function emailOf(u) {
    var em = u && u.email;
    if (!em && u && u.providerData) {
      for (var i = 0; i < u.providerData.length; i++) { if (u.providerData[i] && u.providerData[i].email) { em = u.providerData[i].email; break; } }
    }
    em = String(em || '').trim().toLowerCase();
    return em.indexOf('@') > 0 ? em : '';
  }
  function signOutQuiet() { try { window.CFFirebase.signOutFb(); } catch (e) {} }

  /* la identidad en CFAuth, como enterFresh / enterReturning pero sin recargar */
  function enter(email, isNew, givenName) {
    var info = { role: 'patient', email: email };
    if (isNew) info.fresh = true;
    window.CFAuth.login(info);                          /* PRIMERO: lo de abajo cae en el espacio de ESTA cuenta */
    if (isNew || !onbDone()) {
      lsSet(CF_FRESH_KEY, '1');                         /* sin datos de muestra: diario vacío */
      if (givenName) lsSet(NAME_KEY, givenName);
    }
  }

  var busy = false;
  function signIn(p) {
    if (PROVIDERS.indexOf(p) < 0 || available[p] !== true) return Promise.resolve({ ok: false, code: 'unavailable' });
    if (busy) return Promise.resolve({ ok: false, code: 'error' });
    try { if (window.navigator && window.navigator.onLine === false) return Promise.resolve({ ok: false, code: 'network' }); } catch (e) {}
    busy = true;
    return obtain(p, 'signin').then(function (got) {
      if (!got.ok) return { ok: false, code: got.code };
      return window.firebase.auth().signInWithCredential(got.cred).then(function (res) {
        var u = res && res.user, email = emailOf(u);
        if (!u || !email || !window.CFAuth || typeof window.CFAuth.login !== 'function') { signOutQuiet(); return { ok: false, code: 'error' }; }
        var isNew = !!(res.additionalUserInfo && res.additionalUserInfo.isNewUser);
        enter(email, isNew, got.givenName);
        log(p + ' · cuenta ' + (isNew ? 'nueva' : 'existente') + ' · correo verificado=' + !!u.emailVerified);
        return { ok: true, isNew: isNew };
      }, function (e) { return { ok: false, code: fbCode(e) }; });
    }).then(function (r) { busy = false; return r; }, function () { busy = false; return { ok: false, code: 'error' }; });
  }

  /* ---- aviso flotante (el mismo dibujo que el del login por correo) ---- */
  var _toastEl = null, _toastTimer = null;
  function toast(msg, kind) {
    try {
      var doc = window.document;
      if (!_toastEl) {
        _toastEl = doc.createElement('div');
        _toastEl.setAttribute('role', 'alert');
        _toastEl.style.cssText = 'position:fixed;left:50%;top:22px;transform:translateX(-50%);z-index:100000;'
          + 'max-width:88%;padding:12px 16px;border-radius:14px;font-family:inherit;font-size:13px;font-weight:700;'
          + 'line-height:1.35;text-align:center;box-shadow:0 14px 34px -10px rgba(8,30,8,.55);opacity:0;'
          + 'transition:opacity .18s ease;pointer-events:none';
        doc.body.appendChild(_toastEl);
      }
      var bad = kind === 'error';
      _toastEl.style.background = bad ? '#fcecec' : '#eaf7ea';
      _toastEl.style.color = bad ? '#a23030' : '#1f7a3a';
      _toastEl.style.border = '1px solid ' + (bad ? 'rgba(190,60,60,.28)' : 'rgba(60,160,80,.3)');
      _toastEl.textContent = msg;
      _toastEl.style.opacity = '1';
      if (_toastTimer) clearTimeout(_toastTimer);
      _toastTimer = setTimeout(function () { if (_toastEl) _toastEl.style.opacity = '0'; }, 4200);
    } catch (e) {}
  }

  /* ---- borrar la cuenta: confirmar con el proveedor (+ revocar Apple) y luego lo de siempre ---- */
  function socialOnly(u) {
    if (!u || !u.providerData || !u.providerData.length) return null;
    var ids = u.providerData.map(function (x) { return x && x.providerId; });
    if (ids.indexOf('password') >= 0) return null;     /* tiene contraseña: el camino de siempre */
    if (ids.indexOf('apple.com') >= 0) return 'apple';
    if (ids.indexOf('google.com') >= 0) return 'google';
    return null;
  }
  function revokeApple(u, authCode) {
    var warn = function (why) { try { console.warn('[CFSocialAuth] Apple: token NO revocado — ' + why); } catch (e) {} };
    if (!authCode) { warn('sin código'); return Promise.resolve(); }
    return u.getIdToken().then(function (idToken) {
      var key = ''; try { key = window.firebase.app().options.apiKey; } catch (e) {}
      return ask({ t: 'auth:apple-revoke', authCode: authCode, idToken: idToken, apiKey: key });
    }).then(function (d) { if (d && d.ok) log('Apple: token revocado'); else warn((d && d.error) || 'sin respuesta'); },
      function () { warn('error'); });
  }
  var wire = window.CFAuthFB;
  if (wire && typeof wire.deleteAccountFull === 'function' && !wire.__cfSocialDelete) {
    var plainDelete = wire.deleteAccountFull;
    wire.deleteAccountFull = function () {
      var self = this, args = arguments, u = null;
      try { u = window.CFFirebase.currentUser(); } catch (e) {}
      var p = socialOnly(u);
      if (!p || available[p] !== true) return plainDelete.apply(self, args);
      var failed = function (ref) { toast(T('fb_del_err', 'We could not delete your account. Please try again.') + (ref ? ' (ref ' + ref + ')' : ''), 'error'); };
      obtain(p, 'reauth').then(function (got) {
        if (!got.ok) { if (got.code === 'cancelled') toast(T('fb_del_cancel', 'Account deletion cancelled.')); else failed('obtain-' + got.code); return; }
        return u.reauthenticateWithCredential(got.cred)
          .then(null, function (e) {
            /* DEL2 (26 oct 2026, Historial CF [3716]-[3718]): si lo dice FIREBASE (código «auth/…», p. ej. otra
               cuenta), no se borra. Si falla el MÓVIL —el WKWebView del iPhone pierde IndexedDB al volver de
               segundo plano y el SDK no puede guardar la sesión—, el servidor ya confirmó y la sesión en
               memoria es reciente: se sigue con el borrado. */
            if (e && typeof e.code === 'string' && e.code.indexOf('auth/') === 0) throw e;
            log('confirmar: falló el almacén del móvil (' + ((e && (e.name || e.message)) || e) + ') — sigo con el borrado');
          })
          .then(function () { return p === 'apple' ? revokeApple(u, got.authCode) : null; })
          .then(function () { plainDelete.call(self, { social: true }); });   /* sesión recién confirmada: borra sin pedir contraseña */
      }).catch(function (e) { failed('reauth-' + String((e && e.code) || 'js').replace(/^auth\//, '').slice(0, 40)); });
    };
    wire.__cfSocialDelete = true;
  }

  /* la sugerencia de nombre solo sirve hasta terminar la bienvenida */
  if (onbDone()) lsDel(NAME_KEY);

  window.CFSocialAuth = {
    available: available,
    signIn: signIn,
    suggestedName: function () { return lsGet(NAME_KEY) || ''; },
    _sha256Hex: sha256Hex
  };
  setCaps(window.CFSocialNative);
  if (bridge() && fbOk()) { try { bridge().postMessage(JSON.stringify({ t: 'auth:ready' })); } catch (e) {} }
  log('listo · apple=' + available.apple + ' · google=' + available.google);
})();
