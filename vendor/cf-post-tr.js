/* cf-post-tr.js — TRAD1 (29 sep 2026): window.CFPostTr, la capa que pide el desplegable
   «Translate ▾» de Claude Design (design/postcard.jsx, CICLO 1.0.7f/g).

   Traduce con el traductor del PROPIO móvil (Apple en iPhone con iOS 18+, Google ML Kit
   en Android) a través de native/App.js: mensaje 'tr:translate' → evento del DOM
   'cf-tr-native-result' (native/vendor/trbridge.js). El texto de un post NUNCA sale del
   teléfono.

   🔴 Solo existe dentro de la app que sabe traducir: window.CFTranslateNative.available,
   que pone native/App.js antes de cargar la página (desde la 1.0.8). En el navegador, en
   la 1.0.7 y en un iPhone con iOS 17 → window.CFPostTr NO se define → Claude Design no
   pinta ni el desplegable ni su entrada del manual. Nunca un botón que solo puede fallar.
   (Si el anuncio del nativo llegara tarde, se vuelve a mirar al cargar la página.)

   Contrato (postcard.jsx, ptRead/usePostTr):
     get(post, lang) → {status:'ready', title, body, from} | {status:'pending'}
                     | {status:'same'} | {status:'unavailable'}
     onChange(fn)    → devuelve la función para darse de baja
   · get() se llama en CADA pintado: pide la traducción UNA sola vez y contesta 'pending'
     hasta que llega; nunca dos peticiones iguales a la vez.
   · La clave lleva el texto (título + cuerpo): si el post se edita, se traduce de nuevo.
   · 'unavailable' se reintenta pasados 30 s (p. ej., sin red para bajarse el idioma).
   · Sin respuesta del móvil en 150 s → 'unavailable' (nunca «Translating…» eterno).
   · Solo en memoria (300 entradas como mucho): no se guarda ni se sube nada. */
(function () {
  'use strict';

  var LANGS = ['en', 'es', 'ca', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'hi', 'id', 'tr', 'ru', 'vi', 'ar'];
  var MAX = 300;            /* entradas en memoria */
  var RETRY_MS = 30000;     /* un 'unavailable' se vuelve a intentar pasado esto */
  var WAIT_MS = 150000;     /* sin respuesta del móvil en este tiempo → 'unavailable' */

  function now() { return Date.now(); }

  function puedo() {
    var nat = window.CFTranslateNative;
    var rn = window.ReactNativeWebView;
    return !!(nat && nat.available === true && rn && typeof rn.postMessage === 'function');
  }

  function montar() {
    if (window.CFPostTr || !puedo()) return;

    var cache = {};       /* clave → resultado */
    var orden = [];       /* orden de llegada, para el tope de memoria */
    var enVuelo = {};     /* clave → id de la petición que está esperando */
    var porId = {};       /* id → clave */
    var subs = [];
    var seq = 0;

    function huella(s) {
      var h = 5381;
      for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
      return (h >>> 0).toString(36) + ':' + s.length;
    }
    function clave(post, lang) {
      return String(post._cid) + '|' + lang + '|' + huella(String(post.title || '') + '\u0001' + String(post.body || ''));
    }
    function avisar() {
      var l = subs.slice();
      for (var i = 0; i < l.length; i++) { try { l[i](); } catch (e) {} }
    }
    function guardar(k, v) {
      if (!Object.prototype.hasOwnProperty.call(cache, k)) {
        orden.push(k);
        if (orden.length > MAX) delete cache[orden.shift()];
      }
      cache[k] = v;
    }
    /* cierra la petición `id` con lo que haya llegado (null = nada) → true si seguía abierta */
    function cerrar(id, d) {
      var k = porId[id];
      if (!k) return false;
      delete porId[id];
      if (enVuelo[k] === id) delete enVuelo[k];
      if (d && d.status === 'ready' && d.texts && d.texts.length === 2
          && typeof d.texts[0] === 'string' && typeof d.texts[1] === 'string') {
        guardar(k, { status: 'ready', title: d.texts[0], body: d.texts[1], from: LANGS.indexOf(d.from) >= 0 ? d.from : undefined });
      } else if (d && d.status === 'same') {
        guardar(k, { status: 'same' });
      } else {
        guardar(k, { status: 'unavailable', at: now() });
      }
      return true;
    }
    function pedir(k, post, lang) {
      var id = 'tr' + (++seq) + '-' + now().toString(36);
      enVuelo[k] = id;
      porId[id] = k;
      try {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          t: 'tr:translate', id: id, to: lang,
          texts: [String(post.title || ''), String(post.body || '')],
        }));
      } catch (e) {
        cerrar(id, null);
        setTimeout(avisar, 0);
        return;
      }
      setTimeout(function () { if (cerrar(id, null)) avisar(); }, WAIT_MS);
    }

    window.addEventListener('cf-tr-native-result', function (ev) {
      var d = ev && ev.detail;
      if (!d || typeof d.id !== 'string') return;
      if (cerrar(d.id, d)) avisar();
    });

    window.CFPostTr = {
      get: function (post, lang) {
        if (!post || !post._cid || LANGS.indexOf(lang) < 0) return { status: 'unavailable' };
        var k = clave(post, lang);
        var c = cache[k];
        if (c && !(c.status === 'unavailable' && now() - c.at > RETRY_MS)) {
          return c.status === 'ready'
            ? { status: 'ready', title: c.title, body: c.body, from: c.from }
            : { status: c.status };
        }
        if (!enVuelo[k]) pedir(k, post, lang);
        return { status: 'pending' };
      },
      onChange: function (fn) {
        if (typeof fn !== 'function') return function () {};
        subs.push(fn);
        return function () { subs = subs.filter(function (f) { return f !== fn; }); };
      },
    };
  }

  montar();
  /* por si el anuncio del nativo llega después de este script (WebView de Android sin
     «document start»): se vuelve a mirar al terminar de cargar. Sin anuncio, no hace nada. */
  if (!window.CFPostTr && typeof window.addEventListener === 'function') {
    window.addEventListener('DOMContentLoaded', montar);
    window.addEventListener('load', montar);
  }
})();
