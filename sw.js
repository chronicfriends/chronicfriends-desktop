/* Service worker de chronicfriends.app — mínimo y honesto.
   Estrategia: red primero, caché como respaldo (la app siempre fresca;
   sin red, sirve la última copia). La versión la sella deploy-desktop.sh
   con el WEBAPP_VERSION del paquete → cada deploy invalida la caché vieja. */
var CACHE = 'cf-web-2026-08-06-2046';

self.addEventListener('install', function () { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; /* Firebase/OFF van directas */
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (hit) {
        return hit || caches.match('/index.html');
      });
    })
  );
});
