// Define cache names
const CACHE_NAME = 'joke-app-cache-v1';
const DYNAMIC_CACHE_NAME = 'joke-app-dynamic-cache-v1';

// host api
const HOST = 'v2.jokeapi.dev';
// Files to cache during install
const STATIC_ASSETS = [
  'index.html',
  'style.css',
  'script.js',
  'icons/horse-192-192.png',
  'icons/horse-48-48.png',
  'icons/horse-72-72.png',
  'icons/horse-96-96.png',
  'icons/horse-144-144.png',
  'icons/horse-512-512.png'
];

// Install event: Cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event: Network-first strategy with JokeAPI caching
self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  // Check if the request is to HOST API
  if (requestURL.hostname === HOST) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => {
            return caches.match(event.request);
          });
      })
    );
  } else {
    // Handle other requests
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

