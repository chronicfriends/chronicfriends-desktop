/* ===== Firebase · CHAT3 — AMISTAD (solicitudes + amigos) ================
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design, igual que firebase-community.js y cf-identity.js.

   QUÉ RESUELVE: hoy cualquiera podría abrir un chat con cualquiera. A partir
   de aquí hace falta PERMISO PREVIO — pedir amistad, y que la otra persona
   acepte. Decisiones de Gerhard (19 ago 2026):
     • RECHAZO SILENCIOSO: a quien rechaza no se le avisa a nadie, y el
       rechazado NO puede volver a pedirlo (lo impiden las reglas: el doc
       'rejected' se queda y bloquea el create).
     • Solo paciente↔paciente. Los médicos participan por posts/comentarios.
     • Sin buscador de usuarios: se pide amistad desde un post de la Comunidad.

   EN LA NUBE (contrato exacto de firestore.rules, bloque CHAT3):
     friend_requests/{fromUid__toUid}  { from, to, status:'pending'|'rejected', createdAt }
     friendships/{uidA__uidB}          { members:[a,b] ORDENADOS, since }

   ESPEJO LOCAL (para pintar al instante, sin esperar a la nube):
     cf_friends_v1       { uid: {since} }
     cf_friend_reqs_v1   { in: {uid:{ts}}, out: {uid:{ts,status}} }

   API — window.CFFriends (lo que consume la UI de Claude Design):
     status(uid)   → 'none' | 'sent' | 'received' | 'friends'   (nunca 'rejected': es silencioso)
     canFriend(uid)→ ¿procede ofrecer el botón? (no a médicos, no a mí mismo, no a bloqueados)
     request(uid) · accept(uid) · reject(uid) · cancel(uid) · unfriend(uid) → Promise<{ok}>
     incoming()    → [{uid, name, avatar, ts}]   solicitudes recibidas (para la lista y el badge)
     list()        → [{uid, name, avatar, since}] amigos aceptados
     isFriend(uid) → bool          count() → nº de solicitudes recibidas
     subscribe(fn) → unsubscribe   (se dispara con cada cambio, nube o local)
   ===================================================================== */
(function () {
  'use strict';

  var REQ_COL      = 'friend_requests';
  var PAIR_COL     = 'friendships';
  var FRIENDS_KEY  = 'cf_friends_v1';
  var REQS_KEY     = 'cf_friend_reqs_v1';
  /* tope de seguridad: nadie legítimo tiene miles de amigos ni de peticiones,
     y acota el coste de lecturas por sesión (Blaze) igual que hace el feed. */
  var LIMIT = 300;

  function CF() { try { return window.CFFirebase || null; } catch (e) { return null; } }
  function ST() { try { return window.CFStore || null; }    catch (e) { return null; } }
  function ID() { try { return window.CFIdentity || null; } catch (e) { return null; } }
  function uid() { try { var u = CF() && CF().currentUser(); return (u && u.uid) || null; } catch (e) { return null; } }
  function verified() { try { var u = CF() && CF().currentUser(); return !!(u && u.emailVerified); } catch (e) { return false; } }
  function active() { return !!(ST() && ST().available && CF() && CF().available && uid() && verified()); }
  function now() { try { return (window.CFClock && window.CFClock.now && window.CFClock.now()) || Date.now(); } catch (e) { return Date.now(); } }

  /* ---- espejo local ---------------------------------------------------- */
  function load(key, dflt) {
    try { var r = JSON.parse(localStorage.getItem(key)); return (r && typeof r === 'object') ? r : dflt; }
    catch (e) { return dflt; }
  }
  function save(key, obj) { try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {} }
  function friendsMap() { return load(FRIENDS_KEY, {}); }
  function reqsMap() {
    var r = load(REQS_KEY, null);
    if (!r || typeof r !== 'object') r = {};
    if (!r['in']  || typeof r['in']  !== 'object') r['in']  = {};
    if (!r.out    || typeof r.out    !== 'object') r.out    = {};
    return r;
  }

  /* ---- suscriptores ---------------------------------------------------- */
  var subs = [];
  function emit() { subs.slice().forEach(function (fn) { try { fn(); } catch (e) {} }); }
  function subscribe(fn) {
    if (typeof fn !== 'function') return function () {};
    subs.push(fn);
    return function () { subs = subs.filter(function (f) { return f !== fn; }); };
  }

  /* ---- ids deterministas (los mismos que exigen las reglas) ------------ */
  function reqId(from, to) { return String(from) + '__' + String(to); }
  function pairId(a, b) { var m = [String(a), String(b)].sort(); return m[0] + '__' + m[1]; }
  function members(a, b) { return [String(a), String(b)].sort(); }

  /* ---- quién puede ser amigo ------------------------------------------ */
  function isDoctorUid(u) {
    try { return !!(window.cfIsDoctorUid && window.cfIsDoctorUid(u)); } catch (e) { return false; }
  }
  function iAmDoctor() {
    try { return !!(window.cfRole && window.cfRole() === 'Doctor'); } catch (e) { return false; }
  }
  function isBlocked(u) {
    try { return !!(window.CFBlocks && window.CFBlocks.isBlocked(u)); } catch (e) { return false; }
  }
  function canFriend(other) {
    if (!other || typeof other !== 'string') return false;
    if (!active()) return false;
    if (other === uid()) return false;              /* yo mismo, no */
    if (iAmDoctor() || isDoctorUid(other)) return false;  /* solo paciente↔paciente */
    if (isBlocked(other)) return false;
    return true;
  }

  /* ---- estado de cara a la UI (4 estados, rechazo SILENCIOSO) ---------- */
  function status(other) {
    if (!other) return 'none';
    if (friendsMap()[other]) return 'friends';
    var r = reqsMap();
    if (r['in'][other]) return 'received';
    /* si me rechazaron, el remitente sigue viendo «enviada»: nunca se le
       cuenta el rechazo (decisión de Gerhard) y las reglas ya le impiden
       repetir la petición. */
    if (r.out[other]) return 'sent';
    return 'none';
  }
  function isFriend(other) { return !!friendsMap()[other]; }
  function count() { return Object.keys(reqsMap()['in']).length; }

  /* nombre y foto salen SOLO del mini-perfil público de la otra persona
     (users/{uid}/public/profile), nunca de nada local suyo. */
  function decorate(u, extra) {
    var name = '';
    var avatar = null;
    try { name = (window.cfPublicNameFor && window.cfPublicNameFor(u, '')) || ''; } catch (e) {}
    try { var a = window.cfPublicAvatarInfo && window.cfPublicAvatarInfo(u); avatar = (a && a.photo) || null; } catch (e) {}
    var o = { uid: u, name: name, avatar: avatar };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) o[k] = extra[k];
    return o;
  }
  function incoming() {
    var r = reqsMap()['in'], out = [];
    Object.keys(r).forEach(function (u) { if (!isBlocked(u)) out.push(decorate(u, { ts: r[u].ts || 0 })); });
    return out.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
  }
  function list() {
    var f = friendsMap(), out = [];
    Object.keys(f).forEach(function (u) { if (!isBlocked(u)) out.push(decorate(u, { since: f[u].since || 0 })); });
    return out.sort(function (a, b) { return (b.since || 0) - (a.since || 0); });
  }

  /* ---- acciones -------------------------------------------------------- */
  function nope(code) { return Promise.resolve({ ok: false, code: code || 'unavailable' }); }

  /* PEDIR amistad. El doc va con id from__to: si ya hubo un rechazo, las
     reglas lo deniegan y la UI no debe reintentarlo (queda como «enviada»). */
  function request(other) {
    if (!canFriend(other)) return nope('not-allowed');
    var me = uid();
    var doc = { from: me, to: other, status: 'pending', createdAt: now() };
    return ST().colSet(REQ_COL, reqId(me, other), doc, { overwrite: true }).then(function (r) {
      if (r && r.ok) {
        var m = reqsMap(); m.out[other] = { ts: doc.createdAt, status: 'pending' }; save(REQS_KEY, m); emit();
      }
      return r;
    });
  }

  /* ACEPTAR: primero se CREA la amistad (las reglas exigen que la petición
     siga viva para autorizarla) y solo DESPUÉS se borra la petición. Al revés
     la amistad sería rechazada y quedarían los dos lados sin nada. */
  function accept(other) {
    if (!active() || !other) return nope('unavailable');
    var me = uid();
    if (!reqsMap()['in'][other]) return nope('no-request');
    var m = members(me, other);
    return ST().colSet(PAIR_COL, pairId(me, other), { members: m, since: now() }, { overwrite: true })
      .then(function (r) {
        if (!(r && r.ok)) return r;
        return ST().del(REQ_COL + '/' + reqId(other, me)).then(function () {
          var f = friendsMap(); f[other] = { since: now() }; save(FRIENDS_KEY, f);
          var q = reqsMap(); delete q['in'][other]; save(REQS_KEY, q);
          emit();
          return { ok: true };
        });
      });
  }

  /* RECHAZAR: se marca 'rejected' y el doc SE QUEDA — es lo que impide que
     esa persona vuelva a pedírtelo. No se le notifica nada. */
  function reject(other) {
    if (!active() || !other) return nope('unavailable');
    var me = uid();
    return ST().colSet(REQ_COL, reqId(other, me), { status: 'rejected' }).then(function (r) {
      if (r && r.ok) { var q = reqsMap(); delete q['in'][other]; save(REQS_KEY, q); emit(); }
      return r;
    });
  }

  /* CANCELAR mi propia petición (solo mientras siga pendiente). */
  function cancel(other) {
    if (!active() || !other) return nope('unavailable');
    var me = uid();
    return ST().del(REQ_COL + '/' + reqId(me, other)).then(function (r) {
      if (r && r.ok) { var q = reqsMap(); delete q.out[other]; save(REQS_KEY, q); emit(); }
      return r;
    });
  }

  /* DESHACER la amistad (cualquiera de los dos, sin permiso del otro). */
  function unfriend(other) {
    if (!active() || !other) return nope('unavailable');
    return ST().del(PAIR_COL + '/' + pairId(uid(), other)).then(function (r) {
      if (r && r.ok) { var f = friendsMap(); delete f[other]; save(FRIENDS_KEY, f); emit(); }
      return r;
    });
  }

  /* ---- escucha de la nube ---------------------------------------------- */
  var unsubs = [];
  function stop() { unsubs.splice(0).forEach(function (u) { try { u(); } catch (e) {} }); }

  function start() {
    stop();
    if (!active()) return;
    var me = uid();

    /* mis amistades */
    unsubs.push(ST().onCol(PAIR_COL, function (docs) {
      var f = {}, others = [];
      docs.forEach(function (d) {
        var m = d.members || [];
        var other = m[0] === me ? m[1] : m[0];
        if (!other || other === me) return;
        f[other] = { since: d.since || 0 };
        others.push(other);
      });
      save(FRIENDS_KEY, f);
      try { if (ID() && ID().prefetch) ID().prefetch(others); } catch (e) {}
      emit();
    }, function (col) { return col.where('members', 'array-contains', me).limit(LIMIT); }));

    /* peticiones que RECIBO (el estado se filtra aquí, en el cliente: así la
       consulta es de un solo campo y no necesita índice compuesto) */
    unsubs.push(ST().onCol(REQ_COL, function (docs) {
      var q = reqsMap(); q['in'] = {};
      var others = [];
      docs.forEach(function (d) {
        if (d.status !== 'pending' || !d.from) return;
        q['in'][d.from] = { ts: d.createdAt || 0 };
        others.push(d.from);
      });
      save(REQS_KEY, q);
      try { if (ID() && ID().prefetch) ID().prefetch(others); } catch (e) {}
      emit();
    }, function (col) { return col.where('to', '==', me).limit(LIMIT); }));

    /* peticiones que ENVÍO (para saber cuándo pintar «enviada») */
    unsubs.push(ST().onCol(REQ_COL, function (docs) {
      var q = reqsMap(); q.out = {};
      docs.forEach(function (d) {
        if (!d.to) return;
        q.out[d.to] = { ts: d.createdAt || 0, status: d.status || 'pending' };
      });
      save(REQS_KEY, q);
      emit();
    }, function (col) { return col.where('from', '==', me).limit(LIMIT); }));
  }

  var API = {
    get available() { return active(); },
    status: status,
    canFriend: canFriend,
    isFriend: isFriend,
    count: count,
    incoming: incoming,
    list: list,
    request: request,
    accept: accept,
    reject: reject,
    cancel: cancel,
    unfriend: unfriend,
    subscribe: subscribe,
    pairId: pairId,
    reqId: reqId,
    _start: start,
    _stop: stop
  };

  try { window.CFFriends = API; } catch (e) {}

  /* arranca cuando Firebase despierta (mismo evento que usa cf-identity.js) */
  try { window.addEventListener('cf-auth-changed', function () { setTimeout(start, 300); }); } catch (e) {}
  if (document.readyState === 'loading') {
    try { document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 1500); }); } catch (e) {}
  } else { setTimeout(start, 1500); }

  try { console.log('[CFFriends] listo · amistad CHAT3'); } catch (e) {}
})();
