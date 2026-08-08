/* ===== Firebase — inicialización + puente de Auth (Fase 2) ==============
   Capa persistente: vive en webapp/vendor/ y sobrevive a los reexports de
   Claude Design (actualizar-desde-design.sh la conserva y reinyecta).

   Qué hace:
   • Inicializa Firebase con el firebaseConfig del proyecto chronic-friends
     (la apiKey Web es PÚBLICA por diseño — la seguridad la dan las reglas de
     Firestore, no esta clave).
   • Expone window.CFFirebase: un puente async de alto nivel (crear cuenta,
     iniciar sesión, verificar email por ENLACE, cerrar sesión, borrar cuenta)
     que el flujo de login (Fase 2B) usará por debajo, SIN reescribir la UI.

   Aditiva y defensiva: si el SDK no cargó o no hay red, CFFirebase.available
   queda en false y NINGÚN método rompe la app — el login local sigue igual.

   La app corre offline desde file://; las operaciones de Auth (REST a
   identitytoolkit.googleapis.com) necesitan wifi. El SDK compat se autoaloja
   aquí (firebase-app-compat.js + firebase-auth-compat.js) para no depender de
   ninguna CDN en runtime. ================================================ */
(function () {
  'use strict';

  var firebaseConfig = {
    apiKey: "AIzaSyAq5zZg1RaDb0bJ22rN65Qvy8J5v-pYNBU",
    /* authDomain OMITIDO a propósito: en el WebView (file://) el SDK cargaría el
       iframe de <authDomain>/__/auth/... y el envoltorio nativo lo abría en Safari,
       sacando al usuario de la app. El registro/login por email van por REST
       (identitytoolkit) sin iframe, y el enlace de verificación usa el dominio del
       PROYECTO en el servidor, no esta clave. */
    projectId: "chronic-friends",
    storageBucket: "chronic-friends.firebasestorage.app",
    messagingSenderId: "587839205954",
    appId: "1:587839205954:web:e615738e6e2fe912f673db"
  };

  /* Resultado uniforme → objeto plano que la UI puede leer sin conocer el SDK. */
  function ok(extra) { return Object.assign({ ok: true }, extra || {}); }
  function fail(e) {
    return { ok: false, code: (e && e.code) || 'unknown', message: (e && e.message) || String(e), error: e };
  }

  /* Si el SDK no está (fallo de carga), dejamos un stub inerte: todo método
     resuelve a un fallo controlado y available=false. Nada explota. */
  if (typeof window.firebase === 'undefined' || !window.firebase.initializeApp) {
    window.CFFirebase = {
      available: false,
      ready: Promise.resolve(false),
      _reason: 'firebase-sdk-missing',
      register: function () { return Promise.resolve({ ok: false, code: 'sdk-missing' }); },
      signIn: function () { return Promise.resolve({ ok: false, code: 'sdk-missing' }); },
      sendVerification: function () { return Promise.resolve({ ok: false, code: 'sdk-missing' }); },
      isVerified: function () { return Promise.resolve(false); },
      reloadUser: function () { return Promise.resolve(null); },
      signOutFb: function () { return Promise.resolve({ ok: true }); },
      deleteAccount: function () { return Promise.resolve({ ok: false, code: 'sdk-missing' }); },
      reauthenticate: function () { return Promise.resolve({ ok: false, code: 'sdk-missing' }); },
      refreshToken: function () { return Promise.resolve({ ok: false, code: 'sdk-missing' }); },
      sendPasswordReset: function () { return Promise.resolve({ ok: false, code: 'sdk-missing' }); },
      currentUser: function () { return null; },
      onState: function () { return function () {}; }
    };
    try { console.warn('[CFFirebase] SDK de Firebase no encontrado — puente inerte (available=false)'); } catch (e) {}
    return;
  }

  var firebase = window.firebase;

  /* init idempotente */
  try {
    if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(firebaseConfig);
  } catch (e) {
    try { console.error('[CFFirebase] initializeApp falló:', e); } catch (_) {}
  }

  var auth = firebase.auth();

  /* ---- Idioma de los correos de Firebase (verificación y restablecer clave) ----
     Sin esto, Firebase usa el idioma por defecto del proyecto (inglés) y alguien
     que eligió español en la app recibía el correo en inglés. Basta con decirle
     el idioma: Google envía SU plantilla ya traducida, no hay que escribir ni
     mantener ninguna traducción.
     VERIFICADO end-to-end el 5 ago 2026 en los 16 idiomas de la app (16/16, con
     catalán y árabe incluidos), enviando de verdad y leyendo lo que llegó.
     Orden de preferencia: idioma vivo de la app → el guardado → el del móvil. */
  function applyLang() {
    var l = '';
    try { l = (window.I18n && window.I18n.lang) || ''; } catch (e) {}
    if (!l) { try { l = localStorage.getItem('cf_lang') || ''; } catch (e) {} }
    if (!l) { try { l = String(navigator.language || '').slice(0, 2); } catch (e) {} }
    try { if (l) auth.languageCode = l; } catch (e) {}
    return l || 'en';
  }

  /* Nuestro propio envío del correo de verificación (Cloud Function en la UE).
     Existe porque la plantilla de Firebase dejó de traducirse para siempre el
     5 ago 2026 y además enseñaba la dirección de verificación entera. Desde el
     servidor propio el correo sale en el idioma del usuario (16 + inglés de
     respaldo) y con un botón en vez del enlace kilométrico.
     Si esta llamada falla por lo que sea (sin red, función caída, despliegue a
     medias), NO se deja al usuario sin poder registrarse: se cae al correo de
     Firebase de toda la vida, que llega en inglés pero llega. */
  var CF_MAIL_URL = 'https://europe-west1-chronic-friends.cloudfunctions.net/enviarVerificacion';

  function correoPropio(u, lang) {
    if (typeof fetch !== 'function') return Promise.reject(new Error('sin-fetch'));
    return u.getIdToken().then(function (tok) {
      return fetch(CF_MAIL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok },
        body: JSON.stringify({ lang: lang })
      });
    }).then(function (r) {
      if (!r.ok) throw new Error('http-' + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || !j.ok) throw new Error((j && j.code) || 'respuesta-no-ok');
      return j;
    });
  }

  /* Persistencia LOCAL (sobrevive a recargas). En WKWebView desde file://
     IndexedDB puede no estar; si falla, caemos a sesión en memoria sin romper. */
  var ready = Promise.resolve()
    .then(function () { return auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); })
    .then(function () { return true; })
    .catch(function (e) {
      try { console.warn('[CFFirebase] persistencia LOCAL no disponible, sigo en memoria:', e && e.code); } catch (_) {}
      return true;
    });

  var API = {
    available: true,
    ready: ready,
    projectId: firebaseConfig.projectId,

    /* crea la cuenta (email + contraseña) */
    register: function (email, pw) {
      return auth.createUserWithEmailAndPassword(String(email || '').trim(), String(pw || ''))
        .then(function (cred) { return ok({ user: cred.user }); })
        .catch(fail);
    },

    /* manda el correo de verificación con el ENLACE al usuario actual */
    sendVerification: function () {
      var u = auth.currentUser;
      var lang = applyLang();   /* el correo sale en el idioma del usuario */
      if (!u) return Promise.resolve({ ok: false, code: 'no-current-user' });
      return correoPropio(u, lang)
        .then(function (j) { return ok({ via: 'propio', lang: j.lang || lang }); })
        .catch(function (e) {
          try { console.warn('[CFFirebase] correo propio no disponible, uso el de Firebase:', e && e.message); } catch (_) {}
          return u.sendEmailVerification().then(function () { return ok({ via: 'firebase' }); }).catch(fail);
        });
    },

    /* inicia sesión con email + contraseña */
    signIn: function (email, pw) {
      return auth.signInWithEmailAndPassword(String(email || '').trim(), String(pw || ''))
        .then(function (cred) { return ok({ user: cred.user, verified: !!(cred.user && cred.user.emailVerified) }); })
        .catch(fail);
    },

    /* recarga el usuario para leer su estado más reciente (tras pinchar el enlace) */
    reloadUser: function () {
      var u = auth.currentUser;
      if (!u) return Promise.resolve(null);
      return u.reload().then(function () { return auth.currentUser; }).catch(function () { return u; });
    },

    /* ¿el email del usuario actual ya está verificado? (recarga primero) */
    isVerified: function () {
      return this.reloadUser().then(function (u) { return !!(u && u.emailVerified); });
    },

    /* cierra la sesión de Firebase (no toca la sesión local cf_auth_v1) */
    signOutFb: function () {
      return auth.signOut().then(function () { return ok(); }).catch(fail);
    },

    /* borra de VERDAD la cuenta del backend — necesario para Apple (RoadMap D2.3) */
    deleteAccount: function () {
      var u = auth.currentUser;
      if (!u) return Promise.resolve({ ok: false, code: 'no-current-user' });
      return u.delete().then(function () { return ok(); }).catch(fail);
    },

    /* reautenticación reciente (email + contraseña). Firebase la exige antes de
       operaciones sensibles (borrar la cuenta) si la sesión NO es reciente
       (error auth/requires-recent-login). Sin esto, el borrado en la nube falla
       silenciosamente y el usuario seguiría existiendo → incumpliría Apple D2.3. */
    reauthenticate: function (password) {
      var u = auth.currentUser;
      if (!u || !u.email) return Promise.resolve({ ok: false, code: 'no-current-user' });
      try {
        var cred = window.firebase.auth.EmailAuthProvider.credential(u.email, String(password || ''));
        return u.reauthenticateWithCredential(cred).then(function () { return ok(); }).catch(fail);
      } catch (e) { return Promise.resolve(fail(e)); }
    },

    /* fuerza refrescar el ID token para que sus claims (p.ej. email_verified)
       estén al día. Firestore evalúa las reglas con este token: tras verificar
       el correo de una cuenta recién creada, el token viejo aún lleva
       email_verified=false y las escrituras se rechazarían sin este refresco. */
    refreshToken: function () {
      var u = auth.currentUser;
      if (!u) return Promise.resolve({ ok: false, code: 'no-current-user' });
      return u.getIdToken(true).then(function () { return ok(); }).catch(fail);
    },

    /* email de restablecimiento de contraseña (para el 'Forgot password?' real) */
    sendPasswordReset: function (email) {
      applyLang();   /* mismo criterio que la verificación: correo en su idioma */
      return auth.sendPasswordResetEmail(String(email || '').trim()).then(function () { return ok(); }).catch(fail);
    },

    currentUser: function () { return auth.currentUser || null; },

    onState: function (cb) { return auth.onAuthStateChanged(cb); }
  };

  window.CFFirebase = API;
  try { console.log('[CFFirebase] listo · proyecto', firebaseConfig.projectId, '· available=true'); } catch (e) {}
})();
