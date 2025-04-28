const CACHE_NAME = 'simulador-salarial-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(res =>
      res || fetch(evt.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          if (evt.request.method === 'GET' && fetchRes.status === 200) {
            cache.put(evt.request, fetchRes.clone());
          }
          return fetchRes;
        });
      })
    ).catch(() => {
      // Você pode adicionar fallback offline aqui
    })
  );
});
