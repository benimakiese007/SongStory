/**
 * SongStory — Service Worker
 * Stratégie : Cache First pour les assets, Network First pour les pages HTML
 */

const CACHE_NAME = 'songstory-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon-32x32.png',
    '/icons/favicon-16x16.png',
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
    '/songs/lettre-a-la-republique.html',
    '/songs/menace-de-mort.html',
    '/songs/dont-laik.html',
    '/songs/stan.html',
    '/songs/power.html',
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

// Fetch — Stratégies de cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ne gère que les requêtes GET et HTTP(S)
    if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

    // Détermine si c'est une navigation HTML
    const isNavigation = request.mode === 'navigate' || 
                         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));

    if (isNavigation) {
        // Stratégie : Network First (Priorité réseau pour les pages HTML)
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    // Met à jour le cache avec la nouvelle version
                    if (networkResponse.ok) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Si réseau échoue, tente le cache
                    return caches.match(request).then(cachedResponse => {
                        return cachedResponse || caches.match('/index.html') || fetch(request);
                    });
                })
        );
    } else {
        // Stratégie : Stale-While-Revalidate pour les assets (CSS, JS, Images)
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    const fetchPromise = fetch(request).then((networkResponse) => {
                        if (networkResponse.ok) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Silently fail for assets if offline and not in cache
                    });

                    // Retourne le cache immédiatement si présent, sinon attend le réseau
                    return cachedResponse || fetchPromise;
                });
            })
        );
    }
});
