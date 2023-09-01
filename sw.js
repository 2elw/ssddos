// sw.js
const CACHE_NAME = 'offline-cache-v1'; // Change the version number when you update the cache

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',  // Cache the root URL
        'logo.png',
        // Add other resources you want to cache
        'index.html',
        'github.png',
        'candy.css'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return the cached response if it exists, or fetch from the network
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        // Cache the fetched response for future use
        if (event.request.method === 'GET') {
          const clone = networkResponse.clone(); // Clone the response as it's a stream
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone); // Store the fetched response in the cache
          });
        }
        return networkResponse; // Return the fetched response
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  // Remove outdated caches when a new version of the service worker is activated
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
