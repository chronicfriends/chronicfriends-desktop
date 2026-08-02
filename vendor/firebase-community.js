/* ===== Firebase · Comunidad en red — POSTS (Fase 3, capa 2) ============
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design. Lleva el FEED de la comunidad a la nube (Firestore) para que los
   posts se vean entre dispositivos/usuarios, SIN reescribir la UI.

   El feed vive en el store en memoria CFPosts (userPosts, addPost, emit),
   declarado en build/posts.js como `const CFPosts` pero expuesto en window vía
   Object.assign(window,{CFPosts,...}); se accede por window.CFPosts / bareword.

   IDENTIDAD (importante): los posts se autoran con el uid LOCAL de la app
   (CFNS.uid()), que NO es el uid de Firebase. Por eso NO se decide "mío" por
   uid: se marca cada post BAJADO de la nube con `_remote:true` y se considera
   propio TODO lo que NO lleve esa marca (todo lo del store del usuario). Así:
     • nunca se pierde un post local (la fusión jamás los descarta),
     • no se re-suben como propios los posts de otros.
   En la nube, la identidad SÍ es el uid de Firebase: el doc lleva authorUid =
   uid de Firebase (lo exigen las reglas) y el filtro de "remotos" compara
   authorUid con el uid de Firebase.

   • PUSH: CFPosts.addPost envuelto → sube los posts propios (no _remote) a
     community_posts/{firebaseUid__id}.
   • PULL: escucha community_posts → inyecta los posts de otros (marcados
     _remote) en CFPosts.userPosts (fusión + dedupe por id) y emit().

   Alcance: posts + likes + comentarios. Chats/bloqueos = capas siguientes.
   ===================================================================== */
(function () {
  'use strict';

  var POSTS_COL = 'community_posts';
  /* FB3 (coste Blaze): el feed NO se suscribe a la colección entera. Bajamos
     solo los N posts más recientes por `ts` (los posts propios son locales y se
     conservan siempre en la fusión). Así el coste de lecturas por sesión queda
     acotado a ~FEED_LIMIT en vez de crecer con el total de posts de la app. */
  var FEED_LIMIT = 150;
  /* FB3b (coste Blaze): el nº de likes de cada post se DENORMALIZA en el propio
     doc del post (campo numérico `likes`, mantenido con FieldValue.increment en un
     batch atómico). Ese contador baja GRATIS con el post en el listener del feed,
     así que YA NO se escucha el grupo global de likes (que costaba O(likes totales
     de la app)). Solo se escuchan MIS likes (where uid==yo) para saber qué
     corazones pintar llenos → coste O(mis likes), diminuto. LIKES_LIMIT queda como
     tope de seguridad de esa consulta acotada a mí. */
  var LIKES_LIMIT = 500;

  function CF() { return window.CFFirebase; }
  function ST() { return window.CFStore; }
  function POSTS() {
    try { if (typeof CFPosts !== 'undefined' && CFPosts) return CFPosts; } catch (e) {}
    try { return window.CFPosts || null; } catch (e) { return null; }
  }
  function usable() { return !!(ST() && ST().available && CF() && CF().available); }
  function uid() { try { var u = CF().currentUser(); return u && u.uid || null; } catch (e) { return null; } }       /* uid de Firebase (nube) */
  function localUid() { try { return (window.CFNS && CFNS.uid && CFNS.uid()) || null; } catch (e) { return null; } } /* uid LOCAL (el que usan posts/likes) */
  function verified() { try { var u = CF().currentUser(); return !!(u && u.emailVerified); } catch (e) { return false; } }
  function active() { return usable() && !!uid() && verified(); }
  function now() { try { return (window.CFClock && CFClock.now && CFClock.now()) || Date.now(); } catch (e) { return Date.now(); } }

  /* propio y sincronizable = post del store, NO remoto y NO un post de DEMO
     (los seeds `seed…` son locales de cada dispositivo; no se suben a la nube). */
  /* 22 jul: un post solo es «mío» si su author (uid local CFNS 'pat:<email>')
     es el de la cuenta ACTIVA — antes cualquier cuenta del dispositivo re-subía
     a la nube los posts locales de las demás (duplicados + resucitar moderados) */
  function isOwn(p) {
    if (!(p && p.id && !p._remote && String(p.id).indexOf('seed') !== 0)) return false;
    try { return !!(p.author && window.CFNS && p.author === CFNS.uid()); } catch (e) { return false; }
  }
  function docIdFor(id) { return uid() + '__' + id; }

  /* Campos publicables de un post en la nube (lista blanca = contrato
     validPostData de firestore.rules, SIN `author`). El `author` local es
     'pat:<email>' / 'doc:<email>' (lleva el email dentro) y NUNCA debe salir del
     dispositivo: la identidad en la nube es authorUid (uid de Firebase, anónimo).
     Mismo saneado explícito que pushComment — nada de Object.assign(p) que
     arrastraría `author` y cualquier campo local. */
  var POST_PUBLIC_KEYS = ['id', 'title', 'body', 'category', 'likes', 'comments',
    'name', 'role', 'time', 'initials', 'condTag', 'deleted', 'editedAt'];

  /* ---- PUSH: sube un post propio a la nube ----------------------------- */
  function pushPost(p, isRetry) {
    if (!active() || !isOwn(p)) return;
    var data = { authorUid: uid(), ts: p.ts || now(), _deleted: !!p.deleted };
    POST_PUBLIC_KEYS.forEach(function (k) { if (p[k] !== undefined) data[k] = p[k]; });
    ST().colSet(POSTS_COL, docIdFor(p.id), data).then(function (r) {
      if (r && r.ok) return;
      if (!isRetry && r && String(r.code).indexOf('permission-denied') >= 0) {
        CF().refreshToken().then(function () { pushPost(p, true); });
      }
    });
  }
  function pushAllOwn() {
    var P = POSTS(); if (!P) return;
    try { (P.userPosts || []).forEach(function (p) { if (isOwn(p)) pushPost(p); }); } catch (e) {}
  }

  /* un doc de la nube → post local marcado como remoto (guarda su id de nube) */
  function toPost(d) {
    var p = Object.assign({}, d);
    p._cid = d._id;                 /* id del doc en community_posts (para likes/comentarios) */
    delete p._id; delete p._deleted; delete p.authorUid;
    /* FB3b: el conteo de likes NO se lleva en el post, sino en CFPosts.likes[id]
       (recompute lo rellena desde el contador denormalizado). Se pone a 0 aquí
       para que likesFor = post.likes(0) + likes[id].length no doble-cuente. */
    p.likes = 0;
    p._remote = true;
    return p;
  }

  /* id de nube (community_posts/{cid}) de un post local, buscándolo por su id */
  function cidById(localId) {
    var P = POSTS(); if (!P) return null;
    var list = P.userPosts || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id === localId) {
        if (list[i]._cid) return list[i]._cid;
        if (isOwn(list[i])) return uid() + '__' + localId;   /* propio → cid = miUidFirebase__id */
        return null;
      }
    }
    return null;
  }

  /* ---- PULL: fusiona los posts remotos en el feed (SIN perder los locales) */
  var colUnsub = null;
  function startListen() {
    if (colUnsub) return;
    colUnsub = ST().onCol(POSTS_COL, function (docs) {
      var P = POSTS(); if (!P) return;
      var me = uid();
      var own = (P.userPosts || []).filter(function (p) { return p && !p._remote; });   /* TODO lo local se conserva */
      /* SL9: hidden===true = retirado por moderación → no se pinta.
         22 jul: se incluyen TAMBIÉN los docs propios (authorUid === me): si el
         local está vacío (otro dispositivo, o tras la migración por cuentas)
         los posts propios se recuperan de la nube; el dedupe por id de abajo
         conserva la copia local cuando existe. */
      var remote = docs.filter(function (d) { return !d._deleted && d.hidden !== true; }).map(toPost);
      var seen = {}, merged = [];
      own.concat(remote).forEach(function (p) { if (p && p.id && !seen[p.id]) { seen[p.id] = 1; merged.push(p); } });
      merged.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
      P.userPosts = merged;
      /* FB3b: el nº de likes de cada post viene GRATIS en su doc (campo `likes`).
         Se refresca el contador denormalizado de TODOS los docs (propios y ajenos)
         y se recompone CFPosts.likes sin necesidad del listener global de likes. */
      var cc = {};
      docs.forEach(function (d) {
        if (d && d.id && !d._deleted) cc[d.id] = (typeof d.likes === 'number' && d.likes > 0) ? d.likes : 0;
      });
      cloudCount = cc;
      recomputeLikes();   /* recomputeLikes hace emit() */
    }, function (q) {
      /* orderBy+limit: solo los FEED_LIMIT posts más recientes → acota las
         lecturas de Blaze a ~FEED_LIMIT por sesión en vez de la colección entera.
         orderBy('ts') sobre un único campo no exige índice compuesto; pushPost
         siempre escribe `ts`, así que ningún post queda fuera del orden. Si el SDK
         rechazara la query, onCol degrada devolviendo un unsub inerte y el feed
         local sigue intacto. */
      try { return q.orderBy('ts', 'desc').limit(FEED_LIMIT); } catch (e) { return q; }
    });
  }
  function stopListen() { if (colUnsub) { try { colUnsub(); } catch (e) {} colUnsub = null; } }

  /* ---- LIKES (FB3b · denormalizado) -----------------------------------
     Local: CFPosts.likes = { postId: [entradas,...] }; likesFor = post.likes(0) +
     likes[id].length; isLiked(id) = likes[id] incluye MI uid local.
     Nube:
       • community_posts/{cid}.likes  = contador numérico (FieldValue.increment).
       • community_posts/{cid}/likes/{miUid} = { localId, postCid, at, uid } — un
         doc por persona; el campo `uid` permite escuchar SOLO MIS likes.
     El total sale del contador (gratis con el post); solo escucho MIS likes para
     saber qué corazones pintar llenos. recomputeLikes() reconstruye CFPosts.likes
     a partir de 3 fuentes SIN doble-contar ni parpadear:
       cloudCount[id]  = contador denormalizado del post (incluye mi like si está)
       myCloudLikes[id]= mi like existe en la nube (verdad confirmada)
       myLikePending[id]= intención optimista tras un toque, hasta que la nube la
                          confirme (evita el parpadeo del corazón). */
  var cloudCount = {};
  var myCloudLikes = {};
  var myLikePending = {};

  function iLiked(id) { return (id in myLikePending) ? myLikePending[id] : !!myCloudLikes[id]; }

  function recomputeLikes() {
    var P = POSTS(); if (!P) return;
    var lu = localUid();
    var likes = Object.assign({}, P.likes || {});   /* conserva ids locales/seed no gestionados */
    var ids = {};
    Object.keys(cloudCount).forEach(function (k) { ids[k] = 1; });
    Object.keys(myCloudLikes).forEach(function (k) { ids[k] = 1; });
    Object.keys(myLikePending).forEach(function (k) { ids[k] = 1; });
    Object.keys(ids).forEach(function (id) {
      var others = (cloudCount[id] || 0) - (myCloudLikes[id] ? 1 : 0);   /* likes de los DEMÁS */
      if (others < 0) others = 0;
      var arr = [];
      for (var i = 0; i < others; i++) arr.push('⁣o' + i);   /* placeholder opaco: solo cuenta */
      if (iLiked(id)) arr.push(lu);                                /* mi corazón, sin doble-contar */
      likes[id] = arr;
    });
    P.likes = likes;
    try { P.emit(); } catch (e) {}
  }

  /* sube/quita MI like + ajusta el contador en un batch atómico (delta ±1). */
  function pushLike(localId, liked, isRetry) {
    if (!active()) return;
    var cid = cidById(localId); if (!cid) return;
    var myUid = uid();
    var postPath = POSTS_COL + '/' + cid;
    var likePath = postPath + '/likes/' + myUid;
    var delta = liked ? 1 : -1;
    var data = { localId: localId, postCid: cid, at: now(), uid: myUid };   /* uid → listener where uid==yo */
    ST().likeBatch(postPath, likePath, data, delta).then(function (r) {
      if (r && r.ok) return;
      if (!isRetry && r && String(r.code).indexOf('permission-denied') >= 0) {
        CF().refreshToken().then(function () { pushLike(localId, liked, true); });
        return;
      }
      /* fallo duro (no transitorio reintentable — increment no se reintenta): la
         escritura no persistió, así que se revierte la intención optimista para
         no quedar descuadrado respecto a la nube. */
      try { delete myLikePending[localId]; recomputeLikes(); } catch (e) {}
    });
  }

  var likesUnsub = null;
  function startListenLikes() {
    if (likesUnsub) return;
    var me = uid();
    likesUnsub = ST().onGroup('likes', function (docs) {
      var mc = {};
      docs.forEach(function (d) { if (d && d.localId) mc[d.localId] = true; });
      myCloudLikes = mc;
      /* la nube ya refleja mi estado → limpia los pendientes que coincidan (fin
         del optimismo, sin parpadeo: el pendiente aguanta hasta que la nube iguala). */
      Object.keys(myLikePending).forEach(function (id) {
        if (!!myCloudLikes[id] === myLikePending[id]) delete myLikePending[id];
      });
      recomputeLikes();
    }, function (g) {
      /* FB3b: SOLO mis likes (where uid==yo) → coste O(mis likes), no O(todos).
         Requiere índice de campo único con ámbito COLLECTION_GROUP en `likes.uid`
         (consola). Si Firestore rechazara la query, onGroup deja rastro en consola
         y degrada; el conteo total seguiría saliendo del contador denormalizado. */
      try { return g.where('uid', '==', me).limit(LIKES_LIMIT); } catch (e) { return g; }
    });
  }
  function stopListenLikes() { if (likesUnsub) { try { likesUnsub(); } catch (e) {} likesUnsub = null; } }

  /* ---- COMENTARIOS (Fase 3, capa siguiente) ----------------------------
     Local: CFPosts.comments = { postLocalId: [ {name,text,ts,author,role} ] }
            (posts.js/addComment). "Mío" se decide por uid LOCAL (isMine: author==cfUid).
     Nube:  community_posts/{cid}/comments/{miUidFirebase__ts}
            = { authorUid, authorName?, text, createdAt }  ← contrato validCommentData
            (SANEADO: nada de name/ts/author/role crudos, que hasOnly rechazaría).
     PUSH:  envuelve addComment → sube MI comentario al post en la nube.
     PULL:  onGroup('comments') ACOTADO (orderBy createdAt desc, limit) → enruta cada
            comentario a su post local por el cid del PADRE (d._pid, derivado del path)
            y FUSIONA sin perder los locales (mismo principio que el feed de posts).
     BORRADO: envuelve deleteComment → borra el doc en la nube (reglas: delete al autor).
            El contrato NO admite `_deleted` en comentarios, por eso se borra de verdad. */
  var COMMENTS_LIMIT = 300;
  var commentsUnsub = null;

  function commentDocId(ts) { return uid() + '__' + ts; }
  /* 22 jul: mismo criterio de autor que isOwn — no re-subir comentarios ajenos */
  function isOwnComment(c) {
    if (!(c && !c._remote && c.ts)) return false;
    try { return !!(c.author && window.CFNS && c.author === CFNS.uid()); } catch (e) { return false; }
  }

  /* mapa cid-de-nube → id-de-post-local (recomputado desde el store) */
  function cidToLocalMap() {
    var P = POSTS(); var m = {}; if (!P) return m;
    var me = uid();
    (P.userPosts || []).forEach(function (p) {
      if (!p || !p.id) return;
      var cid = p._cid || (isOwn(p) ? me + '__' + p.id : null);
      if (cid) m[cid] = p.id;
    });
    return m;
  }

  /* sanea un comentario local al contrato validCommentData (SIN campos extra) */
  function commentDoc(c) {
    var d = { authorUid: uid(), text: String(c.text || ''), createdAt: c.ts || now() };
    var nm = (c.name != null) ? String(c.name) : '';
    if (nm) d.authorName = nm.slice(0, 80);
    return d;
  }

  function pushComment(postLocalId, c, isRetry) {
    if (!active() || !isOwnComment(c)) return;
    var cid = cidById(postLocalId); if (!cid) return;                 /* el post debe existir en la nube */
    var text = String(c.text || ''); if (!text || text.length > 2000) return;  /* fuera de contrato → no subir */
    var path = POSTS_COL + '/' + cid + '/comments';
    ST().colSet(path, commentDocId(c.ts), commentDoc(c)).then(function (r) {
      if (r && r.ok) return;
      if (!isRetry && r && String(r.code).indexOf('permission-denied') >= 0) {
        CF().refreshToken().then(function () { pushComment(postLocalId, c, true); });
      }
    });
  }

  function pushAllOwnComments() {
    var P = POSTS(); if (!P) return;
    try {
      var cm = P.comments || {};
      Object.keys(cm).forEach(function (pid) {
        (cm[pid] || []).forEach(function (c) { if (isOwnComment(c) && !c.deleted) pushComment(pid, c); });
      });
    } catch (e) {}
  }

  /* doc de la nube → comentario local marcado remoto (author = uid Firebase →
     nombre público en vivo; isMine usa uid LOCAL, así que remoto ⇒ isMine=false) */
  function toComment(d) {
    return {
      name: d.authorName || '', text: d.text || '', ts: d.createdAt || 0,
      author: d.authorUid || null, _remote: true, _cid: d._id
    };
  }

  function startListenComments() {
    if (commentsUnsub) return;
    var me = uid();
    commentsUnsub = ST().onGroup('comments', function (docs) {
      var P = POSTS(); if (!P) return;
      var map = cidToLocalMap();
      var byPost = {};
      docs.forEach(function (d) {
        if (!d || d.authorUid === me || d._deleted || d.hidden === true) return;   /* los míos ya están en local · SL9: hidden = moderado */
        var pid = map[d._pid]; if (!pid) return;              /* post no cargado → se ignora */
        var bucket = byPost[pid] || (byPost[pid] = { seen: {}, arr: [] });
        var key = d._cid || (d.authorUid + ':' + d.createdAt);
        if (bucket.seen[key]) return; bucket.seen[key] = 1;   /* dedupe remotos por id de nube */
        bucket.arr.push(toComment(d));
      });
      /* fusión: conserva TODOS los comentarios locales (no _remote) y añade los remotos */
      var merged = {};
      Object.keys(P.comments || {}).forEach(function (pid) {
        merged[pid] = (P.comments[pid] || []).filter(function (c) { return !c._remote; });
      });
      Object.keys(byPost).forEach(function (pid) {
        var arr = (merged[pid] || []).slice();
        var seenTs = {};
        arr.forEach(function (c) { if (c && c.ts != null) seenTs['t' + c.ts] = 1; });   /* no doblar mi propio comentario */
        byPost[pid].arr.forEach(function (c) { if (!seenTs['t' + c.ts]) arr.push(c); });
        arr.sort(function (a, b) { return (a.ts || 0) - (b.ts || 0); });   /* comentarios: antiguo → nuevo */
        merged[pid] = arr;
      });
      P.comments = merged;
      try { P.emit(); } catch (e) {}
    }, function (g) {
      /* FB3 (coste Blaze): solo los COMMENTS_LIMIT comentarios más recientes de todo
         el grupo. orderBy('createdAt') sobre un único campo no exige índice compuesto;
         commentDoc siempre escribe createdAt. Si el SDK rechazara la query, onGroup
         deja rastro en consola y degrada al grupo sin filtro. */
      try { return g.orderBy('createdAt', 'desc').limit(COMMENTS_LIMIT); } catch (e) { return g; }
    });
  }
  function stopListenComments() { if (commentsUnsub) { try { commentsUnsub(); } catch (e) {} commentsUnsub = null; } }

  /* ---- engancha el store cuando exista y la sesión esté activa --------- */
  var hooked = false;
  function hookStore() {
    var P = POSTS();
    if (hooked || !P || typeof P.addPost !== 'function' || !active()) return;
    var orig = P.addPost.bind(P);
    P.addPost = function (arg) { var p = orig(arg); try { if (p) pushPost(p); } catch (e) {} return p; };
    /* like: envuelve toggleLike. origTL cambia el estado local; aquí, SOLO para
       posts en la nube, se fija la intención optimista (sin parpadeo) y se sube el
       batch (like ±1 + contador). Los posts locales/seed se dejan como origTL. */
    if (typeof P.toggleLike === 'function') {
      var origTL = P.toggleLike.bind(P);
      P.toggleLike = function (id) {
        var r = origTL(id);
        try {
          if (cidById(id)) {                                   /* post existe en la nube */
            var nowLiked = ((P.likes || {})[id] || []).indexOf(localUid()) !== -1;
            myLikePending[id] = nowLiked;                      /* override optimista */
            pushLike(id, nowLiked);                            /* batch a la nube */
            recomputeLikes();                                  /* pinta ya el estado coherente */
          }
        } catch (e) {}
        return r;
      };
    }
    /* comentario: envuelve addComment (sube el mío) y deleteComment (lo borra
       de la nube). Los comentarios en posts que no están en la nube se dejan
       locales — pushComment sale sin hacer nada si no hay cid. */
    if (typeof P.addComment === 'function') {
      var origAC = P.addComment.bind(P);
      P.addComment = function (postId, text) {
        var c = origAC(postId, text);
        try { if (c) pushComment(postId, c); } catch (e) {}
        return c;
      };
    }
    if (typeof P.deleteComment === 'function') {
      var origDC = P.deleteComment.bind(P);
      P.deleteComment = function (postId, ts) {
        var okDel = origDC(postId, ts);
        try {
          if (okDel) {
            var cid = cidById(postId);
            if (cid) ST().del(POSTS_COL + '/' + cid + '/comments/' + commentDocId(ts));
          }
        } catch (e) {}
        return okDel;
      };
    }
    hooked = true;
    try { CF().refreshToken(); } catch (e) {}
    (P.userPosts || []).forEach(function (p) { if (isOwn(p)) pushPost(p); });
    startListen();
    startListenLikes();
    pushAllOwnComments();
    startListenComments();
    try { console.log('[CFCommunity] posts + likes + comentarios en red ACTIVOS'); } catch (e) {}
  }

  var poll = null;
  function ensure() {
    if (hooked) { if (poll) { clearInterval(poll); poll = null; } return; }
    if (active() && POSTS()) { hookStore(); if (hooked && poll) { clearInterval(poll); poll = null; } }
  }
  try {
    poll = setInterval(ensure, 1200);
    if (CF() && CF().onState) {
      CF().onState(function (u) {
        if (u && u.emailVerified) { if (!poll && !hooked) poll = setInterval(ensure, 1200); ensure(); }
        else { stopListen(); stopListenLikes(); stopListenComments(); cloudCount = {}; myCloudLikes = {}; myLikePending = {}; }
      });
    }
  } catch (e) {}

  window.CFCommunity = {
    pushAllOwn: pushAllOwn, pushAllOwnComments: pushAllOwnComments,
    _startListen: startListen, _startListenComments: startListenComments,
    _active: active, _hooked: function () { return hooked; }, _posts: POSTS
  };
  try { console.log('[CFCommunity] módulo de posts en red cargado'); } catch (e) {}
})();
