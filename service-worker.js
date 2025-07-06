const CACHE_NAME = 'ugpodborauto-v1';
const ASSETS = [
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
  // добавьте пути к статике: видео, изображения, шрифты
];
self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('fetch', evt => {
  evt.respondWith(
    fetch(evt.request).catch(() => caches.match(evt.request).then(r => r || caches.match('/index.html')))
  );
});
