/* ===== Chronic Friends · CHAT1a — Publicar la FICHA, y solo con permiso =====
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude Design.

   QUÉ PROBLEMA RESUELVE
   ---------------------
   La app INVENTABA el país, la edad, los «años con la enfermedad» y la biografía
   de las demás personas: los derivaba de un hash de su identificador y los
   pintaba igual que un dato real (design/friendprofile.jsx, cfResolveFriendMeta).
   La causa de raíz no era ese relleno, era que esos datos NUNCA salían del móvil
   de su dueño — así que no había ninguna verdad que enseñar en su lugar.

   Decisión de Gerhard del 31 ago 2026: publicarlos. Este módulo los publica.

   DÓNDE, Y POR QUÉ NO EN EL DIRECTORIO
   ------------------------------------
   Van a users/{uid}/public/profile, que se lee DE UNO EN UNO (justo lo que hace
   una ficha al abrirse). NO van a directory/{uid}, que se lista de 20 en 20:
   ahí cualquiera podría paginar el censo y llevarse la edad y los años de
   enfermedad de toda la comunidad de una sentada. El dato es el mismo; lo que
   cambia es la forma de acceso, y eso es lo que decide el riesgo.
   El rol y la última conexión sí van al directorio: los necesita una LISTA.

   ⚖️ EL PERMISO ES LA MITAD DEL TRABAJO, NO UN ADORNO
   ---------------------------------------------------
   Nace APAGADO y hay que encenderlo a mano. El consentimiento que la gente ya
   dio —«que otros puedan encontrarme»— era para su NOMBRE y su FOTO; no cubre
   la edad ni los años de enfermedad, que son datos de salud (art. 9 GDPR, y
   revFADP en Suiza). Sin este interruptor, publicarlos no sería legítimo por
   mucho que la nube los acepte.

   Y se puede DESHACER: al apagarlo, los cuatro campos se BORRAN de la nube en
   la siguiente pasada (se reescribe el documento entero sin ellos, con
   overwrite). Un permiso que no se puede retirar no es un permiso.

   API (window.CFProfileShare)
     .allowed()          → ¿está encendido el permiso?
     .allow(bool)        → enciende/apaga y publica o retira en el acto
     .publish()          → Promise: sincroniza mi ficha pública con mi perfil
     .fields()           → los 4 campos tal como saldrían (para la interfaz)
   ===================================================================== */
(function () {
  'use strict';

  var PERM_KEY  = 'cf_share_profile_v1';   /* el permiso, en este teléfono */
  var LAST_KEY  = 'cf_share_profile_last'; /* lo último publicado (ahorra escrituras) */
  var PERM_VER  = '2026-09';               /* súbelo si cambia lo que se publica → se vuelve a pedir */
  /* los cuatro campos que gobierna este modulo — y SOLO estos. Nada de
     name/avatar/lang, que son de publicprofile.js y cf-identity.js. */
  var CAMPOS = ['country', 'age', 'crohnYears', 'bio'];
  var PROFILE_KEY = 'cf_profile_v1';       /* nombre, biografía («status») y país */
  var STATS_KEY   = 'cf-profile';          /* edad y años con la enfermedad */

  function CF() { try { return window.CFFirebase || null; } catch (e) { return null; } }
  function ST() { try { return window.CFStore || null; }    catch (e) { return null; } }
  function uid() { try { var u = CF() && CF().currentUser(); return (u && u.uid) || null; } catch (e) { return null; } }
  function verified() { try { var u = CF() && CF().currentUser(); return !!(u && u.emailVerified); } catch (e) { return false; } }
  function usable() { var s = ST(); return !!(s && s.available && CF() && CF().available && uid() && verified()); }

  function readJson(key) {
    try { var r = JSON.parse(localStorage.getItem(key)); return (r && typeof r === 'object') ? r : null; } catch (e) { return null; }
  }
  function writeJson(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

  /* ---- el permiso ------------------------------------------------------- */
  function allowed() {
    var o = readJson(PERM_KEY);
    return !!(o && o.shared === true && o.version === PERM_VER);
  }

  /* ---- de dónde sale cada campo ----------------------------------------
     Se leen los DOS almacenes que ya usa la app: cf_profile_v1 (lo que se
     edita en «Mi perfil») y cf-profile (lo de «Tus datos» del onboarding).
     Nada se deriva ni se estima: si el campo está vacío, no se publica y la
     ficha de esa persona simplemente no lo enseñará. */
  function fields() {
    var out = {};
    if (!allowed()) return out;
    var p = readJson(PROFILE_KEY) || {};
    var s = readJson(STATS_KEY) || {};

    if (typeof p.country === 'string' && p.country.trim()) out.country = p.country.trim().slice(0, 56);
    if (typeof p.status === 'string' && p.status.trim())   out.bio = p.status.trim().slice(0, 300);

    var age = Number(s.age);
    /* 18 no es capricho: la app tiene barrera 18+ (design/agegate.jsx) y la
       regla de la nube rechaza cualquier cosa por debajo. Mejor no mandarlo
       que ver la escritura entera denegada por un campo. */
    if (Number.isFinite(age) && age >= 18 && age <= 120) out.age = Math.round(age);

    /* > 0, no >= 0: un campo vacio no se guarda ausente, se guarda como null
       (onboarding.jsx:156 «Number(years) || null», checkin.jsx:1626) y
       Number(null) es 0. Con «>= 0» se publicaba «crohnYears: 0» a CUALQUIERA
       que encendiera el interruptor sin haber escrito nunca los años — un dato
       de salud subido a la nube que ademas no enseña ninguna pantalla, porque
       la vista previa de Ajustes (settings.jsx:429) y la ficha
       (friendprofile.jsx:68) ya descartan el cero. Los tres sitios dicen ahora
       lo mismo: cero no es un dato, es un hueco. Y la Politica v3.1 promete
       «only the fields you have actually filled in are published». */
    var cy = Number(s.crohnYears);
    if (Number.isFinite(cy) && cy > 0 && cy <= 100) out.crohnYears = Math.round(cy);

    return out;
  }

  /* ---- publicar / retirar ----------------------------------------------
     Se reescribe el documento ENTERO (overwrite) en vez de fusionar, porque
     fusionar no sabría BORRAR: al apagar el permiso hay que quitar los campos
     de la nube, no dejarlos con el último valor. Por eso se lee antes lo que
     hay y se conservan name/avatar/lang, que los gestionan otros módulos
     (publicprofile.js y cf-identity.js) y no son asunto de este. */
  function publish() {
    if (!usable()) return Promise.resolve({ ok: false, code: 'unavailable' });
    var me = uid();
    var extra = fields();

    /* ¿ha cambiado algo desde la última vez? si no, no se gasta una escritura */
    var firma = JSON.stringify([allowed(), extra]);
    var last = null;
    try { last = localStorage.getItem(LAST_KEY); } catch (e) {}
    if (last === firma) return Promise.resolve({ ok: true, code: 'sin-cambios' });

    /* 🔑 SE ESCRIBE CON MERGE Y SE BORRA CAMPO A CAMPO, NO LEYENDO Y
       REESCRIBIENDO ENTERO. Antes esto hacia get() y volvia a escribir el
       documento con overwrite:true conservando a mano name/avatar/lang. El
       agujero: CFStore.get() devuelve null tanto si el documento NO EXISTE como
       si NO SE PUDO LEER (firebase-firestore.js:128, `.catch(() => null)`) y,
       al reves que las escrituras, NO pasa por withRetry. Un solo fallo de
       lectura reescribia el perfil sin nombre ni foto — y la regla lo aceptaba,
       porque validPublicData (firestore.rules) usa hasOnly y no exige ningun
       campo. Los demas veian «Community member» con el retrato por defecto y
       hasta las notificaciones de chat perdian el nombre. Con merge, lo que
       este modulo no nombra NO SE TOCA JAMAS, y borrar es explicito. */
    var FV = null;
    try { FV = window.firebase.firestore.FieldValue; } catch (e) {}
    if (!FV || typeof FV.delete !== 'function') {
      return Promise.resolve({ ok: false, code: 'no-fieldvalue' });
    }
    var doc = { updatedAt: Date.now() };
    CAMPOS.forEach(function (k) {
      doc[k] = Object.prototype.hasOwnProperty.call(extra, k) ? extra[k] : FV.delete();
    });
    return ST().set('users/' + me + '/public/profile', doc).then(function (r) {
      if (r && r.ok !== false) { try { localStorage.setItem(LAST_KEY, firma); } catch (e) {} }
      return r;
    }).catch(function () { return { ok: false, code: 'error' }; });
  }

  function allow(v) {
    var on = !!v;
    var prev = readJson(PERM_KEY);
    writeJson(PERM_KEY, { shared: on, version: PERM_VER, ts: Date.now() });
    /* la firma se invalida a mano: apagar el permiso TIENE que provocar una
       escritura, aunque los campos calculados queden igual de vacíos que ya
       estaban en la copia local. */
    try { localStorage.removeItem(LAST_KEY); } catch (e) {}
    try { window.dispatchEvent(new Event('cf-share-profile')); } catch (e) {}
    return publish().then(function (r) {
      /* 🔑 UN «SI» QUE NO SE PUDO PUBLICAR NO SE QUEDA GUARDADO. El permiso se
         escribe ANTES de publicar, y publish() falla si no hay sesion, si no
         hay red util o si el correo aun no esta verificado. Sin esto, la fila
         de Ajustes revertia el DIBUJO (settings.jsx) pero PERM_KEY se quedaba
         en true: la persona veia el interruptor APAGADO y el siguiente boot()
         le publicaba sus datos de salud. design/CLAUDE.md ya prometia que «the
         row never lies about the state»; ahora es verdad tambien por dentro.
         Se revierte SOLO EL ENCENDIDO. Un apagado que falla NO se revierte: eso
         dejaria los cuatro campos publicados con el interruptor en off, que es
         justo lo contrario de lo que promete la Politica §6 — y esa via ya esta
         cubierta, porque LAST_KEY queda invalidado y el arranque siguiente lo
         reintenta, que es lo que §6 le cuenta al usuario. */
      if (r && r.ok === false && on) {
        if (prev) writeJson(PERM_KEY, prev);
        else { try { localStorage.removeItem(PERM_KEY); } catch (e) {} }
        try { window.dispatchEvent(new Event('cf-share-profile')); } catch (e) {}
      }
      return r;
    });
  }

  var API = {
    get available() { return usable(); },
    allowed: allowed,
    allow: allow,
    publish: publish,
    fields: fields,
    version: PERM_VER
  };
  try { window.CFProfileShare = API; } catch (e) {}

  /* se sincroniza cuando despierta la sesión y cuando el usuario toca su
     perfil; nunca en un bucle ni con temporizador (esto no es presencia). */
  /* 🔑 «NUNCA CONFIGURADO AQUI» NO ES «APAGADO». El permiso vive en el
     localStorage de CADA aparato (PERM_KEY), asi que en un movil nuevo, en un
     navegador o tras limpiar los datos, allowed() es false por no haber nada
     escrito — no porque el usuario haya dicho que no. Publicar en ese estado
     borraba de la nube los cuatro campos que esa persona habia encendido en su
     OTRO telefono; y no se recuperaba nunca, porque alli la firma de LAST_KEY
     seguia coincidiendo y publish() contestaba 'sin-cambios' para siempre: el
     interruptor se quedaba encendido, con sus chips pintados, y en la nube no
     habia nada. Ahora solo se sincroniza donde hay una decision TOMADA. */
  function decidido() { return readJson(PERM_KEY) !== null; }
  function boot() { if (usable() && decidido()) publish(); }
  try { window.addEventListener('cf-auth-changed', function () { setTimeout(boot, 1500); }); } catch (e) {}
  try { if (window.CFProfile && window.CFProfile.subscribe) window.CFProfile.subscribe(function () { if (usable() && decidido()) publish(); }); } catch (e) {}
  if (document.readyState === 'loading') {
    try { document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 2000); }); } catch (e) {}
  } else { setTimeout(boot, 2000); }
})();
