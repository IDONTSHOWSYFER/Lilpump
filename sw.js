/* PWA */

const CACHE_NAME = 'lilpump-v1';

const ASSETS = [
  '/',            
  '/index.html',
  '/assets/css/main.css',
  '/assets/img/favicon.ico',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/video/guccigang.mp4'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
          .then(cache => cache.addAll(ASSETS))
          .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
          .then(keys =>
            Promise.all(keys
              .filter(key => key !== CACHE_NAME)
              .map(key => caches.delete(key))))
          .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request)
        .then(resp => {
          if (resp.ok) {
            caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, resp.clone()));
          }
          return resp;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});