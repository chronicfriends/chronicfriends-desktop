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
  /* MURO1 (18 oct 2026): FUERA `likes` y `comments`. El autor vuelve a subir sus posts
     en cada arranque (pushAllOwn) y su copia local lleva likes:0 → el merge dejaba a 0
     el contador de la nube y se perdían los «me gusta» de los demás (descuadre del 14 oct,
     cal [261]). El contador lo llevan SOLO los batches de like (onlyLikeCountDelta, que
     parte de 0 si el campo no existe). DENTRO los campos del muro nuevo: `image` (la
     foto ya subida: {url,w,h,path}), `lang` (idioma del post) y `cond` («¿Dónde?»). */
  var POST_PUBLIC_KEYS = ['id', 'title', 'body', 'category',
    'name', 'role', 'time', 'initials', 'condTag', 'deleted', 'editedAt', 'image', 'lang', 'cond'];

  /* ---- PUSH: sube un post propio a la nube ----------------------------- */
  function pushPost(p, isRetry) {
    if (!active() || !isOwn(p)) return;
    var data, opts;
    if (p.deleted) {
      /* A6 (auditoría del 5 nov 2026): un post BORRADO subía ENTERO con la marca de borrado
         (título, texto, nombre, foto…) y, como colSet MEZCLA, aunque se quitaran campos se
         quedaban los de antes en la nube: cada móvil verificado lo descargaba y se podía leer.
         Ahora la lápida es MÍNIMA y SUSTITUYE al documento entero (overwrite): solo quién, cuál,
         cuándo y «borrado». Lo mismo cuando el arranque vuelve a subir los posts propios.
         Las reglas (validPostData) solo exigen authorUid. Banco: tools/tests/post-borrado-harness.mjs */
      data = { authorUid: uid(), id: p.id, ts: p.ts || now(), _deleted: true, deleted: true };
      opts = { overwrite: true };
    } else {
      data = { authorUid: uid(), ts: p.ts || now(), _deleted: false };
      POST_PUBLIC_KEYS.forEach(function (k) { if (p[k] !== undefined) data[k] = p[k]; });
    }
    ST().colSet(POSTS_COL, docIdFor(p.id), data, opts).then(function (r) {
      if (r && r.ok) return;
      if (!(r && String(r.code).indexOf('permission-denied') >= 0)) return;
      if (!isRetry) { CF().refreshToken().then(function () { pushPost(p, true); }); return; }
      /* A6 bis (revisión del 5 nov 2026): si el post estaba OCULTO por moderación, las reglas no dejan
         al autor tocarlo (notHidden() en el update) y la lápida se rechaza también tras refrescar el
         token: el texto se quedaba en la nube. El autor SÍ puede borrar su documento (allow delete),
         así que se borra de verdad. En el siguiente arranque la lápida mínima ya entra como alta nueva. */
      if (p.deleted) ST().del(POSTS_COL + '/' + docIdFor(p.id));
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
    /* CHAT1 · el autor SÍ viaja: `author` pasa a ser el uid de NUBE del que
       escribió (nunca su 'pat:<email>', que no sale del móvil). Es el mismo
       criterio que ya usaban los comentarios remotos desde julio (ver toComment
       más abajo) y es lo que permite tocar al autor para pedirle amistad
       (CHAT3) y abrir su mini-perfil. isMine() compara contra el uid LOCAL, así
       que un post remoto sigue sin ser «mío» y nunca se re-sube. */
    p.author = d.authorUid || null;
    p._auid = d.authorUid || null;  /* alias explícito: identidad pública del autor */
    delete p._id; delete p._deleted; delete p.authorUid;
    /* FB3b: el conteo de likes NO se lleva en el post, sino en CFPosts.likes[id]
       (recompute lo rellena desde el contador denormalizado). Se pone a 0 aquí
       para que likesFor = post.likes(0) + likes[id].length no doble-cuente. */
    p.likes = 0;
    p._remote = true;
    p._col = POSTS_COL;            /* MURO1: likes y comentarios se escriben en SU colección */
    return p;
  }
  /* MURO1 · PUB1: una publicación de la cuenta oficial (community_official) */
  function toOfficialPost(d) {
    var p = toPost(d);
    p._col = OFFICIAL_COL;
    p._official = true;
    return p;
  }
  /* colección en la nube de un post local (community_posts salvo las oficiales) */
  function colOf(localId) {
    var P = POSTS(); var list = (P && P.userPosts) || [];
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === localId) return list[i]._col || POSTS_COL;
    return POSTS_COL;
  }
  function findPost(localId) {
    var P = POSTS(); var list = (P && P.userPosts) || [];
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === localId) return list[i];
    return null;
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
      postDocs = docs || [];
      mergeFeed();
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
  /* MURO1 · PUB1: UNA sola fusión para los dos orígenes (posts de las personas +
     publicaciones oficiales). Lo de antes, sin cambios, más las oficiales. */
  function mergeFeed() {
      var P = POSTS(); if (!P) return;
      var docs = postDocs.concat(officialDocs);
      var own = (P.userPosts || []).filter(function (p) { return p && !p._remote; });   /* TODO lo local se conserva */
      /* SL9: hidden===true = retirado por moderación → no se pinta.
         22 jul: se incluyen TAMBIÉN los docs propios (authorUid === me): si el
         local está vacío (otro dispositivo, o tras la migración por cuentas)
         los posts propios se recuperan de la nube; el dedupe por id de abajo
         conserva la copia local cuando existe. */
      /* 🔴 M6 bis (7 nov 2026; auditoría del 5 nov) — CADA POST, SU PROPIO ID EN EL MURO.
         El dedupe iba SOLO por el `id` que pone cada autor: un post de una persona con el id de una
         publicación oficial, o el de otro post, la ESCONDÍA del muro de todos; y si copiaba el id de
         un post MÍO, el store (que busca por id) podía tocar el suyo al pedir borrar el mío. Las reglas
         del 5 nov ya atan el doc a <uid>__<id> y prohíben 'o_' a las personas; aquí, en el móvil:
           · conservan su id los posts de AQUÍ, las oficiales y mis copias de la nube (estas se juntan
             con la local, como siempre);
           · entre los posts AJENOS, SIN GANADOR: si un id se repite, o choca con uno de los de arriba, o
             tiene la forma del documento de otro post, TODOS llevan el id de su DOCUMENTO (<uid>__<id>,
             único). Antes ganaba «el más antiguo», según un `ts` que pone el propio autor: con dos
             documentos (uno con el ts atrasado) se seguía escondiendo el post de otra persona y se
             quedaba sus comentarios (revisión independiente del 7 nov, b1/b2,
             auditorias/20261107-revision-m6bis/INFORME.md, propuesta P1-P6);
           · un post de persona con id 'o_…' (de antes de las reglas) no se pinta, ni uno con `deleted`;
           · mis comentarios guardan el DOCUMENTO de su post (_pcid/_pcol) y van siempre con él: si ese
             post no está en el muro, se aparcan, nunca debajo de otro; mis «me gusta» se casan por postCid.
         2.ª revisión (INFORME-2.md, propuesta-2): mientras no llegue la 1.ª foto de comentarios se quedan los
         de otros guardados en el móvil (P5e); lo que denuncié sigue silenciado aunque su post cambie de id (P7,
         envoltorio de CFReports.isMuted); un id «~…» lleva el de su documento (P2b); mis comentarios VIEJOS (sin
         _pcid) se atan a su documento según la nube y nunca van a un post más de 1 día más nuevo que ellos (P6d);
         y solo se atan a posts de la nube (P6f).
         Sin ids repetidos (lo normal), nada cambia respecto a antes (b4: 1.400 pasos iguales). Con uno
         repetido, el post de la víctima cambia de id: un guardado viejo queda huérfano, pero ya no apunta
         al del otro. El borrador del 5 nov dejaba dos posts con el MISMO id en el store y no se podía
         borrar el propio (auditorias/20261105-revision-vendor/m6-borrar.mjs). Banco: tools/tests/muro-dedupe-harness.mjs */
      var me = uid();
      var mineDoc = function (d) { return !!(me && d.authorUid && d.authorUid === me); };
      var fuera = function (d) { return !d || d._deleted || d.deleted === true || d.hidden === true; };
      var liveP = postDocs.filter(function (d) {
        return !fuera(d) && !(!mineDoc(d) && String(d.id || '').indexOf('o_') === 0);
      });
      var liveO = officialDocs.filter(function (d) { return !fuera(d); });
      var taken = {}, feedId = {};
      own.forEach(function (p) { if (p && p.id) taken[p.id] = 1; });
      liveO.forEach(function (d) { if (d.id) taken[d.id] = 1; });
      liveP.forEach(function (d) { if (d.id && mineDoc(d)) taken[d.id] = 1; });
      var docIds = {}, veces = {}, own_ = Object.prototype.hasOwnProperty;
      postDocs.forEach(function (d) { if (d && d._id) docIds[d._id] = 1; });
      var otros = liveP.filter(function (d) { return d.id && !mineDoc(d); });
      otros.forEach(function (d) { veces[d.id] = (veces[d.id] || 0) + 1; });
      otros.forEach(function (d) {
        var solo = veces[d.id] === 1 && !own_.call(taken, d.id) && !own_.call(docIds, d.id)
          && String(d.id).charAt(0) !== '~';           /* P2b: '~…' es la clave de mis comentarios aparcados (P5) */
        feedId[d._id] = solo ? d.id : d._id;          /* repetido o con forma de documento: el de su documento */
      });
      var alias = {};
      var remote = liveP.map(function (d) {
        var p = toPost(d); if (feedId[d._id]) p.id = feedId[d._id];
        if (!mineDoc(d)) alias[p.id] = [d.id, d._id];  /* P7: su id original y su documento (denuncias) */
        return p;
      })
        .concat(liveO.map(toOfficialPost));
      var seen = {}, merged = [];
      own.concat(remote).forEach(function (p) { if (p && p.id && !seen[p.id]) { seen[p.id] = 1; merged.push(p); } });
      merged.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
      P.userPosts = merged;
      /* FB3b: el nº de likes de cada post viene GRATIS en su doc (campo `likes`).
         Se refresca el contador denormalizado de TODOS los docs (propios y ajenos)
         y se recompone CFPosts.likes sin necesidad del listener global de likes.
         M6 bis: con la MISMA clave que el post lleva en el muro. */
      var cc = {};
      liveP.concat(liveO).forEach(function (d) {
        if (d && d.id && !d._deleted) cc[feedId[d._id] || d.id] = (typeof d.likes === 'number' && d.likes > 0) ? d.likes : 0;
      });
      cloudCount = cc;
      muteAlias = alias; wrapReports();
      rebuildMyLikes();
      rebuildComments();
      recomputeLikes();   /* recomputeLikes hace emit() */
  }
  function stopListen() { if (colUnsub) { try { colUnsub(); } catch (e) {} colUnsub = null; } postDocs = []; }

  /* ---- MURO1 · PUB1 (18 oct 2026): LAS PUBLICACIONES DE «CHRONIC FRIENDS» ----
     Viven en community_official/{serie__idioma} y solo las escribe el servidor (Admin,
     desde la Pi). Se piden SOLO en los idiomas que se ven —el de la app y los que haya
     elegido el filtro del muro o de la Sala (cf_feed_filter_v1)—: así las 16 versiones
     de cada publicación diaria no llenan la ventana de los posts de las personas.
     Índice compuesto (lang ASC, ts DESC) en firestore.indexes.json. Se usa el SDK
     directo (no CFStore.onCol) para que un índice que falte deje AVISO en consola en
     vez de un muro vacío y mudo. */
  var OFFICIAL_COL = 'community_official';
  var OFFICIAL_LIMIT = 120;
  var postDocs = [], officialDocs = [];
  var officialUnsub = null, officialLangs = '';
  var CF_LANG_CODES = ['en', 'es', 'ca', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'hi', 'id', 'tr', 'ru', 'vi', 'ar'];
  function wantedLangs() {
    var L = {};
    try { var a = (window.I18n && I18n.lang) || 'en'; L[CF_LANG_CODES.indexOf(a) !== -1 ? a : 'en'] = 1; } catch (e) { L.en = 1; }
    try {
      var f = JSON.parse(localStorage.getItem('cf_feed_filter_v1') || 'null');
      ['community', 'room'].forEach(function (k) {
        var v = f && f[k] && f[k].lang;
        if (v && v !== 'all' && CF_LANG_CODES.indexOf(v) !== -1) L[v] = 1;
      });
    } catch (e) {}
    return Object.keys(L).sort().slice(0, 10);   /* where-in admite 10 valores */
  }
  function startListenOfficial() {
    var want = wantedLangs();
    if (officialUnsub && want.join(',') === officialLangs) return;
    stopListenOfficial();
    officialLangs = want.join(',');
    try {
      var q = window.firebase.firestore().collection(OFFICIAL_COL)
        .where('lang', 'in', want).orderBy('ts', 'desc').limit(OFFICIAL_LIMIT);
      officialUnsub = q.onSnapshot(function (snap) {
        var out = [];
        snap.forEach(function (d) { var o = d.data() || {}; o._id = d.id; out.push(o); });
        officialDocs = out;
        mergeFeed();
      }, function (e) {
        try { console.warn('[CFCommunity] publicaciones oficiales sin leer: ' + ((e && e.code) || e)); } catch (x) {}
      });
    } catch (e) { officialUnsub = null; }
  }
  function stopListenOfficial() {
    if (officialUnsub) { try { officialUnsub(); } catch (e) {} officialUnsub = null; }
    officialLangs = ''; officialDocs = [];
  }

  /* ---- MURO1 · CFOfficial: ¿este uid es la cuenta oficial? ----------------
     La lista sale de system/official.uids, que SOLO escribe el servidor (reglas:
     system → lee quien tenga sesión, nadie escribe). Nunca del name/role del post,
     que los pone el cliente. Sin el doc → nadie es oficial. */
  var officialUids = [], officialDocUnsub = null;
  function startOfficialDoc() {
    if (officialDocUnsub) return;
    officialDocUnsub = ST().onDoc('system/official', function (d) {
      officialUids = (d && Object.prototype.toString.call(d.uids) === '[object Array]') ? d.uids.slice(0, 10) : [];
      try { var P = POSTS(); if (P && P.emit) P.emit(); } catch (e) {}
    });
  }
  function stopOfficialDoc() { if (officialDocUnsub) { try { officialDocUnsub(); } catch (e) {} officialDocUnsub = null; } officialUids = []; }

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
  /* LIKE1 (29 sep 2026): foto de (contador, ¿era mío?) en el momento del toque.
     El batch sube el contador del post ANTES de que mi doc de like llegue por el
     grupo: en ese hueco «contador (ya con mi +1) − mi like (aún no confirmado)»
     sumaba a los demás mi propio like y el corazón contaba DOBLE (Gerhard, 28
     sep: 1 → 2 → 1 → 3…). Mientras haya un toque pendiente se cuenta desde la foto. */
  var likeBase = {};

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
      var others;                                                        /* likes de los DEMÁS */
      if ((id in myLikePending) && likeBase[id]) others = likeBase[id].count - (likeBase[id].mine ? 1 : 0);
      else others = (cloudCount[id] || 0) - (myCloudLikes[id] ? 1 : 0);
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
    var postPath = colOf(localId) + '/' + cid;              /* MURO1: la colección de ESE post */
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
      try { delete myLikePending[localId]; delete likeBase[localId]; recomputeLikes(); } catch (e) {}
    });
  }

  var likesUnsub = null;
  /* M6 bis: mis «me gusta» se casan con su post por el DOCUMENTO del post (postCid), no por el id
     que tenía en el muro al darlo: ese id puede ser otro si aparece un post con el mismo id. Sin
     documento conocido (o sin postCid), por su localId, como antes. */
  var likeDocs = [];
  function rebuildMyLikes() {
    var map = cidToLocalMap(), mc = {};
    likeDocs.forEach(function (d) {
      if (!d) return;
      var lid = d.postCid ? map[d.postCid] : d.localId;
      if (lid) mc[lid] = true;
    });
    myCloudLikes = mc;
  }
  function startListenLikes() {
    if (likesUnsub) return;
    var me = uid();
    likesUnsub = ST().onGroup('likes', function (docs) {
      likeDocs = docs || [];
      rebuildMyLikes();
      /* la nube ya refleja mi estado → limpia los pendientes que coincidan (fin
         del optimismo, sin parpadeo: el pendiente aguanta hasta que la nube iguala). */
      Object.keys(myLikePending).forEach(function (id) {
        if (!!myCloudLikes[id] === myLikePending[id]) { delete myLikePending[id]; delete likeBase[id]; }
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
  function stopListenLikes() { if (likesUnsub) { try { likesUnsub(); } catch (e) {} likesUnsub = null; } likeDocs = []; }

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
    var cid = c._pcid ? (cidToLocalMap()[c._pcid] ? c._pcid : null) : cidById(postLocalId);   /* SU post, y solo si sigue en el muro */
    if (!cid) return;
    if (!c._pcid) { var hp = findPost(postLocalId); if (hp && c.ts + DIA < (hp.ts || 0)) return; }   /* P6d: viejo → nunca a un post más nuevo */
    var text = String(c.text || ''); if (!text || text.length > 2000) return;  /* fuera de contrato → no subir */
    var path = (c._pcol || colOf(postLocalId)) + '/' + cid + '/comments';   /* MURO1: la colección de ESE post */
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

  var commentDocs = [], commentsLoaded = false;
  var DIA = 86400000;
  /* P7 (2.ª revisión del 7 nov) · DENUNCIAS: lo que denuncié (CFReports.muted 'post:<id del muro>') sigue
     silenciado aunque su post cambie de id en el muro (P2): también cuentan su id original y su documento.
     Precio: otro post con ese MISMO id original también queda silenciado para quien denunció. */
  var muteAlias = {};
  function wrapReports() {
    var R = window.CFReports;
    if (!R || typeof R.isMuted !== 'function' || R.__cfAlias) return;
    var orig = R.isMuted;
    var otro = function (type, a, id, cola) {
      return !!(a && ((a[0] && a[0] !== id && orig.call(R, type, a[0] + cola)) || (a[1] && a[1] !== id && orig.call(R, type, a[1] + cola))));
    };
    R.isMuted = function (type, id) {
      if (orig.call(R, type, id)) return true;
      try {
        if (type === 'post') return otro('post', muteAlias[id], id, '');
        if (type === 'comment') { var s = String(id), k = s.lastIndexOf(':'); if (k > 0) return otro('comment', muteAlias[s.slice(0, k)], s.slice(0, k), s.slice(k)); }
      } catch (e) {}
      return false;
    };
    R.__cfAlias = true;
  }
  function startListenComments() {
    if (commentsUnsub) return;
    commentsUnsub = ST().onGroup('comments', function (docs) {
      commentDocs = docs || []; commentsLoaded = true;
      rebuildComments();
      try { var P = POSTS(); if (P) P.emit(); } catch (e) {}
    }, function (g) {
      /* FB3 (coste Blaze): solo los COMMENTS_LIMIT comentarios más recientes de todo
         el grupo. orderBy('createdAt') sobre un único campo no exige índice compuesto;
         commentDoc siempre escribe createdAt. Si el SDK rechazara la query, onGroup
         deja rastro en consola y degrada al grupo sin filtro. */
      try { return g.orderBy('createdAt', 'desc').limit(COMMENTS_LIMIT); } catch (e) { return g; }
    });
  }
  /* M6 bis (P5 de la revisión del 7 nov): los comentarios se recolocan en CADA fusión del muro (no solo
     cuando llega una foto de comentarios), para que sigan a su post aunque su id en el muro cambie */
  function rebuildComments() {
      var P = POSTS(); if (!P) return;
      var me = uid();
      var docs = commentDocs || [];
      var map = cidToLocalMap();
      /* P6d · mis comentarios VIEJOS (sin _pcid): la nube dice su documento (<post>/comments/<miUid>__<ts>) */
      var mioEn = {}, tsDe = {}, cidDe = {};
      docs.forEach(function (d) { if (d && me && d.authorUid === me && d._pid && d._id === me + '__' + d.createdAt) mioEn['t' + d.createdAt] = d._pid; });
      var propio = {};
      (P.userPosts || []).forEach(function (p) { if (p && p.id) { tsDe[p.id] = p.ts || 0; if (isOwn(p)) propio[p.id] = 1; } });
      Object.keys(map).forEach(function (cid) { cidDe[map[cid]] = cid; });
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
        (P.comments[pid] || []).forEach(function (c) {
          if (!c) return;
          if (c._remote) { if (!commentsLoaded) (merged[pid] || (merged[pid] = [])).push(c); return; }   /* P5e */
          if (!c._pcid && isOwnComment(c) && !propio[pid]) {                                               /* P6d */
            var cd = mioEn['t' + c.ts] || (commentsLoaded && cidDe[pid] && !(c.ts + DIA < (tsDe[pid] || 0)) ? cidDe[pid] : null);
            if (cd && !(map[cd] && propio[map[cd]])) { c._pcid = cd; if (map[cd]) c._pcol = colOf(map[cd]); }   /* P6f: a un post propio, no */
          }
          /* el mío va con SU post, lleve el id que lleve; si su post no está en el muro, se aparca (no se pinta debajo de otro) */
          var dest = c._pcid ? (map[c._pcid] || ('~' + c._pcid))
            : (isOwnComment(c) && cidDe[pid] && c.ts + DIA < (tsDe[pid] || 0)) ? ('~' + pid) : pid;   /* P6d: un post MÁS NUEVO no es el suyo */
          (merged[dest] || (merged[dest] = [])).push(c);
        });
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
  }
  function stopListenComments() { if (commentsUnsub) { try { commentsUnsub(); } catch (e) {} commentsUnsub = null; } commentDocs = []; commentsLoaded = false; }

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
            if (!likeBase[id]) likeBase[id] = { count: cloudCount[id] || 0, mine: !!myCloudLikes[id] };   /* LIKE1: foto de antes del toque */
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
        try { if (c) { var pp = findPost(postId); if (pp && pp._cid) { c._pcid = pp._cid; c._pcol = pp._col || POSTS_COL; } pushComment(postId, c); } } catch (e) {}   /* P6f */
        return c;
      };
    }
    if (typeof P.deleteComment === 'function') {
      var origDC = P.deleteComment.bind(P);
      P.deleteComment = function (postId, ts) {
        var arr0 = ((P.comments || {})[postId] || []), c0 = null;
        for (var i0 = 0; i0 < arr0.length; i0++) if (arr0[i0] && arr0[i0].ts === ts) { c0 = arr0[i0]; break; }
        var okDel = origDC(postId, ts);
        try {
          if (okDel) {
            var cid = (c0 && c0._pcid) || cidById(postId);
            if (cid) ST().del(((c0 && c0._pcol) || colOf(postId)) + '/' + cid + '/comments/' + commentDocId(ts));
          }
        } catch (e) {}
        return okDel;
      };
    }
    /* MURO1: borrar MI post → la lápida sube al momento (antes solo llegaba a los demás
       cuando el autor volvía a abrir la app) y su foto se borra de Storage. */
    if (typeof P.deletePost === 'function') {
      var origDP = P.deletePost.bind(P);
      P.deletePost = function (id) {
        var before = findPost(id);
        var okDel = origDP(id);
        try {
          if (okDel && before && isOwn(before)) {
            pushPost(Object.assign({}, before, { deleted: true }));
            if (before.image && before.image.path && window.CFPostPhotos && CFPostPhotos.remove) CFPostPhotos.remove(before.image.path);
          }
        } catch (e) {}
        return okDel;
      };
    }
    hooked = true;
    try { CF().refreshToken(); } catch (e) {}
    (P.userPosts || []).forEach(function (p) { if (isOwn(p)) pushPost(p); });
    startListen();
    startOfficialDoc();
    startListenOfficial();
    startListenLikes();
    pushAllOwnComments();
    startListenComments();
    try { console.log('[CFCommunity] posts + likes + comentarios en red ACTIVOS'); } catch (e) {}
  }

  setInterval(function () { try { if (hooked && active()) startListenOfficial(); } catch (e) {} }, 3000);

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
        else { stopListen(); stopListenOfficial(); stopOfficialDoc(); stopListenLikes(); stopListenComments(); cloudCount = {}; myCloudLikes = {}; myLikePending = {}; likeBase = {}; }
      });
    }
  } catch (e) {}

  window.CFOfficial = {
    isOfficial: function (u) { return !!u && officialUids.indexOf(u) !== -1; },
    get available() { return !!officialDocUnsub; }
  };
  window.CFCommunity = {
    pushAllOwn: pushAllOwn, pushAllOwnComments: pushAllOwnComments,
    _startListen: startListen, _startListenComments: startListenComments, _startListenOfficial: startListenOfficial,
    _wantedLangs: wantedLangs, _mergeFeed: mergeFeed,
    _active: active, _hooked: function () { return hooked; }, _posts: POSTS
  };
  try { console.log('[CFCommunity] módulo de posts en red cargado'); } catch (e) {}
})();
