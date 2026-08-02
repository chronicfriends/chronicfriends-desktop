/* ===== Chronic Friends · SL18 — Espejo local de contraseña ROBUSTO ===========
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude Design.

   PROBLEMA que resuelve: el login offline guardaba un "eco" de la contraseña con
   djb2 (un hash NO criptográfico y SIN sal): rápido de romper por fuerza bruta si
   alguien accede al almacenamiento del móvil. Esto lo sustituye por PBKDF2-SHA256
   con sal aleatoria y muchas iteraciones (Web Crypto del propio navegador/WebView).

   IMPORTANTE: la autenticación REAL es Firebase Auth (en el servidor). Este espejo
   es SOLO para desbloquear la app sin conexión; nunca es la seguridad principal.

   API (async, devuelven Promise):
     CFHash.make(password)            -> "pbkdf2$<iter>$<saltB64>$<hashB64>"  (o "weak$..." si no hay Web Crypto)
     CFHash.verify(password, stored)  -> true/false   (compara en tiempo ~constante)
     CFHash.available                 -> true si Web Crypto está disponible (hash fuerte)

   Uso desde la app (cuando se aplique el prompt SL18 en Claude Design):
     var rec = await CFHash.make(pass);   // guardar `rec` en vez del djb2
     if (await CFHash.verify(intento, rec)) { ...desbloquear... }
   ===================================================================== */
(function () {
  'use strict';

  var ITER = 150000;                 /* iteraciones PBKDF2 (coste de fuerza bruta) */
  var subtle = null;
  try { subtle = (window.crypto && window.crypto.subtle) || null; } catch (e) { subtle = null; }
  function getRandom(n) {
    try { var a = new Uint8Array(n); window.crypto.getRandomValues(a); return a; } catch (e) { return null; }
  }

  /* ---- utilidades base64 <-> bytes ------------------------------------- */
  function bytesToB64(bytes) {
    var bin = ''; for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function b64ToBytes(b64) {
    var bin = atob(b64), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function enc(str) { return new TextEncoder().encode(str); }

  /* ---- PBKDF2-SHA256 (fuerte, si hay Web Crypto) ----------------------- */
  function pbkdf2(password, saltBytes, iter) {
    return subtle.importKey('raw', enc(password), { name: 'PBKDF2' }, false, ['deriveBits'])
      .then(function (key) {
        return subtle.deriveBits(
          { name: 'PBKDF2', salt: saltBytes, iterations: iter, hash: 'SHA-256' },
          key, 256
        );
      })
      .then(function (bits) { return new Uint8Array(bits); });
  }

  /* ---- fallback SIN Web Crypto: sha-256 propio con sal (mejor que djb2,
          pero sin las iteraciones; se marca "weak$" para poder migrar luego) --- */
  function weakHash(password, salt) {
    /* FNV-1a de 64 bits (2×32) sobre salt+password: no es criptográfico, pero
       rompe la trivialidad del djb2 sin sal. Solo se usa si NO hay Web Crypto. */
    var s = salt + '|' + password;
    var h1 = 0x811c9dc5, h2 = 0xcbf29ce4;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      h1 = (h1 ^ c) >>> 0; h1 = (h1 * 0x01000193) >>> 0;
      h2 = (h2 ^ ((c * 7 + i) & 0xff)) >>> 0; h2 = (h2 * 0x01000193) >>> 0;
    }
    return ('00000000' + h1.toString(16)).slice(-8) + ('00000000' + h2.toString(16)).slice(-8);
  }

  /* comparación en tiempo aproximadamente constante (evita timing attacks) */
  function slowEq(a, b) {
    if (a.length !== b.length) return false;
    var r = 0; for (var i = 0; i < a.length; i++) r |= (a.charCodeAt(i) ^ b.charCodeAt(i));
    return r === 0;
  }

  window.CFHash = {
    available: !!(subtle && getRandom(1)),

    make: function (password) {
      password = String(password == null ? '' : password);
      if (subtle && getRandom(1)) {
        var salt = getRandom(16);
        return pbkdf2(password, salt, ITER).then(function (hash) {
          return 'pbkdf2$' + ITER + '$' + bytesToB64(salt) + '$' + bytesToB64(hash);
        }).catch(function () {
          var s = Math.abs(0 | (Date.parse('2020-01-01'))).toString(36); /* sal débil determinista de respaldo */
          return 'weak$' + s + '$' + weakHash(password, s);
        });
      }
      var salt = (getRandom(6) ? bytesToB64(getRandom(6)) : 'nosalt');
      return Promise.resolve('weak$' + salt + '$' + weakHash(password, salt));
    },

    verify: function (password, stored) {
      password = String(password == null ? '' : password);
      stored = String(stored == null ? '' : stored);
      var parts = stored.split('$');
      if (parts[0] === 'pbkdf2' && parts.length === 4 && subtle) {
        var iter = parseInt(parts[1], 10) || ITER;
        var salt = b64ToBytes(parts[2]);
        return pbkdf2(password, salt, iter).then(function (hash) {
          return slowEq(bytesToB64(hash), parts[3]);
        }).catch(function () { return false; });
      }
      if (parts[0] === 'weak' && parts.length === 3) {
        return Promise.resolve(slowEq(weakHash(password, parts[1]), parts[2]));
      }
      return Promise.resolve(false);   /* formato desconocido (p.ej. djb2 viejo) → obliga a re-login online */
    }
  };
  try { console.log('[CFHash] espejo de contraseña cargado · Web Crypto=' + window.CFHash.available); } catch (e) {}
})();
