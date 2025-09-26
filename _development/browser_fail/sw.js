// Service Worker for Vila Mlynica
// Provides advanced caching strategies for better performance

const CACHE_NAME = 'vila-mlynica-v2';
const STATIC_CACHE = 'vila-mlynica-static-v2';
const DYNAMIC_CACHE = 'vila-mlynica-dynamic-v2';
const IMAGE_CACHE = 'vila-mlynica-images-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/pages/accommodation.html',
  '/pages/restaurant.html',
  // '/pages/virtual-tour.html', // temporarily disabled
  '/contact.html',
  '/css/style.css',
  '/js/main.js',
  '/js/accommodation.js',
  // '/js/virtual-tour.js', // temporarily disabled
  '/sitemap.xml',
  '/robots.txt',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
];

const imageUrls = [
  '/images/LOGO.png',
  '/images/Picture outdoor.jpg',
  '/images/Picture outdoor1.jpg',
  '/images/Picture outdoor2.jpg'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(urlsToCache)),
      caches.open(IMAGE_CACHE).then(cache => cache.addAll(imageUrls))
    ]).then(() => {
      console.log('Service Worker installed successfully');
      return self.skipWaiting();
    })
  );
});

// Fetch event with advanced caching strategies
self.addEventListener('fetch', function(event) {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  } else if (url.origin === location.origin) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  }
});

// Cache first strategy (for images)
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

// Network first strategy (for HTML pages)
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Stale while revalidate strategy (for external resources)
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  return cached || fetchPromise;
}

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', function(event) {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Handle offline form submissions when connection is restored
  console.log('Syncing contact form data...');
}
