# Advanced Service Worker Patterns

Comprehensive guide for implementing production-ready service workers.

## Service Worker Lifecycle

### Installation Phase

```javascript
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/images/logo.svg',
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_VERSION);

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Force activation without waiting
        return self.skipWaiting();
      })
  );
});
```

### Activation Phase

```javascript
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Delete old caches
              return name.startsWith('static-') && name !== STATIC_CACHE ||
                     name.startsWith('dynamic-') && name !== DYNAMIC_CACHE;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Claim all clients immediately
        return self.clients.claim();
      })
  );
});
```

## Advanced Caching Strategies

### Cache First with Network Fallback

Best for static assets that rarely change:

```javascript
const cacheFirst = async (request, cacheName) => {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline fallback if available
    return caches.match('/offline.html');
  }
};
```

### Network First with Cache Fallback

Best for API calls and dynamic content:

```javascript
const networkFirst = async (request, cacheName, timeout = 3000) => {
  const cache = await caches.open(cacheName);

  try {
    // Race between network and timeout
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), timeout)
      ),
    ]);

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
};
```

### Stale While Revalidate

Best for content that should be fresh but can tolerate staleness:

```javascript
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
    .catch(() => cached);

  return cached || fetchPromise;
};
```

### Network Only

For requests that should never be cached:

```javascript
const networkOnly = async (request) => {
  return fetch(request);
};
```

### Cache Only

For assets that are pre-cached and should never fetch:

```javascript
const cacheOnly = async (request, cacheName) => {
  return caches.match(request);
};
```

## Request Routing

### URL-Based Routing

```javascript
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Route based on URL pattern
  let responsePromise;

  // Static assets - Cache First
  if (url.pathname.match(/\.(js|css|png|jpg|svg|woff2?)$/)) {
    responsePromise = cacheFirst(request, STATIC_CACHE);
  }
  // API calls - Network First
  else if (url.pathname.startsWith('/api/')) {
    responsePromise = networkFirst(request, 'api-cache');
  }
  // HTML pages - Stale While Revalidate
  else if (request.headers.get('accept')?.includes('text/html')) {
    responsePromise = staleWhileRevalidate(request, 'pages-cache');
  }
  // Default - Network First
  else {
    responsePromise = networkFirst(request, DYNAMIC_CACHE);
  }

  event.respondWith(responsePromise);
});
```

### Request Type Routing

```javascript
const routeByRequestType = (request) => {
  const destination = request.destination;

  switch (destination) {
    case 'document':
      return staleWhileRevalidate(request, 'pages-cache');
    case 'script':
    case 'style':
      return cacheFirst(request, STATIC_CACHE);
    case 'image':
      return cacheFirst(request, 'images-cache');
    case 'font':
      return cacheFirst(request, 'fonts-cache');
    default:
      return networkFirst(request, DYNAMIC_CACHE);
  }
};
```

## Cache Management

### Cache Size Limits

```javascript
const trimCache = async (cacheName, maxItems) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    const deleteCount = keys.length - maxItems;
    const keysToDelete = keys.slice(0, deleteCount);

    await Promise.all(
      keysToDelete.map((key) => cache.delete(key))
    );

    console.log(`[SW] Trimmed ${deleteCount} items from ${cacheName}`);
  }
};

// Run periodically or on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      trimCache('images-cache', 50),
      trimCache('api-cache', 100),
      trimCache(DYNAMIC_CACHE, 200),
    ])
  );
});
```

### Cache Expiration

```javascript
const CACHE_EXPIRATION = {
  'api-cache': 5 * 60 * 1000, // 5 minutes
  'pages-cache': 60 * 60 * 1000, // 1 hour
  'images-cache': 7 * 24 * 60 * 60 * 1000, // 7 days
};

const isExpired = (response, maxAge) => {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;

  const fetchTime = new Date(dateHeader).getTime();
  return Date.now() - fetchTime > maxAge;
};

const cacheFirstWithExpiration = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    const maxAge = CACHE_EXPIRATION[cacheName] || Infinity;
    if (!isExpired(cached, maxAge)) {
      return cached;
    }
    // Delete expired entry
    cache.delete(request);
  }

  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
};
```

## Offline Handling

### Offline Page

```javascript
const OFFLINE_PAGE = '/offline.html';
const OFFLINE_IMAGE = '/images/offline-placeholder.svg';

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_PAGE))
    );
    return;
  }

  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then((cached) => cached || fetch(event.request))
        .catch(() => caches.match(OFFLINE_IMAGE))
    );
    return;
  }
});
```

### Offline Queue

```javascript
// IndexedDB-based queue for offline actions
const QUEUE_DB = 'offline-queue';
const QUEUE_STORE = 'actions';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(QUEUE_DB, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
    };
  });
};

const queueRequest = async (request) => {
  const db = await openDB();
  const tx = db.transaction(QUEUE_STORE, 'readwrite');
  const store = tx.objectStore(QUEUE_STORE);

  store.add({
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers),
    body: await request.clone().text(),
    timestamp: Date.now(),
  });

  return new Promise((resolve) => {
    tx.oncomplete = resolve;
  });
};

const processQueue = async () => {
  const db = await openDB();
  const tx = db.transaction(QUEUE_STORE, 'readwrite');
  const store = tx.objectStore(QUEUE_STORE);
  const requests = await store.getAll();

  for (const req of requests) {
    try {
      await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });
      store.delete(req.id);
    } catch (error) {
      console.log('[SW] Failed to replay request:', req.url);
    }
  }
};
```

## Background Sync

### Basic Sync

```javascript
self.addEventListener('sync', (event) => {
  console.log('[SW] Sync event:', event.tag);

  if (event.tag === 'sync-queue') {
    event.waitUntil(processQueue());
  }
});

// Register sync from client
const registerSync = async () => {
  const registration = await navigator.serviceWorker.ready;

  if ('sync' in registration) {
    await registration.sync.register('sync-queue');
  }
};
```

### Periodic Sync

```javascript
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

// Request periodic sync permission
const requestPeriodicSync = async () => {
  const registration = await navigator.serviceWorker.ready;

  if ('periodicSync' in registration) {
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync',
    });

    if (status.state === 'granted') {
      await registration.periodicSync.register('update-content', {
        minInterval: 24 * 60 * 60 * 1000, // 24 hours
      });
    }
  }
};
```

## Push Notifications

### Push Event Handler

```javascript
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');

  let data = { title: 'Notification', body: 'New update available' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/notification-icon.png',
    badge: '/icons/badge-icon.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: data.actions || [],
    tag: data.tag || 'default',
    renotify: data.renotify || false,
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
```

### Notification Click Handler

```javascript
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);

  event.notification.close();

  const data = event.notification.data;
  let targetUrl = data.url || '/';

  // Handle action buttons
  if (event.action) {
    switch (event.action) {
      case 'view':
        targetUrl = data.viewUrl || targetUrl;
        break;
      case 'dismiss':
        return;
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        return clients.openWindow(targetUrl);
      })
  );
});
```

## Client Communication

### Post Message to Clients

```javascript
const notifyClients = async (message) => {
  const clientList = await clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });

  clientList.forEach((client) => {
    client.postMessage(message);
  });
};

// Usage in service worker
self.addEventListener('push', (event) => {
  // Show notification AND update client
  event.waitUntil(
    Promise.all([
      self.registration.showNotification('New message'),
      notifyClients({ type: 'NEW_MESSAGE', data: event.data.json() }),
    ])
  );
});
```

### Listen in Client

```javascript
// In your app
navigator.serviceWorker.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'NEW_MESSAGE':
      // Update UI with new message
      addMessage(data);
      break;
    case 'CACHE_UPDATED':
      // Prompt user to refresh
      showRefreshPrompt();
      break;
  }
});
```

## Update Flow

### Check for Updates

```javascript
// In client
const checkForUpdates = async () => {
  const registration = await navigator.serviceWorker.ready;
  await registration.update();
};

// Check periodically
setInterval(checkForUpdates, 60 * 60 * 1000); // Every hour
```

### Handle Updates

```javascript
// In client
navigator.serviceWorker.addEventListener('controllerchange', () => {
  // New service worker activated
  // Optionally reload the page
  window.location.reload();
});

// Or show update prompt
let refreshing = false;
navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (refreshing) return;
  refreshing = true;
  showUpdatePrompt(() => window.location.reload());
});
```

### Skip Waiting Pattern

```javascript
// Service worker broadcasts message when updated
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Client triggers skip waiting
const triggerSkipWaiting = async () => {
  const registration = await navigator.serviceWorker.ready;
  if (registration.waiting) {
    registration.waiting.postMessage('SKIP_WAITING');
  }
};
```

## Debugging Tips

### Logging Strategy

```javascript
const DEBUG = true;

const log = (...args) => {
  if (DEBUG) {
    console.log('[SW]', ...args);
  }
};

// Use throughout service worker
log('Install event');
log('Fetch:', request.url);
log('Cache hit:', cached ? 'yes' : 'no');
```

### Error Handling

```javascript
self.addEventListener('error', (event) => {
  console.error('[SW] Error:', event.error);
  // Report to error tracking service
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled rejection:', event.reason);
  // Report to error tracking service
});
```
