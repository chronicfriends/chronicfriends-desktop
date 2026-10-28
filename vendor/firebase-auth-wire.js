/* ===== Firebase Auth · cableado del login real (Fase 2B) ================
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design. Es EL CEREBRO del auth real — 100% aditivo, no reescribe la UI.

   El login de Claude Design (build/auth.js) sigue pintando sus pantallas.
   actualizar-desde-design.sh parchea SOLO dos funciones (startSignup y
   signInPatient) para que llamen aquí; el resto del flujo de verificación lo
   controla este archivo con su PROPIO overlay "revisa tu correo" (así no hay
   que tocar el JSX del código de 6 dígitos, que queda muerto e inofensivo).

   Modelo (decidido 12 jul 2026):
   • Registro y login con Firebase Auth (email + contraseña).
   • Verificación de email por ENLACE real (Firebase manda el correo). El
     usuario lo abre, pulsa el enlace y vuelve → "He verificado mi correo".
   • Verificación ESTRICTA: no se entra hasta que el email esté verificado.
   • Espejo local (cf_creds_v1) para el namespacing por cuenta y para permitir
     iniciar sesión OFFLINE si ya te autenticaste antes en este dispositivo.
   • Sin conexión: crear cuenta / primer inicio de sesión avisan; nada rompe.
   ===================================================================== */
(function () {
  'use strict';

  /* Texto traducible con fallback (la i18n de los 16 idiomas se completa como
     sub-paso; tr() recogerá estas claves cuando existan). */
  function T(key, fallback) {
    try { if (typeof window.tr === 'function') { var s = window.tr(key); if (s && s !== key) return s; } } catch (e) {}
    return fallback;
  }
  function FB() { return window.CFFirebase; }
  function available() { return !!(window.CFFirebase && window.CFFirebase.available); }
  var logoutBusy = false;                              /* LOGOUT1: un solo cierre de sesión a la vez */
  var LOGOUT_MAX_MS = 5000;                            /* LOGOUT1: pase lo que pase, a los 5 s se sale */

  /* ---- toast flotante (independiente del árbol React del login) -------- */
  var _toastEl = null, _toastTimer = null;
  function toast(msg, kind) {
    try {
      if (!_toastEl) {
        _toastEl = document.createElement('div');
        _toastEl.setAttribute('role', 'alert');
        _toastEl.style.cssText = 'position:fixed;left:50%;top:22px;transform:translateX(-50%);z-index:100000;'
          + 'max-width:88%;padding:12px 16px;border-radius:14px;font-family:inherit;font-size:13px;font-weight:700;'
          + 'line-height:1.35;text-align:center;box-shadow:0 14px 34px -10px rgba(8,30,8,.55);opacity:0;'
          + 'transition:opacity .18s ease, transform .18s ease;pointer-events:none';
        document.body.appendChild(_toastEl);
      }
      var bad = kind === 'error';
      _toastEl.style.background = bad ? '#fcecec' : '#eaf7ea';
      _toastEl.style.color = bad ? '#a23030' : '#1f7a3a';
      _toastEl.style.border = '1px solid ' + (bad ? 'rgba(190,60,60,.28)' : 'rgba(60,160,80,.3)');
      _toastEl.textContent = msg;
      _toastEl.style.opacity = '1';
      _toastEl.style.transform = 'translateX(-50%) translateY(0)';
      if (_toastTimer) clearTimeout(_toastTimer);
      _toastTimer = setTimeout(function () { if (_toastEl) { _toastEl.style.opacity = '0'; } }, 4200);
    } catch (e) {}
  }

  function errMsg(code) {
    code = String(code || '');
    if (code.indexOf('email-already-in-use') >= 0) return T('fb_err_inuse', 'That email already has an account. Try signing in.');
    if (code.indexOf('weak-password') >= 0)        return T('fb_err_weak', 'Choose a stronger password (at least 6 characters).');
    if (code.indexOf('invalid-email') >= 0)        return T('fb_err_email', 'That email address looks invalid.');
    if (code.indexOf('network') >= 0)              return T('fb_err_net', 'You need an internet connection to do this.');
    if (code.indexOf('too-many-requests') >= 0)    return T('fb_err_many', 'Too many attempts. Please wait a moment and try again.');
    if (code.indexOf('wrong-password') >= 0 || code.indexOf('invalid-credential') >= 0 || code.indexOf('user-not-found') >= 0)
      return T('fb_err_creds', 'Incorrect email or password. Please try again.');
    return T('fb_err_generic', 'Something went wrong. Please try again.');
  }

  /* PW1 — el código de Firebase de un cambio de contraseña → uno corto que la
     pantalla sabe leer. «wrong-password» es SOLO la contraseña ACTUAL mal escrita. */
  function pwCode(r) {
    var c = String((r && r.code) || '');
    if (c.indexOf('wrong-password') >= 0 || c.indexOf('invalid-credential') >= 0 || c.indexOf('invalid-login-credentials') >= 0) return 'wrong-password';
    if (c.indexOf('weak-password') >= 0) return 'weak-password';
    if (c.indexOf('network') >= 0) return 'network';
    if (c.indexOf('too-many-requests') >= 0) return 'too-many-requests';
    if (c.indexOf('requires-recent-login') >= 0) return 'requires-recent-login';
    if (c.indexOf('no-current-user') >= 0 || c.indexOf('user-not-found') >= 0 || c.indexOf('user-token-expired') >= 0 || c.indexOf('user-disabled') >= 0) return 'no-current-user';
    return 'error';
  }
  function pwMsg(code) {
    if (code === 'wrong-password') return T('pw_err_current', 'Your current password isn’t right.');
    if (code === 'same-password') return T('pw_err_same', 'The new password has to be different from the current one.');
    if (code === 'no-password') return T('pw_err_social', 'This account signs in with Apple or Google, so it has no password.');
    if (code === 'weak-password' || code === 'network' || code === 'too-many-requests') return errMsg(code);
    return errMsg('');
  }
  var pwBusy = false;                                  /* PW1: un cambio de contraseña a la vez */

  /* ---- sesión (replica lo que hacía el auth simulado) ----------------- */
  var CF_ONB_KEY = 'cf_onboarded_v1', CF_FRESH_KEY = 'cf_fresh_v1';
  function onbDone() { try { return localStorage.getItem(CF_ONB_KEY) === '1'; } catch (e) { return false; } }
  function enterFresh(role, email, credKey, pw) {
    try { window.cfSetCred(credKey, pw); } catch (e) {}
    window.CFAuth.login({ role: role, email: email, fresh: true });
    try { localStorage.setItem(CF_FRESH_KEY, '1'); } catch (e) {}
    try { window.CFAuth.setOnboarded(false); } catch (e) {}
    location.reload();
  }
  function enterReturning(role, email, credKey, pw) {
    try { window.cfSetCred(credKey, pw); } catch (e) {}
    window.CFAuth.login({ role: role, email: email });
    try { if (!onbDone()) localStorage.setItem(CF_FRESH_KEY, '1'); } catch (e) {}
    try { window.CFAuth.setOnboarded(onbDone()); } catch (e) {}
    location.reload();
  }

  /* borra TODOS los datos locales de la cuenta actual (namespace cfns:<uid>:*)
     y su credencial del registro global — para el borrado real de cuenta (D2.3). */
  function wipeLocalAccount() {
    try {
      var prefix = (window.CFNS && CFNS.prefix && CFNS.prefix()) || null;   /* 'cfns:<uid>:' */
      if (prefix) {
        var kill = [];
        for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(prefix) === 0) kill.push(k); }
        kill.forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
      }
      var auth = null; try { auth = JSON.parse(localStorage.getItem('cf_auth_v1')); } catch (e) {}
      if (auth && auth.email) {                          /* cf_creds_v1 es global: quita la credencial de este email (paciente y doctor) */
        try {
          var creds = JSON.parse(localStorage.getItem('cf_creds_v1')) || {};
          var em = String(auth.email).toLowerCase().trim();
          delete creds[em]; delete creds['dr:' + em];
          localStorage.setItem('cf_creds_v1', JSON.stringify(creds));
        } catch (e) {}
      }
    } catch (e) {}
  }

  var _pending = null;   /* {email, pw, credKey, role, mode:'fresh'|'returning', setSu} */

  /* ---- overlay "revisa tu correo" (DOM plano, reutiliza clases CSS) ---- */
  var _ov = null, _ovEmail = null, _ovBusy = false;
  function buildOverlay() {
    if (_ov) return;
    _ov = document.createElement('div');
    _ov.style.cssText = 'position:fixed;inset:0;z-index:99990;display:none;align-items:center;justify-content:center;'
      + 'background:rgba(15,35,15,.62);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);padding:22px;font-family:inherit';
    var card = document.createElement('div');
    card.style.cssText = 'background:var(--card,#fff);border-radius:24px;padding:26px 22px 22px;max-width:340px;width:100%;'
      + 'text-align:center;box-shadow:0 24px 60px -18px rgba(5,20,5,.6)';
    card.innerHTML =
      '<div style="width:60px;height:60px;border-radius:20px;margin:2px auto 14px;display:flex;align-items:center;justify-content:center;'
      + 'color:#fff;background:radial-gradient(120% 120% at 30% 25%,#7bd853,#3f8a3f);box-shadow:0 12px 24px -8px rgba(58,140,45,.5)">'
      + '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 6 10-6"/></svg></div>'
      + '<div data-cf="title" style="font-size:18px;font-weight:800;color:var(--ink,#14321a)"></div>'
      + '<div data-cf="body" style="font-size:12.5px;font-weight:600;color:var(--muted,#5a6b58);margin-top:6px;line-height:1.5;padding:0 4px"></div>'
      + '<div data-cf="email" style="font-size:13px;font-weight:800;color:var(--ink,#14321a);margin-top:4px;word-break:break-all"></div>'
      + '<button data-cf="confirm" class="btn3d pill" style="width:100%;margin-top:18px;padding:15px;font-size:15.5px;font-weight:700"></button>'
      + '<div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-top:13px">'
      + '<button data-cf="resend" style="background:none;border:none;cursor:pointer;font-family:inherit;font-size:12.5px;font-weight:700;color:var(--green-600,#2a8c43)"></button>'
      + '<span style="width:1px;height:13px;background:rgba(120,140,115,.3)"></span>'
      + '<button data-cf="cancel" style="background:none;border:none;cursor:pointer;font-family:inherit;font-size:12.5px;font-weight:700;color:var(--muted-2,#8a988a)"></button></div>';
    _ov.appendChild(card);
    document.body.appendChild(_ov);
    card.querySelector('[data-cf="confirm"]').addEventListener('click', _onConfirm);
    card.querySelector('[data-cf="resend"]').addEventListener('click', _onResend);
    card.querySelector('[data-cf="cancel"]').addEventListener('click', _onCancel);
  }
  function ovText() {
    var c = _ov.firstChild;
    c.querySelector('[data-cf="title"]').textContent = T('fb_ov_title', 'Check your inbox');
    c.querySelector('[data-cf="body"]').textContent = T('fb_ov_body', 'We sent a verification link to');
    c.querySelector('[data-cf="email"]').textContent = _ovEmail || '';
    c.querySelector('[data-cf="confirm"]').textContent = T('fb_ov_confirm', "I've verified my email");
    c.querySelector('[data-cf="resend"]').textContent = T('fb_ov_resend', 'Resend email');
    c.querySelector('[data-cf="cancel"]').textContent = T('fb_ov_cancel', 'Use another email');
  }
  function showOverlay(email) { buildOverlay(); _ovEmail = email; ovText(); _ov.style.display = 'flex'; _ovDesde = Date.now(); _vigilar(); }
  function hideOverlay() { if (_ov) _ov.style.display = 'none'; }
  function _ovVisible() { return !!(_ov && _ov.style.display !== 'none'); }

  function _entrar() {
    var p = _pending || {};
    hideOverlay();
    if (p.mode === 'returning') enterReturning(p.role, p.email, p.credKey, p.pw);
    else enterFresh(p.role, p.email, p.credKey, p.pw);
  }

  function _onConfirm() {
    if (_ovBusy || !available()) { if (!available()) toast(errMsg('network'), 'error'); return; }
    _ovBusy = true;
    FB().isVerified().then(function (yes) {
      _ovBusy = false;
      if (!yes) { toast(T('fb_not_verified_yet', "We can't see the verification yet. Open the email and tap the link."), 'error'); return; }
      _entrar();
    }).catch(function () { _ovBusy = false; toast(errMsg('network'), 'error'); });
  }

  /* VER1 (2 oct 2026) — LA APP SE ENTERA SOLA de que ya verificaste.
     Hasta hoy, tras pulsar el enlace del correo había que volver y tocar «He verificado mi
     correo». Ahora el «Continuar» del correo abre la app (www.chronicfriends.org/open/verificado,
     functions/index.js) y, con esta ventana abierta, se comprueba sola: al volver a la app y,
     por si el móvil no avisa de la vuelta, cada 5 s durante 10 minutos. En silencio — si aún no
     está verificado no sale ningún aviso; el botón sigue ahí para quien lo prefiera. */
  var _ovDesde = 0, _vigia = null;
  var VIGIA_MS = 5000, VIGIA_MAX_MS = 10 * 60 * 1000;
  function _autoCheck() {
    if (!_ovVisible() || _ovBusy || !available()) return;
    _ovBusy = true;
    FB().isVerified().then(function (yes) {
      _ovBusy = false;
      if (yes && _ovVisible()) _entrar();
    }).catch(function () { _ovBusy = false; });
  }
  function _vigilar() {
    if (_vigia) return;
    _vigia = setInterval(function () {
      if (!_ovVisible() || Date.now() - _ovDesde > VIGIA_MAX_MS) { clearInterval(_vigia); _vigia = null; return; }
      if (document.visibilityState === 'visible') _autoCheck();
    }, VIGIA_MS);
  }
  try { document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') _autoCheck(); }); } catch (e) {}
  try { window.addEventListener('focus', _autoCheck); } catch (e) {}
  function _onResend() {
    if (!available()) { toast(errMsg('network'), 'error'); return; }
    FB().sendVerification().then(function (r) { toast(r.ok ? T('fb_resent', 'Verification email re-sent.') : errMsg(r.code), r.ok ? 'ok' : 'error'); });
  }
  function _onCancel() {
    hideOverlay();
    try { FB() && FB().signOutFb(); } catch (e) {}   /* deja limpio: registro/verificación a medias no queda con sesión */
    var setSu = _pending && _pending.setSu;
    _pending = null;
    if (setSu) setSu('form');
  }

  var CFAuthFB = {
    available: available,

    /* ---- RECUPERACIÓN (SL13): envía el email real de reset de Firebase.
       Fire-and-forget a propósito: la UI dice «enviado» siempre que el email
       tenga formato válido, para no revelar si la cuenta existe. ---- */
    resetPassword: function (email) {
      if (!available()) return false;
      try { FB().sendPasswordReset(email); } catch (e) {}
      return true;
    },

    /* ---- PW1 (22 oct 2026, Historial CF [3473]): ¿la cuenta tiene contraseña?
       true / false según los proveedores de Firebase; null si no hay sesión o no
       se sabe. Una cuenta que solo entra con Apple o Google da false: la pantalla
       no le ofrece «Cambiar contraseña». ---- */
    hasPassword: function () {
      try {
        var u = available() && FB().currentUser();
        if (!u) return null;
        return (u.providerData || []).some(function (p) { return !!(p && p.providerId === 'password'); });
      } catch (e) { return null; }
    },

    /* ---- PW1: CAMBIAR LA CONTRASEÑA DE VERDAD. Hasta hoy la pantalla de Ajustes
       solo guardaba la nueva en el espejo local (cfSetCred): Firebase seguía con la
       vieja y, en otro móvil o al reinstalar, la nueva NO servía. Aquí se cambia en
       Firebase: reautenticar con la ACTUAL → updatePassword(nueva), en ese orden.
       SIEMPRE resuelve {ok:true} | {ok:false, code, message}; nunca rechaza.
       code: wrong-password (la actual) · weak-password · same-password ·
       no-password (cuenta solo de Apple/Google) · network · too-many-requests ·
       no-current-user · busy · error. NO toca el espejo local: lo pone al día la
       pantalla tras ok:true. ---- */
    changePassword: function (o) {
      var cur = String((o && o.current) || ''), next = String((o && o.next) || '');
      var no = function (code) { return Promise.resolve({ ok: false, code: code, message: pwMsg(code) }); };
      if (pwBusy) return no('busy');
      if (!available()) return no('network');
      var u = null;
      try { u = FB().currentUser(); } catch (e) { u = null; }
      if (!u || !u.email) return no('no-current-user');
      if (this.hasPassword() === false) return no('no-password');
      if (!cur) return no('wrong-password');
      if (next.length < 6) return no('weak-password');
      if (next === cur) return no('same-password');
      pwBusy = true;
      var end = function (r) { pwBusy = false; return r; };
      var bad = function (r) { var c = pwCode(r); return { ok: false, code: c, message: pwMsg(c) }; };
      /* PW1 bajo DEL2 (26 oct 2026, Historial CF [3718] [3726]): en el iPhone, al volver de segundo plano, el
         WKWebView pierde IndexedDB y el SDK falla al GUARDAR la sesión DESPUÉS de que el servidor ya hizo su
         parte (medido con el emulador: auditorias/login1-borrado-google-20261026/arnes-emulador/experimento-pw1.mjs).
         Un fallo SIN código «auth/…» es ese almacén, no Firebase diciendo que no. */
      var esMovil = function (r) {
        var c = String((r && r.code) || '');
        return !!r && !r.ok && c.indexOf('auth/') !== 0 && c !== 'no-current-user' && c !== 'sdk-missing';
      };
      /* la sesión nueva del SDK (en memoria) al espejo de SEC22: si el móvil reinicia, su rescate la recupera
         (la de IndexedDB se queda vieja, y el servidor la invalida al cambiar la contraseña) */
      var espejo = function () {
        try {
          var g = window.CFSessionGuard, uu = FB().currentUser();
          if (g && g.mirrorKey && uu && typeof uu.toJSON === 'function') localStorage.setItem(g.mirrorKey, JSON.stringify(uu.toJSON()));
        } catch (e) {}
      };
      var cambiar = function () {
        return Promise.resolve(FB().updatePassword(next)).then(function (r2) {
          if (r2 && r2.ok) return { ok: true };
          if (!esMovil(r2) || typeof FB().checkPassword !== 'function') return bad(r2);
          /* ¿la cambió el servidor antes de que fallara el almacén? Se mira entrando con la NUEVA por REST */
          return Promise.resolve(FB().checkPassword(u.email, next)).then(function (c) {
            if (!(c && c.ok)) return bad(r2);
            espejo();
            return { ok: true };
          });
        });
      };
      return Promise.resolve().then(function () { return FB().reauthenticate(cur); })
        .then(function (r) {
          if (r && r.ok) return cambiar();
          if (esMovil(r)) return cambiar();             /* Firebase aceptó la actual: el fallo llegó después, al guardar */
          return bad(r);
        })
        .catch(bad)
        .then(end);
    },

    /* ---- REGISTRO: crea la cuenta, manda el enlace y abre el overlay --- */
    signUp: function (ctx) {
      if (!available()) { ctx.setSu && ctx.setSu('form'); toast(errMsg('network'), 'error'); return; }
      var email = ctx.email, pw = ctx.pw;
      FB().register(email, pw).then(function (r) {
        if (r.ok) {
          _pending = { email: email, pw: pw, credKey: ctx.credKey, role: ctx.role, mode: 'fresh', setSu: ctx.setSu };
          return FB().sendVerification().then(function () { showOverlay(email); });
        }
        if (String(r.code || '').indexOf('email-already-in-use') >= 0) {
          /* ya existe: intenta iniciar sesión; si va y está verificado, entra;
             si va pero sin verificar, reenvía el enlace y abre el overlay. */
          return FB().signIn(email, pw).then(function (s) {
            if (s.ok && s.verified) { toast(T('fb_already_verified', 'You already have a verified account — signing you in.'), 'ok'); enterReturning(ctx.role, email, ctx.credKey, pw); return; }
            if (s.ok) { _pending = { email: email, pw: pw, credKey: ctx.credKey, role: ctx.role, mode: 'returning', setSu: ctx.setSu }; return FB().sendVerification().then(function () { showOverlay(email); }); }
            ctx.setSu && ctx.setSu('form'); toast(errMsg('email-already-in-use'), 'error');
          });
        }
        ctx.setSu && ctx.setSu('form'); toast(errMsg(r.code), 'error');
      }).catch(function (e) { ctx.setSu && ctx.setSu('form'); toast(errMsg(e && e.code), 'error'); });
    },

    /* ---- INICIO DE SESIÓN --------------------------------------------- */
    signIn: function (ctx) {
      var email = ctx.email, pw = ctx.pw, role = ctx.role, credKey = ctx.credKey;

      /* Reconocimiento entre roles (LOCAL, intacto del diseño): email de
         paciente que en este dispositivo pertenece a un doctor → entra doctor. */
      try {
        if (!ctx.isDoc && !window.cfHasCred(email) && window.cfHasCred('dr:' + email)) {
          if (!window.cfCheckCred('dr:' + email, pw)) { ctx.setSignInErr(true); return; }
          ctx.setSignInErr(false); ctx.setNoAccount(false);
          enterReturning('doctor', email, 'dr:' + email, pw); return;
        }
      } catch (e) {}

      if (!available()) {
        /* Sin red: solo si ya te autenticaste antes en este dispositivo. */
        try { if (window.cfCheckCred(credKey, pw)) { ctx.setSignInErr(false); ctx.setNoAccount(false); enterReturning(role, email, credKey, pw); return; } } catch (e) {}
        ctx.setSignInErr(false); ctx.setNoAccount(false); toast(errMsg('network'), 'error'); return;
      }

      FB().signIn(email, pw).then(function (r) {
        if (r.ok && r.verified) { ctx.setSignInErr(false); ctx.setNoAccount(false); enterReturning(role, email, credKey, pw); return; }
        if (r.ok && !r.verified) {
          /* Estricto: cuenta correcta pero sin verificar → overlay + reenvío. */
          ctx.setSignInErr(false); ctx.setNoAccount(false);
          _pending = { email: email, pw: pw, credKey: credKey, role: role, mode: 'returning', setSu: ctx.setSu };
          FB().sendVerification().then(function () { showOverlay(email); });
          return;
        }
        if (String(r.code || '').indexOf('network') >= 0) {
          try { if (window.cfCheckCred(credKey, pw)) { enterReturning(role, email, credKey, pw); return; } } catch (e) {}
          toast(errMsg('network'), 'error'); return;
        }
        ctx.setSignInErr(true);   /* Firebase v10 no distingue no-existe de pw-mal → mensaje único */
      }).catch(function () { ctx.setSignInErr(true); });
    },

    /* Borrado REAL de cuenta (RoadMap D2.3 — Apple lo exige): borra el usuario
       de Firebase Y todos los datos locales de la cuenta, luego cierra sesión.
       Si Firebase pide reautenticación reciente (auth/requires-recent-login),
       pedimos la contraseña, reautenticamos y REINTENTAMOS el borrado en la nube,
       para no dejar una cuenta "fantasma" en Firebase. Si el usuario cancela o
       la contraseña falla, NO borramos nada (la cuenta queda intacta) y avisamos. */
    deleteAccountFull: function (opts) {
      /* DEL2 (26 oct 2026): {social:true} = viene de cf-social-auth, ya confirmado con Apple o Google;
         esa cuenta no tiene contraseña que pedir si Firebase volviera a exigir un inicio reciente. */
      var social = !!(opts && opts.social);
      var done = false;
      var wipeAndReload = function () {                /* solo tras confirmar el borrado en la nube (o sin Firebase) */
        if (done) return; done = true;                /* idempotente: nunca borra/recarga dos veces */
        try { wipeLocalAccount(); } catch (e) {}
        try { window.CFAuth && CFAuth.logout(); } catch (e) {}
        location.reload();
      };
      /* DEL2: el aviso lleva una referencia corta del paso que falló (p. ej. «(ref delete-unknown)»):
         la consola del WKWebView no llega a la Pi y sin ella el fallo del 26 oct no se podía leer. */
      var failMsg = function (ref) {
        toast(T('fb_del_err', 'We could not delete your account. Please try again.') + (ref ? ' (ref ' + ref + ')' : ''), 'error');
      };
      var refDe = function (r) { return String((r && r.code) || 'x').replace(/^auth\//, '').slice(0, 40); };

      /* Art. 17 · derecho de supresión (3 sep 2026). ANTES de borrar el usuario
         de Firebase Auth hay que borrar lo que publicó a otros y lo que solo él
         tiene permiso de borrar: en cuanto desaparece de Auth, ya nadie puede
         tocar esos documentos y quedan huérfanos PARA SIEMPRE — con su edad y
         sus años de enfermedad dentro (users/{uid}/public/profile). La Política
         v3.1 §6 promete que al cerrar la cuenta se borran: aquí se cumple.
           · users/{uid}/public/profile   ← los 4 campos del interruptor + nombre/avatar
           · directory/{uid}              ← «Let others find me» (nombre, avatar, rol, lastSeen)
           · steps_board/{uid}            ← la fila del torneo de pasos
           · users/{uid}/private/settings ← findable
           · users/{uid}/private/push     ← tokens de notificación (CHAT7)
         Es lo mejor posible DESDE EL CLIENTE: si un borrado falla se sigue con
         la cuenta (Apple exige que borrar la cuenta siempre sea posible) y se
         deja rastro en consola; el resto (health/*, posts, chats) lo cubre la
         Cloud Function onDelete del RoadMap. Idempotente: borrar un documento
         que no existe no es error, así que reintentar tras la reautenticación
         es seguro. NO exige login reciente (eso solo lo pide u.delete()). */
      var purgeCloudFootprint = function () {
        var u = null; try { u = FB().currentUser(); } catch (e) {}
        var me = u && u.uid; var st = window.CFStore;
        if (!me || !st || typeof st.del !== 'function') return Promise.resolve({ ok: false, code: 'unavailable', failed: [] });
        var paths = [
          'users/' + me + '/public/profile',
          'directory/' + me,
          'steps_board/' + me,
          'users/' + me + '/private/settings',
          'users/' + me + '/private/push'
        ];
        var failed = [];
        return Promise.all(paths.map(function (p) {
          var one;
          try { one = st.del(p); } catch (e) { one = Promise.resolve({ ok: false }); }
          return Promise.resolve(one).then(
            function (r) { if (!(r && r.ok)) failed.push(p); return r; },
            function () { failed.push(p); return { ok: false }; }
          );
        })).then(function () {
          if (failed.length) { try { console.warn('[cf-delete] art.17: cloud footprint NOT fully removed:', failed.join(', ')); } catch (e) {} }
          return { ok: !failed.length, failed: failed };
        });
      };

      /* Firebase exigió login reciente → pedir contraseña, reautenticar y reintentar. */
      var reauthAndDelete = function () {
        var pw = null;
        try { pw = window.prompt(T('fb_del_reauth', 'Confirm your password to permanently delete your account:')); }
        catch (e) { pw = null; }
        if (pw == null) { toast(T('fb_del_cancel', 'Account deletion cancelled.')); return; }  /* cancelado: no borra nada */
        FB().reauthenticate(pw).then(function (r) {
          if (!(r && r.ok)) {
            var c = String((r && r.code) || '');
            /* DEL2: un código «auth/…» es Firebase diciendo que no (contraseña mal…) → no se borra. Sin él,
               lo que falló fue el almacén del móvil DESPUÉS de que Firebase aceptara la contraseña: la sesión
               en memoria ya es reciente y se sigue (si no lo fuera, el borrado lo dirá con su propio código). */
            if (c.indexOf('auth/') === 0 || c === 'no-current-user') { toast(T('fb_del_badpw', 'Wrong password — your account was not deleted.'), 'error'); return; }
          }
          purgeCloudFootprint().then(function () { return FB().deleteAccount(); }).then(function (r2) {
            if (r2 && r2.ok) { wipeAndReload(); } else { failMsg('delete-' + refDe(r2)); }
          }).catch(function () { failMsg('js'); });
        }).catch(function () { failMsg('js'); });
      };

      try {
        if (available() && FB().currentUser()) {
          purgeCloudFootprint().then(function () { return FB().deleteAccount(); }).then(function (r) {
            if (r && r.ok) { wipeAndReload(); return; }
            if (r && String(r.code).indexOf('requires-recent-login') >= 0) {
              if (social) { failMsg('reauth-social'); return; }   /* DEL2: Apple/Google no tienen contraseña que pedir */
              reauthAndDelete(); return;
            }
            failMsg('delete-' + refDe(r));             /* otro error (red/servidor): NO borres local, deja reintentar */
          }).catch(function () { failMsg('js'); });
          return;
        }
      } catch (e) {}
      wipeAndReload();                                 /* sin Firebase (offline / cuenta solo local): borra local */
    },

    /* LOGOUT1 (21 oct 2026) — «Tanca la sessió» DE VERDAD: cierra también la
       sesión de Firebase. Antes solo se borraba cf_auth_v1 y se recargaba; el
       SDK restauraba al usuario al arrancar y, con la pantalla de entrar
       delante, la sincronización de salud seguía con su cuenta (bajando sus
       datos al espacio 'anon' del móvil) y RevenueCat seguía con su uid. Lo
       destapó la prueba 5 de LOGIN1 en el iPhone (Historial CF [3401]).
       El ORDEN importa:
         1) subir lo pendiente con la cuenta aún puesta: CFSync.pushNow lee las
            cajas del espacio de ESTA cuenta (después de CFAuth.logout leería
            las de 'anon', vería null y borraría la caja en la nube);
         2) esperar a que Firestore confirme esas escrituras, con tope (sin
            red se quedan en la cola local de esta cuenta y salen cuando
            vuelva a entrar);
         3) salir de Firebase (el guardián SEC22 se lleva con ello el espejo);
         4) borrar la sesión local y recargar.
       Nunca se queda colgado: cada espera tiene tope y un fallo sigue adelante.
       Lo llama el botón de Claude Design (encargo 1.0.8k §3d); hasta entonces
       el envoltorio de CFAuth.logout de abajo hace 1) y 3) sin esperar. */
    logoutFull: function () {
      if (logoutBusy) return;
      logoutBusy = true;
      var done = false;
      var finish = function () {
        if (done) return; done = true;
        try { window.CFAuth && CFAuth.logout(); } catch (e) {}
        try { location.reload(); } catch (e) {}
      };
      var upTo = function (p, ms) {                    /* espera p, pero nunca más de ms */
        return Promise.race([Promise.resolve(p).catch(function () {}), new Promise(function (r) { setTimeout(r, ms); })]);
      };
      setTimeout(finish, LOGOUT_MAX_MS);
      try { window.CFSync && CFSync.pushNow && CFSync.pushNow(); } catch (e) {}
      upTo(new Promise(function (r) { setTimeout(r, 250); }).then(function () {   /* deja que las subidas lleguen a la cola */
        try { return window.firebase.firestore().waitForPendingWrites(); } catch (e) { return null; }
      }), 2500).then(function () {
        var out = null;
        try { if (available() && FB().currentUser()) out = FB().signOutFb(); } catch (e) { out = null; }
        return upTo(out, 1500);
      }).then(finish, finish);
    }
  };

  window.CFAuthFB = CFAuthFB;

  /* LOGOUT1 — mientras el botón de Claude Design llame a CFAuth.logout() y
     recargue en el acto (sin esperar a nadie), es el propio CFAuth.logout()
     el que sube lo pendiente y empieza a salir de Firebase ANTES de soltar la
     cuenta local. La recarga puede cortar la salida a medias: entonces la
     remata el guardián SEC22 al arrancar (sesión de nube sin nadie dentro →
     fuera). CFAuth vive en build/auth.js, que carga DESPUÉS que vendor/: se
     envuelve al terminar de cargar la página. Idempotente. */
  function wrapLogout() {
    var A = window.CFAuth;
    if (!A || typeof A.logout !== 'function' || A.logout.__cfFull) return;
    var plain = A.logout;
    var full = function () {
      try { if (A.get && A.get() && window.CFSync && CFSync.pushNow) CFSync.pushNow(); } catch (e) {}
      try { if (available() && FB().currentUser()) FB().signOutFb(); } catch (e) {}
      return plain.apply(this, arguments);
    };
    full.__cfFull = true;
    A.logout = full;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wrapLogout);
  else wrapLogout();
  try { console.log('[CFAuthFB] cableado del login listo · Firebase available=' + available()); } catch (e) {}
})();
