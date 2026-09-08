/* ===== Firebase · CHAT9 — BUSCAR A UNA PERSONA POR SU NOMBRE ============
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design, igual que cf-identity.js, firebase-friends.js y firebase-chat.js.

   QUÉ RESUELVE: hasta hoy no había forma de llegar a nadie. La pestaña
   «Chronic Friends» leía el localStorage del propio teléfono, así que estaba
   VACÍA en cualquier móvil real, y a una persona solo se le podía pedir
   amistad si antes había publicado algo. Decisión de Gerhard del 20 ago 2026:
   se puede BUSCAR por nombre y pedir amistad sin haber visto nada suyo. Esto
   cambia la decisión que había tomado el 19 de agosto.

   POR QUÉ UNA COLECCIÓN NUEVA Y NO EL MINI-PERFIL PÚBLICO:
   users/{uid}/public/profile solo se puede leer SABIENDO el uid — cuelga del
   documento de cada persona y no se puede recorrer buscando. Para buscar hace
   falta una lista PLANA sobre la que consultar. Eso es `directory`.

   🔒 ESTAR EN LA LISTA ES LA DEFINICIÓN DE «SE ME PUEDE ENCONTRAR».
   El interruptor de Ajustes NO escribe un campo `findable:false`: BORRA el
   documento. Un campo no habría servido de nada — quien puede consultar la
   colección lo lee igual y la persona seguiría siendo enumerable.

   QUÉ VIAJA AQUÍ: el nombre que la persona YA enseña en la comunidad, su
   avatar, y dos copias del nombre para poder buscar. NUNCA el correo (el uid
   es anónimo desde CHAT1) y NUNCA nada clínico.

   🔤 LAS DOS COPIAS DEL NOMBRE, que es lo que hace que la búsqueda funcione
   en un idioma con acentos:
     · nameLower → el nombre en minúsculas, exacto. Las reglas lo comprueban
       (== name.lower()), así que ata la ficha al nombre de verdad.
     · nameFold  → el mismo, sin acentos ni diacríticos. Es POR DONDE SE BUSCA.
       Sin él, «maria» no encontraría a «María» ni «jose» a «José», y la app se
       usa en español, italiano, portugués, catalán, francés y alemán.

   ⚠️ LÍMITE HONESTO DE FIRESTORE: se busca POR EL PRINCIPIO, no «que
   contenga». «mar» encuentra a «Marta»; NO encuentra a «Ana María». No es una
   decisión de diseño: Firestore no sabe hacer otra cosa sin pagar un buscador
   externo. Si algún día hace falta, ahí es donde se cambia.

   EN LA NUBE (contrato exacto de firestore.rules, bloque CHAT9):
     directory/{uid}   { name, nameLower, nameFold, avatar?, updatedAt }
   El id del documento es el uid de nube: así nadie puede publicar por otro y
   apagar el interruptor es borrar TU documento.

   API — window.CFDirectory
     .available            → ¿hay sesión verificada y Firestore vivo?
     .search(texto)        → Promise<[{uid, name, avatar}]>  (máx. 20)
     .list({cursor})       → Promise<{people:[…], cursor, done}>  (1.0.3)
                             el censo entero, de 20 en 20. cursor=null la
                             primera vez; después, el que devolvió la anterior.
     .isNameTaken(nombre)  → Promise<{taken, suggestions:[…]}>    (1.0.3)
     .findable()           → ¿me pueden encontrar? (por defecto SÍ). Es la
                             CACHÉ del teléfono, para poder responder al
                             instante mientras se pinta; la VERDAD vive en
                             users/{uid}/private/settings desde el 29 ago 2026.
     .setFindable(bool)    → Promise<{ok}>: lo guarda en la nube y publica o
                             borra la ficha
     .publish()            → Promise<{ok}>: refresca mi ficha (nombre/avatar)
     ._start() ._stop()    → arranque/parada manual (para los arneses)
   ===================================================================== */
(function () {
  'use strict';

  var COL       = 'directory';
  var FIND_KEY  = 'cf_findable_v1';
  /* el mismo tope que imponen las reglas: una consulta no puede pedir más */
  var LIMIT     = 20;
  /* por debajo de esto no se consulta: una sola letra devolvería medio
     directorio y sería una lectura cara por cada tecla */
  var MIN_CHARS = 2;

  function CF() { try { return window.CFFirebase || null; } catch (e) { return null; } }
  function ST() { try { return window.CFStore || null; }    catch (e) { return null; } }

  function uid() { try { var u = CF() && CF().currentUser(); return (u && u.uid) || null; } catch (e) { return null; } }
  function verified() { try { var u = CF() && CF().currentUser(); return !!(u && u.emailVerified); } catch (e) { return false; } }
  function active() { return !!(ST() && ST().available && CF() && CF().available && uid() && verified()); }
  function now() {
    try { return (window.CFClock && window.CFClock.now && window.CFClock.now()) || Date.now(); } catch (e) { return Date.now(); }
  }

  /* minúsculas + fuera los diacríticos. NFD separa la letra de su tilde y el
     rango \u0300-\u036f borra las tildes sueltas. Se deja tal cual lo que no
     sea latino (árabe, ruso, japonés): ahí no hay nada que quitar. */
  function fold(s) {
    var t = String(s == null ? '' : s).toLowerCase().trim();
    try { t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
    return t;
  }

  /* ── el interruptor ─────────────────────────────────────────────────────
     Por defecto SÍ se puede encontrar a la persona: si naciera apagado, el
     buscador estaría vacío para todo el mundo y no serviría de nada. Se
     apaga desde Ajustes, y apagarlo BORRA la ficha de la nube. */
  function findable() {
    try {
      var v = localStorage.getItem(FIND_KEY);
      return v === null ? true : v === '1';
    } catch (e) { return true; }
  }
  function rememberFindable(v) {
    try { localStorage.setItem(FIND_KEY, v ? '1' : '0'); } catch (e) {}
  }

  /* mi nombre y mi foto salen del mini-perfil PÚBLICO — exactamente lo que ya
     ve el resto de la comunidad. Nunca de nada local ni del correo. */
  function myPublicProfile() {
    var me = uid();
    if (!me || !ST()) return Promise.resolve(null);
    return ST().get('users/' + me + '/public/profile').then(function (d) {
      return d || null;
    }).catch(function () { return null; });
  }

  /* ── LA PREFERENCIA, EN LA NUBE (CHAT9-bis · 29 ago 2026) ───────────────
     Hasta hoy «que otros me encuentren» vivía SOLO en el localStorage de este
     teléfono. Tres agujeros, y los tres reales:
       · quien lo apagaba y reinstalaba la app volvía a publicarse SOLO;
       · desde otro móvil salía encendido otra vez;
       · y ningún proceso de SERVIDOR podía saber que esa persona había dicho
         que no — la siembra del directorio del 29 ago no pudo respetarlo.
     La Política de Privacidad promete «switching it off removes you from that
     directory, and from then on nobody can reach you»: con el estado en el
     aparato, esa promesa no se podía cumplir.

     Ahora la verdad vive en users/{uid}/private/settings {findable, updatedAt},
     privado y con el esquema cerrado por las reglas (firestore.rules:171).
     El localStorage se queda como CACHÉ, porque findable() tiene que seguir
     respondiendo al instante: la interfaz la llama al pintar y no puede esperar
     a la red.

     ⚠️ LO QUE ESTE ARREGLO **NO** PUEDE RECUPERAR: si alguien apagó el
     interruptor y ya había reinstalado la app antes de hoy, ese «no» se perdió
     con el localStorage y no queda rastro en ninguna parte. Su ficha volverá a
     publicarse como la de cualquiera. No hay forma de distinguirlo. */
  var cloudKnown = undefined;          /* undefined = aún no leída · null = no hay dato */

  function settingsPath() {
    var me = uid();
    return me ? 'users/' + me + '/private/settings' : null;
  }

  function readCloudFindable() {
    var path = settingsPath();
    if (!path || !ST()) return Promise.resolve(null);
    return ST().get(path).then(function (d) {
      return (d && typeof d.findable === 'boolean') ? d.findable : null;
    }).catch(function () { return null; });
  }

  function writeCloudFindable(v) {
    var path = settingsPath();
    if (!path || !ST()) return Promise.resolve({ ok: false });
    return ST().set(path, { findable: !!v, updatedAt: now() }, { overwrite: true })
      .catch(function () { return { ok: false }; });
  }

  /* La verdad, con la nube por delante y el teléfono como respaldo.
     Si la nube no contesta (sin red, sin sesión) NO se inventa un «sí»: se
     devuelve lo último que sabíamos, que es lo prudente — publicar a alguien
     por un fallo de red sería exactamente el error que este arreglo repara. */
  function resolveFindable() {
    if (cloudKnown !== undefined && cloudKnown !== null) {
      return Promise.resolve(cloudKnown);
    }
    return readCloudFindable().then(function (v) {
      cloudKnown = v;
      if (v === null) {
        /* Nunca se guardó en la nube: es la PRIMERA vez con esta versión.
           Se sube lo que dijera este teléfono — así el «no» de quien lo apagó
           en su día queda por fin registrado donde no se puede perder. */
        var local = findable();
        return writeCloudFindable(local).then(function () {
          cloudKnown = local;
          return local;
        });
      }
      rememberFindable(v);            /* la caché sigue a la nube, no al revés */
      return v;
    });
  }

  function publish() {
    if (!active()) return Promise.resolve({ ok: false, code: 'unavailable' });
    var me = uid();
    /* 🔒 la nube manda: nunca se publica a quien dijo que no, ni aunque este
       teléfono no se acuerde (reinstalado, móvil nuevo, datos borrados). */
    return resolveFindable().then(function (puedo) {
      if (!puedo) return remove();
      return publishAhora(me);
    });
  }

  /* ── CHAT1a · ROL Y PRESENCIA ──────────────────────────────────────────
     El rol sale de donde ya vive en la app: cf_auth_v1.role, que es lo mismo
     que lee cfRole() en design/posts.jsx. Se normaliza a los dos unicos
     valores que aceptan las reglas.
     🔎 Limitacion CONOCIDA y asumida: este rol lo declara el propio cliente,
     igual que el `role` que ya viaja en cada publicacion de la comunidad. No
     hay hoy ninguna fuente autoritativa de «medico verificado» en la nube, asi
     que esto no empeora nada de lo que ya habia — pero no confundirlo con una
     credencial. Si algun dia se verifican los medicos de verdad, ESTE es el
     campo que hay que dejar de creerle al cliente. */
  function miRol() {
    try {
      var a = JSON.parse(localStorage.getItem('cf_auth_v1') || 'null');
      return (a && a.role === 'doctor') ? 'doctor' : 'patient';
    } catch (e) { return 'patient'; }
  }

  /* Cada cuanto se refresca el sello de presencia, y cuanto dura encendido el
     punto verde. ONLINE_MS es MAYOR que LATIDO_MS a proposito: si fueran
     iguales, la ficha parpadearia entre «en linea» y «desconectado» solo por
     el retardo de la red. */
  var LATIDO_MS = 5 * 60 * 1000;    /* una escritura cada 5 min de uso real */
  var ONLINE_MS = 12 * 60 * 1000;   /* «en linea» = visto hace menos de 12 min */
  var latidoTimer = null;

  /* 💰 COSTE: una escritura por persona y por cada 5 minutos con la app
     ABIERTA Y DELANTE. Con la app en segundo plano no se escribe nada — de ahi
     el visibilityState. Es el precio de que el punto verde diga la verdad; si
     algun dia molesta, se sube LATIDO_MS y ya. */
  function latido() {
    if (!active()) return;
    try { if (document.visibilityState !== 'visible') return; } catch (e) {}
    var me = uid();
    if (!me) return;
    /* merge, NO overwrite: aqui solo se refresca el sello. Las reglas validan
       el documento RESULTANTE, asi que el resto de campos siguen cumpliendo. */
    try { ST().colSet(COL, me, { lastSeen: now() }); } catch (e) {}
  }

  function arrancarLatido() {
    if (latidoTimer) return;
    latido();
    try { latidoTimer = setInterval(latido, LATIDO_MS); } catch (e) {}
    try { document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') latido();
    }); } catch (e) {}
  }

  /* El criterio de «en linea», en UN solo sitio: lo usa la interfaz y asi no
     hay dos definiciones distintas rondando por ahi. Sin sello -> false, que
     es lo correcto: no saber cuando se conecto alguien NO es «esta conectado».
     Esto es justo lo que fallaba antes, cuando el punto verde se pintaba fijo. */
  function online(lastSeen) {
    var t = Number(lastSeen);
    if (!isFinite(t) || t <= 0) return false;
    return (Date.now() - t) < ONLINE_MS;
  }

  function publishAhora(me) {
    return myPublicProfile().then(function (p) {
      var name = ((p && p.name) || '').toString().trim().slice(0, 80);
      /* sin nombre público no se publica: una ficha sin nombre no se puede
         buscar y solo serviría para engordar el directorio */
      if (!name) return { ok: false, code: 'no-name' };
      var doc = {
        name: name,
        nameLower: name.toLowerCase(),
        nameFold: fold(name) || name.toLowerCase(),
        updatedAt: now(),
      };
      var avatar = (p && p.avatar) ? String(p.avatar).slice(0, 512) : null;
      if (avatar) doc.avatar = avatar;
      /* CHAT1a_ROL_PRESENCIA (31 ago 2026) — dos campos, y solo dos.
         · role: paciente o medico. NO es un dato clinico: dice que CLASE de
           cuenta es. Hasta hoy el rol se deducia del prefijo 'doc:' del uid
           LOCAL, que con un uid de NUBE no casa nunca — por eso arreglar
           cfFriendUid sin esto ofreceria amistad a un medico, y la regla del
           producto es paciente↔paciente.
         · lastSeen: cuando tuvo esta persona la app abierta por ultima vez. Es
           lo que hace REAL el punto verde de «En linea».
         Lo personal (pais, edad, años, bio) NO se toca aqui: va al mini-perfil,
         que se lee de uno en uno. Ver vendor/cf-profile-share.js. */
      doc.role = miRol();
      doc.lastSeen = now();
      return ST().colSet(COL, me, doc, { overwrite: true });
    });
  }

  function remove() {
    var me = uid();
    if (!me || !ST()) return Promise.resolve({ ok: false, code: 'unavailable' });
    return ST().del(COL + '/' + me);
  }

  function setFindable(v) {
    var on = !!v;
    rememberFindable(on);               /* la interfaz responde ya */
    cloudKnown = on;
    /* y la decisión queda guardada donde sobrevive a un reinstalado y donde el
       servidor puede leerla. Si la escritura en la nube falla, se sigue
       adelante con el efecto visible: apagar SIEMPRE borra la ficha. */
    return writeCloudFindable(on).then(function () {
      return on ? publishAhora(uid()) : remove();
    });
  }

  /* ── la búsqueda ────────────────────────────────────────────────────────
     Por PREFIJO sobre nameFold. El truco del \uf8ff es el estándar de
     Firestore: es un carácter altísimo en el orden, así que «ana» → «ana\uf8ff»
     abarca todo lo que empieza por «ana» y nada más.
     🪤 Va escrito como ESCAPE (\uf8ff), no como el carácter suelto: ese carácter
     es del área de uso privado, es INVISIBLE en cualquier editor, y un
     copiar-pegar o un guardado en otra codificación se lo lleva por delante
     sin que nada dé error — la búsqueda pasaría a encontrar solo el nombre
     exacto y nadie sabría por qué. Lo mismo con el rango de acentos de fold(). */

  /* ── CHAT1-c · LA FOTO Y EL NOMBRE, AL ESPEJO QUE YA LEE LA INTERFAZ ────
     CHAT1c_ESPEJO. Aqui se vuelca lo que YA viene en esta misma respuesta (cero lecturas
     de mas) al espejo cf_public_profiles_v1, que es donde miran
     cfPublicAvatarInfo(uid) y cfPublicNameFor(uid) — o sea, PersonAvatar y
     CFFriendPhoto, o sea TODAS las pantallas: lista, buscador, ficha de
     perfil, autor de una publicacion y autor de un comentario.

     Hasta hoy ese espejo solo conocia uids LOCALES (pat:<correo>), asi que
     para un uid de NUBE no habia nada que pintar y no salia ninguna foto. El
     lector de perfiles ajenos ya existia en vendor/cf-identity.js
     (CFIdentity.profile / .prefetch) pero NADIE lo llamaba: esto es la punta
     que le faltaba al puente, y por el camino corto.

     Se escribe ANTES de devolver las filas, a proposito: cuando React pinte
     la lista el espejo ya esta puesto y las fotos salen a la primera, sin
     depender de ningun evento de repintado.

     🔒 Solo nombre y avatar. El esquema del espejo es el del mini-perfil
     publico (cfPubSanitize) y ahi no cabe —ni cabra— nada clinico. */
  var MIRROR_KEY = 'cf_public_profiles_v1';
  function espejar(rows) {
    if (!rows || !rows.length) return rows;
    try {
      var raw = localStorage.getItem(MIRROR_KEY);
      var m = raw ? JSON.parse(raw) : {};
      if (!m || typeof m !== 'object' || Array.isArray(m)) m = {};
      var tocado = 0;
      rows.forEach(function (p) {
        if (!p || !p.uid) return;
        var prev = m[p.uid] || {};
        var doc = {};
        if (p.name) doc.name = p.name;
        if (p.avatar) doc.avatar = p.avatar;
        if (prev.lang) doc.lang = prev.lang;          /* no pisar el idioma ya sabido */
        if (prev.name === doc.name && prev.avatar === doc.avatar) return;
        m[p.uid] = doc;
        tocado++;
      });
      if (!tocado) return rows;
      localStorage.setItem(MIRROR_KEY, JSON.stringify(m));
    } catch (e) {}
    return rows;
  }

  function search(text) {
    var q = fold(text);
    if (q.length < MIN_CHARS) return Promise.resolve([]);
    if (!active()) return Promise.resolve([]);
    var me = uid();
    return ST().listCol(COL, function (ref) {
      return ref.orderBy('nameFold').startAt(q).endAt(q + '\uf8ff').limit(LIMIT);
    }).then(function (rows) {
      var out = [];
      (rows || []).forEach(function (d) {
        var u = d && d._id;
        if (!u || u === me) return;                       /* yo no me busco */
        /* a quien he bloqueado no me lo devuelve el buscador jamás */
        try { if (window.CFBlocks && CFBlocks.isBlocked({ uid: u, seed: u })) return; } catch (e) {}
        out.push({ uid: u, seed: u, name: d.name || '', avatar: d.avatar || null,
                   role: d.role || null, lastSeen: d.lastSeen || null, online: online(d.lastSeen) });
      });
      return espejar(out);
    }).catch(function () { return []; });
  }

  /* ── la LISTA COMPLETA (build 1.0.3) ────────────────────────────────────
     Decisión de Gerhard del 29 ago 2026: la pestaña «Chronic Friends» enseña
     a TODAS las personas con cuenta verificada, estén conectadas o no. Hasta
     hoy no se veía a nadie hasta escribir 2 letras, y con el directorio casi
     vacío la pantalla parecía rota. Esto es el censo; `search` sigue siendo
     el filtro cuando se teclea.

     🔒 EL LÍMITE DE 20 NO ES UNA ELECCIÓN: lo imponen las reglas de la nube
     (firestore.rules, bloque CHAT9: `allow list: if verified() &&
     request.query.limit <= 20`). Pedir 21 no devuelve 21: devuelve DENEGADO.
     Por eso esto pagina en vez de traerlo todo — y por eso no hubo que tocar
     ni republicar las reglas para el 1.0.3.

     EL CURSOR es el último `nameFold` entregado, no un objeto de Firestore:
     así sobrevive a que la interfaz lo guarde en un estado de React y no
     obliga a la pantalla a saber nada de la base de datos.
     ⚠️ Con dos personas de nameFold idéntico la página podría saltarse a una;
     desde el 1.0.3 los nombres son ÚNICOS (isNameTaken, abajo), así que el
     caso solo puede venir de una cuenta anterior. Se prefiere ese riesgo
     mínimo a paginar por __name__, que en compat obliga a pasar la ruta
     entera del documento y se rompe en silencio si cambia la colección. */
  function list(opts) {
    if (!active()) return Promise.resolve({ people: [], cursor: null, done: true });
    var cursor = opts && opts.cursor ? String(opts.cursor) : null;
    var me = uid();
    return ST().listCol(COL, function (ref) {
      var q = ref.orderBy('nameFold');
      if (cursor) q = q.startAfter(cursor);
      return q.limit(LIMIT);
    }).then(function (rows) {
      rows = rows || [];
      var out = [], last = cursor;
      rows.forEach(function (d) {
        var u = d && d._id;
        if (u) last = d.nameFold || last;
        if (!u || u === me) return;                        /* yo no salgo en mi lista */
        try { if (window.CFBlocks && CFBlocks.isBlocked({ uid: u, seed: u })) return; } catch (e) {}
        out.push({ uid: u, seed: u, name: d.name || '', avatar: d.avatar || null,
                   role: d.role || null, lastSeen: d.lastSeen || null, online: online(d.lastSeen) });
      });
      espejar(out);
      /* `done` mira las filas CRUDAS, no las filtradas: si la tanda venía
         llena pero era toda gente bloqueada, todavía queda por leer. */
      return { people: out, cursor: last, done: rows.length < LIMIT };
    }).catch(function () { return { people: [], cursor: cursor, done: true }; });
  }

  /* ── ¿ESE NOMBRE ESTÁ COGIDO? (build 1.0.3) ─────────────────────────────
     Decisión de Gerhard del 29 ago 2026: dos personas no pueden llamarse
     igual. Se compara por `nameFold`, o sea SIN mayúsculas y SIN acentos: si
     «José» está cogido, «jose» también lo está. Es lo que se quiere — el
     objetivo es que no haya dos personas indistinguibles en la lista.

     No es un candado de seguridad y no pretende serlo: dos móviles que
     guarden el mismo nombre en el mismo segundo pasarían los dos. Las reglas
     de la nube no pueden comprobar unicidad (no saben consultar otras
     fichas), así que esto es cortesía de interfaz, no una garantía. Con esta
     escala de usuarios la carrera es teórica; si algún día importa, se
     resuelve con una colección `names/{nameFold}` reservada por el dueño. */
  function isNameTaken(name) {
    var q = fold(name);
    if (!q) return Promise.resolve({ taken: false, suggestions: [] });
    if (!active()) return Promise.resolve({ taken: false, suggestions: [] });
    var me = uid();
    return ST().listCol(COL, function (ref) {
      return ref.where('nameFold', '==', q).limit(5);
    }).then(function (rows) {
      var taken = false;
      (rows || []).forEach(function (d) {
        /* mi propia ficha no me bloquea a mí mismo: si no cambio el nombre,
           guardar el perfil no puede decirme que mi nombre está cogido */
        if (d && d._id && d._id !== me) taken = true;
      });
      if (!taken) return { taken: false, suggestions: [] };
      return suggest(String(name).trim()).then(function (s) {
        return { taken: true, suggestions: s };
      });
    }).catch(function () { return { taken: false, suggestions: [] }; });
  }

  /* Propone alternativas y COMPRUEBA que estén libres antes de ofrecerlas:
     sugerir un nombre que también está cogido es peor que no sugerir nada.
     Una sola consulta con `in` (tope de 10 valores en Firestore, y 20 en las
     reglas) en vez de una por candidato. */
  function suggest(base) {
    var cand = [];
    ['M.', 'R.', 'S.', 'B.', 'L.'].forEach(function (ini) { cand.push(base + ' ' + ini); });
    cand.push(base + ' 2');
    cand.push(base + ' 3');
    var folds = cand.map(fold);
    return ST().listCol(COL, function (ref) {
      return ref.where('nameFold', 'in', folds).limit(20);
    }).then(function (rows) {
      var cogidos = {};
      (rows || []).forEach(function (d) { if (d && d.nameFold) cogidos[d.nameFold] = true; });
      var libres = [];
      cand.forEach(function (c) { if (!cogidos[fold(c)] && libres.length < 3) libres.push(c); });
      return libres;
    }).catch(function () { return cand.slice(0, 3); });
  }

  /* ── arranque ───────────────────────────────────────────────────────────
     Se republica al entrar y cada vez que cambie el perfil (nombre o foto):
     si no, el buscador encontraría a la gente por un nombre que ya cambió. */
  var wired = false;
  function start() {
    if (!active()) return;
    publish();
    arrancarLatido();
    if (wired) return;
    wired = true;
    try {
      if (window.CFProfile && window.CFProfile.subscribe) {
        window.CFProfile.subscribe(function () { if (active()) publish(); });
      }
    } catch (e) {}
  }
  function stop() { wired = false; }

  var API = {
    get available() { return active(); },
    search: search,
    list: list,
    isNameTaken: isNameTaken,
    findable: findable,
    setFindable: setFindable,
    publish: publish,
    fold: fold,
    online: online,          /* CHAT1a: ¿pinto el punto verde? */
    _latido: latido,
    _start: start,
    _stop: stop,
  };
  try { window.CFDirectory = API; } catch (e) {}

  try { window.addEventListener('cf-auth-changed', function () { setTimeout(start, 600); }); } catch (e) {}
  if (document.readyState === 'loading') {
    try { document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 1600); }); } catch (e) {}
  } else { setTimeout(start, 1600); }
})();
