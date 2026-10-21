/* ===== MURO1 · CFPostPhotos — la foto de una publicación (18 oct 2026) =====
   Capa persistente de Claude Code (webapp/vendor/): sobrevive a los reexports de
   Claude Design. Es el CONTRATO §2a del encargo CICLO-1.0.8h: la pantalla elige y
   publica fotos SOLO a través de aquí, y sin este motor no dibuja ningún botón de foto.

     available               → true con el SDK de Storage cargado y la app iniciada
     pick()                  → Promise<{ok:true, id, previewUrl, w, h} | {ok:false, code}>
                               abre el selector del móvil (galería o cámara). La foto se
                               reduce a ≤1600 px por el lado largo y se vuelve a codificar
                               en JPG con un canvas: así se van TODOS sus metadatos EXIF,
                               la ubicación GPS incluida. code:'cancelled' si se cierra.
     discard(id)             → suelta una foto elegida y no publicada (el ✕ de la vista previa)
     publish(id, postId?)    → Promise<{ok:true, image:{url, w, h, path}} | {ok:false, code}>
                               la sube a community/{uidFirebase}/{fichero}.jpg con caché de
                               un año en el móvil (storage.rules: solo su dueño, solo JPG,
                               menos de 3 MB) y devuelve su URL de descarga. Una negativa
                               llega como {ok:false} CUMPLIDA, nunca como excepción.
     remove(path)            → borra una foto PROPIA (al borrar el post)

   El post nunca guarda un dataURL ni un blob: solo {url, w, h, path}. Las reglas de
   Firestore (validPostImage) solo aceptan la URL de NUESTRO bucket y de la carpeta
   del propio autor.
   ===================================================================== */
(function () {
  'use strict';

  var MAX_SIDE = 1600, QUALITY = 0.82, MAX_BYTES = 2.9 * 1024 * 1024;
  var picked = {};          /* id → { blob, url, w, h } — solo en memoria */
  var seq = 0;
  var pendingChoose = null; /* el selector abierto, si lo hay */

  function fb() { return window.firebase; }
  function haveSDK() {
    var f = fb();
    try { return !!(f && f.storage && f.apps && f.apps.length > 0); } catch (e) { return false; }
  }
  function me() {
    try { var u = fb().auth().currentUser; return (u && u.emailVerified) ? u : null; } catch (e) { return null; }
  }
  function safeName(s) { return String(s || '').replace(/[^A-Za-z0-9_.-]/g, '_').slice(0, 100); }
  function failed(code) { return { ok: false, code: code || 'unknown' }; }

  /* abre el selector del sistema; sin `capture`, el móvil ofrece galería y cámara */
  function choose() {
    if (pendingChoose) pendingChoose(null);     /* un selector a la vez: el anterior, cancelado */
    return new Promise(function (resolve) {
      var inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'image/*';
      inp.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0';
      var done = false;
      function finish(file) {
        if (done) return; done = true; pendingChoose = null;
        window.removeEventListener('focus', onFocus, true);
        try { inp.remove(); } catch (e) {}
        resolve(file || null);
      }
      function onFocus() {   /* donde no existe el evento «cancel»: al volver sin foto */
        setTimeout(function () { if (!done && !(inp.files && inp.files.length)) finish(null); }, 1500);
      }
      pendingChoose = finish;
      inp.addEventListener('change', function () { finish(inp.files && inp.files[0]); });
      inp.addEventListener('cancel', function () { finish(null); });
      window.addEventListener('focus', onFocus, true);
      document.body.appendChild(inp);
      inp.click();
    });
  }

  /* decodifica respetando la orientación de la cámara */
  function decode(file) {
    if (window.createImageBitmap) {
      return createImageBitmap(file, { imageOrientation: 'from-image' }).catch(function () { return viaImg(file); });
    }
    return viaImg(file);
  }
  function viaImg(file) {
    return new Promise(function (res, rej) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () { res(im); setTimeout(function () { URL.revokeObjectURL(u); }, 2000); };
      im.onerror = function () { URL.revokeObjectURL(u); rej(new Error('decode')); };
      im.src = u;
    });
  }

  /* ≤1600 px y JPG nuevo: lo que se sube no lleva ni un byte de los metadatos originales */
  function shrink(src) {
    var w0 = src.width || src.naturalWidth, h0 = src.height || src.naturalHeight;
    if (!w0 || !h0) return Promise.reject(new Error('empty'));
    var k = Math.min(1, MAX_SIDE / Math.max(w0, h0));
    var w = Math.max(1, Math.round(w0 * k)), h = Math.max(1, Math.round(h0 * k));
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var g = c.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);      /* un PNG transparente no sale negro */
    g.drawImage(src, 0, 0, w, h);
    try { if (src.close) src.close(); } catch (e) {}
    function enc(q) {
      return new Promise(function (res, rej) {
        c.toBlob(function (b) { b ? res(b) : rej(new Error('encode')); }, 'image/jpeg', q);
      });
    }
    return enc(QUALITY).then(function (b) { return b.size <= MAX_BYTES ? b : enc(0.68); })
      .then(function (b) { return { blob: b, w: w, h: h }; });
  }

  function pick() {
    if (!haveSDK()) return Promise.resolve(failed('unavailable'));
    return choose().then(function (file) {
      if (!file) return failed('cancelled');
      if (!/^image\//.test(file.type || 'image/')) return failed('not-an-image');
      return decode(file).then(shrink).then(function (r) {
        var id = 'ph' + (++seq) + '_' + Date.now().toString(36);
        var url = URL.createObjectURL(r.blob);
        picked[id] = { blob: r.blob, url: url, w: r.w, h: r.h };
        return { ok: true, id: id, previewUrl: url, w: r.w, h: r.h };
      }).catch(function () { return failed('unreadable'); });
    });
  }

  function discard(id) {
    var p = picked[id]; if (!p) return;
    try { URL.revokeObjectURL(p.url); } catch (e) {}
    delete picked[id];
  }

  function publish(id, postId) {
    var p = picked[id];
    if (!p) return Promise.resolve(failed('unknown-photo'));
    if (!haveSDK()) return Promise.resolve(failed('unavailable'));
    var u = me(); if (!u) return Promise.resolve(failed('no-session'));
    var name = safeName(u.uid.slice(0, 6) + '_' + (postId || ('p' + Date.now().toString(36))) + '_' + Math.random().toString(36).slice(2, 7)) + '.jpg';
    var path = 'community/' + u.uid + '/' + name;
    try {
      var ref = fb().storage().ref(path);
      return ref.put(p.blob, { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000' })
        .then(function () { return ref.getDownloadURL(); })
        .then(function (url) {
          var out = { ok: true, image: { url: url, w: p.w, h: p.h, path: path } };
          discard(id);
          return out;
        })
        .catch(function (e) { return failed((e && e.code) || 'upload-failed'); });
    } catch (e) { return Promise.resolve(failed('upload-failed')); }
  }

  function remove(path) {
    if (!haveSDK()) return Promise.resolve(failed('unavailable'));
    var u = me(); if (!u) return Promise.resolve(failed('no-session'));
    if (typeof path !== 'string' || path.indexOf('community/' + u.uid + '/') !== 0) return Promise.resolve(failed('not-mine'));
    try {
      return fb().storage().ref(path).delete()
        .then(function () { return { ok: true }; })
        .catch(function (e) { return failed((e && e.code) || 'delete-failed'); });
    } catch (e) { return Promise.resolve(failed('delete-failed')); }
  }

  window.CFPostPhotos = {
    get available() { return haveSDK(); },
    pick: pick, discard: discard, publish: publish, remove: remove,
    _limits: { MAX_SIDE: MAX_SIDE, QUALITY: QUALITY, MAX_BYTES: MAX_BYTES }
  };
  try { console.log('[CFPostPhotos] motor de fotos de los posts cargado · available=' + haveSDK()); } catch (e) {}
})();
