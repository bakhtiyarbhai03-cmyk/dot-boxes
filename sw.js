const CACHE_NAME = 'db-ultra-v8-cache';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.svg',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;600;800;900&display=swap',
    'https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'
];

// Install Event: Cache all essential assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate Event: Clean up old caches if we update the version
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                .map(name => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Serve from cache first, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                // If both cache and network fail (offline), just fail gracefully
                console.warn('Network request failed and no cache available.');
            });
        })
    );
});
