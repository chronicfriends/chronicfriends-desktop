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
   bloquearse a uno mismo (eso ya lo impide CFBlocks). Sin Firestore, la
   denuncia espera en la cola cf_reports_queue_v1 (la misma que usa
   reports.jsx, que nadie vaciaba): flushQueue() la sube cuando hay sesión,
   y solo las denuncias de la cuenta que está dentro.

   Idempotente: cargarlo dos veces no envuelve dos veces.
   =================================================================== */
/* 7 nov 2026 · REVISIÓN INDEPENDIENTE (auditorias/20261107-revision-apple1/INFORME.md), aplicada por el autor tras
   leerla: H1 (el uid local de la cuenta es CFNS.uid(); window.cfUid no existe en la app) · H3 (un id local o un correo
   NUNCA sale del móvil) · H4 (lo de un chat se mira PRIMERO) · H5 (otra pestaña u otro móvil ya lo bloqueó) · H6 (clip
   sin medio emoji) · H7 (sesión de nube de otra persona → no se sube la cola) · H2-D (la cola se manda toda a la vez y
   cada fallo vuelve en el acto). Marcas «REVISOR» en cada cambio. Partida: md5 f4204ca4. */
(function () {
  'use strict';
  if (window.CFModeration) return;

  var QUEUE_KEY = 'cf_reports_queue_v1';
  var REASON = 'Blocked user';
  var SNIPPET = 400;

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
     si no sale, va a la cola y flushQueue la reintenta. Lo que escribe este motor ya gestiona su
     cola (propio = true mientras llama). Banco: tools/tests/reporte-cola-harness.mjs */
  var propio = false;
  function colAddPropio(doc) {
    propio = true;
    try { return CFStore.colAdd('reports', doc); } finally { propio = false; }
  }
  function wrapStore() {
    var S = window.CFStore;
    if (!S || typeof S.colAdd !== 'function') return false;
    if (S.__cfReportQueue) return true;
    var orig = S.colAdd;
    S.colAdd = function (col, doc) {
      var p = orig.apply(this, arguments);
      if (col !== 'reports' || propio) return p;
      return Promise.resolve(p).then(function (r) { if (r && r.ok === false) encolar(doc); return r; },
                                     function (e) { encolar(doc); throw e; });
    };
    S.__cfReportQueue = true;
    return true;
  }

  function escribir(doc) {
    try {
      if (window.CFStore && typeof CFStore.colAdd === 'function') {
        return Promise.resolve(colAddPropio(doc)).then(function (r) {
          if (r && r.ok === false) { encolar(doc); return { ok: false, queued: true, code: r.code }; }
          return r || { ok: true };
        }, function () { encolar(doc); return { ok: false, queued: true }; });
      }
    } catch (e) {}
    encolar(doc);
    return Promise.resolve({ ok: false, queued: true });
  }
  function encolar(doc) {
    try {
      var q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      if (!Array.isArray(q)) q = [];
      var d = {}; for (var k in doc) d[k] = doc[k];
      d.createdAt = (doc.createdAt instanceof Date) ? doc.createdAt.getTime() : (doc.createdAt || Date.now());
      q.push(d);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-200)));
    } catch (e) {}
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
    if (!me) { encolar(doc); return Promise.resolve({ ok: false, queued: true }); }
    return escribir(doc);
  }

  /* sube la cola SOLO con las denuncias de la cuenta que está dentro (las demás se quedan) */
  var flushing = false;
  function flushQueue() {
    if (flushing) return Promise.resolve({ sent: 0 });
    var me = myUid();
    if (!me || !(window.CFStore && typeof CFStore.colAdd === 'function')) return Promise.resolve({ sent: 0 });
    var q;
    try { q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch (e) { q = []; }
    if (!Array.isArray(q) || !q.length) return Promise.resolve({ sent: 0 });
    /* reports.jsx encola con el uid LOCAL de la cuenta (cfUid) si no había nube: también es «mío».
       Ese uid local nunca sale del móvil: al subir, authorUid es SIEMPRE el uid de nube. */
    /* REVISOR: window.cfUid NO existe en la app (posts.js lo deja dentro de su función): el uid LOCAL de esta cuenta
       es CFNS.uid(); la cola vive en el espacio de ESTA cuenta (parche CFNS), así que lo que lleva su uid local es suyo */
    var local = null;
    try { local = typeof window.cfUid === 'function' ? cfUid() : (window.CFNS && typeof CFNS.uid === 'function' ? CFNS.uid() : null); } catch (e) {}
    if (local === 'anon') local = null;
    /* REVISOR: sesión de nube de OTRA persona que la cuenta de dentro (huérfana, antes de que SEC22 la cierre) → nada */
    if (otraPersona()) return Promise.resolve({ sent: 0 });
    var mias = [], otras = [];
    q.forEach(function (d) { (d && (d.authorUid === me || (local && d.authorUid === local) || !d.authorUid) ? mias : otras).push(d); });
    if (!mias.length) return Promise.resolve({ sent: 0 });
    flushing = true;
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(otras)); } catch (e) {}
    var sent = 0, fallan = 0;
    function devolver(d) {   /* REVISOR: la que falla vuelve a la cola EN EL ACTO (la app puede cerrarse antes del final) */
      fallan++;
      try {
        var ahora = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
        localStorage.setItem(QUEUE_KEY, JSON.stringify((Array.isArray(ahora) ? ahora : []).concat([d]).slice(-200)));
      } catch (e) {}
    }
    /* REVISOR: TODAS a la vez, no en fila: sin red la 1.ª no contesta nunca y las demás no llegaban ni a la cola del SDK */
    return Promise.all(mias.map(function (d) {
      return (function () {
        var doc = {
          authorUid: me,
          targetType: String(d.targetType || ''),
          targetId: String(d.targetId == null ? '' : d.targetId).slice(0, 200),
          reason: String(d.reason || '').slice(0, 120),
          details: String(d.details || '').slice(0, 2000),
          createdAt: new Date(typeof d.createdAt === 'number' ? d.createdAt : Date.now())
        };
        if (!doc.targetType || !doc.targetId) return null;
        return Promise.resolve(colAddPropio(doc)).then(function (r) {
          if (r && r.ok === false) devolver(d); else sent++;
        }, function () { devolver(d); });
      })();
    })).then(function () {
      flushing = false;
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

  window.CFModeration = { version: 'apple1-20261107', notifyBlock: notifyBlock, flushQueue: flushQueue, _contexto: contexto };

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
