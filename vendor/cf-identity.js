/* ===== Chronic Friends · CHAT1 — Puente de identidad ========================
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude Design.

   EL PROBLEMA QUE RESUELVE
   ------------------------
   En la app conviven DOS identificadores de la misma persona:

     • uid LOCAL   →  CFNS.uid()  =  'pat:<email>'   (o 'doc:<email>')
       Lo usan los posts locales, los chats (cf_chats_v1) y el espejo de
       mini-perfiles. LLEVA EL CORREO DENTRO: no puede salir del dispositivo.

     • uid de NUBE →  firebase.auth().currentUser.uid
       Es anónimo, estable y el MISMO en todos los móviles de esa cuenta.
       Es el `authorUid` de community_posts y la carpeta users/{uid}/.

   Para que dos personas puedan pedirse amistad y escribirse (CHAT3-CHAT5) hace
   falta un identificador público del interlocutor: ese es el uid de NUBE. Este
   módulo es el puente entre los dos mundos y el guardián de que el correo no
   cruce nunca al lado público.

   QUÉ HACE
   --------
   1) CORTAFUEGOS DE PRIVACIDAD (lo más importante). Envuelve CFStore.set para
      sanear TODA escritura en users/{uid}/public/**: si el campo `avatar` lleva
      un uid local dentro (p. ej. 'cfavatar:pat:alguien@dominio.com'), se
      sustituye antes de salir del móvil. Se hace en la capa de escritura y no
      en quien la llama, para que también proteja al código de build/ que Claude
      Design regenera — y a cualquier módulo futuro.

   2) AVATAR PÚBLICO DE VERDAD. La foto de perfil es un dataURL guardado en el
      propio móvil, así que hoy NADIE ve la foto de nadie. Aquí se sube a
      Storage (users/{uid}/public/avatar.jpg — zona que las reglas ya tenían
      prevista y que nadie usaba) y se publica su URL https en el mini-perfil.

   3) LECTOR DE PERFILES AJENOS. Lee users/{uid}/public/profile de otra persona
      y lo deja en el MISMO espejo local que ya consulta la app
      (cf_public_profiles_v1), de modo que cfPublicNameFor()/cfPublicAvatarInfo()
      —que viven en build/publicprofile.js— empiezan a resolver también uids de
      nube sin tocar una línea de build/.

   API (window.CFIdentity)
     .available            → true si hay puente utilizable
     .uid()                → uid de NUBE (el identificador PÚBLICO) o null
     .localUid()           → uid LOCAL 'pat:<email>' (NUNCA publicar)
     .isMe(id)             → true si `id` es cualquiera de mis dos uids
     .profile(uid)         → Promise<{name,avatar,lang}|null> (lee y cachea)
     .prefetch([uids])     → Promise: precarga varios de golpe, sin repetir
     .publishAvatar()      → Promise: sube mi foto y publica su URL
     .safeAvatar(v, uid)   → referencia de avatar saneada (uso interno/tests)
   ===================================================================== */
(function () {
  'use strict';

  var MIRROR_KEY = 'cf_public_profiles_v1';  /* el espejo que ya lee la app */
  var PUSHED_KEY = 'cf_pub_avatar_v1';       /* qué foto subí ya (evita re-subir) */
  var TTL_MS = 10 * 60 * 1000;               /* relectura de un perfil ajeno */

  var memo = {};        /* uid → {ts, doc}  caché de sesión */
  var inflight = {};    /* uid → Promise    dedupe de lecturas simultáneas */

  /* ---- accesos defensivos a lo que ya existe --------------------------- */
  function CF()    { try { return window.CFFirebase || null; } catch (e) { return null; } }
  function ST()    { try { return window.CFStore || null; }    catch (e) { return null; } }
  function cloud() { try { var u = CF() && CF().currentUser(); return (u && u.uid) || null; } catch (e) { return null; } }
  function local() { try { return (window.CFNS && window.CFNS.uid && window.CFNS.uid()) || null; } catch (e) { return null; } }
  function verified() { try { var u = CF() && CF().currentUser(); return !!(u && u.emailVerified); } catch (e) { return false; } }
  function usable() { var s = ST(); return !!(s && s.available && cloud() && verified()); }

  function load(key) {
    try { var r = JSON.parse(localStorage.getItem(key)); if (r && typeof r === 'object' && !Array.isArray(r)) return r; } catch (e) {}
    return {};
  }
  function save(key, obj) { try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {} }

  /* ---- 1) CORTAFUEGOS: nada con el correo dentro sale al lado público --- */

  /* ¿este texto lleva una identidad local (y por tanto un correo) dentro? */
  function leaksIdentity(v) {
    if (typeof v !== 'string' || !v) return false;
    return v.indexOf('@') >= 0 || /(^|:)(pat|doc):/.test(v);
  }

  /* Devuelve una referencia de avatar que se puede publicar sin miedo.
     - URL https  → se deja tal cual (es lo que queremos: la foto real)
     - color:#hex / default → se dejan (no identifican a nadie)
     - cfavatar:<loQueSea> → se reescribe con el uid de NUBE
     - cualquier otra cosa con un correo dentro → 'default' */
  function safeAvatar(v, uidForRef) {
    if (typeof v !== 'string' || !v) return v;
    if (/^https?:/i.test(v)) return v;
    if (v === 'default' || v.indexOf('color:') === 0) return v;
    if (!leaksIdentity(v)) return v;
    if (v.indexOf('cfavatar:') === 0 && uidForRef) return ('cfavatar:' + uidForRef).slice(0, 512);
    return 'default';
  }

  /* Sanea el documento entero del mini-perfil. `pathUid` es el uid de la RUTA
     (users/<pathUid>/public/…), que por definición es público. */
  function safeProfileDoc(doc, pathUid) {
    if (!doc || typeof doc !== 'object') return doc;
    var out = null;
    ['avatar', 'name', 'lang'].forEach(function (k) {
      var v = doc[k];
      if (typeof v !== 'string') return;
      var fixed = (k === 'avatar') ? safeAvatar(v, pathUid) : (leaksIdentity(v) ? '' : v);
      if (fixed === v) return;
      if (!out) out = Object.assign({}, doc);
      if (fixed) out[k] = fixed; else delete out[k];
    });
    return out || doc;
  }

  /* Envoltura idempotente de CFStore.set: intercepta SOLO la zona pública
     (users/<uid>/public/...).
     Se marca con un flag en la propia función para no envolverla dos veces si
     el script se reinyectase. */
  function wrapStore() {
    var s = ST();
    if (!s || typeof s.set !== 'function' || s.set.__cfIdentityWrapped) return false;
    var orig = s.set;
    var wrapped = function (path, data, opts) {
      try {
        var m = /^users\/([^/]+)\/public\//.exec(String(path || ''));
        if (m) data = safeProfileDoc(data, m[1]);
      } catch (e) {}
      return orig.call(s, path, data, opts);
    };
    wrapped.__cfIdentityWrapped = true;
    s.set = wrapped;
    return true;
  }

  /* ---- 2) AVATAR PÚBLICO: la foto sube a Storage y se publica su URL ---- */

  function myPhoto() {
    try { var p = (window.CFProfile && window.CFProfile.get && window.CFProfile.get()) || {}; return p.avatarPhoto || null; } catch (e) { return null; }
  }

  /* huella corta y barata del dataURL, para saber si la foto cambió */
  function stamp(s) {
    var h = 5381, i = 0, n = s.length;
    for (; i < n; i++) { h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; }
    return String(n) + '.' + h.toString(36);
  }

  function publishAvatar() {
    if (!usable()) return Promise.resolve({ ok: false, code: 'no-session' });
    var uid = cloud(), photo = myPhoto();
    if (!photo || photo.indexOf('data:') !== 0) return Promise.resolve({ ok: false, code: 'no-photo' });
    var pushed = load(PUSHED_KEY), tag = stamp(photo);
    if (pushed[uid] && pushed[uid].tag === tag && pushed[uid].url) {
      return Promise.resolve({ ok: true, url: pushed[uid].url, cached: true });
    }
    var P = window.CFPhotos;
    if (!P || !P.available || typeof P.putPublic !== 'function') return Promise.resolve({ ok: false, code: 'no-storage' });
    return P.putPublic('avatar.jpg', photo).then(function (r) {
      if (!r || !r.ok || !r.url) return r || { ok: false, code: 'upload-failed' };
      pushed[uid] = { tag: tag, url: r.url };
      save(PUSHED_KEY, pushed);
      /* publicar la URL en el mini-perfil (merge: no pisa name/lang) */
      var s = ST();
      if (s) s.set('users/' + uid + '/public/profile', { avatar: String(r.url).slice(0, 512), updatedAt: Date.now() });
      /* y dejarla también en el espejo local, para verla al instante */
      try {
        var mirror = load(MIRROR_KEY), lu = local();
        [uid, lu].forEach(function (k) { if (k && mirror[k]) mirror[k].avatar = String(r.url).slice(0, 512); });
        save(MIRROR_KEY, mirror);
      } catch (e) {}
      return r;
    });
  }

  /* ---- 3) LECTOR de perfiles ajenos ------------------------------------ */

  /* deja el doc en el espejo que ya consulta build/publicprofile.js, indexado
     por el uid de NUBE: a partir de ahí cfPublicNameFor(uidNube) funciona. */
  function cache(uid, doc) {
    memo[uid] = { ts: Date.now(), doc: doc || null };
    if (!doc) return;
    try {
      var mirror = load(MIRROR_KEY);
      var prev = mirror[uid];
      if (prev && prev.name === doc.name && prev.avatar === doc.avatar && prev.lang === doc.lang) return;
      mirror[uid] = doc;
      save(MIRROR_KEY, mirror);
      try { window.dispatchEvent(new Event('cf-public-profile')); } catch (e) {}
    } catch (e) {}
  }

  function profile(uid) {
    if (!uid || typeof uid !== 'string') return Promise.resolve(null);
    if (leaksIdentity(uid)) {          /* es un uid LOCAL: se resuelve en local */
      try { return Promise.resolve((window.cfPublicProfileFor && window.cfPublicProfileFor(uid)) || null); } catch (e) { return Promise.resolve(null); }
    }
    var hit = memo[uid];
    if (hit && (Date.now() - hit.ts) < TTL_MS) return Promise.resolve(hit.doc);
    if (inflight[uid]) return inflight[uid];
    if (!usable()) return Promise.resolve(hit ? hit.doc : null);
    var p = ST().get('users/' + uid + '/public/profile').then(function (d) {
      var doc = null;
      try { doc = (window.cfPubSanitize && window.cfPubSanitize(d)) || null; } catch (e) { doc = d || null; }
      cache(uid, doc);
      delete inflight[uid];
      return doc;
    }).catch(function () { delete inflight[uid]; return null; });
    inflight[uid] = p;
    return p;
  }

  function prefetch(uids) {
    if (!uids || !uids.length) return Promise.resolve([]);
    var seen = {}, list = [];
    uids.forEach(function (u) { if (u && !seen[u]) { seen[u] = 1; list.push(u); } });
    return Promise.all(list.map(profile));
  }

  /* ---- arranque -------------------------------------------------------- */

  function boot() {
    wrapStore();
    if (!usable()) return;
    /* re-publicar mi mini-perfil ya saneado: si antes salió con el correo
       dentro, esta escritura lo corrige en la nube. */
    try { if (window.cfPublicProfileSync) window.cfPublicProfileSync(); } catch (e) {}
    publishAvatar();
  }

  var API = {
    get available() { return usable(); },
    uid: cloud,
    localUid: local,
    isMe: function (id) { return !!id && (id === cloud() || id === local()); },
    profile: profile,
    prefetch: prefetch,
    publishAvatar: publishAvatar,
    safeAvatar: safeAvatar,
    safeProfileDoc: safeProfileDoc,
    leaksIdentity: leaksIdentity
  };

  try { window.CFIdentity = API; } catch (e) {}

  /* el cortafuegos se pone YA (aunque no haya sesión todavía) y el resto en
     cuanto Firebase despierte; CFAuth avisa con este evento en la app. */
  wrapStore();
  try { window.addEventListener('cf-auth-changed', boot); } catch (e) {}
  try { if (window.CFProfile && window.CFProfile.subscribe) window.CFProfile.subscribe(function () { if (usable()) publishAvatar(); }); } catch (e) {}
  if (document.readyState === 'loading') {
    try { document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 1200); }); } catch (e) {}
  } else { setTimeout(boot, 1200); }
})();
