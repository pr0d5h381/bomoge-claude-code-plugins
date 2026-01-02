/**
 * Next.js PWA Configuration
 *
 * Complete configuration for next-pwa with optimized caching strategies.
 * Copy this to your next.config.js and adjust as needed.
 */

const withPWA = require('next-pwa')({
  dest: 'public',

  // Disable in development for faster builds
  disable: process.env.NODE_ENV === 'development',

  // Register service worker immediately
  register: true,

  // Skip waiting for new service worker
  skipWaiting: true,

  // Cache start URL
  cacheStartUrl: true,

  // Dynamic start URL for authenticated apps
  dynamicStartUrl: true,

  // Cache on frontend navigation
  cacheOnFrontEndNav: true,

  // Reload on online
  reloadOnOnline: true,

  // Scope of the service worker
  scope: '/',

  // Service worker source (if custom)
  // sw: 'sw.js',

  // Fallback pages for offline
  fallbacks: {
    document: '/offline',
    image: '/images/offline-placeholder.svg',
    // audio: '/audio/offline.mp3',
    // video: '/video/offline.mp4',
    // font: '/fonts/offline.woff2',
  },

  // Runtime caching strategies
  runtimeCaching: [
    // Static assets - Cache First
    {
      urlPattern: /\.(?:js|css|woff2?)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },

    // Images - Cache First
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },

    // Google Fonts stylesheets - Stale While Revalidate
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },

    // Google Fonts webfonts - Cache First
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },

    // CDN assets - Cache First
    {
      urlPattern: /^https:\/\/cdn\./i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdn-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },

    // API calls - Network First
    {
      urlPattern: /^https:\/\/api\./i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    // Internal API routes - Network First
    {
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'internal-api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    // HTML pages - Network First
    {
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },

    // Catch-all - Stale While Revalidate
    {
      urlPattern: /.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'misc-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],

  // Build exclusions
  buildExcludes: [
    // Exclude server-only files
    /middleware-manifest\.json$/,
    /app-build-manifest\.json$/,
    /build-manifest\.json$/,
    /_buildManifest\.js$/,
    /_ssgManifest\.js$/,
  ],

  // Public excludes (don't precache these)
  publicExcludes: [
    '!robots.txt',
    '!sitemap*.xml',
    '!*.map',
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required for PWA icons
  images: {
    domains: ['your-cdn.com'],
  },

  // Headers for PWA
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
