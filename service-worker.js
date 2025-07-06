const CACHE_NAME = 'ugpodborauto-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/assets/images/logo.svg',
    '/assets/images/car-placeholder.webp',
    '/assets/images/car-placeholder.avif',
    '/assets/images/parallax-bg1.webp', // и другие фоновые изображения
    '/assets/images/parallax-bg2.webp',
    '/assets/images/parallax-bg3.webp',
    '/assets/images/gallery/car1.webp', // и все изображения галереи
    '/assets/images/gallery/car1.avif',
    '/assets/images/gallery/car1.jpg',
    // ... добавьте все критичные ресурсы, которые должны быть доступны оффлайн
    '/assets/images/icons/icon-192x192.png',
    '/assets/images/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // Отдаем из кэша, если есть
                }
                return fetch(event.request); // Иначе - делаем запрос к сети
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
