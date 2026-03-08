// MDO Command Center — Service Worker v2.0.0
// OODA Loop + MDO Architecture PWA Offline Support
const CACHE_NAME = 'mdo-hub-v2.0.0';
const ASSETS = [
  '/ai-orchestration-hub/',
  '/ai-orchestration-hub/index.html',
  '/ai-orchestration-hub/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/')) {
    e.respondWith(
      fetch(e.request)
        .catch(() => new Response(JSON.stringify({ status: 'offline', message: 'MDO Hub is offline' }), {
          headers: { 'Content-Type': 'application/json' }
        }))
    );
  } else {
    e.respondWith(
      caches.match(e.request)
        .then(cached => cached || fetch(e.request).then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          return resp;
        }))
        .catch(() => caches.match('/ai-orchestration-hub/index.html'))
    );
  }
});
