/**
 * SongStory — Service Worker
 * Stratégie : Cache First pour les assets, Network First pour les pages HTML
 */

const CACHE_NAME = 'songstory-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/library.html',
    '/artists.html',
    '/about.html',
    '/timeline.html',
    '/account.html',
    '/contribute.html',
    '/css/style.css',
    '/js/app.js',
    '/js/data.js',
    '/js/auth.js',
    '/js/pwa.js',
    '/js/timeline.js',
    '/js/spotify.js',
    '/js/contribute.js',
    '/songs/bohemian-rhapsody.html',
    '/songs/macarena.html',
    '/songs/euphoria.html',
    '/songs/black.html',
    '/songs/fairchild.html',
    '/songs/push-ups.html',
    '/songs/family-matters.html',
    '/songs/first-person-shooter.html',
    '/songs/back-to-back.html',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap',
];

// Install — précache les assets statiques
self.addEventListener('install', (event) => {
    console.log('[SW] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('http')));
        }).catch(err => console.warn('[SW] Cache install error:', err))
    );
    self.skipWaiting();
});

// Activate — nettoie les anciens caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activate');
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch — stratégie hybride
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requêtes non-GET et les extensions tierces
    if (request.method !== 'GET') return;
    if (!url.protocol.startsWith('http')) return;

    // Pour les pages HTML → Network First (contenu frais si disponible, sinon cache)
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
        );
        return;
    }

    // Pour les assets CSS/JS/fonts → Cache First (performance)
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                }
                return response;
            });
        })
    );
});
