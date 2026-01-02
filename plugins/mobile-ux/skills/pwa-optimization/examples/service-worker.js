/**
 * Production-Ready Service Worker
 *
 * A complete service worker with multiple caching strategies,
 * offline support, and background sync capabilities.
 */

// Cache versions - increment to force update
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGES_CACHE = `images-${CACHE_VERSION}`;

// Assets to precache during install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Add your critical CSS and JS here
];

// Network timeout for Network First strategy
const NETWORK_TIMEOUT = 3000;

// Cache limits
const CACHE_LIMITS = {
  [DYNAMIC_CACHE]: 100,
  [API_CACHE]: 50,
  [IMAGES_CACHE]: 200,
};

// ============================================
// Installation
// ============================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_VERSION);

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// ============================================
// Activation
// ============================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CACHE_VERSION);

  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGES_CACHE];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => !currentCaches.includes(name))
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ============================================
// Caching Strategies
// ============================================

/**
 * Cache First Strategy
 * Best for: Static assets, fonts, images
 */
const cacheFirst = async (request, cacheName) => {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return null;
  }
};

/**
 * Network First Strategy with Timeout
 * Best for: API calls, dynamic content
 */
const networkFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);

  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), NETWORK_TIMEOUT)
      ),
    ]);

    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || null;
  }
};

/**
 * Stale While Revalidate
 * Best for: Semi-dynamic content
 */
const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || fetchPromise;
};

// ============================================
// Fetch Event Handler
// ============================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip browser extensions
  if (!url.protocol.startsWith('http')) return;

  // Route requests to appropriate strategy
  let responsePromise;

  // Navigation requests (HTML)
  if (request.mode === 'navigate') {
    responsePromise = networkFirst(request, DYNAMIC_CACHE)
      .then((response) => response || caches.match('/offline'));
  }
  // API requests
  else if (url.pathname.startsWith('/api/') || url.hostname.includes('api.')) {
    responsePromise = networkFirst(request, API_CACHE);
  }
  // Images
  else if (request.destination === 'image') {
    responsePromise = cacheFirst(request, IMAGES_CACHE)
      .then((response) => response || caches.match('/images/placeholder.svg'));
  }
  // Static assets (JS, CSS, fonts)
  else if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font'
  ) {
    responsePromise = cacheFirst(request, STATIC_CACHE);
  }
  // Everything else
  else {
    responsePromise = staleWhileRevalidate(request, DYNAMIC_CACHE);
  }

  event.respondWith(
    responsePromise.then((response) => {
      return response || fetch(request);
    })
  );
});

// ============================================
// Background Sync
// ============================================

self.addEventListener('sync', (event) => {
  console.log('[SW] Sync event:', event.tag);

  if (event.tag === 'sync-pending-actions') {
    event.waitUntil(processPendingActions());
  }
});

/**
 * Process queued actions when back online
 */
const processPendingActions = async () => {
  // Implement your sync logic here
  // Example: Read from IndexedDB and replay requests
  console.log('[SW] Processing pending actions');
};

// ============================================
// Push Notifications
// ============================================

self.addEventListener('push', (event) => {
  console.log('[SW] Push received');

  let data = {
    title: 'Notification',
    body: 'New update available',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge.png',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: data.actions || [],
      tag: data.tag || 'default',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');

  event.notification.close();

  const data = event.notification.data;
  const url = data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        return clients.openWindow(url);
      })
  );
});

// ============================================
// Message Handler
// ============================================

self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CLEAR_CACHE':
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
      break;

    case 'CACHE_URLS':
      caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.addAll(event.data.urls);
      });
      break;
  }
});

// ============================================
// Cache Cleanup
// ============================================

/**
 * Trim cache to max entries
 */
const trimCache = async (cacheName, maxEntries) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxEntries) {
    const deleteCount = keys.length - maxEntries;
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
    console.log(`[SW] Trimmed ${deleteCount} entries from ${cacheName}`);
  }
};

// Periodically clean caches
setInterval(() => {
  Object.entries(CACHE_LIMITS).forEach(([name, limit]) => {
    trimCache(name, limit);
  });
}, 60 * 60 * 1000); // Every hour

// ============================================
// Error Handling
// ============================================

self.addEventListener('error', (event) => {
  console.error('[SW] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled rejection:', event.reason);
});

console.log('[SW] Service worker loaded');
