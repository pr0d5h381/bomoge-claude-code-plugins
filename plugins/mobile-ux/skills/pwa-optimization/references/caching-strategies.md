# Caching Strategies Guide

Detailed guide for choosing and implementing the right caching strategy for different content types.

## Strategy Selection Matrix

| Content Type | Strategy | Freshness | Offline | Performance |
|-------------|----------|-----------|---------|-------------|
| App shell (HTML) | Cache First | Low | High | Fast |
| Static assets (JS/CSS) | Cache First | Low | High | Fast |
| Fonts | Cache First | Low | High | Fast |
| User data | Network First | High | Medium | Variable |
| API responses | Network First | High | Medium | Variable |
| Product listings | SWR | Medium | Medium | Fast |
| User-generated content | SWR | Medium | Medium | Fast |
| Real-time data | Network Only | Highest | None | Variable |
| Analytics | Network Only | N/A | None | N/A |

## Cache First Strategy

**Use when:** Content rarely changes and must be available offline.

```javascript
/**
 * Cache First with Network Fallback
 *
 * 1. Check cache first
 * 2. If cached, return immediately
 * 3. If not cached, fetch from network
 * 4. Cache the response for next time
 * 5. Return the response
 */
const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);

  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('[Cache] Hit:', request.url);
    return cachedResponse;
  }

  // Fall back to network
  console.log('[Cache] Miss:', request.url);
  try {
    const networkResponse = await fetch(request);

    // Only cache successful responses
    if (networkResponse.ok) {
      // Clone because response can only be consumed once
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Cache] Network failed:', request.url);
    throw error;
  }
};
```

### Variations

**Cache First with Timeout:**

```javascript
const cacheFirstWithTimeout = async (request, cacheName, timeout = 5000) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  // Network with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};
```

**Cache First with Background Refresh:**

```javascript
const cacheFirstWithRefresh = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Start background refresh
  const refreshPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  // Return cached immediately, or wait for network
  return cachedResponse || refreshPromise;
};
```

## Network First Strategy

**Use when:** Content must be fresh, but offline access is valuable.

```javascript
/**
 * Network First with Cache Fallback
 *
 * 1. Try network first
 * 2. If successful, cache and return
 * 3. If network fails, try cache
 * 4. If cache misses, throw error
 */
const networkFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[Cache] Network failed, trying cache:', request.url);

    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
};
```

### Variations

**Network First with Timeout:**

```javascript
const networkFirstWithTimeout = async (request, cacheName, timeout = 3000) => {
  const cache = await caches.open(cacheName);

  const fetchWithTimeout = new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error('Timeout')), timeout);

    fetch(request)
      .then((response) => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });

  try {
    const response = await fetchWithTimeout;
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cache.match(request);
  }
};
```

**Network First with Race:**

```javascript
const networkFirstWithRace = async (request, cacheName, timeout = 1000) => {
  const cache = await caches.open(cacheName);

  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeout)
  );

  try {
    return await Promise.race([networkPromise, timeoutPromise]);
  } catch (error) {
    // On timeout or network failure, try cache
    const cached = await cache.match(request);
    if (cached) return cached;

    // Wait for network as last resort
    return networkPromise;
  }
};
```

## Stale While Revalidate

**Use when:** Fast response is important, but content should eventually be fresh.

```javascript
/**
 * Stale While Revalidate
 *
 * 1. Return cached response immediately (if available)
 * 2. Fetch from network in background
 * 3. Update cache with fresh response
 * 4. If no cache, wait for network
 */
const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);

  // Start fetch immediately
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch((error) => {
      console.log('[SWR] Network failed:', error);
      return null;
    });

  // Check cache
  const cachedResponse = await cache.match(request);

  // Return cached if available, otherwise wait for network
  return cachedResponse || fetchPromise;
};
```

### Variations

**SWR with Notification:**

```javascript
const swrWithNotification = async (request, cacheName, onUpdate) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then(async (response) => {
    if (response.ok) {
      const newData = await response.clone().text();
      const oldData = cachedResponse ? await cachedResponse.clone().text() : null;

      cache.put(request, response.clone());

      // Notify if content changed
      if (newData !== oldData && onUpdate) {
        onUpdate(newData);
      }
    }
    return response;
  });

  return cachedResponse || fetchPromise;
};
```

**SWR with Maximum Age:**

```javascript
const swrWithMaxAge = async (request, cacheName, maxAge) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Check if cache is expired
  let isStale = true;
  if (cachedResponse) {
    const dateHeader = cachedResponse.headers.get('date');
    if (dateHeader) {
      const age = Date.now() - new Date(dateHeader).getTime();
      isStale = age > maxAge;
    }
  }

  // If stale or no cache, prioritize network
  if (isStale || !cachedResponse) {
    const fetchPromise = fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    });

    return cachedResponse || fetchPromise;
  }

  // Fresh cache, return immediately but still revalidate
  fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
  });

  return cachedResponse;
};
```

## Cache Only Strategy

**Use when:** Content is pre-cached and should never fetch from network.

```javascript
const cacheOnly = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const response = await cache.match(request);

  if (!response) {
    throw new Error('Not found in cache: ' + request.url);
  }

  return response;
};
```

## Network Only Strategy

**Use when:** Content should never be cached (e.g., analytics, auth).

```javascript
const networkOnly = async (request) => {
  return fetch(request);
};
```

## Hybrid Strategies

### API Data with Fallback

```javascript
const apiWithFallback = async (request, cacheName) => {
  const cache = await caches.open(cacheName);

  try {
    // Try network first for fresh data
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
      return response;
    }

    // Non-OK response, try cache
    throw new Error('Non-OK response');
  } catch (error) {
    // Network failed, try cache
    const cached = await cache.match(request);
    if (cached) {
      // Return cached with header indicating staleness
      const headers = new Headers(cached.headers);
      headers.set('X-Cache-Status', 'stale');
      return new Response(cached.body, { headers });
    }

    // Return error response
    return new Response(
      JSON.stringify({ error: 'Offline and no cached data' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
```

### Versioned Assets

```javascript
const versionedAssets = async (request, cacheName) => {
  const url = new URL(request.url);

  // Check if URL has version/hash in filename
  const isVersioned = /\.[a-f0-9]{8,}\.(js|css)$/.test(url.pathname);

  if (isVersioned) {
    // Versioned assets can be cached forever
    return cacheFirst(request, cacheName);
  } else {
    // Non-versioned assets need revalidation
    return staleWhileRevalidate(request, cacheName);
  }
};
```

### Image Optimization

```javascript
const optimizedImages = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      // Only cache images under certain size
      const contentLength = response.headers.get('content-length');
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!contentLength || parseInt(contentLength) < maxSize) {
        cache.put(request, response.clone());
      }
    }

    return response;
  } catch (error) {
    // Return placeholder image
    return caches.match('/images/placeholder.svg');
  }
};
```

## Cache Naming Conventions

```javascript
// Version-based caches
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Content-type based caches
const CACHES = {
  pages: 'pages-cache',
  images: 'images-cache',
  fonts: 'fonts-cache',
  api: 'api-cache',
  static: 'static-assets',
};

// Combined approach
const getCacheName = (type, version) => `${type}-${version}`;
```

## Cache Cleanup

```javascript
// Delete old caches on activate
self.addEventListener('activate', (event) => {
  const currentCaches = Object.values(CACHES);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
});
```

## Performance Tips

1. **Use appropriate cache names** - Separate caches for different content types
2. **Set cache limits** - Prevent unbounded cache growth
3. **Use cache headers** - Respect `Cache-Control` and `Expires`
4. **Preload critical resources** - Cache during install phase
5. **Lazy-cache on demand** - Don't cache everything upfront
6. **Monitor cache size** - Track and report cache usage
