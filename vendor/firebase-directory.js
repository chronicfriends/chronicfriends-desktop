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
     .findable()           → ¿me pueden encontrar? (por defecto SÍ)
     .setFindable(bool)    → Promise<{ok}>: publica mi ficha o la borra
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

  function publish() {
    if (!active()) return Promise.resolve({ ok: false, code: 'unavailable' });
    var me = uid();
    if (!findable()) return remove();
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
    rememberFindable(on);
    return on ? publish() : remove();
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
        out.push({ uid: u, seed: u, name: d.name || '', avatar: d.avatar || null });
      });
      return out;
    }).catch(function () { return []; });
  }

  /* ── arranque ───────────────────────────────────────────────────────────
     Se republica al entrar y cada vez que cambie el perfil (nombre o foto):
     si no, el buscador encontraría a la gente por un nombre que ya cambió. */
  var wired = false;
  function start() {
    if (!active()) return;
    publish();
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
    findable: findable,
    setFindable: setFindable,
    publish: publish,
    fold: fold,
    _start: start,
    _stop: stop,
  };
  try { window.CFDirectory = API; } catch (e) {}

  try { window.addEventListener('cf-auth-changed', function () { setTimeout(start, 600); }); } catch (e) {}
  if (document.readyState === 'loading') {
    try { document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 1600); }); } catch (e) {}
  } else { setTimeout(start, 1600); }
})();
