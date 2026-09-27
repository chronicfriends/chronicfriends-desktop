/* ===== Firebase · COOP1 — EL MODO «JUNTOS», DE VERDAD =====================
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design, igual que firebase-friends.js o firebase-steps-board.js.

   QUÉ ES (decisión de Gerhard, 25 sep 2026, opción B + alcance «a»): hacer una
   sala de Meditación o de Flare Mode A LA VEZ con un amigo, como COMPAÑÍA: cada
   uno hace la sala en su móvil y ve que el otro está ahí. Nada se sincroniza
   (ni la música ni la respiración): lo que se comparte es la presencia.
   Hasta la 1.0.6 esto era una MAQUETA de la fase de diseño (design/coop.jsx:
   «transport is SIMULATED»): la invitación no salía del teléfono, el otro
   «aceptaba» solo con un temporizador y la app se inventaba a cinco personas
   (Mara, Ravi…). Historial CF [2547] [2552].

   🚨 NADIE INVENTADO: solo se invita a AMIGOS aceptados (las reglas lo exigen
   con un exists() sobre friendships), el orbe del compañero solo existe si SU
   latido es reciente, y una invitación sin respuesta caduca y se dice.

   EN LA NUBE (contrato exacto de firestore.rules, bloque COOP1) — UN DOC por
   pareja y sentido, con id determinista:
     coop_sessions/{host__guest} {
       host, guest,                 uids de nube; host = quien invita
       toolId, toolName, accent?,   la sala (nombre visible, nunca datos de salud)
       status: 'invited' | 'live' | 'declined' | 'ended',
       createdAt, expiresAt,        la invitación caduca a los 2 minutos
       acceptedAt?, hostSeen?, guestSeen?, endedAt?
     }
   Transiciones: el host crea (invited) y puede borrar · el guest pasa a live o
   declined · cualquiera de los dos pasa live → ended · cada uno solo escribe SU
   latido · cualquiera de los dos borra (limpieza).

   SIN AVISOS PUSH (CHAT7 retirado el 23 ago 2026): la invitación solo llega si
   el amigo tiene la app ABIERTA. Por eso roster() dice quién está en línea de
   verdad (latido del directorio) y la interfaz solo debe ofrecer a esos.

   🩹 AUDITORÍA DEL 26 SEP 2026 (Historial CF [2560]) — cuatro arreglos:
     · EL LATIDO ES DE LA SALA, no de la app: solo se late mientras la sala de
       la sesión está EN PANTALLA, es decir, mientras existe en el DOM su
       envoltorio [data-coop-tool="<toolId>"] (CoopTool de Claude Design, que
       solo se monta con la sala abierta). Antes bastaba con tener la app
       abierta en cualquier pantalla, y el otro veía la luz y «You're both here»
       con el amigo ya fuera del ritual, hasta un día después. 🔴 CONTRATO CON
       CD: ese atributo no se puede quitar ni montar fuera de la sala.
     · SIN SESIONES ZOMBI: si el compañero lleva 10 min sin latir, la sesión se
       termina sola (live → ended). Antes solo acababa pulsando «Leave»; una
       sesión olvidada tapaba las invitaciones nuevas y daba «busy».
     · «{name} está contigo» cuando el compañero LLEGA (su primer latido tras
       aceptar), no al aceptar: al invitado le salía sin nadie al otro lado.
     · RELOJES: la presencia se mide con la hora de MI móvil al RECIBIR el latido
       del otro, no comparando su reloj con el mío (un móvil desfasado rompía
       «Juntos» sin avisar); la caducidad de una invitación recibida, igual.

   API — window.CFCoopCloud
     .available            → ¿sesión verificada + Firestore vivo?
     .state()              → { session, outgoing, incoming }   (SÍNCRONO)
         session  { id, toolId, toolName, accent, partner, role:'host'|'guest',
                    since, partnerPresent, partnerArrived }
                    partnerPresent → su latido llegó hace menos de 45 s
                    partnerArrived → ha latido al menos una vez en esta sesión
                                     (false = aceptó pero aún no ha entrado)
         outgoing { id, toolId, toolName, accent, partner, at, expiresAt,
                    status:'invited'|'declined'|'expired' }
         incoming [{ id, toolId, toolName, accent, from, at, expiresAt }]
         partner / from = { key, uid, seed, name, avatar }
     .roster()             → Promise<[{uid, key, seed, name, avatar, online}]>
                             mis amigos aceptados; online = latido del directorio
     .invite(tool, uid)    → Promise<{ok, code}>  tool = {id, name, accent}
     .cancel()             → Promise<{ok}>        retira mi invitación
     .accept(id) · .decline(id) · .leave()        → Promise<{ok, code}>
     .dismiss()            → olvida una invitación mía ya rechazada/caducada
     ._start() ._stop() ._tick()                  → para los arneses
   Eventos en window: 'cf-coop' (cambió algo) · 'cf-coop-toast' {name} (el
   compañero LLEGA a la sala por primera vez en esa sesión: el mismo aviso que
   ya pintaba la interfaz; desde el 26 sep, no al aceptar).
   ===================================================================== */
(function () {
  'use strict';

  var COL         = 'coop_sessions';
  var FRIEND_COL  = 'friendships';
  var DIR_COL     = 'directory';
  var CADUCA_MS   = 2 * 60 * 1000;   /* una invitación en directo no espera más */
  var LATIDO_MS   = 15 * 1000;       /* mi latido mientras estoy en la sala */
  var PRESENTE_MS = 45 * 1000;       /* el compañero está si latió hace menos */
  var TICK_MS     = 5 * 1000;        /* repaso de caducidades y presencia */
  var LIMPIEZA_MS = 20 * 1000;       /* cuánto se deja ver «rechazada/sin respuesta» */
  var ONLINE_MS   = 3 * 60 * 1000;   /* mismo criterio que CFDirectory.online() (26 sep: 12 → 3 min) */
  var ZOMBI_MS    = 10 * 60 * 1000;  /* compañero sin latir tanto tiempo → la sesión se termina */
  var RELOJ_MS    = 10 * 60 * 1000;  /* margen para el reloj del OTRO móvil al leer sus horas */

  function CF() { try { return window.CFFirebase || null; } catch (e) { return null; } }
  function ST() { try { return window.CFStore || null; }    catch (e) { return null; } }
  function FR() { try { return window.CFFriends || null; }  catch (e) { return null; } }
  function DIR() { try { return window.CFDirectory || null; } catch (e) { return null; } }
  function user() { try { return (CF() && CF().currentUser()) || null; } catch (e) { return null; } }
  function uid() { var u = user(); return (u && u.uid) || null; }
  function verified() { var u = user(); return !!(u && u.emailVerified); }
  function active() { return !!(ST() && ST().available && CF() && CF().available && uid() && verified()); }
  function now() {
    try { return (window.CFClock && window.CFClock.now && window.CFClock.now()) || Date.now(); } catch (e) { return Date.now(); }
  }
  function visible() { try { return !document.visibilityState || document.visibilityState === 'visible'; } catch (e) { return true; } }
  function emit(tipo, detalle) {
    try { window.dispatchEvent(new CustomEvent(tipo, detalle ? { detail: detalle } : undefined)); } catch (e) {}
  }
  function idDe(host, guest) { return host + '__' + guest; }
  function recorta(s, n) { return String(s == null ? '' : s).slice(0, n); }

  /* ---- quién es la otra persona: SOLO de lo público (nombre y foto) ------ */
  function persona(u) {
    var name = '', avatar = null;
    try {
      var l = (FR() && FR().list && FR().list()) || [];
      for (var i = 0; i < l.length; i++) if (l[i] && l[i].uid === u) { name = l[i].name || ''; avatar = l[i].avatar || null; break; }
    } catch (e) {}
    if (!name) { try { name = (window.cfPublicNameFor && window.cfPublicNameFor(u, '')) || ''; } catch (e) {} }
    if (!avatar) { try { var a = window.cfPublicAvatarInfo && window.cfPublicAvatarInfo(u); avatar = (a && a.photo) || null; } catch (e) {} }
    return { key: u, uid: u, seed: u, name: name, avatar: avatar };
  }
  function esAmigo(u) { try { return !!(FR() && FR().isFriend && FR().isFriend(u)); } catch (e) { return false; } }

  /* ---- el estado: lo que dicen los documentos, y nada más ---------------- */
  var docs = {};            /* id → doc (host y guest mezclados) */
  var visto = {};           /* id → último estado visto (transiciones) */
  var llegada = {};         /* id → { v: último latido del otro, t: MI hora al recibirlo } */
  var pendiente = {};       /* id → la vi como 'invited': falta el aviso «está contigo» */
  var vivaDesde = {};       /* id → MI hora cuando la vi viva por primera vez */
  var recibida = {};        /* id → MI hora cuando me llegó la invitación (en directo) */
  var cargado = {};         /* rol → ya llegó la primera foto de ese oyente */
  var subs = [];

  function campoOtro(d) { return d.host === uid() ? 'guestSeen' : 'hostSeen'; }

  /* el otro está si SU latido me llegó hace menos de 45 s, medido con MI reloj */
  function presente(id) {
    var l = llegada[id];
    return !!(l && now() - l.t < PRESENTE_MS);
  }

  /* ¿sigue viva una invitación que me han hecho? Si la vi llegar, cuento los
     2 min desde que llegó (mi reloj). Si ya estaba al arrancar, uso su hora de
     caducidad (reloj del otro). Y nunca una con la caducidad muy pasada, por
     desfasado que esté el otro reloj. */
  function invitacionViva(id, d) {
    var t = now(), exp = Number(d.expiresAt);
    if (!(exp && isFinite(exp)) || exp <= t - RELOJ_MS) return false;
    if (recibida[id]) return t - recibida[id] < CADUCA_MS;
    return exp > t;
  }

  function state() {
    var me = uid();
    var out = { session: null, outgoing: null, incoming: [] };
    if (!me) return out;
    var t = now();
    Object.keys(docs).forEach(function (id) {
      var d = docs[id];
      if (!d || !d.host || !d.guest) return;
      var soyHost = d.host === me, soyGuest = d.guest === me;
      if (!soyHost && !soyGuest) return;
      var otro = soyHost ? d.guest : d.host;
      if (d.status === 'live') {
        out.session = {
          id: id, toolId: d.toolId, toolName: d.toolName, accent: d.accent || null,
          partner: persona(otro), role: soyHost ? 'host' : 'guest',
          since: d.acceptedAt || d.createdAt || 0,
          partnerPresent: presente(id),
          partnerArrived: !!llegada[id]
        };
        return;
      }
      if (soyHost && (d.status === 'invited' || d.status === 'declined')) {
        var caducada = d.status === 'invited' && Number(d.expiresAt) <= t;
        out.outgoing = {
          id: id, toolId: d.toolId, toolName: d.toolName, accent: d.accent || null,
          partner: persona(otro), at: d.createdAt || 0, expiresAt: d.expiresAt || 0,
          status: d.status === 'declined' ? 'declined' : (caducada ? 'expired' : 'invited')
        };
        return;
      }
      if (soyGuest && d.status === 'invited' && invitacionViva(id, d)) {
        out.incoming.push({
          id: id, toolId: d.toolId, toolName: d.toolName, accent: d.accent || null,
          from: persona(otro), at: d.createdAt || 0, expiresAt: d.expiresAt || 0
        });
      }
    });
    out.incoming.sort(function (a, b) { return (b.at || 0) - (a.at || 0); });
    return out;
  }

  /* ---- escuchar mis documentos (como host y como guest) ------------------ */
  /* lo que se sabe de UNA sesión concreta. El id (host__guest) se repite en
     cada invitación entre las mismas dos personas: al cambiar de sesión, fuera. */
  var altaDe = {};          /* id → createdAt de la sesión que conozco con ese id */
  function olvidar(id) {
    delete llegada[id]; delete pendiente[id]; delete vivaDesde[id]; delete recibida[id];
    delete terminando[id];
  }

  function mezclar(rol, lista) {
    var me = uid();
    var fuera = {};
    Object.keys(docs).forEach(function (id) { if (docs[id] && docs[id][rol] === me) { fuera[id] = true; delete docs[id]; } });
    (lista || []).forEach(function (d) {
      var id = d._id || (d.host && d.guest ? idDe(d.host, d.guest) : null);
      if (id) { docs[id] = d; delete fuera[id]; }
    });
    Object.keys(fuera).forEach(function (id) { olvidar(id); delete visto[id]; delete altaDe[id]; });
    revisar();
    cargado[rol] = true;       /* lo que llegue a partir de ahora, llega EN DIRECTO */
    emit('cf-coop');
  }

  /* transiciones: la sesión empieza · el compañero llega · la otra persona se fue */
  function revisar() {
    var me = uid();
    var empieza = false;
    Object.keys(docs).forEach(function (id) {
      var d = docs[id]; if (!d) return;
      if (altaDe[id] !== undefined && altaDe[id] !== d.createdAt) { olvidar(id); delete visto[id]; }
      altaDe[id] = d.createdAt;
      var antes = visto[id];
      /* ¿lo estoy viendo pasar, o ya estaba así al arrancar la app? */
      var enDirecto = antes !== undefined || !!cargado[d.host === me ? 'host' : 'guest'];
      if (d.status === 'invited') {
        pendiente[id] = true;
        if (d.guest === me && enDirecto && !recibida[id]) recibida[id] = now();
      }
      if (d.status === 'live') {
        if (!vivaDesde[id]) {
          var ac = Number(d.acceptedAt);
          vivaDesde[id] = enDirecto ? now() : Math.min(now(), (ac && isFinite(ac)) ? ac : now());
        }
        /* el latido del otro: si CAMBIÓ, me acaba de llegar (hora de MI móvil).
           Al arrancar no sé cuándo llegó: uso su hora, sin pasar de la mía. */
        var v = Number(d[campoOtro(d)]);
        if (v && isFinite(v) && (!llegada[id] || llegada[id].v !== v)) {
          llegada[id] = { v: v, t: (llegada[id] || enDirecto) ? now() : Math.min(now(), v) };
        }
        if (antes === 'invited') empieza = true;
        /* «{name} está contigo» cuando el compañero LLEGA de verdad (su primer
           latido después de aceptar), una sola vez. Al reabrir la app en mitad
           de una sesión no se repite: nunca la vi como invitación. */
        if (pendiente[id] && presente(id)) {
          delete pendiente[id];
          emit('cf-coop-toast', { name: persona(d.host === me ? d.guest : d.host).name });
        }
      }
      if (d.status === 'declined' || d.status === 'ended') delete pendiente[id];
      /* la otra persona terminó: el que lo ve limpia el documento */
      if (d.status === 'ended' && ST()) { try { ST().del(COL + '/' + id); } catch (e) {} }
      visto[id] = d.status;
    });
    /* al empezar, mi latido sale YA (si estoy en la sala): la otra persona no
       tiene que esperar al siguiente repaso para verme */
    if (empieza) latir(true);
  }

  /* ---- acciones -------------------------------------------------------- */
  function nope(code) { return Promise.resolve({ ok: false, code: code || 'unavailable' }); }

  function invite(tool, other) {
    if (!active()) return nope('unavailable');
    var me = uid();
    if (!other || other === me) return nope('bad-partner');
    if (!esAmigo(other)) return nope('not-friends');          /* las reglas también lo exigen */
    if (!tool || !tool.id) return nope('bad-tool');
    if (state().session) return nope('busy');                 /* una sala a la vez */
    var previa = state().outgoing;                            /* y una invitación a la vez */
    if (previa && previa.partner && previa.partner.uid !== other) { try { cancel(); } catch (e) {} }
    var id = idDe(me, other), t = now();
    var doc = {
      host: me, guest: other,
      toolId: recorta(tool.id, 40), toolName: recorta(tool.name || tool.id, 80),
      status: 'invited', createdAt: t, expiresAt: t + CADUCA_MS
    };
    if (tool.accent) doc.accent = recorta(tool.accent, 32);
    /* si quedaba uno viejo (rechazado, terminado, caducado) se borra primero:
       las reglas solo dejan CREAR invitaciones nuevas, no resucitarlas */
    return ST().del(COL + '/' + id).catch(function () { return null; }).then(function () {
      return ST().colSet(COL, me + '__' + other, doc, { overwrite: true });
    }).then(function (r) {
      if (r && r.ok === false) return r;
      olvidar(id);
      docs[id] = doc; visto[id] = 'invited'; altaDe[id] = t; pendiente[id] = true; emit('cf-coop');
      return { ok: true, id: id };
    });
  }

  function cancel() {
    var o = state().outgoing;
    if (!o || !ST()) return Promise.resolve({ ok: true });
    delete docs[o.id]; emit('cf-coop');
    return ST().del(COL + '/' + o.id);
  }
  function dismiss() { return cancel(); }

  function actualizar(id, patch) {
    if (!active()) return nope('unavailable');
    return ST().colSet(COL, id, patch).then(function (r) {
      if (!(r && r.ok === false) && docs[id]) {
        for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) docs[id][k] = patch[k];
        revisar(); emit('cf-coop');
      }
      return r || { ok: true };
    });
  }

  function accept(id) {
    var d = docs[id], me = uid();
    if (!d || d.guest !== me || d.status !== 'invited') return nope('no-invite');
    if (!invitacionViva(id, d)) return nope('expired');
    var s = state().session;
    var antes = s ? leave() : Promise.resolve();
    var t = now();
    /* mi primer latido va con el «sí» SOLO si ya estoy en esa sala. Si acepto
       desde otra pantalla, lateré al entrar en ella (la interfaz me lleva). */
    var patch = { status: 'live', acceptedAt: t };
    if (visible() && enSala(d.toolId)) { patch.guestSeen = t; ultimoLatido = t; dentroAntes = true; }
    return antes.then(function () { return actualizar(id, patch); });
  }
  function decline(id) {
    var d = docs[id], me = uid();
    if (!d || d.guest !== me || d.status !== 'invited') return nope('no-invite');
    return actualizar(id, { status: 'declined' });
  }
  function leave() {
    var s = state().session;
    if (!s) { return cancel(); }
    return actualizar(s.id, { status: 'ended', endedAt: now() });
  }

  /* ---- mis amigos, con su «en línea» DE VERDAD --------------------------- */
  function roster() {
    if (!active()) return Promise.resolve([]);
    var l = [];
    try { l = (FR() && FR().list && FR().list()) || []; } catch (e) {}
    return Promise.all(l.map(function (f) {
      if (!f || !f.uid) return Promise.resolve(null);
      return ST().get(DIR_COL + '/' + f.uid).then(function (d) {
        var ls = d && Number(d.lastSeen);
        var on = false;
        try { on = DIR() && DIR().online ? !!DIR().online(ls) : !!(ls && now() - ls < ONLINE_MS); }
        catch (e) { on = !!(ls && now() - ls < ONLINE_MS); }
        var p = persona(f.uid);
        return { uid: f.uid, key: f.uid, seed: f.uid, name: p.name || f.name || '', avatar: p.avatar, online: on };
      }).catch(function () { return null; });
    })).then(function (rows) {
      return rows.filter(function (r) { return r && r.name; })
        .sort(function (a, b) { return (b.online ? 1 : 0) - (a.online ? 1 : 0); });
    });
  }

  /* ---- latido y repaso ---------------------------------------------------- */
  var latidoT = null, tickT = null, ultimoLatido = 0, huella = '', dentroAntes = false;
  var terminando = {};      /* id → MI hora al pedir el cierre por zombi (no repetirlo) */

  /* ¿está la sala de la sesión EN PANTALLA? Claude Design envuelve cada sala en
     <div class="coop-tool" data-coop-tool="<toolId>"> (CoopTool, coop.jsx) y
     solo lo monta con la sala abierta. Sin ese envoltorio no hay latido. */
  function enSala(toolId) {
    if (!toolId) return false;
    try {
      var els = document.querySelectorAll('[data-coop-tool]');
      for (var i = 0; i < els.length; i++) if (els[i].getAttribute('data-coop-tool') === toolId) return true;
    } catch (e) {}
    return false;
  }

  function latir(forzar) {
    var s = state().session;
    var dentro = !!(s && active() && visible() && enSala(s.toolId));
    var entra = dentro && !dentroAntes;      /* acaba de entrar: latido YA */
    dentroAntes = dentro;
    if (!dentro) return;
    var t = now();
    if (!forzar && !entra && t - ultimoLatido < LATIDO_MS - 500) return;
    ultimoLatido = t;
    var patch = {}; patch[s.role === 'host' ? 'hostSeen' : 'guestSeen'] = t;
    try { ST().colSet(COL, s.id, patch); } catch (e) {}
    if (docs[s.id]) docs[s.id][s.role === 'host' ? 'hostSeen' : 'guestSeen'] = t;
  }
  function tick() {
    var st = state();
    /* la mía rechazada o caducada: se deja ver un rato y se limpia */
    if (st.outgoing && st.outgoing.status !== 'invited') {
      var desde = st.outgoing.status === 'expired' ? st.outgoing.expiresAt : (docs[st.outgoing.id] && docs[st.outgoing.id]._vistoRechazo);
      if (st.outgoing.status === 'declined' && docs[st.outgoing.id] && !docs[st.outgoing.id]._vistoRechazo) docs[st.outgoing.id]._vistoRechazo = now();
      if (desde && now() - desde > LIMPIEZA_MS) cancel();
    }
    /* sin sesiones zombi: si el compañero lleva 10 min sin latir (o sin llegar
       desde que aceptó), la sesión se termina para los dos */
    if (st.session) {
      var sid = st.session.id;
      var ult = Math.max(llegada[sid] ? llegada[sid].t : 0, vivaDesde[sid] || 0);
      if (ult && now() - ult > ZOMBI_MS && !(terminando[sid] && now() - terminando[sid] < 60000)) {
        terminando[sid] = now();
        try { leave(); } catch (e) {}
      }
    }
    latir(false);
    /* la presencia y las caducidades cambian con el reloj: se avisa si cambió */
    var h = JSON.stringify([st.session && st.session.partnerPresent, st.outgoing && st.outgoing.status, st.incoming.length]);
    if (h !== huella) { huella = h; emit('cf-coop'); }
  }

  /* ---- arranque --------------------------------------------------------- */
  function stop() {
    subs.splice(0).forEach(function (u) { try { u(); } catch (e) {} });
    docs = {}; visto = {}; llegada = {}; pendiente = {}; vivaDesde = {}; recibida = {};
    cargado = {}; altaDe = {}; terminando = {}; dentroAntes = false;
  }
  function start() {
    stop();
    if (!active()) return;
    var me = uid();
    subs.push(ST().onCol(COL, function (l) { mezclar('host', l); }, function (c) { return c.where('host', '==', me).limit(20); }));
    subs.push(ST().onCol(COL, function (l) { mezclar('guest', l); }, function (c) { return c.where('guest', '==', me).limit(20); }));
    if (!tickT) { try { tickT = setInterval(tick, TICK_MS); } catch (e) {} }
    if (!latidoT) { try { latidoT = setInterval(function () { latir(false); }, LATIDO_MS); } catch (e) {} }
  }

  var API = {
    get available() { return active(); },
    state: state,
    roster: roster,
    invite: invite,
    cancel: cancel,
    dismiss: dismiss,
    accept: accept,
    decline: decline,
    leave: leave,
    _start: start,
    _stop: stop,
    _tick: tick
  };
  try { window.CFCoopCloud = API; } catch (e) {}

  /* arranque: con la sesión (BOOT1 lanza 'cf-auth-changed' desde
     firebase-init.js), al cargar y al volver a la app (latido inmediato) */
  try { window.addEventListener('cf-auth-changed', function () { setTimeout(start, 350); }); } catch (e) {}
  try { document.addEventListener('visibilitychange', function () { if (visible()) latir(true); }); } catch (e) {}
  if (document.readyState === 'loading') {
    try { document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 1500); }); } catch (e) {}
  } else { setTimeout(start, 1500); }

  try { console.log('[CFCoopCloud] listo · modo Juntos COOP1'); } catch (e) {}
})();
