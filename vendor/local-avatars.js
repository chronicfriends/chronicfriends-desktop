/* local-avatars.js — avatares generados EN EL DISPOSITIVO (sin red).
 *
 * Sustituye el CDN de terceros i.pravatar.cc (que filtraba nombre visible + IP)
 * por un avatar SVG determinista (iniciales + color por hash del seed),
 * devuelto como data: URI. Así la app queda 100% autocontenida y la
 * "Seguridad de los datos" de Google Play puede declarar "no se recopilan datos".
 *
 * API: window.cfPfp(pathq)
 *   pathq = el path+query original de pravatar, p.ej. "240?u=crohnfriends-maria"
 *           o "120?u=" (+seed concatenado). Se parsea el tamaño y el seed.
 *   -> devuelve "data:image/svg+xml,<svg iniciales>".
 *
 * Coherente con el sistema de avatares locales existente (UserAvatar/initials)
 * que ya usan las cuentas reales.
 */
(function () {
  if (window.cfPfp) return;

  // Paleta bosque, en línea con la marca (#33492f / verdes).
  var PAL = ['#3f8a3f', '#2e5a35', '#4a7c59', '#5b8c5a', '#6b9b7a', '#7a9e6e',
             '#8aab6a', '#c4863f', '#b5654a', '#7d6b9e', '#5a8fa8', '#9a7b4f'];

  function hash(s) {
    var h = 2166136261; s = String(s || '');
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function initials(seed) {
    var n = String(seed || '')
      .replace(/^crohnfriends-/i, '')
      .replace(/^(best|cf|dr)-/i, '')
      .replace(/[_\-]+/g, ' ')
      .replace(/[^0-9A-Za-zÀ-ÿ ]/g, ' ')
      .trim();
    if (!n) return '·';
    var parts = n.split(/\s+/);
    var a = parts[0] ? parts[0].charAt(0) : '';
    var b = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    var out = (a + b).toUpperCase();
    return out || n.charAt(0).toUpperCase();
  }

  window.cfPfp = function (pathq) {
    pathq = String(pathq || '');
    var size = parseInt(pathq, 10);
    if (!size || size < 16) size = 96;
    if (size > 512) size = 512;
    var qi = pathq.indexOf('u=');
    var seed = qi >= 0 ? pathq.slice(qi + 2) : pathq;
    var ini = initials(seed);
    var bg = PAL[hash(seed) % PAL.length];
    var fs = Math.round(size * 0.42);
    var r = Math.round(size * 0.5); // círculo
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<rect width="' + size + '" height="' + size + '" rx="' + r + '" ry="' + r + '" fill="' + bg + '"/>' +
      '<text x="50%" y="50%" dy=".35em" text-anchor="middle" ' +
      'font-family="Poppins,Montserrat,Arial,sans-serif" font-size="' + fs +
      '" font-weight="700" fill="#ffffff">' + ini + '</text></svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  };
})();
