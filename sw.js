const version = "v333";

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll([
        '/',
        'index.html',
        'style.css',
        'script.js',
        'icons/horse-192-192.png',
        'icons/horse-48-48.png',
        'icons/horse-72-72.png',
        'icons/horse-96-96.png',
        'icons/horse-144-144.png',
        'icons/horse-512-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
