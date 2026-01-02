---
name: PWA Optimization
description: This skill should be used when the user asks to "make PWA", "add service worker", "enable offline mode", "add install prompt", "improve app startup", "add splash screen", "configure web manifest", "cache strategy", "background sync", "push notifications", "app-like experience", or mentions Progressive Web App, offline-first, or installability.
version: 1.0.0
---

# PWA Optimization

Expert knowledge for transforming web applications into Progressive Web Apps with native-like capabilities, offline support, and optimal performance.

## Core PWA Requirements

### Web App Manifest

Required manifest configuration for installability:

```json
{
  "name": "App Full Name",
  "short_name": "App",
  "description": "Application description",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

### Display Modes

Choose appropriate display mode:
- **standalone**: No browser UI, like native app (recommended)
- **fullscreen**: No status bar, full screen
- **minimal-ui**: Minimal browser controls
- **browser**: Standard browser tab

### Icon Requirements

Provide icons at multiple sizes:
- 192x192px (required for Android)
- 512x512px (required for Android splash)
- 180x180px (Apple touch icon)
- Maskable icons for adaptive icon support

## Service Worker Strategies

### Registration Pattern

```typescript
// Register service worker in app
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('SW registered:', registration.scope);
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  });
}
```

### Caching Strategies

**Cache First** (static assets):
```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
```

**Network First** (API calls):
```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open('api-cache').then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
```

**Stale While Revalidate** (best for most content):
```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('dynamic-cache').then((cache) => {
      return cache.match(event.request).then((cached) => {
        const fetched = fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
        return cached || fetched;
      });
    })
  );
});
```

## Offline Support

### Offline Page Fallback

```javascript
// In service worker
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-cache').then((cache) => {
      return cache.addAll([OFFLINE_URL, '/offline.css']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

### Offline Detection

```typescript
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
```

## Install Prompt

### Custom Install Button

```typescript
const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);

    return outcome === 'accepted';
  };

  return { isInstallable, promptInstall };
};
```

### iOS Install Instructions

iOS doesn't support `beforeinstallprompt`, show manual instructions:

```tsx
const IOSInstallPrompt = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  if (!isIOS || isStandalone) return null;

  return (
    <div className="p-4 bg-muted rounded-lg">
      <p className="text-sm">
        Install this app: tap <ShareIcon /> then "Add to Home Screen"
      </p>
    </div>
  );
};
```

## App Shell Architecture

### Shell Pattern

Pre-cache the app shell for instant loading:

```javascript
const SHELL_CACHE = 'app-shell-v1';
const SHELL_FILES = [
  '/',
  '/styles/main.css',
  '/scripts/app.js',
  '/images/logo.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(SHELL_FILES);
    })
  );
});
```

### Skeleton Loading

Show app shell with skeletons while content loads:

```tsx
const AppShell = ({ children, isLoading }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      {isLoading ? <ContentSkeleton /> : children}
    </main>
    <BottomNavigation />
  </div>
);
```

## Background Sync

### Deferred Actions

Queue actions when offline:

```typescript
// Register sync
async function queueAction(action: any) {
  const registration = await navigator.serviceWorker.ready;

  if ('sync' in registration) {
    await registration.sync.register('sync-actions');
    // Store action in IndexedDB
    await storeAction(action);
  } else {
    // Fallback: try immediately
    await performAction(action);
  }
}

// In service worker
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-actions') {
    event.waitUntil(processQueuedActions());
  }
});
```

## Push Notifications

### Request Permission

```typescript
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};
```

### Subscribe to Push

```typescript
const subscribeToPush = async () => {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // Send subscription to server
  await sendSubscriptionToServer(subscription);
};
```

## Performance Optimization

### Preloading

```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
<link rel="preload" href="/api/user" as="fetch" crossorigin>

<!-- Preconnect to origins -->
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">
```

### Resource Hints

```html
<!-- Prefetch next page -->
<link rel="prefetch" href="/dashboard">

<!-- Prerender likely navigation -->
<link rel="prerender" href="/settings">
```

## Next.js PWA Setup

### Using next-pwa

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\./,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 300 },
      },
    },
  ],
});

module.exports = withPWA({ /* next config */ });
```

### Manifest in Next.js

```typescript
// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My App',
    short_name: 'App',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
```

## PWA Checklist

Essential requirements:
- [ ] HTTPS enabled
- [ ] Web manifest with required fields
- [ ] Service worker registered
- [ ] Icons at 192x192 and 512x512
- [ ] Start URL loads offline
- [ ] Theme color set
- [ ] Viewport meta tag configured

Enhanced features:
- [ ] Custom install prompt
- [ ] Offline fallback page
- [ ] Background sync for forms
- [ ] Push notifications (if applicable)
- [ ] App shortcuts defined
- [ ] Screenshots for install UI

## Additional Resources

### Reference Files

For detailed implementation patterns:
- **`references/service-worker-patterns.md`** - Advanced SW patterns
- **`references/caching-strategies.md`** - Detailed caching approaches

### Examples

Working implementations in `examples/`:
- **`next-pwa-config.js`** - Complete Next.js PWA setup
- **`service-worker.js`** - Production-ready service worker
