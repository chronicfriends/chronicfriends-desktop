/* ===== Firebase · CHAT5 — MENSAJES 1-a-1 EN LA NUBE =====================
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design, igual que cf-identity.js y firebase-friends.js.

   QUÉ RESUELVE: hasta hoy los chats vivían SOLO en el móvil
   (chat.js → localStorage 'cf_chats_v1'). Dos personas con la app en dos
   teléfonos distintos no se veían: el «envío» era un truco que escribía en
   el buzón del destinatario DEL MISMO dispositivo (cfDeliverMessage).
   Aquí los mensajes viajan de verdad por Firestore.

   CÓMO ENCAJA CON LO QUE YA HAY (esto es lo importante):
     • La UI NO se toca. Este motor lee y escribe el MISMO espejo local
       'cf_chats_v1' que ya pinta la pantalla de chat, así que la
       conversación aparece sola aunque Claude Design no cambie una línea.
     • La identidad pública es el uid de NUBE (CFIdentity/CHAT1). El uid
       local 'pat:<email>' NUNCA sale del teléfono.
     • Solo se sincronizan conversaciones con AMIGOS aceptados (CHAT3):
       las reglas (CHAT4) rechazan escribir sin amistad viva.

   EN LA NUBE (contrato exacto de firestore.rules, bloque CHAT4):
     chats/{uidA__uidB}                    { members:[a,b] ORDENADOS, createdAt, lastAt }
     chats/{uidA__uidB}/messages/{sender__ts}  { senderUid, text, createdAt }
   El id del mensaje es determinista (remitente + milisegundo), así que un
   reintento reescribe el mismo documento en vez de duplicar el mensaje.

   ESPEJO LOCAL (formato que ya usa la UI, sin cambios):
     cf_chats_v1 → { <uidAmigo>: { seed, uid, name, unread, lastTs,
                                   messages:[{ from:'me'|'them', text, ts, cid }] } }
   El campo `cid` es la marca de «este mensaje ya está en la nube»: los
   mensajes propios que no lo tienen son los que el vigilante envía.

   API — window.CFChatCloud
     .available          → ¿hay sesión verificada y Firestore vivo?
     .send(uid, text)    → Promise<{ok}>  (envía y deja el espejo al día)
     .subscribe(fn)      → unsubscribe; se dispara con cada mensaje nuevo
     .pairId(a,b)        → id del chat, el MISMO que el de la amistad
     ._start() ._stop()  → arranque/parada manual (para los arneses)
   ===================================================================== */
(function () {
  'use strict';

  var CHATS_COL = 'chats';
  var MSGS      = 'messages';
  var CHAT_KEY  = 'cf_chats_v1';
  /* tope por conversación: acota el coste de lecturas (Blaze) igual que el
     feed y la lista de amigos. 200 mensajes es más de lo que cabe en pantalla. */
  var LIMIT     = 200;
  /* cada cuánto se mira si la UI ha dejado un mensaje nuevo por enviar */
  var WATCH_MS  = 1500;
  /* freno anti-ráfaga: nunca más de N envíos en un mismo barrido */
  var MAX_BURST = 20;
  /* CHAT8 · una conversación no se guarda para siempre: cada mensaje nace con
     fecha de caducidad y la política TTL de Firestore lo borra sola al cumplirse.
     Es un campo TIMESTAMP (no un número): el TTL no mira otra cosa. */
  var TTL_DAYS  = 365;

  function CF() { try { return window.CFFirebase || null; } catch (e) { return null; } }
  function ST() { try { return window.CFStore || null; }    catch (e) { return null; } }
  function ID() { try { return window.CFIdentity || null; } catch (e) { return null; } }
  function FR() { try { return window.CFFriends || null; }  catch (e) { return null; } }

  function uid() { try { var u = CF() && CF().currentUser(); return (u && u.uid) || null; } catch (e) { return null; } }
  function verified() { try { var u = CF() && CF().currentUser(); return !!(u && u.emailVerified); } catch (e) { return false; } }
  function active() { return !!(ST() && ST().available && CF() && CF().available && uid() && verified()); }
  function now() {
    try { return (window.CFClock && window.CFClock.now && window.CFClock.now()) || Date.now(); } catch (e) { return Date.now(); }
  }

  /* un uid de NUBE es el de Firebase Auth: 20-128 alfanuméricos y nada más.
     Los ids locales ('pat:…', 'cf-…') no pasan por aquí NUNCA — es lo que
     impide que un correo acabe dentro del id de un documento público. */
  function isCloudUid(s) { return typeof s === 'string' && /^[A-Za-z0-9]{20,128}$/.test(s); }

  /* Timestamp de Firestore para el TTL. Si el SDK no lo expone (o cambia), se
     devuelve null y el mensaje sale SIN expireAt: se guarda igual, simplemente
     no caduca solo. Nunca se manda un número aquí — las reglas lo rechazan. */
  function ttlStamp(ms) {
    try {
      var T = window.firebase && window.firebase.firestore && window.firebase.firestore.Timestamp;
      return (T && T.fromMillis) ? T.fromMillis(ms) : null;
    } catch (e) { return null; }
  }

  function pairId(a, b) { var m = [String(a), String(b)].sort(); return m[0] + '__' + m[1]; }
  function members(a, b) { return [String(a), String(b)].sort(); }
  function msgId(from, ts) { return String(from) + '__' + String(ts); }

  /* ---- espejo local ----------------------------------------------------- */
  function loadChats() {
    try { var r = JSON.parse(localStorage.getItem(CHAT_KEY)); if (r && typeof r === 'object') return r; } catch (e) {}
    return {};
  }
  function saveChats(o) { try { localStorage.setItem(CHAT_KEY, JSON.stringify(o)); } catch (e) {} }

  var subs = [];
  function subscribe(fn) {
    if (typeof fn !== 'function') return function () {};
    subs.push(fn);
    return function () { var i = subs.indexOf(fn); if (i >= 0) subs.splice(i, 1); };
  }
  function emit() { subs.slice().forEach(function (fn) { try { fn(); } catch (e) {} }); }

  /* nombre y avatar del amigo, tal y como los resuelve CHAT3 */
  function peerMeta(peer) {
    var out = { name: '', avatar: '' };
    try {
      var l = (FR() && FR().list && FR().list()) || [];
      for (var i = 0; i < l.length; i++) if (l[i] && l[i].uid === peer) { out.name = l[i].name || ''; out.avatar = l[i].avatar || ''; break; }
    } catch (e) {}
    if (!out.name) { try { if (window.cfPublicNameFor) out.name = window.cfPublicNameFor(peer) || ''; } catch (e) {} }
    if (!out.name) out.name = 'Friend';
    return out;
  }

  function conversation(store, peer) {
    var c = store[peer];
    if (!c) {
      var meta = peerMeta(peer);
      c = store[peer] = { seed: peer, uid: peer, name: meta.name, avatar: meta.avatar, doctor: false, unread: 0, messages: [], lastTs: 0 };
    }
    if (!c.messages || !c.messages.length) c.messages = c.messages || [];
    c.seed = peer; c.uid = peer;                    /* identidad siempre fresca */
    if (!c.name || c.name === 'Friend') { var m2 = peerMeta(peer); if (m2.name) c.name = m2.name; }
    return c;
  }

  /* ¿ese mensaje ya está en el espejo? Se compara por el id de nube (cid) y,
     como red, por (remitente + milisegundo), que es de donde sale el cid. */
  function findMsg(conv, cid, from, ts) {
    var list = conv.messages || [];
    for (var i = list.length - 1; i >= 0; i--) {
      var m = list[i];
      if (!m) continue;
      if (cid && m.cid === cid) return i;
      if (!cid && m.from === from && m.ts === ts) return i;
    }
    return -1;
  }

  /* ---- enviar ----------------------------------------------------------- */
  function nope(code) { return Promise.resolve({ ok: false, code: code || 'unavailable' }); }

  /* la ficha del chat: las reglas la exigen con members+createdAt SIEMPRE
     (también al mover lastAt), porque evalúan el documento resultante. */
  function touchChatDoc(peer, ts) {
    var me = uid();
    var doc = { members: members(me, peer), createdAt: ts, lastAt: ts };
    return ST().colSet(CHATS_COL, pairId(me, peer), doc);
  }

  function sendCloud(peer, text, ts) {
    var me = uid();
    var path = CHATS_COL + '/' + pairId(me, peer) + '/' + MSGS;
    var doc = { senderUid: me, text: String(text), createdAt: ts };
    var exp = ttlStamp(ts + TTL_DAYS * 86400000);
    if (exp) doc.expireAt = exp;                       /* CHAT8: caduca a los 12 meses */
    return ST().colSet(path, msgId(me, ts), doc, { overwrite: true }).then(function (r) {
      if (r && r.ok) { try { touchChatDoc(peer, ts); } catch (e) {} }
      return r;
    });
  }

  /* Envío desde código (lo que llamará la UI cuando Claude Design la conecte).
     Deja el mensaje en el espejo local ANTES de que la nube conteste, para que
     la conversación se pinte al instante. */
  function send(peer, text) {
    if (!active()) return nope('unavailable');
    if (!isCloudUid(peer)) return nope('not-cloud-uid');
    if (!text || !String(text).trim()) return nope('empty');
    if (String(text).length > 2000) return nope('too-long');
    if (FR() && FR().isFriend && !FR().isFriend(peer)) return nope('not-friend');

    var ts = now();
    var store = loadChats();
    var conv = conversation(store, peer);
    conv.messages.push({ from: 'me', text: String(text), ts: ts });
    conv.lastTs = ts;
    saveChats(store); emit();

    return sendCloud(peer, String(text), ts).then(function (r) {
      if (r && r.ok) {
        var s2 = loadChats(), c2 = conversation(s2, peer);
        var i = findMsg(c2, null, 'me', ts);
        if (i >= 0) { c2.messages[i].cid = msgId(uid(), ts); saveChats(s2); }
      }
      return r;
    });
  }

  /* ---- vigilante: mensajes que la UI escribe directamente en el espejo ----
     La pantalla de chat de hoy no llama a send(): mete el mensaje en
     localStorage ella sola. Este barrido detecta los mensajes PROPIOS que aún
     no están en la nube (sin `cid`) y los envía. Cuando la UI pase a llamar a
     send(), esto no encontrará nada que hacer y se queda a coste cero. */
  var timer = null;
  function scanOutbox() {
    if (!active()) return;
    var store = loadChats(), sent = 0, dirty = false;
    Object.keys(store).forEach(function (peer) {
      if (sent >= MAX_BURST) return;
      if (!isCloudUid(peer)) return;                       /* demo o cuenta local: nunca sale */
      if (FR() && FR().isFriend && !FR().isFriend(peer)) return;
      var conv = store[peer]; if (!conv || !conv.messages) return;
      conv.messages.forEach(function (m) {
        if (sent >= MAX_BURST) return;
        if (!m || m.from !== 'me' || m.cid || m._failed) return;
        if (!m.text || String(m.text).length > 2000) { m._failed = 1; dirty = true; return; }
        var ts = m.ts || now();
        m.cid = msgId(uid(), ts);                          /* marca ANTES: no se envía dos veces */
        dirty = true; sent++;
        sendCloud(peer, m.text, ts).then(function (r) {
          if (r && r.ok) return;
          var s2 = loadChats(), c2 = s2[peer];              /* falló: se quita la marca para reintentar */
          if (!c2 || !c2.messages) return;
          for (var i = 0; i < c2.messages.length; i++) {
            if (c2.messages[i] && c2.messages[i].ts === ts && c2.messages[i].from === 'me') { delete c2.messages[i].cid; break; }
          }
          saveChats(s2);
        });
      });
    });
    if (dirty) saveChats(store);
  }

  /* ---- escucha de la nube ----------------------------------------------- */
  var unsubs = {};      /* peer → unsubscribe */

  function mergeDocs(peer, docs) {
    var me = uid(), store = loadChats(), conv = conversation(store, peer), changed = false;
    docs.forEach(function (d) {
      if (!d || !d.text) return;
      var cid = d._id || msgId(d.senderUid, d.createdAt);
      var mine = d.senderUid === me;
      var ts = d.createdAt || now();
      var i = findMsg(conv, cid, mine ? 'me' : 'them', ts);
      if (i >= 0) { if (!conv.messages[i].cid) { conv.messages[i].cid = cid; changed = true; } return; }
      conv.messages.push({ from: mine ? 'me' : 'them', text: String(d.text), ts: ts, cid: cid });
      if (!mine) conv.unread = (conv.unread || 0) + 1;
      if (ts > (conv.lastTs || 0)) conv.lastTs = ts;
      changed = true;
    });
    if (!changed) return;
    conv.messages.sort(function (a, b) { return (a.ts || 0) - (b.ts || 0); });
    if (conv.messages.length > LIMIT) conv.messages = conv.messages.slice(-LIMIT);
    saveChats(store); emit();
  }

  function listenTo(peer) {
    if (unsubs[peer] || !isCloudUid(peer)) return;
    var path = CHATS_COL + '/' + pairId(uid(), peer) + '/' + MSGS;
    unsubs[peer] = ST().onCol(path, function (docs) { mergeDocs(peer, docs); },
      function (col) { return col.orderBy('createdAt', 'desc').limit(LIMIT); });
  }

  function stop() {
    Object.keys(unsubs).forEach(function (k) { try { unsubs[k](); } catch (e) {} delete unsubs[k]; });
    if (timer) { try { clearInterval(timer); } catch (e) {} timer = null; }
  }

  /* se escucha SOLO a los amigos: sin amistad, las reglas no dejan escribir,
     así que abrir un listener ahí sería gastar lecturas para nada. */
  function sync() {
    if (!active()) return;
    var friends = {};
    try { ((FR() && FR().list && FR().list()) || []).forEach(function (f) { if (f && isCloudUid(f.uid)) friends[f.uid] = 1; }); } catch (e) {}
    Object.keys(unsubs).forEach(function (peer) {
      if (friends[peer]) return;                      /* dejó de ser amigo: se corta la escucha */
      try { unsubs[peer](); } catch (e) {}
      delete unsubs[peer];
    });
    Object.keys(friends).forEach(listenTo);
  }

  var unsubFriends = null;
  function start() {
    stop();
    if (!active()) return;
    sync();
    /* CHAT7 RETIRADO (23 ago 2026, decisión de Gerhard): la app no avisa de
       mensajes nuevos, así que NO se pide ni se guarda el identificador de aviso
       del teléfono. Dato que no hace falta, dato que no se recoge. El puente
       (askNativeForToken/savePushToken/_recv) se conserva más abajo, sin usar,
       por si algún día se retoma — ver Historial CF [1895] antes de revivirlo. */
    try {
      if (unsubFriends) { unsubFriends(); unsubFriends = null; }
      if (FR() && FR().subscribe) unsubFriends = FR().subscribe(sync);   /* nuevo amigo → nueva escucha */
    } catch (e) {}
    timer = setInterval(scanOutbox, WATCH_MS);
  }

  /* ---- CHAT7 · aviso de mensaje nuevo ------------------------------------
     El identificador que permite avisar a este teléfono lo da el SISTEMA, no la
     web: se lo pedimos al nativo (push:ready) y él lo devuelve por _recv. Aquí
     solo se guarda, en users/{uid}/private/push — nunca en el perfil público:
     un token identifica un dispositivo concreto. Quien lo usa para mandar el
     aviso es la Cloud Function avisarMensajeNuevo, con permisos de servidor. */
  var MAX_TOKENS = 5;

  function savePushToken(token, platform) {
    if (!active() || !token) return nope('unavailable');
    var path = 'users/' + uid() + '/private/push';
    return ST().get(path).then(function (prev) {
      var list = (prev && Array.isArray(prev.tokens)) ? prev.tokens.slice() : [];
      if (list.indexOf(token) >= 0 && list.length <= MAX_TOKENS) return { ok: true, code: 'ya-estaba' };
      list = list.filter(function (t) { return t && t !== token; });
      list.push(token);
      if (list.length > MAX_TOKENS) list = list.slice(-MAX_TOKENS);   /* se queda con los últimos */
      var doc = { tokens: list, updatedAt: now() };
      if (platform) doc.platform = String(platform).slice(0, 16);
      return ST().set(path, doc);
    });
  }

  /* lo que el nativo inyecta: window.CFChatCloud._recv({t:'push:token', …}) */
  function _recv(payload) {
    try {
      if (!payload || payload.t !== 'push:token') return;
      savePushToken(payload.token, payload.platform);
    } catch (e) {}
  }

  /* se le pide el token al nativo. Si la app corre en un navegador (web de
     escritorio) no hay puente y esto no hace nada — sin errores. */
  function askNativeForToken() {
    try {
      if (!window.ReactNativeWebView || !window.ReactNativeWebView.postMessage) return;
      window.ReactNativeWebView.postMessage(JSON.stringify({ t: 'push:ready' }));
    } catch (e) {}
  }

  var API = {
    get available() { return active(); },
    send: send,
    savePushToken: savePushToken,
    _recv: _recv,
    subscribe: subscribe,
    pairId: pairId,
    msgId: msgId,
    isCloudUid: isCloudUid,
    _scan: scanOutbox,
    _merge: mergeDocs,
    _sync: sync,
    _start: start,
    _stop: stop
  };

  try { window.CFChatCloud = API; } catch (e) {}

  /* arranca cuando Firebase despierta (mismo evento que cf-identity.js) */
  try { window.addEventListener('cf-auth-changed', function () { setTimeout(start, 400); }); } catch (e) {}
  if (document.readyState === 'loading') {
    try { document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 1800); }); } catch (e) {}
  } else { setTimeout(start, 1800); }

  try { console.log('[CFChatCloud] listo · mensajes CHAT5'); } catch (e) {}
})();
