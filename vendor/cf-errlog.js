/* cf-errlog.js — los errores de la parte WEB llegan a Crashlytics (M34) · Claude Code
   Auditoría del 5 nov 2026, escrito el 7 nov. Vive en webapp/vendor: sobrevive a cada
   export de Claude Design (lo inyecta actualizar-desde-design.sh, el PRIMERO de todos
   los scripts, para ver también los errores al cargar los demás).

   Por qué: casi toda la app es web, y sus errores no llegaban a ningún sitio. La caja
   «Something went wrong on this screen» (CFErrorBoundary) solo escribe en la consola,
   que en un teléfono no lee nadie. Así se escondió C2 (la hoja de crisis rota) meses.

   Qué hace:
     1. Recoge tres cosas: window.onerror, las promesas rechazadas que nadie atrapa y
        los errores de pantalla que atrapa CFErrorBoundary (los escribe con
        console.error('[Chronic Friends] screen error:', err, componentStack)).
     2. Dentro del móvil se los pasa al nativo ({t:'err:web'}), que los apunta en
        Crashlytics como error NO fatal (native/App.js). En un navegador solo cuenta.

   🔴 NUNCA viaja el TEXTO del error ni nada de la persona: un mensaje puede llevar el
   nombre de una medicina, un correo o lo que escribió. Solo: el tipo (TypeError…), el
   fichero (sin ruta ni parámetros), línea y columna, y para los errores de pantalla los
   nombres de los 2 primeros componentes de React (código, no datos). La versión de la
   web la pone el nativo. Tope: 20 envíos por apertura, y el mismo error una sola vez.
   Nunca rompe nada: todo va dentro de try, y la consola sigue recibiendo lo de siempre. */
(function () {
  'use strict';
  if (window.CFErrLog) return;

  var TOPE = 20;
  var enviados = 0;
  var vistos = {};
  var cuenta = { error: 0, promise: 0, screen: 0 };

  function limpio(x, n) { return String(x == null ? '' : x).replace(/[^A-Za-z0-9_.\-]/g, '').slice(0, n); }

  /* «file:///…/webapp/build/medication.js?v=3#x» → «medication.js» */
  function fichero(u) {
    try {
      var s = String(u || '').split('#')[0].split('?')[0];
      var i = s.lastIndexOf('/');
      return limpio(i >= 0 ? s.slice(i + 1) : s, 60) || '?';
    } catch (e) { return '?'; }
  }

  /* REVISOR AUD4: el `name` solo se cree si el valor ES un error (Error, DOMException…)
     y tiene forma de tipo. Un objeto cualquiera rechazado o lanzado (una medicina, una
     persona: los dos tienen `name`) sale como «Object», nunca con su nombre. */
  function tipo(err) {
    try {
      if (err && typeof err === 'object') {
        var esError = (err instanceof Error)
          || (typeof DOMException !== 'undefined' && err instanceof DOMException);
        var n = esError ? String(err.name || 'Error') : 'Object';
        return /^[A-Z][A-Za-z]{0,40}(?:Error|Exception)$|^Error$|^Object$/.test(n) ? n : 'Error';
      }
      return err == null ? 'null' : limpio(typeof err, 12);
    } catch (e) { return 'Error'; }
  }

  /* la PRIMERA línea de la pila con «fichero:línea:columna» (Chrome y WebKit) */
  function sitio(err) {
    try {
      var pila = String((err && err.stack) || '');
      var m = /([^\s()@\/]+\.js)[^:\s]*:(\d+):(\d+)/.exec(pila);
      if (m) return { file: limpio(m[1], 60), line: limpio(m[2], 7), col: limpio(m[3], 7) };
    } catch (e) {}
    return { file: '?', line: '', col: '' };
  }

  /* «\n    at MedRow (…)\n    at Settings (…)» o «in MedRow» → «MedRow>Settings» */
  function componentes(stack) {
    try {
      var out = [];
      var re = /(?:\bat|\bin)\s+([A-Z][A-Za-z0-9_$]*)/g;
      var m;
      var s = String(stack || '');
      while ((m = re.exec(s)) && out.length < 2) out.push(limpio(m[1], 30));
      return out.join('>');
    } catch (e) { return ''; }
  }

  function mandar(kind, d) {
    try {
      if (cuenta[kind] !== undefined) cuenta[kind]++;
      var clave = kind + '|' + d.type + '|' + d.file + '|' + d.line + '|' + d.col + '|' + (d.comp || '');
      if (vistos[clave] || enviados >= TOPE) return;
      vistos[clave] = 1;
      var rn = window.ReactNativeWebView;
      if (!rn || typeof rn.postMessage !== 'function') return;
      enviados++;
      rn.postMessage(JSON.stringify({ t: 'err:web', kind: kind, type: d.type, file: d.file,
        line: d.line, col: d.col, comp: d.comp || '' }));
    } catch (e) {}
  }

  /* 1) errores sin atrapar */
  window.addEventListener('error', function (ev) {
    try {
      if (!ev) return;
      var s = sitio(ev.error);
      mandar('error', {
        /* «muted»: el navegador lo esconde (script de otro origen): no trae ni tipo ni sitio */
        type: ev.error ? tipo(ev.error) : (ev.filename ? 'Error' : 'muted'),
        file: ev.filename ? fichero(ev.filename) : s.file,
        line: ev.lineno != null ? limpio(ev.lineno, 7) : s.line,
        col: ev.colno != null ? limpio(ev.colno, 7) : s.col,
      });
    } catch (e) {}
  });

  /* 2) promesas rechazadas que nadie atrapa */
  window.addEventListener('unhandledrejection', function (ev) {
    try {
      var r = ev && ev.reason;
      var s = sitio(r);
      mandar('promise', { type: tipo(r), file: s.file, line: s.line, col: s.col });
    } catch (e) {}
  });

  /* 3) los errores de pantalla de CFErrorBoundary: solo se MIRA lo que ya escribe en la
     consola; la consola recibe exactamente lo mismo que antes */
  var original = window.console && window.console.error;
  if (typeof original === 'function') {
    window.console.error = function () {
      try {
        var a0 = arguments[0];
        if (typeof a0 === 'string' && a0.indexOf('[Chronic Friends] screen error') === 0) {
          var err = arguments[1];
          var s = sitio(err);
          mandar('screen', { type: tipo(err), file: s.file, line: s.line, col: s.col,
            comp: componentes(arguments[2]) });
        }
      } catch (e) {}
      return original.apply(this, arguments);
    };
  }

  window.CFErrLog = {
    version: 'aud4-20261107',
    /* cuántos de cada clase se han visto en esta apertura (también en el navegador) */
    contados: function () { return { error: cuenta.error, promise: cuenta.promise, screen: cuenta.screen }; },
  };
})();
