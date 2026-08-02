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
  function showOverlay(email) { buildOverlay(); _ovEmail = email; ovText(); _ov.style.display = 'flex'; }
  function hideOverlay() { if (_ov) _ov.style.display = 'none'; }

  function _onConfirm() {
    if (_ovBusy || !available()) { if (!available()) toast(errMsg('network'), 'error'); return; }
    _ovBusy = true;
    FB().isVerified().then(function (yes) {
      _ovBusy = false;
      if (!yes) { toast(T('fb_not_verified_yet', "We can't see the verification yet. Open the email and tap the link."), 'error'); return; }
      var p = _pending || {};
      hideOverlay();
      if (p.mode === 'returning') enterReturning(p.role, p.email, p.credKey, p.pw);
      else enterFresh(p.role, p.email, p.credKey, p.pw);
    }).catch(function () { _ovBusy = false; toast(errMsg('network'), 'error'); });
  }
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
    deleteAccountFull: function () {
      var done = false;
      var wipeAndReload = function () {                /* solo tras confirmar el borrado en la nube (o sin Firebase) */
        if (done) return; done = true;                /* idempotente: nunca borra/recarga dos veces */
        try { wipeLocalAccount(); } catch (e) {}
        try { window.CFAuth && CFAuth.logout(); } catch (e) {}
        location.reload();
      };
      var failMsg = function () { toast(T('fb_del_err', 'We could not delete your account. Please try again.'), 'error'); };

      /* Firebase exigió login reciente → pedir contraseña, reautenticar y reintentar. */
      var reauthAndDelete = function () {
        var pw = null;
        try { pw = window.prompt(T('fb_del_reauth', 'Confirm your password to permanently delete your account:')); }
        catch (e) { pw = null; }
        if (pw == null) { toast(T('fb_del_cancel', 'Account deletion cancelled.')); return; }  /* cancelado: no borra nada */
        FB().reauthenticate(pw).then(function (r) {
          if (!(r && r.ok)) { toast(T('fb_del_badpw', 'Wrong password — your account was not deleted.'), 'error'); return; }
          FB().deleteAccount().then(function (r2) {
            if (r2 && r2.ok) { wipeAndReload(); } else { failMsg(); }
          }).catch(failMsg);
        }).catch(failMsg);
      };

      try {
        if (available() && FB().currentUser()) {
          FB().deleteAccount().then(function (r) {
            if (r && r.ok) { wipeAndReload(); return; }
            if (r && String(r.code).indexOf('requires-recent-login') >= 0) { reauthAndDelete(); return; }
            failMsg();                                 /* otro error (red/servidor): NO borres local, deja reintentar */
          }).catch(failMsg);
          return;
        }
      } catch (e) {}
      wipeAndReload();                                 /* sin Firebase (offline / cuenta solo local): borra local */
    }
  };

  window.CFAuthFB = CFAuthFB;
  try { console.log('[CFAuthFB] cableado del login listo · Firebase available=' + available()); } catch (e) {}
})();
