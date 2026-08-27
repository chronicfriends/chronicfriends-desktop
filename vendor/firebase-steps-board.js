/* ===== Firebase · GAM1 — TORNEO DE PASOS ==================================
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude
   Design, igual que firebase-directory.js o firebase-friends.js.

   QUÉ ES (idea de Gerhard, 21 ago 2026): el contador de pasos deja de ser un
   número muerto y pasa a ser un torneo — día, semana, mes y año — que se
   reinicia solo el 1 de enero. Decisiones suyas del 21 ago:
     · DOS listas, en pestañas: «Amigos» y «Global».
     · Sólo compite quien tenga HealthSync conectado. El check-in NO se toca:
       ahí los pasos son un RANGO de texto («2k-5k») y con eso no se ordena nada.
     · GRATIS para todos. No lleva candado: es lo que hace volver a la app.

   🚨 CONSENTIMIENTO — NO ES UN ADORNO (App Store 5.1.3): los pasos vienen de
   HealthKit / Health Connect. Enseñárselos a otros usuarios es compartir un
   dato de salud, así que el interruptor nace APAGADO y apagarlo BORRA el
   documento de la nube (no marca un campo: lo que no está no se puede leer).
   Es la misma decisión que se tomó en CHAT9 con «que me puedan encontrar».

   📅 POR QUÉ EL AÑO EMPIEZA CUANDO TE APUNTAS, Y NO EL 1 DE ENERO PASADO:
   la app sólo pide 30 días al teléfono (healthsync.jsx → query(30)), y en
   Android no puede pedir más: el manifiesto declara READ_STEPS/SLEEP/EXERCISE
   pero NO `READ_HEALTH_DATA_HISTORY`, que es el permiso que Health Connect
   exige para leer más allá de 30 días (comprobado en native/app.json:62-64).
   Así que el total anual se ACUMULA hacia delante: al apuntarse se rellena con
   lo que haya en el espejo (hasta 30 días) y a partir de ahí crece solo.

   EN LA NUBE (contrato exacto de firestore.rules, bloque GAM1) — UN SOLO DOC:
     steps_board/{uid}   { name, avatar?, d,dKey, w,wKey, m,mKey, y,yKey, updatedAt }

   🔒 DE TU SALUD SALEN CUATRO NÚMEROS Y NADA MÁS (decisión de Gerhard, 22 ago
   2026, opción B). Hubo una versión que subía además el desglose DÍA A DÍA a un
   documento privado, para que cambiar de teléfono no pusiera el año a cero. Se
   quitó a propósito: la política de privacidad promete que las lecturas de
   Apple Health y Health Connect no salen del móvil, y cuanto menos haya que
   excepcionar de esa promesa, mejor. El desglose vive SOLO en el teléfono
   (localStorage). Precio: en un móvil nuevo el año empieza otra vez, y se
   rellena solo con los 30 días que el teléfono sabe dar. Lo paga un caso raro,
   y ni siquiera pierde el mes en curso.

   🪤 HONESTIDAD SOBRE LAS TRAMPAS: el número lo manda el teléfono, así que es
   falsificable por definición. Aquí hay un tope por día (100.000) y las reglas
   validan tipos y topes. Eso frena el disparate, no al que se empeñe. Mientras
   no haya PREMIO, es proporcionado; el día que lo haya, esto no basta.

   API — window.CFStepsBoard
     .available          → ¿sesión verificada + Firestore vivo?
     .hasSteps()         → ¿HealthSync conectado y con permiso de pasos?
     .enabled()          → ¿participo? (por defecto NO)
     .setEnabled(bool)   → Promise: publica mi ficha o la BORRA
     .mine()             → { d, w, m, y } míos (SÍNCRONO, aunque no participe)
                           · null si no hay NI UN día con dato
                           · el periodo sin ningún día vale undefined, nunca 0
     .sync()             → Promise: recalcula desde el espejo y publica
     .top(periodo,ámbito)→ Promise<[{uid,name,avatar,n,me}]>
                           periodo 'd'|'w'|'m'|'y' · ámbito 'global'|'friends'
     ._start() ._stop()  → arranque/parada manual (para los arneses)
   ===================================================================== */
(function () {
  'use strict';

  var COL        = 'steps_board';
  var ON_KEY     = 'cf_steps_board_v1';   /* ¿participo? */
  var DAYS_KEY   = 'cf_sb_days_v1';       /* mi desglose, copia local */
  var HS_DAYS    = 'cf_hs_days_v1';       /* el espejo de HealthSync */
  var HS_STATE   = 'cf_healthsync_v1';    /* estado de la conexión */
  var TOP        = 50;
  /* Tope por día. El récord del mundo anda por 100.000 y esto no es una app de
     atletismo: por encima, el dato es basura o trampa y no se cuenta. */
  var CAP_DIA    = 100000;

  function CF() { try { return window.CFFirebase || null; } catch (e) { return null; } }
  function ST() { try { return window.CFStore || null; }    catch (e) { return null; } }
  function user() { try { return (CF() && CF().currentUser()) || null; } catch (e) { return null; } }
  function uid()  { var u = user(); return (u && u.uid) || null; }
  function verified() { var u = user(); return !!(u && u.emailVerified); }
  function active() { return !!(ST() && ST().available && CF() && CF().available && uid() && verified()); }
  function now() {
    try { return (window.CFClock && window.CFClock.now && window.CFClock.now()) || Date.now(); } catch (e) { return Date.now(); }
  }
  function leer(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---- claves de periodo, en hora LOCAL del usuario ---------------------
     El «día» tiene que ser el suyo: a las 02:00 en España el día UTC ya ha
     cambiado, y su lunes empezaría el domingo por la noche. */
  function p2(n) { return String(n).padStart(2, '0'); }
  function dKeyOf(d) { return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
  function mKeyOf(d) { return d.getFullYear() + '-' + p2(d.getMonth() + 1); }
  function yKeyOf(d) { return String(d.getFullYear()); }
  /* Semana ISO-8601: empieza el LUNES y la semana 1 es la del primer jueves.
     Es la que usan Europa entera y el propio Health Connect. */
  function wKeyOf(d) {
    var t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dow = (t.getDay() + 6) % 7;              /* lunes=0 … domingo=6 */
    t.setDate(t.getDate() - dow + 3);            /* al jueves de esa semana */
    var jueves = t.getTime();
    /* el jueves de la semana 1 es siempre el de la semana del 4 de enero */
    var primerJueves = new Date(t.getFullYear(), 0, 4);
    primerJueves.setDate(primerJueves.getDate() - ((primerJueves.getDay() + 6) % 7) + 3);
    var semana = 1 + Math.round((jueves - primerJueves.getTime()) / 604800000);
    return t.getFullYear() + '-W' + p2(semana);
  }
  function claves(ts) {
    var d = new Date(ts == null ? now() : ts);
    return { d: dKeyOf(d), w: wKeyOf(d), m: mKeyOf(d), y: yKeyOf(d) };
  }
  /* a qué periodos pertenece un día suelto, para poder sumarlo o no */
  function clavesDeDia(ds) {
    var p = ds.split('-');
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return { d: dKeyOf(d), w: wKeyOf(d), m: mKeyOf(d), y: yKeyOf(d) };
  }

  /* ---- ¿tiene pasos que contar? ---------------------------------------- */
  function hasSteps() {
    var s = leer(HS_STATE);
    if (!s || s.status !== 'connected') return false;
    return !!(s.granted && s.granted.steps);
  }

  /* ---- mi desglose: espejo de HealthSync + lo ya acumulado -------------- */
  /* El espejo sólo llega a 30 días; lo anterior se conserva porque ya se
     guardó aquí el día que se leyó. Se poda al AÑO EN CURSO: el 1 de enero
     todo el mundo aparece a cero y no queda basura del año pasado. */
  function mezclarDias() {
    var acc = leer(DAYS_KEY) || {};
    var esp = leer(HS_DAYS) || {};
    Object.keys(esp).forEach(function (ds) {
      var n = esp[ds] && esp[ds].steps;
      if (typeof n !== 'number' || !isFinite(n) || n <= 0) return;
      acc[ds] = Math.min(Math.round(n), CAP_DIA);
    });
    /* 🪤 LA PODA NO PUEDE SER «SÓLO EL AÑO EN CURSO»: la semana ISO que cruza
       el 31 de diciembre pertenece al año viejo (1 ene 2027 = 2026-W53), y
       borrando diciembre esa tabla saldría a cero para todos justo ese día.
       Se poda por ANTIGÜEDAD y es el TOTAL ANUAL el que mira el año. */
    var limite = now() - 400 * 86400000;
    var limpio = {};
    Object.keys(acc).forEach(function (ds) {
      var pp = ds.split('-');
      var t = new Date(Number(pp[0]), Number(pp[1]) - 1, Number(pp[2])).getTime();
      if (!isFinite(t) || t < limite) return;
      var n = acc[ds];
      if (typeof n === 'number' && isFinite(n) && n > 0) limpio[ds] = Math.min(Math.round(n), CAP_DIA);
    });
    escribir(DAYS_KEY, limpio);
    return limpio;
  }

  function totales(dias) {
    var k = claves(null);
    var t = { d: 0, w: 0, m: 0, y: 0 };
    Object.keys(dias).forEach(function (ds) {
      var n = dias[ds], c = clavesDeDia(ds);
      /* cada periodo se mira por su cuenta: el año sólo suma el año en curso,
         pero la semana del 1 de enero sigue sumando los días de diciembre que
         le pertenecen (ISO), que es como lo cuenta el calendario de verdad */
      if (c.y === k.y) t.y += n;
      if (c.m === k.m) t.m += n;
      if (c.w === k.w) t.w += n;
      if (c.d === k.d) t.d += n;
    });
    return t;
  }

  /* 🔢 25 ago 2026 — «TUS PASOS 0» ERA UN NÚMERO INVENTADO.
     mine() leía SOLO DAYS_KEY, la copia local que rellena sync(); y sync() se
     rinde antes de escribirla si no participas (enabled=false). Resultado:
     alguien con Apple Health conectado y 6.200 pasos de hoy abría el torneo y
     leía «Tus pasos 0» justo al lado de la tarjeta que decía 6.200.
     Dos cambios, los dos en la misma dirección — no enseñar números que no
     vienen del sistema:
       1. Se fusiona también HS_DAYS, el espejo de HealthSync, que existe
          participes o no. En memoria y SIN escribir: mine() es de solo lectura
          (quien escribe es mezclarDias(), desde sync()).
       2. Sin un solo día con dato se devuelve null, y un periodo sin ningún día
          queda `undefined` en vez de 0. El consumidor (design/stepsboard.jsx:281)
          hace Number.isFinite(Number(mine[period])): con undefined da NaN y la
          tira «Tus pasos» no se pinta — que es la instrucción de Gerhard del 25
          ago («—», nunca 0) aplicada aquí abajo.
     ⚠️ Un 0 SÍ es legítimo cuando hay días en ese periodo y suman 0: ese cero
     lo ha andado la persona, no me lo he inventado yo. */
  function diasMios() {
    var acc = {};
    var meter = function (mapa, sacar) {
      Object.keys(mapa || {}).forEach(function (ds) {
        var n = sacar(mapa[ds]);
        if (typeof n !== 'number' || !isFinite(n) || n <= 0) return;
        acc[ds] = Math.min(Math.round(n), CAP_DIA);
      });
    };
    meter(leer(DAYS_KEY), function (v) { return v; });
    /* el espejo va DESPUÉS: manda el dato del teléfono, igual que en mezclarDias() */
    meter(leer(HS_DAYS), function (v) { return v && v.steps; });
    return acc;
  }

  function mine() {
    var dias = diasMios();
    if (!Object.keys(dias).length) return null;      /* ni un dato → la tira no se pinta */
    var k = claves(null);
    var t = { d: undefined, w: undefined, m: undefined, y: undefined };
    Object.keys(dias).forEach(function (ds) {
      var n = dias[ds], c = clavesDeDia(ds);
      if (c.y === k.y) t.y = (t.y || 0) + n;
      if (c.m === k.m) t.m = (t.m || 0) + n;
      if (c.w === k.w) t.w = (t.w || 0) + n;
      if (c.d === k.d) t.d = (t.d || 0) + n;
    });
    return t;
  }

  /* ---- el interruptor --------------------------------------------------- */
  /* APAGADO por defecto: nadie publica un dato de salud sin decir que sí. */
  /* !! delante: sin él, con la clave sin escribir esto devolvía `null` en vez
     de `false` — falso igual, pero la UI compara y el contrato dice booleano. */
  function enabled() { var v = leer(ON_KEY); return !!(v === true || (v && v.on === true)); }

  function borrar() {
    var me = uid();
    if (!me || !ST()) return Promise.resolve({ ok: true });
    return ST().del(COL + '/' + me).catch(function () { return { ok: false }; });
  }

  function setEnabled(on) {
    escribir(ON_KEY, { on: !!on, ts: now() });
    try { window.dispatchEvent(new CustomEvent('cf-steps-board')); } catch (e) {}
    if (!on) return borrar();
    return sync();
  }

  /* ---- publicar --------------------------------------------------------- */
  function miPerfil() {
    var me = uid();
    if (!me || !ST()) return Promise.resolve(null);
    return ST().get('users/' + me + '/public/profile').then(function (d) { return d || null; })
      .catch(function () { return null; });
  }

  function sync() {
    if (!active()) return Promise.resolve({ ok: false, code: 'unavailable' });
    if (!enabled()) return Promise.resolve({ ok: false, code: 'off' });
    if (!hasSteps()) return Promise.resolve({ ok: false, code: 'no-healthsync' });
    var me = uid();
    var dias = mezclarDias();
    var t = totales(dias);
    var k = claves(null);
    return miPerfil().then(function (p) {
      var name = ((p && p.name) || '').toString().trim().slice(0, 80);
      /* sin nombre público no se publica: una fila sin nombre en una tabla no
         le dice nada a nadie y sólo engorda la colección */
      if (!name) return { ok: false, code: 'no-name' };
      var doc = {
        name: name,
        d: t.d, dKey: k.d,
        w: t.w, wKey: k.w,
        m: t.m, mKey: k.m,
        y: t.y, yKey: k.y,
        updatedAt: now()
      };
      var av = (p && p.avatar) ? String(p.avatar).slice(0, 512) : null;
      if (av) doc.avatar = av;
      /* 🔒 Aquí NO se sube nada más. El desglose por días se queda en el
         teléfono: ver la cabecera (decisión de Gerhard del 22 ago 2026). */
      return ST().colSet(COL, me, doc, { overwrite: true }).then(function (r) {
        try { window.dispatchEvent(new CustomEvent('cf-steps-board')); } catch (e) {}
        return r;
      });
    });
  }

  /* ---- las tablas ------------------------------------------------------- */
  var CAMPO = { d: 'd', w: 'w', m: 'm', y: 'y' };
  var CLAVE = { d: 'dKey', w: 'wKey', m: 'mKey', y: 'yKey' };

  function fila(doc, me) {
    return {
      uid: doc._id,
      name: doc.name || '',
      avatar: doc.avatar || null,
      n: 0,
      me: doc._id === me
    };
  }

  /* GLOBAL: una consulta ordenada. Necesita índice compuesto (clave + total).
     El filtro por la clave del periodo es lo que impide que la tabla de HOY
     enseñe los pasos de AYER de quien no ha abierto la app. */
  function topGlobal(per) {
    var campo = CAMPO[per] || 'd', clave = CLAVE[per] || 'dKey';
    var k = claves(null)[per] || claves(null).d;
    var me = uid();
    return ST().listCol(COL, function (c) {
      return c.where(clave, '==', k).orderBy(campo, 'desc').limit(TOP);
    }).then(function (docs) {
      return docs.map(function (d) { var f = fila(d, me); f.n = d[campo] || 0; return f; });
    });
  }

  /* AMIGOS: se leen sus documentos y se ordena aquí. Con una lista de amigos
     normal son unas pocas lecturas y no hace falta ningún índice. */
  function topFriends(per) {
    var campo = CAMPO[per] || 'd', clave = CLAVE[per] || 'dKey';
    var k = claves(null)[per] || claves(null).d;
    var me = uid();
    var ids = [];
    try {
      var l = (window.CFFriends && window.CFFriends.list && window.CFFriends.list()) || [];
      l.forEach(function (f) { if (f && f.uid) ids.push(f.uid); });
    } catch (e) {}
    if (me) ids.push(me);                       /* uno también compite */
    if (!ids.length) return Promise.resolve([]);
    return Promise.all(ids.map(function (id) {
      return ST().get(COL + '/' + id).then(function (d) {
        if (!d) return null;
        if (d[clave] !== k) return null;        /* su dato es de otro periodo */
        var f = fila({ _id: id, name: d.name, avatar: d.avatar }, me);
        f.n = d[campo] || 0;
        return f;
      }).catch(function () { return null; });
    })).then(function (rows) {
      return rows.filter(Boolean).sort(function (a, b) { return b.n - a.n; }).slice(0, TOP);
    });
  }

  function top(per, ambito) {
    if (!active()) return Promise.resolve([]);
    return (ambito === 'friends' ? topFriends(per || 'd') : topGlobal(per || 'd'));
  }

  /* ---- arranque --------------------------------------------------------- */
  function start() {
    if (!active()) return;
    if (enabled() && hasSteps()) sync();
  }
  function stop() {}

  var API = {
    get available() { return active(); },
    hasSteps: hasSteps,
    enabled: enabled,
    setEnabled: setEnabled,
    mine: mine,
    sync: sync,
    top: top,
    _start: start,
    _stop: stop
  };

  window.CFStepsBoard = API;

  try { if (CF() && CF().onState) CF().onState(function () { start(); }); } catch (e) {}
  /* cada vez que el teléfono manda datos nuevos, se republica */
  try { window.addEventListener('cf-hs-changed', function () { if (enabled() && hasSteps()) sync(); }); } catch (e) {}
  try { start(); } catch (e) {}

  try { console.log('[CFStepsBoard] listo · torneo de pasos'); } catch (e) {}
})();
