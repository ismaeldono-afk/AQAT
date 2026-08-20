const CACHE_NAME = 'aqat-runtime-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        if (event.request.mode !== 'navigate') return new Response('', { status: 504, statusText: 'Offline' });
        return caches.match(self.registration.scope).then((fallback) => fallback ?? new Response(
          'AQAT is offline. Reconnect once to save this application for offline use.',
          { status: 503, headers: { 'Content-Type': 'text/plain' } },
        ));
      });
    }),
  );
});
