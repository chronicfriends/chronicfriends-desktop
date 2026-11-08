/* ===================================================================
   APPLE1 (3 nov 2026) · window.CFModeration — BLOQUEAR AVISA AL EQUIPO
   -------------------------------------------------------------------
   Apple rechazó la 1.0.9 por la norma 1.2: «a mechanism for users to
   block abusive users (blocking should also notify the developer of the
   inappropriate content and should remove it from the user's feed
   instantly)». Quitarlo al instante YA lo hace CFBlocks (design/blocks.jsx:
   un filtro local sobre muro, comentarios, chats y listas de personas).
   Lo que faltaba es el AVISO: bloquear se quedaba en el móvil.

   Aquí se envuelve CFBlocks.block: cada bloqueo NUEVO escribe una denuncia
   en Firestore `reports` (targetType 'user', reason 'Blocked user'), y la
   función avisarDenuncia (functions/moderacion.js) la manda por correo al
   equipo. Contrato = la regla validReportData de firestore.rules:
     authorUid (= el uid de nube de quien bloquea), targetType 'user',
     targetId 1-200, reason ≤ 120, details ≤ 2000, createdAt.

   QUÉ CONTENIDO (lo que pide Apple): si CFBlocks.block recibe el OBJETO
   (la publicación, el comentario, el chat o la persona; encargo APPLE1 §2a),
   el detalle dice desde dónde se bloqueó y, si es una publicación o un
   comentario —que ya son públicos dentro de la comunidad—, su id y el
   principio del texto. Un chat es privado: solo su id, NUNCA el texto.

   NUNCA: avisar dos veces del mismo bloqueo, avisar al desbloquear, ni
   bloquearse a uno mismo (eso ya lo impide CFBlocks). Cada denuncia se
   guarda ANTES de mandarla en la cola cf_reports_queue_v1 (la misma que usa
   reports.jsx) y sale de ella cuando la nube confirma: flushQueue() reintenta
   las que quedan cuando hay sesión, y solo las de la cuenta que está dentro.

   Idempotente: cargarlo dos veces no envuelve dos veces.
   =================================================================== */
/* 7 nov 2026 · REVISIÓN INDEPENDIENTE (auditorias/20261107-revision-apple1/INFORME.md), aplicada por el autor tras
   leerla: H1 (el uid local de la cuenta es CFNS.uid(); window.cfUid no existe en la app) · H3 (un id local o un correo
   NUNCA sale del móvil) · H4 (lo de un chat se mira PRIMERO) · H5 (otra pestaña u otro móvil ya lo bloqueó) · H6 (clip
   sin medio emoji) · H7 (sesión de nube de otra persona → no se sube la cola) · H2-D (la cola se manda toda a la vez).
   Marcas «REVISOR» en cada cambio. Partida: md5 f4204ca4. */
/* 7 nov 2026 · H2-A (decisión de Gerhard: «A»). Una denuncia «en vuelo» (sin red, add() no contesta) solo vivía en la
   caché del SDK: sin IndexedDB (el iPhone la pierde al volver de segundo plano, [3718]) moría al cerrar la app
   (b2-cola.mjs D y E). Ahora TODA denuncia —bloqueo, hoja «Report» y reintentos de la cola— se guarda en la cola ANTES
   de mandarla, con una marca _q (solo local: nunca sube), y sale de la cola cuando la nube contesta ok. Lo que esta
   apertura ya está mandando (vuelo[_q]) no se vuelve a mandar. PRECIO ACEPTADO: si el SDK también la guardó en su
   IndexedDB, al volver la red llegan las dos y el equipo recibe el correo dos veces (functions/moderacion.js corta a 5
   por persona y día). Marcas «H2-A». Partida: md5 9b881ca3. */
/* 7 nov 2026 · PROPUESTA DEL REVISOR DE H2-A (auditorias/20261107-revision-h2a/INFORME.md), aplicada por el autor tras leerla línea a línea. Partida: el
   borrador H2-A (md5 3578dc3c). Dos cambios, marcas «REVISOR H2A»:
   · R1 · flushQueue espera a que el SDK no tenga nada pendiente (waitForPendingWrites) antes de reintentar la cola.
     Con IndexedDB, cada apertura sin red le daba al SDK OTRA copia de lo que él ya guardaba: 3 aperturas → 3 copias
     pendientes + la de la cola (bancos r1 y r3, este con el SDK de verdad). Así, como mucho 2: el precio aceptado.
   · R2 · una entrada se reconoce por su _q o, si no lo tiene (las de la 1615), por su contenido. Antes había que
     GUARDAR un _q nuevo para poder quitarla: con el móvil lleno no se guardaba y se mandaba en cada flush, sin fin
     (banco r2). */
(function () {
  'use strict';
  if (window.CFModeration) return;

  var QUEUE_KEY = 'cf_reports_queue_v1';
  var REASON = 'Blocked user';
  var SNIPPET = 400;
  var MAXQ = 200;

  function myUid() {
    try { if (window.CFStore && typeof CFStore.uid === 'function') { var u = CFStore.uid(); if (u) return u; } } catch (e) {}
    try { var cu = window.firebase && firebase.auth && firebase.auth().currentUser; if (cu && cu.uid) return cu.uid; } catch (e) {}
    return null;
  }
  function idOf(x) {
    try { if (typeof window.cfBlockId === 'function') return cfBlockId(x); } catch (e) {}
    if (x == null) return null;
    if (typeof x === 'string') return x || null;
    return x.author || x.seed || x.uid || x.id || null;
  }
  function clip(t, n) {
    t = String(t == null ? '' : t).replace(/\s+/g, ' ').trim();
    if (t.length <= n) return t;
    var c = t.slice(0, n - 1), u = c.charCodeAt(c.length - 1);
    if (u >= 0xD800 && u <= 0xDBFF) c = c.slice(0, -1);      /* REVISOR: no dejar medio emoji */
    return c + '…';
  }
  /* REVISOR: un id LOCAL ('pat:<correo>' / 'doc:<…>') o cualquier cosa con un correo NUNCA sale del móvil */
  function esLocal(s) { return /^(pat|doc):|@/.test(String(s == null ? '' : s)); }

  /* desde dónde se bloqueó, en inglés (lo lee el equipo; el correo es el mismo para todos) */
  function contexto(x) {
    if (!x || typeof x !== 'object') return 'Blocked by id (no content attached).';
    /* REVISOR: lo de un chat se mira PRIMERO — una conversación o un mensaje ({from, text, ts}) jamás manda su
       texto, lleve los campos que lleve */
    if ((x.seed && (x.lastMessage != null || x.messages != null || x.unread != null || x.chatId != null)) || (x.from != null && x.text != null)) {
      var ch = x.chatId || x.seed || '';
      return 'Blocked from a private chat · chat: ' + (!ch || esLocal(ch) ? '(local)' : ch) + ' (private: no text attached).';
    }
    var isPost = (x.body != null || x.title != null) && (x._cid || x._col || x.category || x.cond);
    if (isPost) {
      var pid = x._cid || x.id || '?';
      var txt = clip((x.title ? x.title + ' — ' : '') + (x.body || ''), SNIPPET);
      return 'Blocked from a post · post id: ' + pid + ' · collection: ' + (x._col || 'community_posts') +
        (txt ? ' · text: «' + txt + '»' : '');
    }
    var isComment = x.text != null && (x.ts != null || x.rid != null || x.postId != null);
    if (isComment) {
      var cid = x.rid || x.id || x.ts || '?';
      return 'Blocked from a comment · comment: ' + cid + (x.postId ? ' · post: ' + x.postId : '') +
        ' · text: «' + clip(x.text, SNIPPET) + '»';
    }
    return 'Blocked from a profile or a people list.';
  }

  /* M12 (auditoría del 5 nov 2026): una denuncia hecha desde la hoja «Report» (design/reports.jsx)
     que no llegaba a la nube (sin sesión, correo sin verificar, interruptor de solo lectura) se
     PERDÍA, y la pantalla decía «la revisaremos». Se envuelve CFStore.colAdd SOLO para 'reports':
     H2-A: va a la cola ANTES de mandarla y sale cuando la nube contesta ok; si no, flushQueue la
     reintenta. Lo que escribe este motor ya gestiona su cola (propio = true mientras llama).
     Banco: tools/tests/reporte-cola-harness.mjs */
  var propio = false;
  function colAddPropio(doc) {
    propio = true;
    try { return CFStore.colAdd('reports', doc); } finally { propio = false; }
  }

  /* H2-A: la cola. Cada entrada lleva _q (un id que nunca sale del móvil); vuelo = lo que esta apertura ya está
     mandando y todavía no ha contestado (sin red, add() no contesta nunca) */
  var vuelo = {};
  function nuevoQ() { return 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function leerCola() {
    try { var q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); return Array.isArray(q) ? q : []; } catch (e) { return []; }
  }
  function guardarCola(q) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-MAXQ))); return true; } catch (e) { return false; }
  }
  /* guarda una COPIA (createdAt en milisegundos) y devuelve su _q; null si no se pudo guardar */
  function encolar(doc) {
    var d = {}; for (var k in doc) d[k] = doc[k];
    var c = doc.createdAt;
    d.createdAt = (c && typeof c.getTime === 'function') ? c.getTime() : (typeof c === 'number' ? c : Date.now());
    d._q = nuevoQ();
    var q = leerCola(); q.push(d);
    return guardarCola(q) ? d._q : null;
  }
  /* REVISOR H2A (R2): la clave de una entrada es su _q; las de antes de H2-A (1615, sin _q) se reconocen por su
     CONTENIDO, sin tener que guardar nada (con el móvil lleno, un _q nuevo no se guardaba y quitar no la encontraba) */
  function clave(d) {
    if (!d || typeof d !== 'object') return null;
    if (typeof d._q === 'string' && d._q) return d._q;
    try { return 'v' + JSON.stringify([d.createdAt, d.targetType, d.targetId, d.reason, d.details, d.authorUid]); } catch (e) { return null; }
  }
  /* la nube confirmó: fuera de la cola */
  function quitar(qid) {
    if (!qid) return;
    var q = leerCola(), r = q.filter(function (d) { return clave(d) !== qid; });      /* REVISOR H2A (R2) */
    if (r.length !== q.length) guardarCola(r);
  }
  /* manda; si la nube contesta ok, la quita de la cola; si no, se queda para flushQueue */
  function mandar(doc, qid) {
    if (qid) vuelo[qid] = true;
    var p;
    try { p = colAddPropio(doc); } catch (e) { p = { ok: false, code: 'exception' }; }
    return Promise.resolve(p).then(function (r) {
      if (qid) delete vuelo[qid];
      if (r && r.ok === false) return { ok: false, queued: !!qid, code: r.code };
      quitar(qid);
      return r || { ok: true };
    }, function () { if (qid) delete vuelo[qid]; return { ok: false, queued: !!qid }; });
  }

  function wrapStore() {
    var S = window.CFStore;
    if (!S || typeof S.colAdd !== 'function') return false;
    if (S.__cfReportQueue) return true;
    var orig = S.colAdd;
    S.colAdd = function (col, doc) {
      if (col !== 'reports' || propio || !doc || typeof doc !== 'object') return orig.apply(this, arguments);
      var qid = encolar(doc);                                   /* H2-A: a la cola ANTES de mandarla */
      if (qid) vuelo[qid] = true;
      var p;
      try { p = orig.apply(this, arguments); } catch (e) { if (qid) delete vuelo[qid]; throw e; }
      return Promise.resolve(p).then(function (r) {
        if (qid) delete vuelo[qid];
        if (!(r && r.ok === false)) quitar(qid);
        return r;
      }, function (e) { if (qid) delete vuelo[qid]; throw e; });
    };
    S.__cfReportQueue = true;
    return true;
  }

  /* la denuncia de un bloqueo nuevo */
  function notifyBlock(x, name) {
    var target = idOf(x);
    var me = myUid();
    if (!target || (me && target === me)) return Promise.resolve({ ok: false, skipped: true });
    var who = clip(name || (x && typeof x === 'object' && x.name) || '', 80);
    var doc = {
      authorUid: me || '',
      targetType: 'user',
      targetId: esLocal(target) ? 'local-account' : String(target).slice(0, 200),      /* REVISOR */
      reason: REASON,
      details: clip((who ? 'Blocked user name: ' + who + ' · ' : '') + contexto(x), 2000),
      createdAt: new Date()
    };
    var qid = encolar(doc);                                     /* H2-A: a la cola ANTES de mandarla */
    if (!me || !(window.CFStore && typeof CFStore.colAdd === 'function')) return Promise.resolve({ ok: false, queued: !!qid });
    return mandar(doc, qid);
  }

  /* sube la cola SOLO con las denuncias de la cuenta que está dentro (las demás se quedan) */
  function flushQueue() {
    var me = myUid();
    if (!me || !(window.CFStore && typeof CFStore.colAdd === 'function')) return Promise.resolve({ sent: 0 });
    if (!leerCola().length) return Promise.resolve({ sent: 0 });
    /* REVISOR H2A (R1): con IndexedDB, lo que el SDK no pudo mandar sigue en SU cola y sale solo al volver la red.
       Dárselo otra vez en cada apertura sin red apilaba una copia más por apertura. Se reintenta cuando el SDK ya no
       tiene nada pendiente: sin red y con algo pendiente, waitForPendingWrites no contesta (la denuncia sigue en
       esta cola, que sobrevive a cerrar la app); sin nada pendiente, contesta en el acto. Si falla, se sigue igual. */
    var espera = null;
    try { if (CFStore.db && typeof CFStore.db.waitForPendingWrites === 'function') espera = CFStore.db.waitForPendingWrites(); } catch (e) { espera = null; }
    return Promise.resolve(espera).then(subirCola, subirCola);
  }
  function subirCola() {
    var me = myUid();
    if (!me || !(window.CFStore && typeof CFStore.colAdd === 'function')) return { sent: 0 };
    var q = leerCola();
    if (!q.length) return { sent: 0 };
    /* reports.jsx encola con el uid LOCAL de la cuenta si no había nube: también es «mío».
       Ese uid local nunca sale del móvil: al subir, authorUid es SIEMPRE el uid de nube. */
    /* REVISOR: window.cfUid NO existe en la app (posts.js lo deja dentro de su función): el uid LOCAL de esta cuenta
       es CFNS.uid(); la cola vive en el espacio de ESTA cuenta (parche CFNS), así que lo que lleva su uid local es suyo */
    var local = null;
    try { local = typeof window.cfUid === 'function' ? cfUid() : (window.CFNS && typeof CFNS.uid === 'function' ? CFNS.uid() : null); } catch (e) {}
    if (local === 'anon') local = null;
    /* REVISOR: sesión de nube de OTRA persona que la cuenta de dentro (huérfana, antes de que SEC22 la cierre) → nada */
    if (otraPersona()) return { sent: 0 };
    /* REVISOR H2A (R2): las que se encolaron antes de H2-A (o reports.jsx sin CFStore) no llevan _q: clave() las
       reconoce por su contenido, así que ya no se les escribe un _q (con el móvil lleno no se guardaba) */
    var mias = q.filter(function (d) {
      return d && typeof d === 'object' && clave(d) && !vuelo[clave(d)] && (d.authorUid === me || (local && d.authorUid === local) || !d.authorUid);
    });
    if (!mias.length) return { sent: 0 };
    var sent = 0, fallan = 0;
    /* REVISOR (H2-D): TODAS a la vez, no en fila: sin red la 1.ª no contesta nunca y las demás no llegaban ni a la
       cola del SDK. H2-A: cada una sigue en la cola hasta que la nube contesta ok */
    return Promise.all(mias.map(function (d) {
      var k = clave(d);                                                       /* REVISOR H2A (R2) */
      if (vuelo[k]) return null;               /* REVISOR H2A (R2): dos entradas idénticas de la 1615 → una sola vez */
      var doc = {
        authorUid: me,
        targetType: String(d.targetType || ''),
        targetId: String(d.targetId == null ? '' : d.targetId).slice(0, 200),
        reason: String(d.reason || '').slice(0, 120),
        details: String(d.details || '').slice(0, 2000),
        createdAt: new Date(typeof d.createdAt === 'number' ? d.createdAt : Date.now())
      };
      if (!doc.targetType || !doc.targetId) { quitar(k); return null; }         /* nunca podría subir */
      return mandar(doc, k).then(function (r) { if (r && r.ok === false) fallan++; else sent++; });
    })).then(function () {
      return { sent: sent, failed: fallan };
    });
  }

  /* REVISOR: otra pestaña u otro móvil (cf_blocked_v1 viaja con firebase-sync.js) ya lo bloqueó → no avisar otra vez */
  function enLaLista(id) {
    try { var l = JSON.parse(localStorage.getItem('cf_blocked_v1') || '[]'); return Array.isArray(l) && l.some(function (b) { return b && b.id === id; }); } catch (e) { return false; }
  }
  function otraPersona() {
    try {
      var a = JSON.parse(localStorage.getItem('cf_auth_v1') || 'null');
      var le = a && a.email ? String(a.email).toLowerCase().trim() : '';
      var u = window.firebase && firebase.auth && firebase.auth().currentUser;
      var fe = String((u && (u.email || (u.providerData && u.providerData[0] && u.providerData[0].email))) || '').toLowerCase().trim();
      return !!(le && fe && le !== fe);
    } catch (e) { return false; }
  }

  /* envolver CFBlocks.block (build/blocks.js se carga antes que vendor/, pero por si acaso se reintenta) */
  function wrap() {
    var B = window.CFBlocks;
    if (!B || typeof B.block !== 'function') return false;
    if (B.__cfModeration) return true;
    var original = B.block;
    B.block = function (idOrItem, name) {
      var id = idOf(idOrItem);
      var antes = false;
      try { antes = !!(id && (B.isBlocked(id) || enLaLista(id))); } catch (e) {}      /* REVISOR */
      var r = original.apply(this, arguments);
      var ahora = false;
      try { ahora = !!(id && B.isBlocked(id)); } catch (e) {}
      if (r && !antes && ahora) { try { notifyBlock(idOrItem, name); } catch (e) {} }
      return r;
    };
    B.__cfModeration = true;
    return true;
  }

  window.CFModeration = { version: 'apple1-20261107-h2a', notifyBlock: notifyBlock, flushQueue: flushQueue, _contexto: contexto };

  if (!wrap()) {
    var n = 0;
    var t = setInterval(function () { if (wrap() || ++n > 100) clearInterval(t); }, 200);
  }
  if (!wrapStore()) {
    var n2 = 0;
    var t2 = setInterval(function () { if (wrapStore() || ++n2 > 100) clearInterval(t2); }, 200);
  }
  /* la cola: al cargar y cada vez que cambia la sesión de Firebase */
  setTimeout(function () { flushQueue(); }, 4000);
  try {
    if (window.firebase && firebase.auth) firebase.auth().onAuthStateChanged(function (u) { if (u) setTimeout(function () { flushQueue(); }, 1500); });
  } catch (e) {}
})();
