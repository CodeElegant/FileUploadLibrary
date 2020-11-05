const VERSION = "v1.00.9";

const cacheResources = async () => {
    const cacheFilesFirst = [
        '/public/views/index.ejs',
        '/public/views/header.ejs',
        '/public/views/footer.ejs',
		'/public/css/foundation.min.css',
        '/public/css/overrides.css',
        '/src/javascripts/main.js',
        '/src/javascripts/EventHandler.js',
        '/public/images/favicon.ico',
        '/public/images/icon.192.png',
        '/public/images/icon.512.png',
        '/public/images/photon.png',
    ];
    const cache = await caches.open(VERSION);
    return cache.addAll(cacheFilesFirst);
};

const cachedResource = async (request) => {
    const cache = await caches.open(VERSION);
    return await cache.match(request);
};

self.addEventListener('install', async (event) => {
    event.waitUntil(cacheResources());
    await self.skipWaiting();
});

self.addEventListener('activate', async (event) => {
    console.log(`SW activated:  ${event}`);
    await self.clients.claim();
});

self.addEventListener('fetch', async (event) => {
    console.log(`Fetch event: ${event.request.url}`);
    const response = event.request;
    console.log(response.status);
    await event.respondWith(cachedResource(event.request));
});

self.addEventListener('push', async (event) => {
    console.log(event);
});

self.addEventListener('sync', async (event) => {
    console.log(event);
});