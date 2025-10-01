const CACHE_NAME = 'tpl-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './benvenuto.html',
  './tratte.html',
  './tariffe.html',
  './style.css',
  './script.js',
  './database.json',
  './manifest.json',
  './src/tpl.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
